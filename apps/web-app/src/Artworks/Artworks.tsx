'use client'
import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Image as ImageIcon, Shield, AlertCircle, Clock, Eye, Wifi, CheckCircle, X, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import RegisterArtwork from '@/src/Artworks/registerArtwork/RegisterArtwork';
import COACertificate from '@/src/Artworks/registerArtwork/COACertificate';
import ArtworkDetails from '@/src/Artworks/ArtworkDetails';
import { useAuth } from '@/src/components/auth-provider';
import { ArtworkService } from '@/src/services/artwork-service';
import { ArtworkWithDetails } from '@/src/types/database';
import { formatArtistName } from '@/src/utils/artist-utils';


const Artworks: React.FC = () => {
    const { user } = useAuth();
    const [showRegisterForm, setShowRegisterForm] = useState(false);
    const [selectedArtwork, setSelectedArtwork] = useState<ArtworkWithDetails | null>(null);
    const [showCertificate, setShowCertificate] = useState(false);
    const [showArtworkDetails, setShowArtworkDetails] = useState(false);
    const [artworks, setArtworks] = useState<ArtworkWithDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deletingArtworkId, setDeletingArtworkId] = useState<string | null>(null);

    // Load artworks on component mount
    useEffect(() => {
        const loadArtworks = async () => {
            if (!user) return;

            try {
                setLoading(true);
                const data = await ArtworkService.getArtworks();
                setArtworks(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load artworks');
            } finally {
                setLoading(false);
            }
        };

        loadArtworks();
    }, [user]);

    // Calculate stats from real data
    const stats = [
        {
            label: 'Total Artworks',
            value: artworks.length.toString(),
            icon: ImageIcon
        },
        {
            label: 'Authenticated',
            value: artworks.filter(a => a.status === 'authenticated').length.toString(),
            icon: Shield
        },
        {
            label: 'Pending Verification',
            value: artworks.filter(a => a.status === 'pending_verification').length.toString(),
            icon: Clock
        },
        {
            label: 'Needs Review',
            value: artworks.filter(a => a.status === 'needs_review').length.toString(),
            icon: AlertCircle
        },
    ];

    const handleViewArtwork = (artwork: ArtworkWithDetails) => {
        setSelectedArtwork(artwork);
        setShowArtworkDetails(true);
    };

    const handleViewCertificate = () => {
        setShowCertificate(true);
    };

    const handleGenerateCertificate = () => {
        // Navigate to certificate generation flow
        console.log('Generate certificate for:', selectedArtwork?.title);
        // This would typically navigate to a certificate generation flow
    };

    const handleConnectNFC = () => {
        // Navigate to NFC connection flow
        console.log('Connect NFC for:', selectedArtwork?.title);
        // This would typically navigate to an NFC connection flow
    };

    const handleBackToArtworks = () => {
        setShowArtworkDetails(false);
        setShowCertificate(false);
        setSelectedArtwork(null);
    };

    const handleDeleteArtwork = async (artworkId: string) => {
        try {
            setDeletingArtworkId(artworkId);
            await ArtworkService.deleteArtwork(artworkId);

            // Remove the artwork from the local state
            setArtworks(prevArtworks => prevArtworks.filter(artwork => artwork.id !== artworkId));

            // If the deleted artwork was selected, clear the selection
            if (selectedArtwork?.id === artworkId) {
                setSelectedArtwork(null);
                setShowArtworkDetails(false);
                setShowCertificate(false);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete artwork');
        } finally {
            setDeletingArtworkId(null);
        }
    };

    if (showRegisterForm) {
        return <RegisterArtwork onBack={() => setShowRegisterForm(false)} />;
    }

    if (showArtworkDetails && selectedArtwork) {
        return (
            <ArtworkDetails
                artwork={selectedArtwork}
                onBack={handleBackToArtworks}
                onViewCOA={handleViewCertificate}
                onGenerateCOA={handleGenerateCertificate}
                onConnectNFC={handleConnectNFC}
                onDelete={handleDeleteArtwork}
            />
        );
    }

    if (showCertificate && selectedArtwork) {
        return (
            <div className="p-6">
                <div className="mb-6">
                    <Button
                        onClick={() => setShowCertificate(false)}
                        variant="ghost"
                        className="mb-4 flex items-center gap-2 text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300"
                    >
                        <X className="h-4 w-4" />
                        Back to Artwork Details
                    </Button>
                    <h1 className="text-3xl font-bold text-black dark:text-white mb-2">
                        Certificate of Authenticity
                    </h1>
                    <p className="text-black dark:text-white">
                        Viewing certificate for &quot;{selectedArtwork.title}&quot;
                    </p>
                </div>

                <COACertificate
                    artworkData={{
                        title: selectedArtwork.title,
                        year: selectedArtwork.year.toString(),
                        medium: selectedArtwork.medium,
                        dimensions: selectedArtwork.dimensions,
                        artistName: selectedArtwork.artist,
                        imageUrl: selectedArtwork.image_url || undefined
                    }}
                    certificateData={{
                        certificateId: selectedArtwork.certificates?.[0]?.certificate_id ?? '',
                        qrCode: `https://aetherlabs.art/verify/${selectedArtwork.certificates?.[0]?.certificate_id}`,
                        blockchainHash: selectedArtwork.certificates?.[0]?.blockchain_hash ?? '',
                        generatedAt: selectedArtwork.certificates?.[0]?.generated_at ?? selectedArtwork.created_at
                    }}
                    verificationLevel={{
                        level: selectedArtwork.verification_levels?.[0]?.level ?? 'unverified',
                        hasNFC: selectedArtwork.nfc_tags?.some(tag => tag.is_bound) ?? false,
                        nfcUid: selectedArtwork.nfc_tags?.find(tag => tag.is_bound)?.nfc_uid
                    }}
                    className="shadow-lg"
                />
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header Section */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Artworks Dashboard</h1>
                    <p className="text-muted-foreground">Manage and monitor your authenticated artworks</p>
                </div>
                <Button
                    onClick={() => setShowRegisterForm(true)}
                    className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-black px-4 py-2 rounded-lg transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Register New Artwork
                </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.label} className="rounded-lg border p-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-primary/10 rounded-lg">
                                <stat.icon className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">{stat.label}</p>
                                <p className="text-2xl font-bold">{stat.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Search and Filter Section */}
            <div className="flex gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search artworks..."
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
                <Button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-accent">
                    <Filter className="w-5 h-5" />
                    Filter
                </Button>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="text-center py-8">
                    <p className="text-black dark:text-white">Loading artworks...</p>
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="text-center py-8">
                    <p className="text-red-500">Error: {error}</p>
                </div>
            )}

            {/* Artworks Grid */}
            {!loading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {artworks.map((artwork) => {
                        const hasCertificate = artwork.certificates && artwork.certificates.length > 0;
                        const hasNFC = artwork.nfc_tags && artwork.nfc_tags.some(tag => tag.is_bound);

                        return (
                            <Card key={artwork.id} className="border border-black dark:border-white bg-white dark:bg-black overflow-hidden hover:shadow-lg transition-shadow">
                                <div className="aspect-w-16 aspect-h-9 bg-gray-100 dark:bg-gray-900">
                                    <img
                                        src={artwork.image_url || '/placeholder-artwork.jpg'}
                                        alt={artwork.title}
                                        className="object-cover w-full h-48"
                                    />
                                </div>
                                <CardContent className="p-4">
                                    <div className="mb-3">
                                        <h3 className="font-semibold text-lg text-black dark:text-white mb-1">{artwork.title}</h3>
                                        <p className="text-black dark:text-white text-sm mb-1">{formatArtistName(artwork.artist)}</p>
                                        <p className="text-gray-600 dark:text-gray-400 text-xs">{artwork.year} • {artwork.medium}</p>
                                    </div>

                                    {/* Certificate Status */}
                                    <div className="mb-3">
                                        {hasCertificate ? (
                                            <div className="flex items-center gap-2 mb-2">
                                                <CheckCircle className="h-4 w-4 text-black dark:text-white" />
                                                <span className="text-sm font-medium text-black dark:text-white">Certificate Issued</span>
                                                <Badge variant="outline" className="text-xs border-black dark:border-white text-black dark:text-white">
                                                    {artwork.certificates?.[0]?.certificate_id}
                                                </Badge>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 mb-2">
                                                <AlertCircle className="h-4 w-4 text-gray-500" />
                                                <span className="text-sm text-gray-500">No Certificate</span>
                                            </div>
                                        )}

                                        {/* NFC Status */}
                                        <div className="flex items-center gap-2 mb-2">
                                            {hasNFC ? (
                                                <>
                                                    <Wifi className="h-4 w-4 text-black dark:text-white" />
                                                    <span className="text-xs text-black dark:text-white">NFC Linked</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Wifi className="h-4 w-4 text-gray-400" />
                                                    <span className="text-xs text-gray-500">No NFC</span>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Status and Date */}
                                    <div className="flex justify-between items-center mb-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${artwork.status === 'authenticated'
                                            ? 'bg-black dark:bg-white text-white dark:text-black'
                                            : artwork.status === 'pending_verification'
                                                ? 'bg-yellow-500 text-black'
                                                : 'bg-gray-500 text-white'
                                            }`}>
                                            {artwork.status.replace('_', ' ').toUpperCase()}
                                        </span>
                                        <span className="text-xs text-gray-600 dark:text-gray-400">
                                            {new Date(artwork.created_at).toLocaleDateString()}
                                        </span>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={() => handleViewArtwork(artwork)}
                                            size="sm"
                                            className="flex-1 bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black"
                                        >
                                            <Eye className="h-3 w-3 mr-1" />
                                            View Details
                                        </Button>

                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
                                                    disabled={deletingArtworkId === artwork.id}
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Delete Artwork</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Are you sure you want to delete &quot;{artwork.title}&quot;? This action cannot be undone.
                                                        {artwork.certificates && artwork.certificates.length > 0 && (
                                                            <span className="block mt-2 text-amber-600 dark:text-amber-400">
                                                                ⚠️ This artwork has certificates and NFC tags that will also be deleted.
                                                            </span>
                                                        )}
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => handleDeleteArtwork(artwork.id)}
                                                        className="bg-red-600 hover:bg-red-700 text-white"
                                                    >
                                                        Delete
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Artworks; 