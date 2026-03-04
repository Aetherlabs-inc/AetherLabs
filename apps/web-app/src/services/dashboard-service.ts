import { createClient } from '@/src/lib/supabase'

export interface DashboardStats {
  totalArtworks: number
  issuedCertificates: number
  inProcessCertificates: number
  pendingVerification: number
  needsReview: number
}

export interface CRMStats {
  totalClients: number
  recentTransactionsCount: number
  quotationsDraft: number
  quotationsSent: number
  quotationsAccepted: number
}

export interface Activity {
  id: string
  type: 'artwork' | 'certificate' | 'verification' | 'nfc'
  title: string
  action: string
  time: string
  createdAt: Date
}

export interface PendingItem {
  id: string
  title: string
  artist: string | null
  imageUrl: string | null
  issue: 'no_certificate' | 'no_nfc' | 'pending_verification'
  createdAt: string
}

export class DashboardService {
  /**
   * Get dashboard statistics for the current user
   */
  static async getStats(): Promise<DashboardStats> {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('Not authenticated')
    }

    // Get total artworks count
    const { count: totalArtworks, error: artworksError } = await supabase
      .from('artworks')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    if (artworksError) throw artworksError

    // Get artworks with their certificates count
    const { data: artworksWithCerts, error: certsError } = await supabase
      .from('artworks')
      .select('id, status, certificates(id)')
      .eq('user_id', user.id)

    if (certsError) throw certsError

    // Calculate certificate counts
    const issuedCertificates = artworksWithCerts?.filter(
      a => a.certificates && a.certificates.length > 0
    ).length || 0

    const inProcessCertificates = (totalArtworks || 0) - issuedCertificates

    // Get pending verification count
    const pendingVerification = artworksWithCerts?.filter(
      a => a.status === 'pending_verification'
    ).length || 0

    // Get needs review count
    const needsReview = artworksWithCerts?.filter(
      a => a.status === 'needs_review'
    ).length || 0

    return {
      totalArtworks: totalArtworks || 0,
      issuedCertificates,
      inProcessCertificates,
      pendingVerification,
      needsReview,
    }
  }

  /**
   * Get recent activity for the current user
   */
  static async getRecentActivity(limit: number = 5): Promise<Activity[]> {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('Not authenticated')
    }

    const activities: Activity[] = []

    // Get recent artworks
    const { data: recentArtworks } = await supabase
      .from('artworks')
      .select('id, title, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (recentArtworks) {
      recentArtworks.forEach(artwork => {
        activities.push({
          id: `artwork-${artwork.id}`,
          type: 'artwork',
          title: artwork.title,
          action: 'Added',
          time: getRelativeTime(new Date(artwork.created_at)),
          createdAt: new Date(artwork.created_at),
        })
      })
    }

    // Get recent certificates
    const { data: recentCerts } = await supabase
      .from('certificates')
      .select('id, certificate_id, generated_at, artworks!inner(user_id, title)')
      .eq('artworks.user_id', user.id)
      .order('generated_at', { ascending: false })
      .limit(limit)

    if (recentCerts) {
      recentCerts.forEach((cert: any) => {
        activities.push({
          id: `cert-${cert.id}`,
          type: 'certificate',
          title: cert.artworks?.title || cert.certificate_id,
          action: 'Certificate Issued',
          time: getRelativeTime(new Date(cert.generated_at)),
          createdAt: new Date(cert.generated_at),
        })
      })
    }

    // Get recent NFC bindings
    const { data: recentNFC } = await supabase
      .from('nfc_tags')
      .select('id, nfc_uid, created_at, artworks!inner(user_id, title)')
      .eq('artworks.user_id', user.id)
      .eq('is_bound', true)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (recentNFC) {
      recentNFC.forEach((nfc: any) => {
        activities.push({
          id: `nfc-${nfc.id}`,
          type: 'nfc',
          title: nfc.artworks?.title || `Tag ${nfc.nfc_uid}`,
          action: 'NFC Linked',
          time: getRelativeTime(new Date(nfc.created_at)),
          createdAt: new Date(nfc.created_at),
        })
      })
    }

    // Sort by date and limit
    return activities
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit)
  }

  /**
   * Get pending items that need attention
   */
  static async getPendingItems(): Promise<PendingItem[]> {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('Not authenticated')
    }

    const pendingItems: PendingItem[] = []

    // Get artworks without certificates
    const { data: noCertArtworks } = await supabase
      .from('artworks')
      .select('id, title, artist, image_url, created_at, certificates(id)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10)

    if (noCertArtworks) {
      noCertArtworks
        .filter(a => !a.certificates || a.certificates.length === 0)
        .forEach(artwork => {
          pendingItems.push({
            id: artwork.id,
            title: artwork.title,
            artist: artwork.artist,
            imageUrl: artwork.image_url,
            issue: 'no_certificate',
            createdAt: artwork.created_at,
          })
        })
    }

    // Get artworks without NFC (that have certificates)
    const { data: noNFCArtworks } = await supabase
      .from('artworks')
      .select('id, title, artist, image_url, created_at, certificates(id), nfc_tags(id, is_bound)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10)

    if (noNFCArtworks) {
      noNFCArtworks
        .filter(a =>
          a.certificates && a.certificates.length > 0 &&
          (!a.nfc_tags || !a.nfc_tags.some((t: any) => t.is_bound))
        )
        .forEach(artwork => {
          // Avoid duplicates
          if (!pendingItems.find(p => p.id === artwork.id)) {
            pendingItems.push({
              id: artwork.id,
              title: artwork.title,
              artist: artwork.artist,
              imageUrl: artwork.image_url,
              issue: 'no_nfc',
              createdAt: artwork.created_at,
            })
          }
        })
    }

    // Get artworks pending verification
    const { data: pendingVerification } = await supabase
      .from('artworks')
      .select('id, title, artist, image_url, created_at')
      .eq('user_id', user.id)
      .eq('status', 'pending_verification')
      .order('created_at', { ascending: false })
      .limit(5)

    if (pendingVerification) {
      pendingVerification.forEach(artwork => {
        if (!pendingItems.find(p => p.id === artwork.id)) {
          pendingItems.push({
            id: artwork.id,
            title: artwork.title,
            artist: artwork.artist,
            imageUrl: artwork.image_url,
            issue: 'pending_verification',
            createdAt: artwork.created_at,
          })
        }
      })
    }

    return pendingItems.slice(0, 5)
  }

  /**
   * Get CRM overview stats (clients, transactions, quotations by status)
   */
  static async getCRMStats(): Promise<CRMStats> {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      throw new Error('Not authenticated')
    }

    const [{ count: totalClients }, { count: recentTx }, { data: quotations }] = await Promise.all([
      supabase.from('clients').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
      supabase.from('transactions').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
      supabase.from('quotations').select('status').eq('user_id', user.id),
    ])

    const quotationsDraft = quotations?.filter(q => q.status === 'draft').length ?? 0
    const quotationsSent = quotations?.filter(q => q.status === 'sent').length ?? 0
    const quotationsAccepted = quotations?.filter(q => q.status === 'accepted').length ?? 0

    return {
      totalClients: totalClients ?? 0,
      recentTransactionsCount: recentTx ?? 0,
      quotationsDraft,
      quotationsSent,
      quotationsAccepted,
    }
  }
}

/**
 * Get relative time string (e.g., "2 hours ago")
 */
function getRelativeTime(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`

  return date.toLocaleDateString()
}
