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
            .select('id, title')
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

        for (const record of records) {
            const data = { ...record.extracted_data, ...record.user_edits }

            try {
                switch (record.record_type) {
                    case 'artwork': {
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
                        }
                        savedCount++
                        break
                    }

                    case 'client': {
                        const { data: client, error } = await supabase
                            .from('clients')
                            .insert({
                                user_id: user.id,
                                name: data.name || 'Unknown',
                                email: data.email || null,
                                phone: data.phone || null,
                                company: data.company || null,
                                address: data.address || null,
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
                        break
                    }

                    case 'transaction': {
                        // Try to link artwork
                        const artworkTitle = data.artwork_title?.toLowerCase()
                        const artworkId = artworkTitle
                            ? (artworkMap.get(artworkTitle) || newArtworkMap.get(artworkTitle) || null)
                            : null

                        // Try to link client
                        const clientName = data.client_name?.toLowerCase()
                        const clientEmail = data.client_email?.toLowerCase()
                        const clientId =
                            (clientName && (clientMap.get(clientName) || newClientMap.get(clientName))) ||
                            (clientEmail && (clientMap.get(clientEmail) || newClientMap.get(clientEmail))) ||
                            null

                        const { error } = await supabase
                            .from('transactions')
                            .insert({
                                user_id: user.id,
                                artwork_id: artworkId,
                                client_id: clientId,
                                import_session_id: sessionId,
                                type: data.type || 'sale',
                                amount: data.amount ? parseFloat(String(data.amount).replace(/[^0-9.]/g, '')) : null,
                                currency: data.currency || 'USD',
                                date: data.date || null,
                                invoice_number: data.invoice_number || null,
                                notes: data.notes || null,
                            })

                        if (error) throw error
                        savedCount++
                        break
                    }

                    case 'quotation': {
                        const artworkTitle = data.artwork_title?.toLowerCase()
                        const artworkId = artworkTitle
                            ? (artworkMap.get(artworkTitle) || newArtworkMap.get(artworkTitle) || null)
                            : null

                        const clientName = data.client_name?.toLowerCase()
                        const clientEmail = data.client_email?.toLowerCase()
                        const clientId =
                            (clientName && (clientMap.get(clientName) || newClientMap.get(clientName))) ||
                            (clientEmail && (clientMap.get(clientEmail) || newClientMap.get(clientEmail))) ||
                            null

                        const { error } = await supabase
                            .from('quotations')
                            .insert({
                                user_id: user.id,
                                artwork_id: artworkId,
                                client_id: clientId,
                                import_session_id: sessionId,
                                amount: data.amount ? parseFloat(String(data.amount).replace(/[^0-9.]/g, '')) : null,
                                currency: data.currency || 'USD',
                                valid_until: data.valid_until || null,
                                status: VALID_QUOTATION_STATUSES.includes(data.status) ? data.status : 'draft',
                                quotation_number: data.quotation_number || null,
                                notes: data.notes || null,
                            })

                        if (error) throw error
                        savedCount++
                        break
                    }
                }

                // Mark record as saved
                await supabase
                    .from('extracted_records')
                    .update({ status: 'saved' })
                    .eq('id', record.id)

            } catch (err: any) {
                errors.push(`${record.record_type} (row ${record.row_index}): ${err.message}`)
            }
        }

        // Update session
        await supabase
            .from('import_sessions')
            .update({
                approved_records: savedCount,
                status: 'completed',
            })
            .eq('id', sessionId)

        return NextResponse.json({ saved: savedCount, errors })
    } catch (error: any) {
        console.error('Save API error:', error)
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 })
    }
}
