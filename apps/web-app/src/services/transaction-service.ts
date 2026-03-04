import { createClient } from '@/src/lib/supabase'
import type { Transaction, TransactionInsert, TransactionType } from '@/src/types/database'

const supabase = createClient()

export interface TransactionWithDetails extends Transaction {
    artworks?: { id: string; title: string } | null
    clients?: { id: string; name: string } | null
}

export interface GetTransactionsFilters {
    client_id?: string
    artwork_id?: string
}

export class TransactionService {
    static async getTransactions(filters?: GetTransactionsFilters): Promise<TransactionWithDetails[]> {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            throw new Error('User not authenticated')
        }

        let query = supabase
            .from('transactions')
            .select(`
                *,
                artworks (id, title),
                clients (id, name)
            `)
            .eq('user_id', user.id)
            .order('date', { ascending: false, nullsFirst: false })

        if (filters?.client_id) {
            query = query.eq('client_id', filters.client_id)
        }
        if (filters?.artwork_id) {
            query = query.eq('artwork_id', filters.artwork_id)
        }

        const { data, error } = await query

        if (error) {
            throw new Error(`Failed to fetch transactions: ${error.message}`)
        }

        return (data || []) as TransactionWithDetails[]
    }

    static async getTransaction(id: string): Promise<TransactionWithDetails | null> {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            throw new Error('User not authenticated')
        }

        const { data, error } = await supabase
            .from('transactions')
            .select(`
                *,
                artworks (id, title),
                clients (id, name)
            `)
            .eq('id', id)
            .eq('user_id', user.id)
            .single()

        if (error) {
            if (error.code === 'PGRST116') return null
            throw new Error(`Failed to fetch transaction: ${error.message}`)
        }

        return data as TransactionWithDetails
    }

    static async createTransaction(data: Omit<TransactionInsert, 'user_id'>): Promise<Transaction> {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            throw new Error('User not authenticated')
        }

        const { data: tx, error } = await supabase
            .from('transactions')
            .insert({
                user_id: user.id,
                artwork_id: data.artwork_id ?? null,
                client_id: data.client_id ?? null,
                import_session_id: data.import_session_id ?? null,
                type: data.type,
                amount: data.amount ?? null,
                currency: data.currency ?? 'USD',
                date: data.date ?? null,
                invoice_number: data.invoice_number ?? null,
                notes: data.notes ?? null,
            })
            .select()
            .single()

        if (error) {
            throw new Error(`Failed to create transaction: ${error.message}`)
        }

        return tx as Transaction
    }

    static async updateTransaction(
        id: string,
        data: Partial<Omit<TransactionInsert, 'user_id'>>
    ): Promise<Transaction> {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            throw new Error('User not authenticated')
        }

        const { data: tx, error } = await supabase
            .from('transactions')
            .update({
                artwork_id: data.artwork_id,
                client_id: data.client_id,
                type: data.type,
                amount: data.amount,
                currency: data.currency,
                date: data.date,
                invoice_number: data.invoice_number,
                notes: data.notes,
            })
            .eq('id', id)
            .eq('user_id', user.id)
            .select()
            .single()

        if (error) {
            throw new Error(`Failed to update transaction: ${error.message}`)
        }

        return tx as Transaction
    }

    static async deleteTransaction(id: string): Promise<void> {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            throw new Error('User not authenticated')
        }

        const { error } = await supabase
            .from('transactions')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id)

        if (error) {
            throw new Error(`Failed to delete transaction: ${error.message}`)
        }
    }
}
