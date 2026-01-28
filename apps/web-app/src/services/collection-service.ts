import { createClient } from '@/src/lib/supabase'
import {
    Collection,
    CollectionInsert,
    CollectionUpdate,
    CollectionWithArtworks,
    CollectionArtwork,
    ArtworkWithDetails
} from '@/src/types/database'

const supabase = createClient()

export class CollectionService {
    // Get all collections for the current user
    static async getCollections(): Promise<CollectionWithArtworks[]> {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            throw new Error('User not authenticated')
        }

        const { data: collections, error } = await supabase
            .from('collections')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })

        if (error) {
            throw new Error(`Failed to fetch collections: ${error.message}`)
        }

        // Get artwork counts for each collection
        const collectionsWithCounts = await Promise.all(
            (collections || []).map(async (collection) => {
                const { count } = await supabase
                    .from('collection_artworks')
                    .select('*', { count: 'exact', head: true })
                    .eq('collection_id', collection.id)

                return {
                    ...collection,
                    artworks_count: count || 0
                }
            })
        )

        return collectionsWithCounts
    }

    // Get a single collection by ID with its artworks
    static async getCollection(id: string): Promise<CollectionWithArtworks | null> {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            throw new Error('User not authenticated')
        }

        const { data: collection, error } = await supabase
            .from('collections')
            .select('*')
            .eq('id', id)
            .eq('user_id', user.id)
            .single()

        if (error) {
            if (error.code === 'PGRST116') {
                return null
            }
            throw new Error(`Failed to fetch collection: ${error.message}`)
        }

        // Get artworks in this collection
        const artworks = await this.getCollectionArtworks(id)

        return {
            ...collection,
            artworks,
            artworks_count: artworks.length
        }
    }

    // Get a public collection by slug (no auth required)
    static async getPublicCollection(slug: string): Promise<CollectionWithArtworks | null> {
        const { data: collection, error } = await supabase
            .from('collections')
            .select('*')
            .eq('slug', slug)
            .eq('visibility', 'public')
            .single()

        if (error) {
            if (error.code === 'PGRST116') {
                return null
            }
            throw new Error(`Failed to fetch collection: ${error.message}`)
        }

        // Get artworks in this collection
        const { data: collectionArtworks } = await supabase
            .from('collection_artworks')
            .select(`
                order_index,
                artworks (
                    *,
                    certificates (*),
                    nfc_tags (*),
                    verification_levels (*)
                )
            `)
            .eq('collection_id', collection.id)
            .order('order_index', { ascending: true })

        const artworks = (collectionArtworks || [])
            .map(ca => ca.artworks as unknown as ArtworkWithDetails)
            .filter(Boolean)

        return {
            ...collection,
            artworks,
            artworks_count: artworks.length
        }
    }

    // Create a new collection
    static async createCollection(collectionData: Omit<CollectionInsert, 'user_id'>): Promise<Collection> {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            throw new Error('User not authenticated')
        }

        // Generate slug from name if not provided
        const slug = collectionData.slug || this.generateSlug(collectionData.name)

        const { data: collection, error } = await supabase
            .from('collections')
            .insert({
                ...collectionData,
                user_id: user.id,
                slug,
                visibility: collectionData.visibility || 'private'
            })
            .select()
            .single()

        if (error) {
            throw new Error(`Failed to create collection: ${error.message}`)
        }

        return collection
    }

    // Update a collection
    static async updateCollection(id: string, updates: CollectionUpdate): Promise<Collection> {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            throw new Error('User not authenticated')
        }

        // If name is being updated and slug isn't provided, regenerate slug
        if (updates.name && !updates.slug) {
            updates.slug = this.generateSlug(updates.name)
        }

        const { data: collection, error } = await supabase
            .from('collections')
            .update(updates)
            .eq('id', id)
            .eq('user_id', user.id)
            .select()
            .single()

        if (error) {
            throw new Error(`Failed to update collection: ${error.message}`)
        }

        return collection
    }

    // Delete a collection
    static async deleteCollection(id: string): Promise<void> {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            throw new Error('User not authenticated')
        }

        const { error } = await supabase
            .from('collections')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id)

        if (error) {
            throw new Error(`Failed to delete collection: ${error.message}`)
        }
    }

    // Get artworks in a collection
    static async getCollectionArtworks(collectionId: string): Promise<ArtworkWithDetails[]> {
        const { data: collectionArtworks, error } = await supabase
            .from('collection_artworks')
            .select(`
                order_index,
                artworks (
                    *,
                    certificates (*),
                    nfc_tags (*),
                    verification_levels (*)
                )
            `)
            .eq('collection_id', collectionId)
            .order('order_index', { ascending: true })

        if (error) {
            throw new Error(`Failed to fetch collection artworks: ${error.message}`)
        }

        return (collectionArtworks || [])
            .map(ca => ca.artworks as unknown as ArtworkWithDetails)
            .filter(Boolean)
    }

    // Add an artwork to a collection
    static async addArtwork(collectionId: string, artworkId: string): Promise<CollectionArtwork> {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            throw new Error('User not authenticated')
        }

        // Verify collection belongs to user
        const { data: collection } = await supabase
            .from('collections')
            .select('id')
            .eq('id', collectionId)
            .eq('user_id', user.id)
            .single()

        if (!collection) {
            throw new Error('Collection not found or access denied')
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

        // Get the highest order_index
        const { data: lastItem } = await supabase
            .from('collection_artworks')
            .select('order_index')
            .eq('collection_id', collectionId)
            .order('order_index', { ascending: false })
            .limit(1)
            .single()

        const nextOrderIndex = (lastItem?.order_index ?? -1) + 1

        const { data: collectionArtwork, error } = await supabase
            .from('collection_artworks')
            .insert({
                collection_id: collectionId,
                artwork_id: artworkId,
                order_index: nextOrderIndex
            })
            .select()
            .single()

        if (error) {
            if (error.code === '23505') {
                throw new Error('Artwork is already in this collection')
            }
            throw new Error(`Failed to add artwork to collection: ${error.message}`)
        }

        return collectionArtwork
    }

    // Remove an artwork from a collection
    static async removeArtwork(collectionId: string, artworkId: string): Promise<void> {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            throw new Error('User not authenticated')
        }

        // Verify collection belongs to user
        const { data: collection } = await supabase
            .from('collections')
            .select('id')
            .eq('id', collectionId)
            .eq('user_id', user.id)
            .single()

        if (!collection) {
            throw new Error('Collection not found or access denied')
        }

        const { error } = await supabase
            .from('collection_artworks')
            .delete()
            .eq('collection_id', collectionId)
            .eq('artwork_id', artworkId)

        if (error) {
            throw new Error(`Failed to remove artwork from collection: ${error.message}`)
        }
    }

    // Reorder artworks in a collection
    static async reorderArtworks(collectionId: string, orderedArtworkIds: string[]): Promise<void> {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            throw new Error('User not authenticated')
        }

        // Verify collection belongs to user
        const { data: collection } = await supabase
            .from('collections')
            .select('id')
            .eq('id', collectionId)
            .eq('user_id', user.id)
            .single()

        if (!collection) {
            throw new Error('Collection not found or access denied')
        }

        // Update order for each artwork
        const updates = orderedArtworkIds.map((artworkId, index) =>
            supabase
                .from('collection_artworks')
                .update({ order_index: index })
                .eq('collection_id', collectionId)
                .eq('artwork_id', artworkId)
        )

        await Promise.all(updates)
    }

    // Get collections that contain a specific artwork
    static async getCollectionsForArtwork(artworkId: string): Promise<Collection[]> {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            throw new Error('User not authenticated')
        }

        const { data: collectionArtworks, error } = await supabase
            .from('collection_artworks')
            .select(`
                collections (*)
            `)
            .eq('artwork_id', artworkId)

        if (error) {
            throw new Error(`Failed to fetch collections: ${error.message}`)
        }

        return (collectionArtworks || [])
            .map(ca => ca.collections as unknown as Collection)
            .filter(Boolean)
    }

    // Helper to generate URL-safe slug
    private static generateSlug(name: string): string {
        const base = name
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .slice(0, 50)

        const random = Math.random().toString(36).slice(2, 8)
        return `${base}-${random}`
    }
}
