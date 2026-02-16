import React, { useState } from 'react';
import { ArrowLeft, Eye, FileText, Wifi, Shield, QrCode, CheckCircle, AlertTriangle, User, Calendar, Ruler, Trash2, Download, Loader2, Share2, Copy } from 'lucide-react';
import { Button, Card, CardContent, CardHeader, CardTitle, Badge, AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@aetherlabs/ui';
import { ArtworkWithDetails } from '@/src/types/database';
import { formatArtistName } from '@/src/utils/artist-utils';
import { downloadCertificatePDF } from './registerArtwork/COACertificatePDF';
import { ArtworkLinkedDocuments } from './ArtworkLinkedDocuments';


interface ArtworkDetailsProps {
    artwork: ArtworkWithDetails;
    onBack: () => void;
    onViewCOA: () => void;
    onGenerateCOA: () => void;
    onConnectNFC: () => void;
    onDelete?: (artworkId: string) => void;
}

const ArtworkDetails: React.FC<ArtworkDetailsProps> = ({
    artwork,
    onBack,
    onViewCOA,
    onGenerateCOA,
    onConnectNFC,
    onDelete
}) => {
    const [isDownloading, setIsDownloading] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleDownloadCertificate = async () => {
        if (!artwork.certificates || artwork.certificates.length === 0) return;

        const cert = artwork.certificates[0];
        setIsDownloading(true);

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
                    qrCodeUrl: cert.qr_code_url || `https://aetherlabs.art/verify/${cert.certificate_id}`,
                    blockchainHash: cert.blockchain_hash || '',
                    generatedAt: cert.generated_at,
                },
                verificationLevel: {
                    hasNFC: artwork.nfc_tags?.some(tag => tag.is_bound) || false,
                    nfcUid: artwork.nfc_tags?.find(tag => tag.is_bound)?.nfc_uid,
                },
            });
        } catch (error) {
            console.error('Error downloading certificate:', error);
            alert('Failed to download certificate. Please try again.');
        } finally {
            setIsDownloading(false);
        }
    };

    const handleCopyCertificateId = () => {
        if (!artwork.certificates || artwork.certificates.length === 0) return;
        navigator.clipboard.writeText(artwork.certificates[0].certificate_id);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShareCertificate = async () => {
        if (!artwork.certificates || artwork.certificates.length === 0) return;

        const cert = artwork.certificates[0];
        const shareUrl = `https://aetherlabs.art/verify/${cert.certificate_id}`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Certificate of Authenticity - ${artwork.title}`,
                    text: `View the certificate of authenticity for "${artwork.title}" by ${artwork.artist}`,
                    url: shareUrl,
                });
            } catch (error) {
                // User cancelled or share failed, fall back to copy
                navigator.clipboard.writeText(shareUrl);
                alert('Link copied to clipboard!');
            }
        } else {
            navigator.clipboard.writeText(shareUrl);
            alert('Link copied to clipboard!');
        }
    };

    const getVerificationInfo = () => {
        const latestVerification = artwork.verification_levels?.[0];
        const verificationLevel = latestVerification?.level ?? 'unverified';

        switch (verificationLevel) {
            case 'unverified':
                return {
                    icon: AlertTriangle,
                    label: 'Unverified',
                    description: 'Artist self-registered',
                    color: 'text-muted-foreground',
                    bgColor: 'bg-muted'
                };
            case 'artist_verified':
                return {
                    icon: CheckCircle,
                    label: 'Artist Verified',
                    description: 'Verified by the artist',
                    color: 'text-foreground',
                    bgColor: 'bg-muted'
                };
            case 'gallery_verified':
                return {
                    icon: Shield,
                    label: 'Gallery Verified',
                    description: 'AetherLabs Trusted Gallery',
                    color: 'text-foreground',
                    bgColor: 'bg-muted'
                };
            case 'third_party_verified':
                return {
                    icon: Shield,
                    label: 'Third Party Verified',
                    description: 'Independent verification',
                    color: 'text-foreground',
                    bgColor: 'bg-muted'
                };
            default:
                return {
                    icon: AlertTriangle,
                    label: 'Unknown',
                    description: 'Verification status unknown',
                    color: 'text-muted-foreground',
                    bgColor: 'bg-muted'
                };
        }
    };

    const verificationInfo = getVerificationInfo();
    const VerificationIcon = verificationInfo.icon;
    const verificationBgColor = verificationInfo.bgColor;

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Button
                        onClick={onBack}
                        variant="ghost"
                        className="mb-4 flex items-center gap-2 text-foreground hover:text-muted-foreground"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Artworks
                    </Button>

                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-foreground mb-2">
                                {artwork.title}
                            </h1>
                            <p className="text-xl text-foreground mb-4">
                                by {formatArtistName(artwork.artist)}
                            </p>
                            <div className="flex items-center gap-4">
                                <Badge
                                    variant="outline"
                                    className={`px-3 py-1 ${artwork.status === 'authenticated'
                                        ? 'bg-primary text-primary-foreground border-primary'
                                        : artwork.status === 'pending_verification'
                                            ? 'bg-accent text-accent-foreground border-accent'
                                            : 'bg-muted text-muted-foreground border-muted'
                                        }`}
                                >
                                    {artwork.status.replace('_', ' ').toUpperCase()}
                                </Badge>
                                <span className="text-sm text-muted-foreground">
                                    Added {new Date(artwork.created_at).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Artwork Image */}
                    <div className="lg:col-span-2">
                        <Card className="border border-border bg-background">
                            <CardHeader>
                                <CardTitle className="text-foreground">Artwork</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="border border-border rounded-lg overflow-hidden">
                                    <img
                                        src={artwork.image_url || '/placeholder-artwork.jpg'}
                                        alt={artwork.title}
                                        className="w-full h-96 object-cover"
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Details & Actions */}
                    <div className="space-y-6">
                        {/* Artwork Information */}
                        <Card className="border border-border bg-background">
                            <CardHeader>
                                <CardTitle className="text-foreground">Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <User className="h-4 w-4 text-foreground" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Artist</p>
                                        <p className="font-semibold text-foreground">{formatArtistName(artwork.artist)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Calendar className="h-4 w-4 text-foreground" />
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-muted-foreground">Year</p>
                                        <p className="font-semibold text-foreground">{artwork.year.toString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Ruler className="h-4 w-4 text-foreground" />
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-muted-foreground">Dimensions</p>
                                        <p className="font-semibold text-foreground">{artwork.dimensions}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-muted-foreground">Medium</p>
                                    <p className="font-semibold text-foreground">{artwork.medium}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Verification Status */}
                        <Card className="border border-border bg-background">
                            <CardHeader>
                                <CardTitle className="text-foreground">Verification</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className={`${verificationBgColor} border border-border rounded-lg p-4`}>
                                    <div className="flex items-center gap-3">
                                        <VerificationIcon className={`h-6 w-6 ${verificationInfo.color}`} />
                                        <div>
                                            <p className={`font-bold ${verificationInfo.color}`}>{verificationInfo.label}</p>
                                            <p className="text-sm text-gray-600 dark:text-muted-foreground">{verificationInfo.description}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Certificate Status */}
                                <div className="border-t border-border pt-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-semibold text-foreground">Certificate</span>
                                        {artwork.certificates && artwork.certificates.length > 0 ? (
                                            <div className="flex items-center gap-2">
                                                <CheckCircle className="h-4 w-4 text-foreground" />
                                                <span className="text-sm text-foreground">Issued</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-sm text-muted-foreground">Not Issued</span>
                                            </div>
                                        )}
                                    </div>
                                    {artwork.certificates && artwork.certificates.length > 0 && (
                                        <p className="text-xs text-muted-foreground font-mono">
                                            {artwork.certificates[0].certificate_id}
                                        </p>
                                    )}
                                </div>

                                {/* NFC Status */}
                                <div className="border-t border-border pt-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-semibold text-foreground">NFC Tag</span>
                                        {artwork.nfc_tags && artwork.nfc_tags.some(tag => tag.is_bound) ? (
                                            <div className="flex items-center gap-2">
                                                <Wifi className="h-4 w-4 text-foreground" />
                                                <span className="text-sm text-foreground">Connected</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <Wifi className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-sm text-muted-foreground">Not Connected</span>
                                            </div>
                                        )}
                                    </div>
                                    {artwork.nfc_tags && artwork.nfc_tags.some(tag => tag.is_bound) && (
                                        <p className="text-xs text-muted-foreground font-mono">
                                            {artwork.nfc_tags.find(tag => tag.is_bound)?.nfc_uid}
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Action Buttons */}
                        <Card className="border border-border bg-background">
                            <CardHeader>
                                <CardTitle className="text-foreground">Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {artwork.certificates && artwork.certificates.length > 0 ? (
                                    <Button
                                        onClick={onViewCOA}
                                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                                    >
                                        <Eye className="h-4 w-4 mr-2" />
                                        View Certificate
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={onGenerateCOA}
                                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                                    >
                                        <FileText className="h-4 w-4 mr-2" />
                                        Generate Certificate
                                    </Button>
                                )}

                                {artwork.certificates && artwork.certificates.length > 0 &&
                                    (!artwork.nfc_tags || !artwork.nfc_tags.some(tag => tag.is_bound)) && (
                                        <Button
                                            onClick={onConnectNFC}
                                            variant="outline"
                                            className="w-full border-border text-foreground hover:bg-muted"
                                        >
                                            <Wifi className="h-4 w-4 mr-2" />
                                            Connect NFC Tag
                                        </Button>
                                    )}

                                {artwork.certificates && artwork.certificates.length > 0 && (
                                    <>
                                        <Button
                                            onClick={handleDownloadCertificate}
                                            disabled={isDownloading}
                                            variant="outline"
                                            className="w-full border-[#2A2121] dark:border-[#BC8010] text-foreground hover:bg-[#BC8010]/10"
                                        >
                                            {isDownloading ? (
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            ) : (
                                                <Download className="h-4 w-4 mr-2" />
                                            )}
                                            {isDownloading ? 'Generating...' : 'Download PDF'}
                                        </Button>
                                        <Button
                                            onClick={handleShareCertificate}
                                            variant="outline"
                                            className="w-full border-border text-foreground hover:bg-muted"
                                        >
                                            <Share2 className="h-4 w-4 mr-2" />
                                            Share Certificate
                                        </Button>
                                        <Button
                                            onClick={handleCopyCertificateId}
                                            variant="ghost"
                                            className="w-full text-muted-foreground hover:text-foreground"
                                        >
                                            {copied ? (
                                                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                                            ) : (
                                                <Copy className="h-4 w-4 mr-2" />
                                            )}
                                            {copied ? 'Copied!' : 'Copy Certificate ID'}
                                        </Button>
                                    </>
                                )}

                                {onDelete && (
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className="w-full border-destructive text-destructive hover:bg-destructive/10"
                                            >
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Delete Artwork
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Delete Artwork</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Are you sure you want to delete &quot;{artwork.title}&quot;? This action cannot be undone.
                                                    {artwork.certificates && artwork.certificates.length > 0 && (
                                                        <span className="block mt-2 text-warning">
                                                            ⚠️ This artwork has certificates and NFC tags that will also be deleted.
                                                        </span>
                                                    )}
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={() => onDelete(artwork.id)}
                                                    className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                                                >
                                                    Delete
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                )}
                            </CardContent>
                        </Card>

                        {/* Linked Quotations & Transactions */}
                        <ArtworkLinkedDocuments artworkId={artwork.id} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArtworkDetails;
