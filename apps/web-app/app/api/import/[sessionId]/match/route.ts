import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/src/lib/supabase-server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
})

interface ArtworkReference {
    title: string
    artist?: string | null
}

interface ArtworkRow {
    id: string
    title: string
    artist: string
}

interface MatchResult {
    reference: ArtworkReference
    status: 'matched' | 'fuzzy_match' | 'no_match'
    matched_artwork_id?: string
    matched_artwork?: { id: string; title: string; artist: string }
    fuzzy_candidates?: { id: string; title: string; artist: string; reason: string }[]
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ sessionId: string }> }
) {
    try {
        const { sessionId } = await params
        const supabase = await createClient()

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // Verify session belongs to user
        const { data: session, error: sessionError } = await supabase
            .from('import_sessions')
            .select('*')
            .eq('id', sessionId)
            .eq('user_id', user.id)
            .single()

        if (sessionError || !session) {
            return NextResponse.json({ error: 'Import session not found' }, { status: 404 })
        }

        // Fetch extracted quotation and transaction records
        const { data: records, error: recordsError } = await supabase
            .from('extracted_records')
            .select('*')
            .eq('session_id', sessionId)
            .in('record_type', ['quotation', 'transaction'])
            .in('status', ['pending', 'approved', 'edited'])

        if (recordsError) {
            return NextResponse.json({ error: 'Failed to fetch records' }, { status: 500 })
        }

        if (!records || records.length === 0) {
            return NextResponse.json({ matches: [], message: 'No quotation/transaction records to match' })
        }

        // Fetch user's existing artworks
        const { data: existingArtworks } = await supabase
            .from('artworks')
            .select('id, title, artist')
            .eq('user_id', user.id)

        const artworks: ArtworkRow[] = existingArtworks || []

        // Collect all unique artwork references across all records
        const allReferences: { recordId: string; ref: ArtworkReference }[] = []
        for (const record of records) {
            const data = { ...record.extracted_data, ...record.user_edits }
            const refs: ArtworkReference[] = data.artwork_references || []

            // Backward compat: if no artwork_references but has artwork_title, convert
            if (refs.length === 0 && data.artwork_title) {
                refs.push({ title: data.artwork_title, artist: data.artwork_artist || null })
            }

            for (const ref of refs) {
                if (ref.title) {
                    allReferences.push({ recordId: record.id, ref })
                }
            }
        }

        if (allReferences.length === 0) {
            return NextResponse.json({ matches: [], message: 'No artwork references found in records' })
        }

        // Deduplicate references by title+artist for matching
        const uniqueRefs = new Map<string, ArtworkReference>()
        for (const { ref } of allReferences) {
            const key = `${ref.title.toLowerCase()}|${(ref.artist || '').toLowerCase()}`
            if (!uniqueRefs.has(key)) {
                uniqueRefs.set(key, ref)
            }
        }

        // Phase 1: Exact matching (title + artist, case-insensitive)
        const matchResults = new Map<string, MatchResult>()
        const unmatchedRefs: ArtworkReference[] = []

        for (const [key, ref] of uniqueRefs) {
            const exactMatch = artworks.find((a) => {
                const titleMatch = a.title.toLowerCase().trim() === ref.title.toLowerCase().trim()
                if (!ref.artist) return titleMatch
                return titleMatch && a.artist.toLowerCase().trim() === ref.artist.toLowerCase().trim()
            })

            if (exactMatch) {
                matchResults.set(key, {
                    reference: ref,
                    status: 'matched',
                    matched_artwork_id: exactMatch.id,
                    matched_artwork: { id: exactMatch.id, title: exactMatch.title, artist: exactMatch.artist },
                })
            } else {
                unmatchedRefs.push(ref)
            }
        }

        // Phase 2: AI fuzzy matching for unmatched references
        if (unmatchedRefs.length > 0 && artworks.length > 0) {
            try {
                const fuzzyResults = await fuzzyMatchArtworks(unmatchedRefs, artworks)

                for (const result of fuzzyResults) {
                    const key = `${result.reference.title.toLowerCase()}|${(result.reference.artist || '').toLowerCase()}`
                    matchResults.set(key, result)
                }
            } catch (err) {
                // If AI matching fails, mark all as no_match
                for (const ref of unmatchedRefs) {
                    const key = `${ref.title.toLowerCase()}|${(ref.artist || '').toLowerCase()}`
                    matchResults.set(key, {
                        reference: ref,
                        status: 'no_match',
                    })
                }
            }
        } else {
            // No existing artworks to match against
            for (const ref of unmatchedRefs) {
                const key = `${ref.title.toLowerCase()}|${(ref.artist || '').toLowerCase()}`
                matchResults.set(key, {
                    reference: ref,
                    status: 'no_match',
                })
            }
        }

        // Store match results in each extracted record's user_edits
        for (const record of records) {
            const data = { ...record.extracted_data, ...record.user_edits }
            const refs: ArtworkReference[] = data.artwork_references || []

            if (refs.length === 0 && data.artwork_title) {
                refs.push({ title: data.artwork_title, artist: data.artwork_artist || null })
            }

            const recordMatches: MatchResult[] = []
            for (const ref of refs) {
                if (!ref.title) continue
                const key = `${ref.title.toLowerCase()}|${(ref.artist || '').toLowerCase()}`
                const match = matchResults.get(key)
                if (match) recordMatches.push(match)
            }

            if (recordMatches.length > 0) {
                const existingEdits = record.user_edits || {}
                await supabase
                    .from('extracted_records')
                    .update({
                        user_edits: {
                            ...existingEdits,
                            artwork_matches: recordMatches,
                        },
                    })
                    .eq('id', record.id)
            }
        }

        const allMatches = Array.from(matchResults.values())
        return NextResponse.json({
            matches: allMatches,
            summary: {
                total: allMatches.length,
                matched: allMatches.filter((m) => m.status === 'matched').length,
                fuzzy: allMatches.filter((m) => m.status === 'fuzzy_match').length,
                unmatched: allMatches.filter((m) => m.status === 'no_match').length,
            },
        })
    } catch (error: any) {
        console.error('Match API error:', error)
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
    }
}

async function fuzzyMatchArtworks(
    references: ArtworkReference[],
    existingArtworks: ArtworkRow[]
): Promise<MatchResult[]> {
    const prompt = `You are an art database matching assistant. Given a list of artwork references extracted from documents and a list of existing artworks in the database, determine which references likely match existing artworks.

Consider: typos, abbreviations, alternate titles, name variations (e.g. "J. Smith" vs "Jane Smith"), minor differences in punctuation or capitalization.

EXISTING ARTWORKS IN DATABASE:
${JSON.stringify(existingArtworks.map((a) => ({ id: a.id, title: a.title, artist: a.artist })), null, 2)}

ARTWORK REFERENCES TO MATCH:
${JSON.stringify(references.map((r) => ({ title: r.title, artist: r.artist || 'unknown' })), null, 2)}

For each reference, respond with one of:
- "fuzzy_match" if it likely matches an existing artwork (provide the artwork id and a brief reason)
- "no_match" if there is no plausible match

Respond with ONLY valid JSON:
{
  "results": [
    {
      "reference_title": "...",
      "reference_artist": "...",
      "status": "fuzzy_match" | "no_match",
      "matched_artwork_id": "uuid" | null,
      "reason": "why this is a match" | null
    }
  ]
}`

    const message = await anthropic.messages.create({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 4096,
        messages: [{ role: 'user', content: prompt }],
    })

    const textBlock = message.content.find((b) => b.type === 'text')
    if (!textBlock || textBlock.type !== 'text') {
        throw new Error('No text response from Claude')
    }

    const jsonMatch = textBlock.text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
        throw new Error('No JSON found in response')
    }

    const parsed = JSON.parse(jsonMatch[0])
    const results: MatchResult[] = []

    for (const item of parsed.results || []) {
        const ref = references.find(
            (r) => r.title.toLowerCase() === item.reference_title?.toLowerCase()
        )
        if (!ref) continue

        if (item.status === 'fuzzy_match' && item.matched_artwork_id) {
            const matchedArtwork = existingArtworks.find((a) => a.id === item.matched_artwork_id)
            if (matchedArtwork) {
                results.push({
                    reference: ref,
                    status: 'fuzzy_match',
                    matched_artwork_id: matchedArtwork.id,
                    matched_artwork: { id: matchedArtwork.id, title: matchedArtwork.title, artist: matchedArtwork.artist },
                    fuzzy_candidates: [{
                        id: matchedArtwork.id,
                        title: matchedArtwork.title,
                        artist: matchedArtwork.artist,
                        reason: item.reason || 'AI-suggested match',
                    }],
                })
                continue
            }
        }

        results.push({
            reference: ref,
            status: 'no_match',
        })
    }

    // Make sure all references are accounted for
    for (const ref of references) {
        const found = results.find(
            (r) => r.reference.title.toLowerCase() === ref.title.toLowerCase()
        )
        if (!found) {
            results.push({ reference: ref, status: 'no_match' })
        }
    }

    return results
}
