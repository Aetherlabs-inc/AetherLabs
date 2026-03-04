'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Eye, Loader2, Download, Share2, Copy, CheckCircle, Shield, Wifi } from 'lucide-react'
import { Button, Skeleton } from '@aetherlabs/ui'
import ArtworkDetails from './ArtworkDetails'
import COACertificateElegant from './registerArtwork/COACertificateElegant'
import COAGenerationScreen from './registerArtwork/COAGenerationScreen'
import { downloadCertificatePDF } from './registerArtwork/COACertificatePDF'
import { ArtworkService } from '@/src/services/artwork-service'
import { verificationUrl } from '@/src/lib/app-config'
import type { ArtworkWithDetails } from '@/src/types/database'

interface ArtworkDetailPageProps {
    artworkId: string
}

export default function ArtworkDetailPage({ artworkId }: ArtworkDetailPageProps) {
    const router = useRouter()
    const [artwork, setArtwork] = useState<ArtworkWithDetails | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [view, setView] = useState<'details' | 'certificate' | 'generate'>('details')
    const [isDownloadingPDF, setIsDownloadingPDF] = useState(false)
    const [copiedCertId, setCopiedCertId] = useState(false)

    const fetchArtwork = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)
            const data = await ArtworkService.getArtwork(artworkId)
            if (!data) {
                setError('Artwork not found')
                return
            }
            setArtwork(data)
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to load artwork')
        } finally {
            setLoading(false)
        }
    }, [artworkId])

    useEffect(() => {
        fetchArtwork()
    }, [fetchArtwork])

    const handleBack = () => {
        router.push('/artworks')
    }

    const handleViewCertificate = () => setView('certificate')

    const handleGenerateCertificate = () => setView('generate')

    const handleConnectNFC = () => {
        console.log('Connect NFC for:', artwork?.title)
    }

    const handleDeleteArtwork = async (id: string) => {
        try {
            await ArtworkService.deleteArtwork(id)
            router.push('/artworks')
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to delete artwork')
        }
    }

    const handleCertificateGenerated = async (coaData: {
        certificateId: string
        qrCode: string
        blockchainHash: string
        generatedAt: string
    }) => {
        if (!artwork) return

        try {
            await ArtworkService.createCertificate(artwork.id, {
                certificate_id: coaData.certificateId,
                qr_code_url: coaData.qrCode,
                blockchain_hash: coaData.blockchainHash,
            })
            await fetchArtwork()
            setView('details')
        } catch (err: unknown) {
            console.error('Failed to save certificate:', err)
            setError(err instanceof Error ? err.message : 'Failed to save certificate')
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-background p-6">
                <div className="max-w-6xl mx-auto space-y-6">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-12 w-96" />
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <Skeleton className="lg:col-span-2 h-96" />
                        <div className="space-y-6">
                            <Skeleton className="h-48" />
                            <Skeleton className="h-64" />
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (error || !artwork) {
        return (
            <div className="min-h-screen bg-background p-6">
                <div className="max-w-6xl mx-auto text-center py-16">
                    <p className="text-muted-foreground mb-4">{error || 'Artwork not found'}</p>
                    <Button variant="outline" onClick={handleBack}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Artworks
                    </Button>
                </div>
            </div>
        )
    }

    if (view === 'generate') {
        return (
            <COAGenerationScreen
                artworkData={{
                    title: artwork.title,
                    year: artwork.year?.toString() || '',
                    medium: artwork.medium || '',
                    dimensions: artwork.dimensions || '',
                    artistName: artwork.artist || '',
                    imageUrl: artwork.image_url || undefined,
                }}
                onBack={() => setView('details')}
                onComplete={handleCertificateGenerated}
                onSkip={() => setView('details')}
            />
        )
    }

    if (view === 'certificate') {
        const cert = artwork.certificates?.[0]
        const hasNFC = artwork.nfc_tags?.some(tag => tag.is_bound) ?? false
        const nfcUid = artwork.nfc_tags?.find(tag => tag.is_bound)?.nfc_uid

        const handleDownloadPDF = async () => {
            if (!cert) return
            setIsDownloadingPDF(true)
            try {
                await downloadCertificatePDF({
                    artworkData: {
                        title: artwork.title,
                        year: artwork.year?.toString() || '',
                        medium: artwork.medium || '',
                        dimensions: artwork.dimensions || '',
                        artistName: artwork.artist || '',
                        imageUrl: artwork.image_url || undefined,
                    },
                    certificateData: {
                        certificateId: cert.certificate_id,
                        qrCodeUrl: verificationUrl(cert.certificate_id),
                        blockchainHash: cert.blockchain_hash || '',
                        generatedAt: cert.generated_at,
                    },
                    verificationLevel: { hasNFC, nfcUid },
                })
            } catch {
                alert('Failed to download PDF. Please try again.')
            } finally {
                setIsDownloadingPDF(false)
            }
        }

        const handleCopyCertificateId = () => {
            if (!cert) return
            navigator.clipboard.writeText(cert.certificate_id)
            setCopiedCertId(true)
            setTimeout(() => setCopiedCertId(false), 2000)
        }

        const handleShareCertificate = async () => {
            if (!cert) return
            const shareUrl = `https://aetherlabs.art/v/${cert.certificate_id}`
            if (navigator.share) {
                try {
                    await navigator.share({
                        title: `Certificate of Authenticity - ${artwork.title}`,
                        text: `View the certificate of authenticity for "${artwork.title}" by ${artwork.artist}`,
                        url: shareUrl,
                    })
                } catch {
                    navigator.clipboard.writeText(shareUrl)
                    alert('Link copied to clipboard!')
                }
            } else {
                navigator.clipboard.writeText(shareUrl)
                alert('Link copied to clipboard!')
            }
        }

        return (
            <div className="min-h-screen bg-background p-6">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8">
                        <Button
                            onClick={() => setView('details')}
                            variant="ghost"
                            className="mb-4 flex items-center gap-2 text-foreground hover:text-muted-foreground"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Artwork Details
                        </Button>
                        <div className="text-center">
                            <h1 className="text-3xl font-bold text-foreground mb-2">
                                Certificate of Authenticity
                            </h1>
                            <p className="text-muted-foreground">
                                &quot;{artwork.title}&quot; by {artwork.artist}
                            </p>
                        </div>
                    </div>

                    <COACertificateElegant
                        artworkData={{
                            title: artwork.title,
                            year: artwork.year?.toString() || '',
                            medium: artwork.medium || '',
                            dimensions: artwork.dimensions || '',
                            artistName: artwork.artist || '',
                            imageUrl: artwork.image_url || undefined
                        }}
                        certificateData={{
                            certificateId: cert?.certificate_id ?? '',
                            qrCodeUrl: cert ? verificationUrl(cert.certificate_id) : '',
                            blockchainHash: cert?.blockchain_hash ?? '',
                            generatedAt: cert?.generated_at ?? artwork.created_at
                        }}
                        verificationLevel={{
                            level: artwork.verification_levels?.[0]?.level ?? 'artist_verified',
                            hasNFC,
                            nfcUid
                        }}
                        showActions={false}
                    />

                    <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
                        <Button
                            onClick={handleDownloadPDF}
                            disabled={isDownloadingPDF}
                            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                            {isDownloadingPDF ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                                <Download className="h-4 w-4 mr-2" />
                            )}
                            {isDownloadingPDF ? 'Generating...' : 'Download PDF'}
                        </Button>
                        <Button onClick={handleShareCertificate} variant="outline" className="flex-1 border-border text-foreground hover:bg-muted">
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                        </Button>
                        <Button onClick={handleCopyCertificateId} variant="outline" className="flex-1 border-border text-foreground hover:bg-muted">
                            {copiedCertId ? <CheckCircle className="h-4 w-4 mr-2 text-success" /> : <Copy className="h-4 w-4 mr-2" />}
                            {copiedCertId ? 'Copied!' : 'Copy ID'}
                        </Button>
                    </div>

                    <div className="mt-8 max-w-md mx-auto">
                        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                            <h3 className="font-semibold text-foreground flex items-center gap-2">
                                <Shield className="h-5 w-5 text-accent" />
                                Certificate Details
                            </h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Certificate ID</span>
                                    <span className="font-mono text-foreground">{cert?.certificate_id}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Issued</span>
                                    <span className="text-foreground">
                                        {cert?.generated_at ? new Date(cert.generated_at).toLocaleDateString('en-US', {
                                            year: 'numeric', month: 'long', day: 'numeric'
                                        }) : 'N/A'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">NFC Tag</span>
                                    <span className="text-foreground">
                                        {hasNFC ? (
                                            <span className="flex items-center gap-1">
                                                <Wifi className="h-3 w-3 text-accent" />
                                                Connected
                                            </span>
                                        ) : 'Not connected'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Verification URL</span>
                                    <a
                                        href={cert ? verificationUrl(cert.certificate_id) : '#'}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-accent hover:underline"
                                    >
                                        View Public Page →
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <ArtworkDetails
            artwork={artwork}
            onBack={handleBack}
            onViewCOA={handleViewCertificate}
            onGenerateCOA={handleGenerateCertificate}
            onConnectNFC={handleConnectNFC}
            onDelete={handleDeleteArtwork}
        />
    )
}
