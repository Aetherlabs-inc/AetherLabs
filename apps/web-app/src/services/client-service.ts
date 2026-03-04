import { createClient } from '@/src/lib/supabase'
import type { Client, ClientInsert, ClientType } from '@/src/types/database'

const supabase = createClient()

export interface ClientWithCounts extends Client {
    transaction_count?: number
    quotation_count?: number
}

export interface GetClientsFilters {
    search?: string
    type?: ClientType | 'all'
}

export class ClientService {
    static async getClients(filters?: GetClientsFilters): Promise<Client[]> {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            throw new Error('User not authenticated')
        }

        let query = supabase
            .from('clients')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })

        if (filters?.type && filters.type !== 'all') {
            query = query.eq('type', filters.type)
        }

        const { data: clients, error } = await query

        if (error) {
            throw new Error(`Failed to fetch clients: ${error.message}`)
        }

        const list = (clients || []) as Client[]

        if (filters?.search && filters.search.trim()) {
            const search = filters.search.toLowerCase().trim()
            return list.filter(
                c =>
                    c.name.toLowerCase().includes(search) ||
                    (c.email?.toLowerCase().includes(search) ?? false) ||
                    (c.company?.toLowerCase().includes(search) ?? false)
            )
        }

        return list
    }

    static async getClient(id: string): Promise<ClientWithCounts | null> {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            throw new Error('User not authenticated')
        }

        const { data: client, error } = await supabase
            .from('clients')
            .select('*')
            .eq('id', id)
            .eq('user_id', user.id)
            .single()

        if (error) {
            if (error.code === 'PGRST116') {
                return null
            }
            throw new Error(`Failed to fetch client: ${error.message}`)
        }

        const [{ count: transactionCount }, { count: quotationCount }] = await Promise.all([
            supabase
                .from('transactions')
                .select('*', { count: 'exact', head: true })
                .eq('client_id', id),
            supabase
                .from('quotations')
                .select('*', { count: 'exact', head: true })
                .eq('client_id', id),
        ])

        return {
            ...(client as Client),
            transaction_count: transactionCount ?? 0,
            quotation_count: quotationCount ?? 0,
        }
    }

    static async createClient(data: Omit<ClientInsert, 'user_id'>): Promise<Client> {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            throw new Error('User not authenticated')
        }

        const { data: client, error } = await supabase
            .from('clients')
            .insert({
                user_id: user.id,
                name: data.name,
                email: data.email ?? null,
                phone: data.phone ?? null,
                company: data.company ?? null,
                address: data.address ?? null,
                type: data.type ?? null,
                notes: data.notes ?? null,
            })
            .select()
            .single()

        if (error) {
            throw new Error(`Failed to create client: ${error.message}`)
        }

        return client as Client
    }

    static async updateClient(
        id: string,
        data: Partial<Omit<ClientInsert, 'user_id'>>
    ): Promise<Client> {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            throw new Error('User not authenticated')
        }

        const { data: client, error } = await supabase
            .from('clients')
            .update({
                name: data.name,
                email: data.email,
                phone: data.phone,
                company: data.company,
                address: data.address,
                type: data.type,
                notes: data.notes,
            })
            .eq('id', id)
            .eq('user_id', user.id)
            .select()
            .single()

        if (error) {
            throw new Error(`Failed to update client: ${error.message}`)
        }

        return client as Client
    }

    static async deleteClient(id: string): Promise<void> {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            throw new Error('User not authenticated')
        }

        const { error } = await supabase
            .from('clients')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id)

        if (error) {
            throw new Error(`Failed to delete client: ${error.message}`)
        }
    }
}
