export interface Database {
    public: {
        Tables: {
            user_profiles: {
                Row: {
                    id: string
                    email: string
                    full_name: string | null
                    username: string | null
                    slug: string | null
                    avatar_url: string | null
                    user_type: 'artist' | 'gallery' | 'collector'
                    bio: string | null
                    website: string | null
                    location: string | null
                    phone: string | null
                    instagram: string | null
                    profile_visibility: 'public' | 'private' | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    email: string
                    full_name?: string | null
                    username?: string | null
                    slug?: string | null
                    avatar_url?: string | null
                    user_type?: 'artist' | 'gallery' | 'collector'
                    bio?: string | null
                    website?: string | null
                    location?: string | null
                    phone?: string | null
                    instagram?: string | null
                    profile_visibility?: 'public' | 'private' | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    full_name?: string | null
                    username?: string | null
                    slug?: string | null
                    avatar_url?: string | null
                    user_type?: 'artist' | 'gallery' | 'collector'
                    bio?: string | null
                    website?: string | null
                    location?: string | null
                    phone?: string | null
                    instagram?: string | null
                    profile_visibility?: 'public' | 'private' | null
                    created_at?: string
                    updated_at?: string
                }
            }
            artworks: {
                Row: {
                    id: string
                    title: string
                    artist: string
                    year: number
                    medium: string
                    dimensions: string
                    status: 'unverified' | 'authenticated' | 'pending_verification' | 'needs_review'
                    image_url: string | null
                    created_at: string
                    updated_at: string
                    user_id: string
                }
                Insert: {
                    id?: string
                    title: string
                    artist: string
                    year: number
                    medium: string
                    dimensions: string
                    status?: 'unverified' | 'authenticated' | 'pending_verification' | 'needs_review'
                    image_url?: string | null
                    created_at?: string
                    updated_at?: string
                    user_id: string
                }
                Update: {
                    id?: string
                    title?: string
                    artist?: string
                    year?: number
                    medium?: string
                    dimensions?: string
                    status?: 'unverified' | 'authenticated' | 'pending_verification' | 'needs_review'
                    image_url?: string | null
                    created_at?: string
                    updated_at?: string
                    user_id?: string
                }
            }
            certificates: {
                Row: {
                    id: string
                    artwork_id: string
                    certificate_id: string
                    qr_code_url: string | null
                    blockchain_hash: string | null
                    generated_at: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    artwork_id: string
                    certificate_id: string
                    qr_code_url?: string | null
                    blockchain_hash?: string | null
                    generated_at?: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    artwork_id?: string
                    certificate_id?: string
                    qr_code_url?: string | null
                    blockchain_hash?: string | null
                    generated_at?: string
                    created_at?: string
                    updated_at?: string
                }
            }
            nfc_tags: {
                Row: {
                    id: string
                    artwork_id: string
                    nfc_uid: string
                    is_bound: boolean
                    binding_status: 'pending' | 'success' | 'failed'
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    artwork_id: string
                    nfc_uid: string
                    is_bound?: boolean
                    binding_status?: 'pending' | 'success' | 'failed'
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    artwork_id?: string
                    nfc_uid?: string
                    is_bound?: boolean
                    binding_status?: 'pending' | 'success' | 'failed'
                    created_at?: string
                    updated_at?: string
                }
            }
            verification_levels: {
                Row: {
                    id: string
                    artwork_id: string
                    level: 'unverified' | 'artist_verified' | 'gallery_verified' | 'third_party_verified'
                    verified_by: string | null
                    verified_at: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    artwork_id: string
                    level: 'unverified' | 'artist_verified' | 'gallery_verified' | 'third_party_verified'
                    verified_by?: string | null
                    verified_at?: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    artwork_id?: string
                    level?: 'unverified' | 'artist_verified' | 'gallery_verified' | 'third_party_verified'
                    verified_by?: string | null
                    verified_at?: string
                    created_at?: string
                }
            }
            survey_responses: {
                Row: {
                    id: string
                    email: string | null
                    responses: Record<string, any>
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    email?: string | null
                    responses: Record<string, any>
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    email?: string | null
                    responses?: Record<string, any>
                    created_at?: string
                    updated_at?: string
                }
            }
        }
    }
}

export type UserProfile = Database['public']['Tables']['user_profiles']['Row']
export type Artwork = Database['public']['Tables']['artworks']['Row']
export type Certificate = Database['public']['Tables']['certificates']['Row']
export type NFCTag = Database['public']['Tables']['nfc_tags']['Row']
export type VerificationLevel = Database['public']['Tables']['verification_levels']['Row']
export type SurveyResponse = Database['public']['Tables']['survey_responses']['Row']

export type ArtworkWithDetails = Artwork & {
    certificates?: Certificate[]
    nfc_tags?: NFCTag[]
    verification_levels?: VerificationLevel[]
}
