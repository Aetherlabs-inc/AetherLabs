'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Card,
  CardContent,
  Input,
  Button,
  Skeleton,
} from '@aetherlabs/ui'
import {
  Search,
  FileCheck,
  Download,
  ExternalLink,
  Calendar,
  Image as ImageIcon,
  Award,
  Link2,
} from 'lucide-react'
import { CertificateService, type Certificate, type CertificateStats } from '@/src/services/certificate-service'
import { DataError } from '@/src/components/error-states'

// Skeleton components
function CertificateCardSkeleton() {
  return (
    <Card className="border border-border bg-card overflow-hidden">
      <div className="flex">
        <Skeleton className="w-24 h-24 sm:w-32 sm:h-32 rounded-none" />
        <div className="flex-1 p-4">
          <Skeleton className="h-5 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2 mb-3" />
          <Skeleton className="h-3 w-2/3 mb-2" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
    </Card>
  )
}

function StatCardSkeleton() {
  return (
    <Card className="border border-border bg-card">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-8 w-16" />
          </div>
          <Skeleton className="w-12 h-12 rounded-full" />
        </div>
      </CardContent>
    </Card>
  )
}

// Empty state
function EmptyCertificates({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
          <FileCheck className="w-12 h-12 text-muted-foreground" strokeWidth={1.5} />
        </div>
        <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-[#BC8010]/10 flex items-center justify-center">
          <Award className="w-4 h-4 text-[#BC8010]" />
        </div>
      </div>

      <h3 className="text-xl font-semibold text-foreground mb-2">
        No certificates yet
      </h3>
      <p className="text-muted-foreground text-center max-w-sm mb-6">
        Certificates are generated when you complete the artwork registration process.
        Start by registering your first artwork.
      </p>

      <Button
        onClick={onNavigate}
        className="bg-[#2A2121] hover:bg-[#2A2121]/90 text-white"
      >
        Register Artwork
      </Button>
    </div>
  )
}

export default function Certificates() {
  const router = useRouter()
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [stats, setStats] = useState<CertificateStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [certsData, statsData] = await Promise.all([
        CertificateService.getCertificates(),
        CertificateService.getStats(),
      ])

      setCertificates(certsData)
      setStats(statsData)
    } catch (err) {
      console.error('Failed to fetch certificates:', err)
      setError(err instanceof Error ? err.message : 'Failed to load certificates')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Filter certificates based on search
  const filteredCertificates = useMemo(() => {
    if (!searchQuery.trim()) return certificates

    const query = searchQuery.toLowerCase()
    return certificates.filter(cert =>
      cert.artwork.title.toLowerCase().includes(query) ||
      cert.artwork.artist?.toLowerCase().includes(query) ||
      cert.certificate_id.toLowerCase().includes(query)
    )
  }, [certificates, searchQuery])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const handleViewArtwork = (artworkId: string) => {
    router.push(`/artworks/${artworkId}`)
  }

  const handleDownload = async (cert: Certificate) => {
    if (cert.pdf_url) {
      window.open(cert.pdf_url, '_blank')
    } else {
      // Navigate to artwork to generate certificate
      router.push(`/artworks/${cert.artwork_id}`)
    }
  }

  if (error) {
    return (
      <div className="w-full min-h-screen bg-background">
        <div className="mx-auto w-full px-4 py-6">
          <DataError
            title="Unable to load certificates"
            error={error}
            onRetry={fetchData}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen bg-background">
      <div className="mx-auto w-full px-4 py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground sm:text-3xl">Certificates</h1>
          <p className="text-muted-foreground mt-1">
            View and manage your certificates of authenticity
          </p>
        </div>

        {/* Stats Cards */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </div>
        ) : stats && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border border-border bg-card">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Certificates</p>
                      <p className="text-2xl font-bold text-foreground mt-1">{stats.total}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                      <FileCheck className="w-6 h-6 text-primary-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card className="border border-border bg-card">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Issued This Month</p>
                      <p className="text-2xl font-bold text-foreground mt-1">{stats.thisMonth}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-[#BC8010]/10 flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-[#BC8010]" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Card className="border border-border bg-card">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">With NFC Tags</p>
                      <p className="text-2xl font-bold text-foreground mt-1">{stats.withNFC}</p>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <Link2 className="w-6 h-6 text-blue-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}

        {/* Search */}
        {!loading && certificates.length > 0 && (
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by artwork, artist, or certificate ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        )}

        {/* Certificates List */}
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <CertificateCardSkeleton key={i} />
            ))}
          </div>
        ) : certificates.length === 0 ? (
          <EmptyCertificates onNavigate={() => router.push('/artworks?action=register')} />
        ) : filteredCertificates.length === 0 ? (
          <div className="text-center py-12">
            <Search className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No matching certificates</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredCertificates.map((cert, index) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="border border-border bg-card overflow-hidden hover:border-[#BC8010]/20 transition-colors">
                  <div className="flex flex-col sm:flex-row">
                    {/* Artwork Thumbnail */}
                    <div
                      className="w-full sm:w-32 h-48 sm:h-32 bg-muted flex-shrink-0 cursor-pointer"
                      onClick={() => handleViewArtwork(cert.artwork_id)}
                    >
                      {cert.artwork.image_url ? (
                        <img
                          src={cert.artwork.image_url}
                          alt={cert.artwork.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ImageIcon className="w-8 h-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    {/* Certificate Details */}
                    <div className="flex-1 p-4">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h3
                            className="font-semibold text-foreground truncate cursor-pointer hover:text-[#BC8010] transition-colors"
                            onClick={() => handleViewArtwork(cert.artwork_id)}
                          >
                            {cert.artwork.title}
                          </h3>
                          {cert.artwork.artist && (
                            <p className="text-sm text-muted-foreground mt-0.5">
                              by {cert.artwork.artist}
                            </p>
                          )}

                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <FileCheck className="w-3 h-3" />
                              {cert.certificate_id}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(cert.generated_at)}
                            </span>
                            {cert.artwork.medium && (
                              <span>{cert.artwork.medium}</span>
                            )}
                            {cert.artwork.year && (
                              <span>{cert.artwork.year}</span>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownload(cert)}
                            className="hover:border-[#BC8010]/50"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewArtwork(cert.artwork_id)}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
