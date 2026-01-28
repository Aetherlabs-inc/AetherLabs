import { createClient } from '@/src/lib/supabase'
import {
    ProvenanceRecord,
    ProvenanceRecordInsert,
    ExhibitionRecord,
    ExhibitionRecordInsert,
    ConservationRecord,
    ConservationRecordInsert
} from '@/src/types/database'

const supabase = createClient()

export class DocumentationService {
    // ============================================
    // PROVENANCE RECORDS
    // ============================================

    static async getProvenanceHistory(artworkId: string): Promise<ProvenanceRecord[]> {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            throw new Error('User not authenticated')
        }

        // Verify artwork belongs to user
        const { data: artwork } = await supabase
            .from('artworks')
            .select('id')
            .eq('id', artworkId)
            .eq('user_id', user.id)
            .single()

        if (!artwork) {
            throw new Error('Artwork not found or access denied')
        }

        const { data, error } = await supabase
            .from('provenance_records')
            .select('*')
            .eq('artwork_id', artworkId)
            .order('order_index', { ascending: true })

        if (error) {
            throw new Error(`Failed to fetch provenance history: ${error.message}`)
        }

        return data || []
    }

    static async addProvenanceRecord(record: ProvenanceRecordInsert): Promise<ProvenanceRecord> {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            throw new Error('User not authenticated')
        }

        // Verify artwork belongs to user
        const { data: artwork } = await supabase
            .from('artworks')
            .select('id')
            .eq('id', record.artwork_id)
            .eq('user_id', user.id)
            .single()

        if (!artwork) {
            throw new Error('Artwork not found or access denied')
        }

        // Get the highest order_index
        const { data: lastRecord } = await supabase
            .from('provenance_records')
            .select('order_index')
            .eq('artwork_id', record.artwork_id)
            .order('order_index', { ascending: false })
            .limit(1)
            .single()

        const nextOrderIndex = (lastRecord?.order_index ?? -1) + 1

        const { data, error } = await supabase
            .from('provenance_records')
            .insert({
                ...record,
                order_index: record.order_index ?? nextOrderIndex
            })
            .select()
            .single()

        if (error) {
            throw new Error(`Failed to add provenance record: ${error.message}`)
        }

        return data
    }

    static async updateProvenanceRecord(id: string, updates: Partial<ProvenanceRecordInsert>): Promise<ProvenanceRecord> {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            throw new Error('User not authenticated')
        }

        // Verify record belongs to user's artwork
        const { data: record } = await supabase
            .from('provenance_records')
            .select('artwork_id, artworks!inner(user_id)')
            .eq('id', id)
            .single()

        if (!record || (record.artworks as any).user_id !== user.id) {
            throw new Error('Record not found or access denied')
        }

        const { data, error } = await supabase
            .from('provenance_records')
            .update(updates)
            .eq('id', id)
            .select()
            .single()

        if (error) {
            throw new Error(`Failed to update provenance record: ${error.message}`)
        }

        return data
    }

    static async deleteProvenanceRecord(id: string): Promise<void> {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            throw new Error('User not authenticated')
        }

        // Verify record belongs to user's artwork
        const { data: record } = await supabase
            .from('provenance_records')
            .select('artwork_id, artworks!inner(user_id)')
            .eq('id', id)
            .single()

        if (!record || (record.artworks as any).user_id !== user.id) {
            throw new Error('Record not found or access denied')
        }

        const { error } = await supabase
            .from('provenance_records')
            .delete()
            .eq('id', id)

        if (error) {
            throw new Error(`Failed to delete provenance record: ${error.message}`)
        }
    }

    static async reorderProvenance(artworkId: string, orderedIds: string[]): Promise<void> {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            throw new Error('User not authenticated')
        }

        // Verify artwork belongs to user
        const { data: artwork } = await supabase
            .from('artworks')
            .select('id')
            .eq('id', artworkId)
            .eq('user_id', user.id)
            .single()

        if (!artwork) {
            throw new Error('Artwork not found or access denied')
        }

        const updates = orderedIds.map((id, index) =>
            supabase
                .from('provenance_records')
                .update({ order_index: index })
                .eq('id', id)
                .eq('artwork_id', artworkId)
        )

        await Promise.all(updates)
    }

    // ============================================
    // EXHIBITION RECORDS
    // ============================================

    static async getExhibitionHistory(artworkId: string): Promise<ExhibitionRecord[]> {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            throw new Error('User not authenticated')
        }

        // Verify artwork belongs to user
        const { data: artwork } = await supabase
            .from('artworks')
            .select('id')
            .eq('id', artworkId)
            .eq('user_id', user.id)
            .single()

        if (!artwork) {
            throw new Error('Artwork not found or access denied')
        }

        const { data, error } = await supabase
            .from('exhibition_records')
            .select('*')
            .eq('artwork_id', artworkId)
            .order('start_date', { ascending: false })

        if (error) {
            throw new Error(`Failed to fetch exhibition history: ${error.message}`)
        }

        return data || []
    }

    static async addExhibitionRecord(record: ExhibitionRecordInsert): Promise<ExhibitionRecord> {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            throw new Error('User not authenticated')
        }

        // Verify artwork belongs to user
        const { data: artwork } = await supabase
            .from('artworks')
            .select('id')
            .eq('id', record.artwork_id)
            .eq('user_id', user.id)
            .single()

        if (!artwork) {
            throw new Error('Artwork not found or access denied')
        }

        const { data, error } = await supabase
            .from('exhibition_records')
            .insert(record)
            .select()
            .single()

        if (error) {
            throw new Error(`Failed to add exhibition record: ${error.message}`)
        }

        return data
    }

    static async updateExhibitionRecord(id: string, updates: Partial<ExhibitionRecordInsert>): Promise<ExhibitionRecord> {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            throw new Error('User not authenticated')
        }

        // Verify record belongs to user's artwork
        const { data: record } = await supabase
            .from('exhibition_records')
            .select('artwork_id, artworks!inner(user_id)')
            .eq('id', id)
            .single()

        if (!record || (record.artworks as any).user_id !== user.id) {
            throw new Error('Record not found or access denied')
        }

        const { data, error } = await supabase
            .from('exhibition_records')
            .update(updates)
            .eq('id', id)
            .select()
            .single()

        if (error) {
            throw new Error(`Failed to update exhibition record: ${error.message}`)
        }

        return data
    }

    static async deleteExhibitionRecord(id: string): Promise<void> {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            throw new Error('User not authenticated')
        }

        // Verify record belongs to user's artwork
        const { data: record } = await supabase
            .from('exhibition_records')
            .select('artwork_id, artworks!inner(user_id)')
            .eq('id', id)
            .single()

        if (!record || (record.artworks as any).user_id !== user.id) {
            throw new Error('Record not found or access denied')
        }

        const { error } = await supabase
            .from('exhibition_records')
            .delete()
            .eq('id', id)

        if (error) {
            throw new Error(`Failed to delete exhibition record: ${error.message}`)
        }
    }

    // ============================================
    // CONSERVATION RECORDS
    // ============================================

    static async getConservationHistory(artworkId: string): Promise<ConservationRecord[]> {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            throw new Error('User not authenticated')
        }

        // Verify artwork belongs to user
        const { data: artwork } = await supabase
            .from('artworks')
            .select('id')
            .eq('id', artworkId)
            .eq('user_id', user.id)
            .single()

        if (!artwork) {
            throw new Error('Artwork not found or access denied')
        }

        const { data, error } = await supabase
            .from('conservation_records')
            .select('*')
            .eq('artwork_id', artworkId)
            .order('performed_at', { ascending: false })

        if (error) {
            throw new Error(`Failed to fetch conservation history: ${error.message}`)
        }

        return data || []
    }

    static async addConservationRecord(record: ConservationRecordInsert): Promise<ConservationRecord> {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            throw new Error('User not authenticated')
        }

        // Verify artwork belongs to user
        const { data: artwork } = await supabase
            .from('artworks')
            .select('id')
            .eq('id', record.artwork_id)
            .eq('user_id', user.id)
            .single()

        if (!artwork) {
            throw new Error('Artwork not found or access denied')
        }

        const { data, error } = await supabase
            .from('conservation_records')
            .insert(record)
            .select()
            .single()

        if (error) {
            throw new Error(`Failed to add conservation record: ${error.message}`)
        }

        return data
    }

    static async updateConservationRecord(id: string, updates: Partial<ConservationRecordInsert>): Promise<ConservationRecord> {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            throw new Error('User not authenticated')
        }

        // Verify record belongs to user's artwork
        const { data: record } = await supabase
            .from('conservation_records')
            .select('artwork_id, artworks!inner(user_id)')
            .eq('id', id)
            .single()

        if (!record || (record.artworks as any).user_id !== user.id) {
            throw new Error('Record not found or access denied')
        }

        const { data, error } = await supabase
            .from('conservation_records')
            .update(updates)
            .eq('id', id)
            .select()
            .single()

        if (error) {
            throw new Error(`Failed to update conservation record: ${error.message}`)
        }

        return data
    }

    static async deleteConservationRecord(id: string): Promise<void> {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            throw new Error('User not authenticated')
        }

        // Verify record belongs to user's artwork
        const { data: record } = await supabase
            .from('conservation_records')
            .select('artwork_id, artworks!inner(user_id)')
            .eq('id', id)
            .single()

        if (!record || (record.artworks as any).user_id !== user.id) {
            throw new Error('Record not found or access denied')
        }

        const { error } = await supabase
            .from('conservation_records')
            .delete()
            .eq('id', id)

        if (error) {
            throw new Error(`Failed to delete conservation record: ${error.message}`)
        }
    }

    // ============================================
    // AGGREGATED DATA
    // ============================================

    static async getArtworkDocumentation(artworkId: string) {
        const [provenance, exhibitions, conservation] = await Promise.all([
            this.getProvenanceHistory(artworkId),
            this.getExhibitionHistory(artworkId),
            this.getConservationHistory(artworkId)
        ])

        return {
            provenance,
            exhibitions,
            conservation
        }
    }
}
