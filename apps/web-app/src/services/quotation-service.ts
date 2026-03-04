import { createClient } from '@/src/lib/supabase'
import type { Quotation, QuotationInsert, QuotationStatus } from '@/src/types/database'

const supabase = createClient()

export interface QuotationWithDetails extends Quotation {
    artworks?: { id: string; title: string } | null
    clients?: { id: string; name: string } | null
}

export interface GetQuotationsFilters {
    client_id?: string
    artwork_id?: string
    status?: QuotationStatus
}

export class QuotationService {
    static async getQuotations(filters?: GetQuotationsFilters): Promise<QuotationWithDetails[]> {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            throw new Error('User not authenticated')
        }

        let query = supabase
            .from('quotations')
            .select(`
                *,
                artworks (id, title),
                clients (id, name)
            `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })

        if (filters?.client_id) {
            query = query.eq('client_id', filters.client_id)
        }
        if (filters?.artwork_id) {
            query = query.eq('artwork_id', filters.artwork_id)
        }
        if (filters?.status) {
            query = query.eq('status', filters.status)
        }

        const { data, error } = await query

        if (error) {
            throw new Error(`Failed to fetch quotations: ${error.message}`)
        }

        return (data || []) as QuotationWithDetails[]
    }

    static async getQuotation(id: string): Promise<QuotationWithDetails | null> {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            throw new Error('User not authenticated')
        }

        const { data, error } = await supabase
            .from('quotations')
            .select(`
                *,
                artworks (id, title, artist, year, medium),
                clients (id, name, email, company)
            `)
            .eq('id', id)
            .eq('user_id', user.id)
            .single()

        if (error) {
            if (error.code === 'PGRST116') return null
            throw new Error(`Failed to fetch quotation: ${error.message}`)
        }

        return data as QuotationWithDetails
    }

    static async createQuotation(data: Omit<QuotationInsert, 'user_id'>): Promise<Quotation> {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            throw new Error('User not authenticated')
        }

        const { data: q, error } = await supabase
            .from('quotations')
            .insert({
                user_id: user.id,
                artwork_id: data.artwork_id ?? null,
                client_id: data.client_id ?? null,
                import_session_id: data.import_session_id ?? null,
                amount: data.amount ?? null,
                currency: data.currency ?? 'USD',
                valid_until: data.valid_until ?? null,
                status: data.status ?? 'draft',
                quotation_number: data.quotation_number ?? null,
                notes: data.notes ?? null,
            })
            .select()
            .single()

        if (error) {
            throw new Error(`Failed to create quotation: ${error.message}`)
        }

        return q as Quotation
    }

    static async updateQuotation(
        id: string,
        data: Partial<Omit<QuotationInsert, 'user_id'>>
    ): Promise<Quotation> {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            throw new Error('User not authenticated')
        }

        const { data: q, error } = await supabase
            .from('quotations')
            .update({
                artwork_id: data.artwork_id,
                client_id: data.client_id,
                amount: data.amount,
                currency: data.currency,
                valid_until: data.valid_until,
                status: data.status,
                quotation_number: data.quotation_number,
                notes: data.notes,
            })
            .eq('id', id)
            .eq('user_id', user.id)
            .select()
            .single()

        if (error) {
            throw new Error(`Failed to update quotation: ${error.message}`)
        }

        return q as Quotation
    }

    static async deleteQuotation(id: string): Promise<void> {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            throw new Error('User not authenticated')
        }

        const { error } = await supabase
            .from('quotations')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id)

        if (error) {
            throw new Error(`Failed to delete quotation: ${error.message}`)
        }
    }
}
