import { createClient } from '@/src/lib/supabase'

export interface Certificate {
  id: string
  certificate_id: string
  artwork_id: string
  generated_at: string
  qr_code_url: string | null
  pdf_url: string | null
  artwork: {
    id: string
    title: string
    artist: string | null
    image_url: string | null
    medium: string | null
    year: number | null
  }
}

export interface CertificateStats {
  total: number
  thisMonth: number
  withNFC: number
}

export class CertificateService {
  /**
   * Get all certificates for the current user
   */
  static async getCertificates(): Promise<Certificate[]> {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('Not authenticated')
    }

    const { data, error } = await supabase
      .from('certificates')
      .select(`
        id,
        certificate_id,
        artwork_id,
        generated_at,
        qr_code_url,
        pdf_url,
        artworks!inner (
          id,
          title,
          artist,
          image_url,
          medium,
          year,
          user_id
        )
      `)
      .eq('artworks.user_id', user.id)
      .order('generated_at', { ascending: false })

    if (error) throw error

    return (data || []).map((cert: any) => ({
      id: cert.id,
      certificate_id: cert.certificate_id,
      artwork_id: cert.artwork_id,
      generated_at: cert.generated_at,
      qr_code_url: cert.qr_code_url,
      pdf_url: cert.pdf_url,
      artwork: {
        id: cert.artworks.id,
        title: cert.artworks.title,
        artist: cert.artworks.artist,
        image_url: cert.artworks.image_url,
        medium: cert.artworks.medium,
        year: cert.artworks.year,
      }
    }))
  }

  /**
   * Get certificate statistics
   */
  static async getStats(): Promise<CertificateStats> {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('Not authenticated')
    }

    // Get total certificates
    const { count: total } = await supabase
      .from('certificates')
      .select('id, artworks!inner(user_id)', { count: 'exact', head: true })
      .eq('artworks.user_id', user.id)

    // Get certificates issued this month
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const { count: thisMonth } = await supabase
      .from('certificates')
      .select('id, artworks!inner(user_id)', { count: 'exact', head: true })
      .eq('artworks.user_id', user.id)
      .gte('generated_at', startOfMonth.toISOString())

    // Get certificates with NFC tags
    const { data: withNFCData } = await supabase
      .from('certificates')
      .select('id, artwork_id, artworks!inner(user_id, nfc_tags(id, is_bound))')
      .eq('artworks.user_id', user.id)

    const withNFC = (withNFCData || []).filter((cert: any) =>
      cert.artworks.nfc_tags?.some((tag: any) => tag.is_bound)
    ).length

    return {
      total: total || 0,
      thisMonth: thisMonth || 0,
      withNFC,
    }
  }

  /**
   * Get a single certificate by ID
   */
  static async getCertificate(certificateId: string): Promise<Certificate | null> {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('Not authenticated')
    }

    const { data, error } = await supabase
      .from('certificates')
      .select(`
        id,
        certificate_id,
        artwork_id,
        generated_at,
        qr_code_url,
        pdf_url,
        artworks!inner (
          id,
          title,
          artist,
          image_url,
          medium,
          year,
          user_id
        )
      `)
      .eq('id', certificateId)
      .eq('artworks.user_id', user.id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      throw error
    }

    if (!data) return null

    return {
      id: data.id,
      certificate_id: data.certificate_id,
      artwork_id: data.artwork_id,
      generated_at: data.generated_at,
      qr_code_url: data.qr_code_url,
      pdf_url: data.pdf_url,
      artwork: {
        id: (data.artworks as any).id,
        title: (data.artworks as any).title,
        artist: (data.artworks as any).artist,
        image_url: (data.artworks as any).image_url,
        medium: (data.artworks as any).medium,
        year: (data.artworks as any).year,
      }
    }
  }
}
