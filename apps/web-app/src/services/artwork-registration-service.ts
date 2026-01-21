import { createClient } from '@/src/lib/supabase'
import { ArtworkService } from './artwork-service'
import { userProfileService } from './user-profile-service'
import { Artwork, Certificate, NFCTag } from '@/src/types/database'

const supabase = createClient()

export interface ArtworkRegistrationData {
    // Identity (Core MVP)
    title: string
    year: string
    medium: string
    dimensions: {
        height: string
        width: string
        depth: string
        unit: string
    }
    primaryImage: File | null

    // Details
    description: string
    editionType: 'unique' | 'editioned'
    editionSize: string
    editionNumber: string
    signature: boolean
    signatureLocation: string
    creationLocation: string

    // COA Linkage
    certificateId: string
    generateCOA: boolean

    // NFC
    nfcUid: string
    bindNFC: boolean

    // Cataloging
    tags: string[]
    category: string
    collection: string
    series: string

    // Privacy & Status
    visibility: 'private' | 'shareable' | 'public'
    status: 'draft' | 'published'
}

export interface COAData {
    certificateId: string
    qrCode: string
    blockchainHash: string
    generatedAt: string
}

export interface NFCData {
    nfcUid: string
    isBound: boolean
    bindingStatus: 'pending' | 'success' | 'failed'
}

export class ArtworkRegistrationService {
    /**
     * Upload image to Supabase Storage
     */
    static async uploadImage(file: File, artworkId: string): Promise<string> {
        console.log('Starting image upload for artwork:', artworkId, 'File:', file.name, 'Size:', file.size)

        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            console.error('User not authenticated for image upload')
            throw new Error('User not authenticated')
        }

        console.log('User authenticated:', user.id)

        // Create a unique filename
        const fileExt = file.name.split('.').pop()
        const fileName = `${artworkId}-${Date.now()}.${fileExt}`
        const filePath = `${user.id}/${fileName}`

        console.log('Uploading to path:', filePath)

        // Upload the file
        const { error } = await supabase.storage
            .from('artwork-images')
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
            })

        if (error) {
            console.error('Storage upload error:', error)
            throw new Error(`Failed to upload image: ${error.message}`)
        }

        console.log('File uploaded successfully')

        // Get the public URL
        const { data: { publicUrl } } = supabase.storage
            .from('artwork-images')
            .getPublicUrl(filePath)

        console.log('Generated public URL:', publicUrl)
        return publicUrl
    }

    /**
     * Create artwork from form data
     */
    static async createArtwork(formData: ArtworkRegistrationData): Promise<Artwork> {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            throw new Error('User not authenticated')
        }

        // Get user profile to use full name instead of email
        let artistName = user.email || 'Unknown Artist'
        try {
            const userProfile = await userProfileService.getUserProfile(user.id)
            if (userProfile?.full_name) {
                artistName = userProfile.full_name
            }
        } catch (error) {
            console.warn('Failed to fetch user profile, using email as fallback:', error)
        }

        // Prepare artwork data
        const dimensionsString = `${formData.dimensions.height} × ${formData.dimensions.width} × ${formData.dimensions.depth} ${formData.dimensions.unit}`

        const artworkData = {
            title: formData.title,
            artist: artistName,
            year: parseInt(formData.year),
            medium: formData.medium,
            dimensions: dimensionsString,
            image_url: null // Will be set after image upload
        }

        // Create the artwork
        const artwork = await ArtworkService.createArtwork({
            title: artworkData.title,
            artist: artistName,
            year: artworkData.year,
            medium: artworkData.medium,
            dimensions: dimensionsString,
            image_url: undefined
        })

        // Upload image if provided
        if (formData.primaryImage) {
            try {
                const imageUrl = await this.uploadImage(formData.primaryImage, artwork.id)

                // Update artwork with image URL
                await ArtworkService.updateArtwork(artwork.id, { image_url: imageUrl })
                artwork.image_url = imageUrl
            } catch (error) {
                console.error('Failed to upload image:', error)
                // Continue without image - artwork is still created
            }
        }

        return artwork
    }

    /**
     * Generate COA (Certificate of Authenticity)
     */
    static async generateCOA(artworkId: string): Promise<COAData> {
        try {
            // Simulate COA generation process
            const certificateId = `COA-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
            const qrCode = `https://aetherlabs.art/verify/${certificateId}`
            const blockchainHash = `0x${Math.random().toString(16).substr(2, 64)}`
            const generatedAt = new Date().toISOString()

            // Create certificate in database
            await ArtworkService.createCertificate(artworkId, {
                certificate_id: certificateId,
                qr_code_url: qrCode,
                blockchain_hash: blockchainHash
            })

            return {
                certificateId,
                qrCode,
                blockchainHash,
                generatedAt
            }
        } catch (error) {
            console.error('Error generating COA:', error)
            throw new Error(`Failed to generate COA: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
    }

    /**
     * Bind NFC tag to artwork
     */
    static async bindNFCTag(artworkId: string, nfcUid: string): Promise<NFCData> {
        try {
            await ArtworkService.createNFCTag(artworkId, {
                nfc_uid: nfcUid,
                is_bound: true,
                binding_status: 'success'
            })

            return {
                nfcUid,
                isBound: true,
                bindingStatus: 'success'
            }
        } catch (error) {
            console.error('Error binding NFC tag:', error)
            throw new Error(`Failed to bind NFC tag: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
    }

    /**
     * Complete artwork registration process
     */
    static async registerArtwork(
        formData: ArtworkRegistrationData,
        coaData?: COAData,
        nfcData?: NFCData
    ): Promise<{
        artwork: Artwork
        certificate?: Certificate
        nfcTag?: NFCTag
    }> {
        try {
            // 1. Create the artwork
            const artwork = await this.createArtwork(formData)

            let certificate: Certificate | undefined
            let nfcTag: NFCTag | undefined

            // 2. Create COA if requested
            if (formData.generateCOA && coaData) {
                certificate = await ArtworkService.createCertificate(artwork.id, {
                    certificate_id: coaData.certificateId,
                    qr_code_url: coaData.qrCode,
                    blockchain_hash: coaData.blockchainHash
                })
            }

            // 3. Bind NFC tag if requested
            if (formData.bindNFC && nfcData) {
                nfcTag = await ArtworkService.createNFCTag(artwork.id, {
                    nfc_uid: nfcData.nfcUid,
                    is_bound: nfcData.isBound,
                    binding_status: nfcData.bindingStatus
                })
            }

            return {
                artwork,
                certificate,
                nfcTag
            }
        } catch (error) {
            console.error('Error registering artwork:', error)
            throw new Error(`Failed to register artwork: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
    }

    /**
     * Get user's artist name from user profile
     */
    static async getArtistName(): Promise<string> {
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            throw new Error('User not authenticated')
        }

        try {
            const userProfile = await userProfileService.getUserProfile(user.id)
            if (userProfile?.full_name) {
                return userProfile.full_name
            }
        } catch (error) {
            console.warn('Failed to fetch user profile, using fallback:', error)
        }

        // Fallback to email or metadata
        return user.user_metadata?.full_name || user.email?.split('@')[0] || 'Unknown Artist'
    }
}
