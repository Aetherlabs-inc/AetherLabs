import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/src/lib/supabase-server'

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ sessionId: string }> }
) {
    try {
        const { sessionId } = await params
        const supabase = await createClient()

        // Auth check
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

        // Fetch approved/edited records
        const { data: records, error: recordsError } = await supabase
            .from('extracted_records')
            .select('*')
            .eq('session_id', sessionId)
            .in('status', ['approved', 'edited'])

        if (recordsError) {
            return NextResponse.json({ error: 'Failed to fetch records' }, { status: 500 })
        }

        if (!records || records.length === 0) {
            return NextResponse.json({ error: 'No approved records to save' }, { status: 400 })
        }

        const VALID_QUOTATION_STATUSES = ['draft', 'sent', 'accepted', 'rejected', 'expired']
        const VALID_CLIENT_TYPES = ['collector', 'buyer', 'gallery', 'dealer', 'institution', 'other']

        let savedCount = 0
        const errors: string[] = []

        // Pre-fetch existing artworks and clients for linking
        const { data: existingArtworks } = await supabase
            .from('artworks')
            .select('id, title, artist')
            .eq('user_id', user.id)

        const { data: existingClients } = await supabase
            .from('clients')
            .select('id, name, email')
            .eq('user_id', user.id)

        const artworkMap = new Map(
            (existingArtworks || []).map((a) => [a.title.toLowerCase(), a.id])
        )
        const clientMap = new Map<string, string>()
        for (const c of existingClients || []) {
            if (c.name) clientMap.set(c.name.toLowerCase(), c.id)
            if (c.email) clientMap.set(c.email.toLowerCase(), c.id)
        }

        // Track newly created items for linking within same batch
        const newArtworkMap = new Map<string, string>()
        const newClientMap = new Map<string, string>()

        // Process artwork and client records first so they're available for linking
        const artworkRecords = records.filter((r) => r.record_type === 'artwork')
        const clientRecords = records.filter((r) => r.record_type === 'client')
        const transactionRecords = records.filter((r) => r.record_type === 'transaction')
        const quotationRecords = records.filter((r) => r.record_type === 'quotation')

        // Save artworks first
        for (const record of artworkRecords) {
            const data = { ...record.extracted_data, ...record.user_edits }
            try {
                const { data: artwork, error } = await supabase
                    .from('artworks')
                    .insert({
                        user_id: user.id,
                        title: data.title || 'Untitled',
                        artist: data.artist || 'Unknown',
                        year: parseInt(data.year) || new Date().getFullYear(),
                        medium: data.medium || 'Unknown',
                        dimensions: data.dimensions || 'Unknown',
                        status: 'unverified',
                    })
                    .select('id')
                    .single()

                if (error) throw error
                if (artwork && data.title) {
                    newArtworkMap.set(data.title.toLowerCase(), artwork.id)
                    // Also map by title+artist for more specific matching
                    if (data.artist) {
                        newArtworkMap.set(`${data.title.toLowerCase()}|${data.artist.toLowerCase()}`, artwork.id)
                    }
                }
                savedCount++

                await supabase
                    .from('extracted_records')
                    .update({ status: 'saved' })
                    .eq('id', record.id)
            } catch (err: any) {
                errors.push(`artwork (row ${record.row_index}): ${err.message}`)
            }
        }

        // Save clients
        for (const record of clientRecords) {
            const data = { ...record.extracted_data, ...record.user_edits }
            try {
                const { data: client, error } = await supabase
                    .from('clients')
                    .insert({
                        user_id: user.id,
                        name: data.name || 'Unknown',
                        email: data.email || null,
                        phone: data.phone || null,
                        company: data.company || null,
                        type: VALID_CLIENT_TYPES.includes(data.type) ? data.type : 'other',
                        notes: data.notes || null,
                    })
                    .select('id')
                    .single()

                if (error) throw error
                if (client) {
                    if (data.name) newClientMap.set(data.name.toLowerCase(), client.id)
                    if (data.email) newClientMap.set(data.email.toLowerCase(), client.id)
                }
                savedCount++

                await supabase
                    .from('extracted_records')
                    .update({ status: 'saved' })
                    .eq('id', record.id)
            } catch (err: any) {
                errors.push(`client (row ${record.row_index}): ${err.message}`)
            }
        }

        // Helper: resolve artwork IDs from matches
        const resolveArtworkIds = async (data: Record<string, any>): Promise<string[]> => {
            const artworkIds: string[] = []
            const matches = data.artwork_matches as any[] | undefined

            if (matches && matches.length > 0) {
                for (const match of matches) {
                    if (match.status === 'matched' || match.status === 'confirmed') {
                        // Exact or user-confirmed fuzzy match
                        if (match.matched_artwork_id) {
                            artworkIds.push(match.matched_artwork_id)
                        }
                    } else if (match.status === 'create_new') {
                        // User approved creating a new artwork
                        const ref = match.reference
                        if (ref?.title) {
                            // Check if we already created this artwork in this batch
                            const existingKey = ref.artist
                                ? `${ref.title.toLowerCase()}|${ref.artist.toLowerCase()}`
                                : ref.title.toLowerCase()
                            const existing = newArtworkMap.get(existingKey) || newArtworkMap.get(ref.title.toLowerCase())
                                || artworkMap.get(ref.title.toLowerCase())

                            if (existing) {
                                artworkIds.push(existing)
                            } else {
                                // Create the artwork
                                const { data: newArtwork, error } = await supabase
                                    .from('artworks')
                                    .insert({
                                        user_id: user.id,
                                        title: ref.title,
                                        artist: ref.artist || 'Unknown',
                                        year: new Date().getFullYear(),
                                        medium: 'Unknown',
                                        dimensions: 'Unknown',
                                        status: 'unverified',
                                    })
                                    .select('id')
                                    .single()

                                if (!error && newArtwork) {
                                    artworkIds.push(newArtwork.id)
                                    newArtworkMap.set(ref.title.toLowerCase(), newArtwork.id)
                                    if (ref.artist) {
                                        newArtworkMap.set(`${ref.title.toLowerCase()}|${ref.artist.toLowerCase()}`, newArtwork.id)
                                    }
                                }
                            }
                        }
                    }
                    // fuzzy_match and no_match without user action are skipped
                }
            } else {
                // Backward compat: single artwork_title
                const artworkTitle = data.artwork_title?.toLowerCase()
                if (artworkTitle) {
                    const artworkId = artworkMap.get(artworkTitle) || newArtworkMap.get(artworkTitle) || null
                    if (artworkId) artworkIds.push(artworkId)
                }
            }

            return artworkIds
        }

        // Helper: resolve client ID
        const resolveClientId = (data: Record<string, any>): string | null => {
            const clientName = data.client_name?.toLowerCase()
            const clientEmail = data.client_email?.toLowerCase()
            return (
                (clientName && (clientMap.get(clientName) || newClientMap.get(clientName))) ||
                (clientEmail && (clientMap.get(clientEmail) || newClientMap.get(clientEmail))) ||
                null
            )
        }

        // Save transactions with many-to-many artwork links
        for (const record of transactionRecords) {
            const data = { ...record.extracted_data, ...record.user_edits }
            try {
                const artworkIds = await resolveArtworkIds(data)
                const clientId = resolveClientId(data)

                const { data: transaction, error } = await supabase
                    .from('transactions')
                    .insert({
                        user_id: user.id,
                        artwork_id: artworkIds[0] || null, // Keep first for backward compat
                        client_id: clientId,
                        import_session_id: sessionId,
                        type: data.type || 'sale',
                        amount: data.amount ? parseFloat(String(data.amount).replace(/[^0-9.]/g, '')) : null,
                        currency: data.currency || 'USD',
                        date: data.date || null,
                        invoice_number: data.invoice_number || null,
                        notes: data.notes || null,
                    })
                    .select('id')
                    .single()

                if (error) throw error

                // Create junction table entries for all linked artworks
                if (transaction && artworkIds.length > 0) {
                    const junctionEntries = artworkIds.map((artworkId) => ({
                        transaction_id: transaction.id,
                        artwork_id: artworkId,
                    }))

                    const { error: junctionError } = await supabase
                        .from('transaction_artworks')
                        .insert(junctionEntries)

                    if (junctionError) {
                        console.error('Failed to create transaction-artwork links:', junctionError)
                    }
                }

                savedCount++

                await supabase
                    .from('extracted_records')
                    .update({ status: 'saved' })
                    .eq('id', record.id)
            } catch (err: any) {
                errors.push(`transaction (row ${record.row_index}): ${err.message}`)
            }
        }

        // Save quotations with many-to-many artwork links
        for (const record of quotationRecords) {
            const data = { ...record.extracted_data, ...record.user_edits }
            try {
                const artworkIds = await resolveArtworkIds(data)
                const clientId = resolveClientId(data)

                const { data: quotation, error } = await supabase
                    .from('quotations')
                    .insert({
                        user_id: user.id,
                        artwork_id: artworkIds[0] || null, // Keep first for backward compat
                        client_id: clientId,
                        import_session_id: sessionId,
                        amount: data.amount ? parseFloat(String(data.amount).replace(/[^0-9.]/g, '')) : null,
                        currency: data.currency || 'USD',
                        valid_until: data.valid_until || null,
                        status: VALID_QUOTATION_STATUSES.includes(data.status) ? data.status : 'draft',
                        quotation_number: data.quotation_number || null,
                        notes: data.notes || null,
                    })
                    .select('id')
                    .single()

                if (error) throw error

                // Create junction table entries for all linked artworks
                if (quotation && artworkIds.length > 0) {
                    const junctionEntries = artworkIds.map((artworkId) => ({
                        quotation_id: quotation.id,
                        artwork_id: artworkId,
                    }))

                    const { error: junctionError } = await supabase
                        .from('quotation_artworks')
                        .insert(junctionEntries)

                    if (junctionError) {
                        console.error('Failed to create quotation-artwork links:', junctionError)
                    }
                }

                savedCount++

                await supabase
                    .from('extracted_records')
                    .update({ status: 'saved' })
                    .eq('id', record.id)
            } catch (err: any) {
                errors.push(`quotation (row ${record.row_index}): ${err.message}`)
            }
        }

        // Update session
        const allSaved = errors.length === 0
        await supabase
            .from('import_sessions')
            .update({
                approved_records: savedCount,
                status: allSaved ? 'completed' : 'extracted',
            })
            .eq('id', sessionId)

        return NextResponse.json({ saved: savedCount, errors })
    } catch (error: any) {
        console.error('Save API error:', error)
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
    }
}
