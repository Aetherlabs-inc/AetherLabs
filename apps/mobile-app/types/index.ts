export type ProfileVisibility = 'private' | 'public';

export interface User {
  id: string;
  email: string;
  full_name: string;
  username?: string;
  slug?: string;
  avatar_url?: string;
  user_type?: string;
  bio?: string;
  website?: string;
  location?: string;
  phone?: string;
  instagram?: string;
  profile_visibility?: ProfileVisibility;
  email_verified?: boolean;
  created_at?: string;
  updated_at?: string;
}

/**
 * Public profile data - safe to share with anyone
 * Excludes sensitive information like email, phone, etc.
 */
export interface PublicProfile {
  id: string;
  full_name: string;
  username?: string;
  slug?: string;
  avatar_url?: string;
  user_type?: string;
  bio?: string;
  location?: string;
  profile_visibility?: ProfileVisibility;
  created_at?: string;
  // Statistics (computed separately)
  statistics?: {
    artworks: number;
    certificates: number;
    tags_linked?: number;
    scans_this_week?: number;
  };
}

export interface Artwork {
  id: string;
  user_id: string;
  title: string;
  artist: string;
  year: number;
  medium: string;
  dimensions: string;
  status: 'verified' | 'unverified';
  image_url?: string;
  created_at?: string;
  updated_at?: string;
}

export type NFCTagType = 'standard' | 'ntag424';

export interface NFCTag {
  id: string;
  artwork_id: string;
  nfc_uid: string;
  is_bound: boolean;
  binding_status: string;
  verification_code?: string;
  aes_key?: string;
  last_counter?: number;
  tag_type?: NFCTagType;
  created_at?: string;
  updated_at?: string;
}

export interface VerificationResult {
  valid: boolean;
  error?: 'invalid_cmac' | 'replay_attack' | 'not_found' | 'rate_limited';
  artwork?: {
    title: string;
    artist: string | null;
    year: number | null;
    status: string;
    image_url: string | null;
  };
  certificate?: {
    certificate_id: string;
    generated_at: string;
  };
  tagType?: NFCTagType;
}

export interface VerificationLevel {
  id: string;
  artwork_id: string;
  level: string;
  verified_by?: string;
  verified_at?: string;
  created_at?: string;
}

export interface Certificate {
  id: string;
  artwork_id: string;
  certificate_id: string;
  qr_code_url?: string;
  blockchain_hash?: string;
  generated_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SurveyResponse {
  id: string;
  email: string;
  responses: Record<string, any>;
  certificate_id?: string;
  qr_code_url?: string;
  blockchain_hash?: string;
  generated_at?: string;
  created_at?: string;
  updated_at?: string;
}
