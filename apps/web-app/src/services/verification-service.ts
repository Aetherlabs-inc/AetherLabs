import { createClient } from '@/src/lib/supabase'

// ============================================
// TYPES
// ============================================

export type VerificationError = 'invalid_cmac' | 'replay_attack' | 'not_found' | 'rate_limited'

export interface PublicArtworkInfo {
  title: string
  artist: string | null
  year: number | null
  status: string
  image_url: string | null
}

export interface PublicCertificateInfo {
  certificate_id: string
  generated_at: string
}

export interface VerificationResult {
  valid: boolean
  error?: VerificationError
  artwork?: PublicArtworkInfo
  certificate?: PublicCertificateInfo
  tagType?: 'standard' | 'ntag424'
}

export interface ScanMetadata {
  scanType: 'web' | 'app' | 'app_authenticated'
  ipAddress?: string
  userAgent?: string
  deviceFingerprint?: string
}

// ============================================
// RATE LIMITING
// ============================================

const RATE_LIMITS = {
  perTagPerHour: 10,
  perIpPerHour: 50,
  failedAttemptsPerHour: 5,
}

// ============================================
// VERIFICATION SERVICE
// ============================================

export class VerificationService {
  private supabase = createClient()

  /**
   * Verify an artwork by its verification code
   * This is the main public verification method
   */
  async verifyByCode(
    code: string,
    counter?: number,
    cmac?: string,
    metadata?: ScanMetadata
  ): Promise<VerificationResult> {
    try {
      // 1. Look up the tag by verification code
      const { data: tag, error: tagError } = await this.supabase
        .from('nfc_tags')
        .select(
          `
          id,
          artwork_id,
          nfc_uid,
          is_bound,
          tag_type,
          aes_key,
          last_counter,
          verification_code
        `
        )
        .eq('verification_code', code.toUpperCase())
        .single()

      if (tagError || !tag) {
        await this.logScan(null, null, 'not_found', metadata)
        return { valid: false, error: 'not_found' }
      }

      // 2. Check rate limiting
      const isRateLimited = await this.checkRateLimit(tag.id, metadata?.ipAddress)
      if (isRateLimited) {
        await this.logScan(tag.id, tag.artwork_id, 'rate_limited', metadata)
        return { valid: false, error: 'rate_limited' }
      }

      // 3. For NTAG 424 DNA tags, validate cryptographic signature (future enhancement)
      // For MVP with standard tags, we skip cryptographic validation
      // The tag is verified by matching the verification_code
      if (tag.tag_type === 'ntag424' && tag.aes_key && counter !== undefined && cmac) {
        // NTAG 424 DNA validation would go here in production
        // For now, we accept the tag if it has a valid verification code
        console.log('NTAG 424 DNA tag detected - cryptographic validation skipped in MVP')
      }

      // 4. Fetch artwork and certificate info
      const { data: artwork, error: artworkError } = await this.supabase
        .from('artworks')
        .select(
          `
          id,
          title,
          artist,
          year,
          status,
          image_url,
          certificates (
            certificate_id,
            generated_at
          )
        `
        )
        .eq('id', tag.artwork_id)
        .single()

      if (artworkError || !artwork) {
        await this.logScan(tag.id, tag.artwork_id, 'not_found', metadata, counter)
        return { valid: false, error: 'not_found' }
      }

      // 5. Log successful verification
      await this.logScan(tag.id, tag.artwork_id, 'valid', metadata, counter)

      // 6. Return minimal public info
      const certificates = artwork.certificates as Array<{ certificate_id: string; generated_at: string }> | null

      return {
        valid: true,
        tagType: tag.tag_type as 'standard' | 'ntag424',
        artwork: {
          title: artwork.title,
          artist: artwork.artist,
          year: artwork.year,
          status: artwork.status,
          image_url: artwork.image_url,
        },
        certificate: certificates?.[0]
          ? {
              certificate_id: certificates[0].certificate_id,
              generated_at: certificates[0].generated_at,
            }
          : undefined,
      }
    } catch (error) {
      console.error('Verification error:', error)
      return { valid: false, error: 'not_found' }
    }
  }

  /**
   * Check if the request is rate limited
   */
  private async checkRateLimit(tagId: string, ipAddress?: string): Promise<boolean> {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()

    // Check per-tag rate limit
    const { count: tagCount } = await this.supabase
      .from('verification_scans')
      .select('*', { count: 'exact', head: true })
      .eq('nfc_tag_id', tagId)
      .gte('scanned_at', oneHourAgo)

    if ((tagCount || 0) >= RATE_LIMITS.perTagPerHour) {
      return true
    }

    // Check per-IP rate limit
    if (ipAddress) {
      const { count: ipCount } = await this.supabase
        .from('verification_scans')
        .select('*', { count: 'exact', head: true })
        .eq('ip_address', ipAddress)
        .gte('scanned_at', oneHourAgo)

      if ((ipCount || 0) >= RATE_LIMITS.perIpPerHour) {
        return true
      }
    }

    // Check failed attempts rate limit
    const { count: failedCount } = await this.supabase
      .from('verification_scans')
      .select('*', { count: 'exact', head: true })
      .eq('nfc_tag_id', tagId)
      .in('verification_result', ['invalid_cmac', 'replay_attack'])
      .gte('scanned_at', oneHourAgo)

    if ((failedCount || 0) >= RATE_LIMITS.failedAttemptsPerHour) {
      return true
    }

    return false
  }

  /**
   * Log a verification scan attempt
   */
  private async logScan(
    tagId: string | null,
    artworkId: string | null,
    result: string,
    metadata?: ScanMetadata,
    counterValue?: number
  ): Promise<void> {
    try {
      await this.supabase.from('verification_scans').insert({
        nfc_tag_id: tagId,
        artwork_id: artworkId,
        scan_type: metadata?.scanType || 'web',
        device_fingerprint: metadata?.deviceFingerprint,
        ip_address: metadata?.ipAddress,
        user_agent: metadata?.userAgent,
        counter_value: counterValue,
        verification_result: result,
      })
    } catch (error) {
      console.error('Failed to log scan:', error)
    }
  }

  /**
   * Verify an artwork by NFC UID (for mobile app scanning)
   */
  async verifyByUID(nfcUid: string, metadata?: ScanMetadata): Promise<VerificationResult> {
    try {
      // Look up the tag by NFC UID
      const { data: tag, error: tagError } = await this.supabase
        .from('nfc_tags')
        .select(
          `
          id,
          artwork_id,
          nfc_uid,
          is_bound,
          tag_type,
          verification_code
        `
        )
        .eq('nfc_uid', nfcUid.toUpperCase())
        .single()

      if (tagError || !tag || !tag.is_bound) {
        await this.logScan(null, null, 'not_found', metadata)
        return { valid: false, error: 'not_found' }
      }

      // Check rate limiting
      const isRateLimited = await this.checkRateLimit(tag.id, metadata?.ipAddress)
      if (isRateLimited) {
        await this.logScan(tag.id, tag.artwork_id, 'rate_limited', metadata)
        return { valid: false, error: 'rate_limited' }
      }

      // Fetch artwork and certificate info
      const { data: artwork, error: artworkError } = await this.supabase
        .from('artworks')
        .select(
          `
          id,
          title,
          artist,
          year,
          status,
          image_url,
          certificates (
            certificate_id,
            generated_at
          )
        `
        )
        .eq('id', tag.artwork_id)
        .single()

      if (artworkError || !artwork) {
        await this.logScan(tag.id, tag.artwork_id, 'not_found', metadata)
        return { valid: false, error: 'not_found' }
      }

      // Log successful verification
      await this.logScan(tag.id, tag.artwork_id, 'valid', metadata)

      const certificates = artwork.certificates as Array<{ certificate_id: string; generated_at: string }> | null

      return {
        valid: true,
        tagType: (tag.tag_type as 'standard' | 'ntag424') || 'standard',
        artwork: {
          title: artwork.title,
          artist: artwork.artist,
          year: artwork.year,
          status: artwork.status,
          image_url: artwork.image_url,
        },
        certificate: certificates?.[0]
          ? {
              certificate_id: certificates[0].certificate_id,
              generated_at: certificates[0].generated_at,
            }
          : undefined,
      }
    } catch (error) {
      console.error('Verification error:', error)
      return { valid: false, error: 'not_found' }
    }
  }

  /**
   * Get verification statistics for an artwork owner
   */
  async getVerificationStats(
    artworkId: string
  ): Promise<{
    total: number
    last7Days: number
    lastScan: string | null
  }> {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

    const [{ count: total }, { count: last7Days }, { data: lastScanData }] = await Promise.all([
      this.supabase
        .from('verification_scans')
        .select('*', { count: 'exact', head: true })
        .eq('artwork_id', artworkId)
        .eq('verification_result', 'valid'),

      this.supabase
        .from('verification_scans')
        .select('*', { count: 'exact', head: true })
        .eq('artwork_id', artworkId)
        .eq('verification_result', 'valid')
        .gte('scanned_at', sevenDaysAgo),

      this.supabase
        .from('verification_scans')
        .select('scanned_at')
        .eq('artwork_id', artworkId)
        .eq('verification_result', 'valid')
        .order('scanned_at', { ascending: false })
        .limit(1)
        .single(),
    ])

    return {
      total: total || 0,
      last7Days: last7Days || 0,
      lastScan: lastScanData?.scanned_at || null,
    }
  }
}

export const verificationService = new VerificationService()
