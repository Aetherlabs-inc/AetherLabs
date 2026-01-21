import { createClient } from '@/src/lib/supabase'
import { userProfileService } from './user-profile-service'

const supabase = createClient()
import { Artwork, ArtworkWithDetails, Certificate, NFCTag, VerificationLevel } from '@/src/types/database'

export class ArtworkService {
    // Get all artworks for the current user
    static async getArtworks(): Promise<ArtworkWithDetails[]> {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            throw new Error('User not authenticated')
        }

        const { data: artworks, error } = await supabase
            .from('artworks')
            .select(`
        *,
        certificates (*),
        nfc_tags (*),
        verification_levels (*)
      `)
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })

        if (error) {
            throw new Error(`Failed to fetch artworks: ${error.message}`)
        }

        return artworks || []
    }

    // Get public artworks for a specific user (no authentication required)
    static async getPublicArtworks(userId: string): Promise<ArtworkWithDetails[]> {
        const { data: artworks, error } = await supabase
            .from('artworks')
            .select(`
                *,
                certificates (*),
                nfc_tags (*),
                verification_levels (*)
            `)
            .eq('user_id', userId)
            .in('status', ['verified', 'authenticated', 'pending_verification'])
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching public artworks:', error);
            throw new Error(`Failed to fetch public artworks: ${error.message}`)
        }

        return artworks || []
    }

    // Get a single artwork by ID
    static async getArtwork(id: string): Promise<ArtworkWithDetails | null> {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            throw new Error('User not authenticated')
        }

        const { data: artwork, error } = await supabase
            .from('artworks')
            .select(`
        *,
        certificates (*),
        nfc_tags (*),
        verification_levels (*)
      `)
            .eq('id', id)
            .eq('user_id', user.id)
            .single()

        if (error) {
            if (error.code === 'PGRST116') {
                return null // Artwork not found
            }
            throw new Error(`Failed to fetch artwork: ${error.message}`)
        }

        return artwork
    }

    // Create a new artwork
    static async createArtwork(artworkData: {
        title: string
        artist: string
        year: number
        medium: string
        dimensions: string
        image_url?: string
    }): Promise<Artwork> {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            throw new Error('User not authenticated')
        }

        // If artist is not provided or is an email, try to get the user's full name
        let artistName = artworkData.artist
        if (!artistName || artistName.includes('@')) {
            try {
                const userProfile = await userProfileService.getUserProfile(user.id)
                if (userProfile?.full_name) {
                    artistName = userProfile.full_name
                } else {
                    artistName = user.email || 'Unknown Artist'
                }
            } catch (error) {
                console.warn('Failed to fetch user profile, using provided artist name:', error)
                artistName = artworkData.artist || user.email || 'Unknown Artist'
            }
        }

        const { data: artwork, error } = await supabase
            .from('artworks')
            .insert({
                ...artworkData,
                artist: artistName,
                user_id: user.id,
                status: 'unverified'
            })
            .select()
            .single()

        if (error) {
            throw new Error(`Failed to create artwork: ${error.message}`)
        }

        return artwork
    }

    // Update an artwork
    static async updateArtwork(id: string, updates: Partial<Artwork>): Promise<Artwork> {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            throw new Error('User not authenticated')
        }

        const { data: artwork, error } = await supabase
            .from('artworks')
            .update(updates)
            .eq('id', id)
            .eq('user_id', user.id)
            .select()
            .single()

        if (error) {
            throw new Error(`Failed to update artwork: ${error.message}`)
        }

        return artwork
    }

    // Delete an artwork
    static async deleteArtwork(id: string): Promise<void> {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            throw new Error('User not authenticated')
        }

        // First, get the artwork to check if it has an image
        const { data: artwork } = await supabase
            .from('artworks')
            .select('image_url')
            .eq('id', id)
            .eq('user_id', user.id)
            .single()

        // Delete the artwork (this will cascade to certificates, nfc_tags, and verification_levels)
        const { error } = await supabase
            .from('artworks')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id)

        if (error) {
            throw new Error(`Failed to delete artwork: ${error.message}`)
        }

        // If the artwork had an image, try to delete it from storage
        if (artwork?.image_url) {
            try {
                // Extract the file path from the URL
                const url = new URL(artwork.image_url)
                const pathParts = url.pathname.split('/')
                const bucketIndex = pathParts.findIndex(part => part === 'artwork-images')

                if (bucketIndex !== -1 && pathParts[bucketIndex + 1]) {
                    const filePath = pathParts.slice(bucketIndex + 1).join('/')
                    await supabase.storage
                        .from('artwork-images')
                        .remove([filePath])
                }
            } catch (storageError) {
                // Log the error but don't fail the deletion
                console.warn('Failed to delete artwork image from storage:', storageError)
            }
        }
    }

    // Create a certificate for an artwork
    static async createCertificate(artworkId: string, certificateData: {
        certificate_id: string
        qr_code_url?: string
        blockchain_hash?: string
    }): Promise<Certificate> {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            throw new Error('User not authenticated')
        }

        // Verify the artwork belongs to the user
        const { data: artwork } = await supabase
            .from('artworks')
            .select('id')
            .eq('id', artworkId)
            .eq('user_id', user.id)
            .single()

        if (!artwork) {
            throw new Error('Artwork not found or access denied')
        }

        const { data: certificate, error } = await supabase
            .from('certificates')
            .insert({
                artwork_id: artworkId,
                ...certificateData
            })
            .select()
            .single()

        if (error) {
            throw new Error(`Failed to create certificate: ${error.message}`)
        }

        return certificate
    }

    // Create an NFC tag for an artwork
    static async createNFCTag(artworkId: string, nfcData: {
        nfc_uid: string
        is_bound?: boolean
        binding_status?: 'pending' | 'success' | 'failed'
    }): Promise<NFCTag> {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            throw new Error('User not authenticated')
        }

        // Verify the artwork belongs to the user
        const { data: artwork } = await supabase
            .from('artworks')
            .select('id')
            .eq('id', artworkId)
            .eq('user_id', user.id)
            .single()

        if (!artwork) {
            throw new Error('Artwork not found or access denied')
        }

        const { data: nfcTag, error } = await supabase
            .from('nfc_tags')
            .insert({
                artwork_id: artworkId,
                ...nfcData
            })
            .select()
            .single()

        if (error) {
            throw new Error(`Failed to create NFC tag: ${error.message}`)
        }

        return nfcTag
    }

    // Update verification level for an artwork
    static async updateVerificationLevel(artworkId: string, level: 'unverified' | 'artist_verified' | 'gallery_verified' | 'third_party_verified', verifiedBy?: string): Promise<VerificationLevel> {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            throw new Error('User not authenticated')
        }

        // Verify the artwork belongs to the user
        const { data: artwork } = await supabase
            .from('artworks')
            .select('id')
            .eq('id', artworkId)
            .eq('user_id', user.id)
            .single()

        if (!artwork) {
            throw new Error('Artwork not found or access denied')
        }

        const { data: verificationLevel, error } = await supabase
            .from('verification_levels')
            .insert({
                artwork_id: artworkId,
                level,
                verified_by: verifiedBy || user.email || null
            })
            .select()
            .single()

        if (error) {
            throw new Error(`Failed to update verification level: ${error.message}`)
        }

        return verificationLevel
    }
}
