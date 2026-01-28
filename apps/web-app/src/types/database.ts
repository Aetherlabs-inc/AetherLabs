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

// ============================================
// COLLECTIONS
// ============================================

export type CollectionVisibility = 'public' | 'private' | 'unlisted'

export interface Collection {
    id: string
    user_id: string
    name: string
    description: string | null
    cover_image_url: string | null
    visibility: CollectionVisibility
    slug: string | null
    created_at: string
    updated_at: string
}

export interface CollectionInsert {
    id?: string
    user_id: string
    name: string
    description?: string | null
    cover_image_url?: string | null
    visibility?: CollectionVisibility
    slug?: string | null
}

export interface CollectionUpdate {
    name?: string
    description?: string | null
    cover_image_url?: string | null
    visibility?: CollectionVisibility
    slug?: string | null
}

export interface CollectionArtwork {
    id: string
    collection_id: string
    artwork_id: string
    order_index: number
    added_at: string
}

export interface CollectionWithArtworks extends Collection {
    artworks?: ArtworkWithDetails[]
    artworks_count?: number
}

// ============================================
// ARTWORK DOCUMENTATION
// ============================================

export type OwnerType = 'artist' | 'gallery' | 'collector' | 'dealer' | 'institution'
export type AcquisitionMethod = 'purchase' | 'commission' | 'gift' | 'inheritance' | 'auction' | 'transfer'
export type VenueType = 'museum' | 'gallery' | 'fair' | 'biennale' | 'private' | 'online'
export type ConservationRecordType = 'condition_report' | 'restoration' | 'cleaning' | 'reframing' | 'material_note'

export interface ProvenanceRecord {
    id: string
    artwork_id: string
    owner_name: string
    owner_type: OwnerType | null
    acquisition_date: string | null
    acquisition_method: AcquisitionMethod | null
    location: string | null
    notes: string | null
    documentation_url: string | null
    verified: boolean
    order_index: number
    created_at: string
}

export interface ProvenanceRecordInsert {
    artwork_id: string
    owner_name: string
    owner_type?: OwnerType | null
    acquisition_date?: string | null
    acquisition_method?: AcquisitionMethod | null
    location?: string | null
    notes?: string | null
    documentation_url?: string | null
    verified?: boolean
    order_index?: number
}

export interface ExhibitionRecord {
    id: string
    artwork_id: string
    exhibition_name: string
    venue_name: string
    venue_type: VenueType | null
    city: string | null
    country: string | null
    start_date: string | null
    end_date: string | null
    catalog_number: string | null
    notes: string | null
    created_at: string
}

export interface ExhibitionRecordInsert {
    artwork_id: string
    exhibition_name: string
    venue_name: string
    venue_type?: VenueType | null
    city?: string | null
    country?: string | null
    start_date?: string | null
    end_date?: string | null
    catalog_number?: string | null
    notes?: string | null
}

export interface ConservationRecord {
    id: string
    artwork_id: string
    record_type: ConservationRecordType
    title: string
    description: string | null
    performed_by: string | null
    performed_at: string | null
    before_image_url: string | null
    after_image_url: string | null
    created_at: string
}

export interface ConservationRecordInsert {
    artwork_id: string
    record_type: ConservationRecordType
    title: string
    description?: string | null
    performed_by?: string | null
    performed_at?: string | null
    before_image_url?: string | null
    after_image_url?: string | null
}

export interface ArtworkWithDocumentation extends ArtworkWithDetails {
    provenance_records?: ProvenanceRecord[]
    exhibition_records?: ExhibitionRecord[]
    conservation_records?: ConservationRecord[]
}

// ============================================
// OWNERSHIP TRANSFERS
// ============================================

export type TransferStatus = 'pending' | 'awaiting_recipient' | 'recipient_confirmed' | 'witness_required' | 'completed' | 'cancelled' | 'rejected'

export interface OwnershipTransfer {
    id: string
    artwork_id: string
    from_user_id: string
    to_user_id: string | null
    to_email: string
    status: TransferStatus
    requires_witness: boolean
    witness_email: string | null
    witness_confirmed_at: string | null
    from_confirmed_at: string | null
    to_confirmed_at: string | null
    transfer_notes: string | null
    completed_at: string | null
    created_at: string
}

export interface OwnershipTransferInsert {
    artwork_id: string
    from_user_id?: string // Optional - service sets this from authenticated user
    to_email: string
    requires_witness?: boolean
    witness_email?: string | null
    transfer_notes?: string | null
}

export interface OwnershipTransferWithDetails extends OwnershipTransfer {
    from_user?: UserProfile
    to_user?: UserProfile
    artwork?: Artwork
}

// ============================================
// CERTIFICATE TEMPLATES
// ============================================

export type CertificateLayout = 'elegant' | 'minimal' | 'classic' | 'modern'
export type SealStyle = 'embossed' | 'flat' | 'gold' | 'none'
export type CertificateSealStyle = SealStyle // Alias for convenience
export type FontFamily = 'playfair' | 'cormorant' | 'libre-baskerville' | 'inter' | 'dm-sans'

export interface CertificateTemplateConfig {
    colors: {
        background: string
        text: string
        accent: string
        border: string
    }
    font: FontFamily
    show_qr: boolean
    show_seal: boolean
    background_blur: number // 0-20
    invert_background: boolean
    background_opacity: number // 0-100
}

export interface CertificateTemplate {
    id: string
    user_id: string
    name: string
    is_default: boolean
    config: CertificateTemplateConfig
    created_at: string
}

export interface CertificateTemplateInsert {
    user_id: string
    name: string
    is_default?: boolean
    config: CertificateTemplateConfig
}

export interface CertificateTemplateUpdate {
    name?: string
    is_default?: boolean
    config?: CertificateTemplateConfig
}
