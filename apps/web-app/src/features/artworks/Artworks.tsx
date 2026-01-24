'use client'
import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, Filter, Image as ImageIcon, Shield, AlertCircle, Clock, Eye, Wifi, CheckCircle, X, Trash2, ChevronDown } from 'lucide-react';
import { Button, Card, CardContent, Badge, AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from '@aetherlabs/ui';
import RegisterArtwork from '@/src/features/artworks/registerArtwork/RegisterArtwork';
import COACertificate from '@/src/features/artworks/registerArtwork/COACertificate';
import ArtworkDetails from '@/src/features/artworks/ArtworkDetails';
import { useAuth } from '@/src/components/auth-provider';
import { ArtworkService } from '@/src/services/artwork-service';
import { ArtworkWithDetails } from '@/src/types/database';
import { formatArtistName } from '@/src/utils/artist-utils';
import { ArtworkGridSkeleton, StatsGridSkeleton } from '@/src/components/skeletons';
import { EmptyArtworks, EmptySearchResults } from '@/src/components/empty-states';
import { DataError } from '@/src/components/error-states';

type FilterStatus = 'all' | 'authenticated' | 'pending_verification' | 'needs_review' | 'unverified';
type FilterCertificate = 'all' | 'with' | 'without';
type FilterNFC = 'all' | 'linked' | 'not-linked';

interface Filters {
    status: FilterStatus;
    certificate: FilterCertificate;
    nfc: FilterNFC;
}

const Artworks: React.FC = () => {
    const { user } = useAuth();
    const searchParams = useSearchParams();
    const router = useRouter();
    const [showRegisterForm, setShowRegisterForm] = useState(false);
    const [selectedArtwork, setSelectedArtwork] = useState<ArtworkWithDetails | null>(null);
    const [showCertificate, setShowCertificate] = useState(false);
    const [showArtworkDetails, setShowArtworkDetails] = useState(false);
    const [artworks, setArtworks] = useState<ArtworkWithDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deletingArtworkId, setDeletingArtworkId] = useState<string | null>(null);

    // Search and filter state
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState<Filters>({
        status: 'all',
        certificate: 'all',
        nfc: 'all',
    });

    // Load artworks
    const loadArtworks = async () => {
        if (!user) return;

        try {
            setLoading(true);
            setError(null);
            const data = await ArtworkService.getArtworks();
            setArtworks(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load artworks');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadArtworks();
    }, [user]);

    // Handle URL action parameter
    useEffect(() => {
        const action = searchParams.get('action');
        if (action === 'register') {
            setShowRegisterForm(true);
            // Clear the action from URL without navigation
            router.replace('/artworks', { scroll: false });
        }
    }, [searchParams, router]);

    // Filter artworks based on search and filters
    const filteredArtworks = useMemo(() => {
        return artworks.filter(artwork => {
            // Search filter
            const matchesSearch = searchQuery === '' ||
                artwork.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (artwork.artist && artwork.artist.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (artwork.medium && artwork.medium.toLowerCase().includes(searchQuery.toLowerCase()));

            // Status filter
            const matchesStatus = filters.status === 'all' || artwork.status === filters.status;

            // Certificate filter
            const hasCertificate = artwork.certificates && artwork.certificates.length > 0;
            const matchesCertificate = filters.certificate === 'all' ||
                (filters.certificate === 'with' && hasCertificate) ||
                (filters.certificate === 'without' && !hasCertificate);

            // NFC filter
            const hasNFC = artwork.nfc_tags && artwork.nfc_tags.some(tag => tag.is_bound);
            const matchesNFC = filters.nfc === 'all' ||
                (filters.nfc === 'linked' && hasNFC) ||
                (filters.nfc === 'not-linked' && !hasNFC);

            return matchesSearch && matchesStatus && matchesCertificate && matchesNFC;
        });
    }, [artworks, searchQuery, filters]);

    // Check if any filters are active
    const hasActiveFilters = filters.status !== 'all' || filters.certificate !== 'all' || filters.nfc !== 'all';

    // Clear all filters
    const clearFilters = () => {
        setFilters({ status: 'all', certificate: 'all', nfc: 'all' });
        setSearchQuery('');
    };

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
        console.log('Generate certificate for:', selectedArtwork?.title);
    };

    const handleConnectNFC = () => {
        console.log('Connect NFC for:', selectedArtwork?.title);
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
            setArtworks(prevArtworks => prevArtworks.filter(artwork => artwork.id !== artworkId));

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
                        className="mb-4 flex items-center gap-2 text-foreground hover:text-muted-foreground"
                    >
                        <X className="h-4 w-4" />
                        Back to Artwork Details
                    </Button>
                    <h1 className="text-3xl font-bold text-foreground mb-2">
                        Certificate of Authenticity
                    </h1>
                    <p className="text-foreground">
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
        <div className="space-y-6">
            {/* Header Section */}
            <div>
                <h1 className="text-2xl font-bold">Your Artworks</h1>
                <p className="text-muted-foreground mt-1">Manage and monitor your authenticated artworks</p>
            </div>

            {/* Stats Grid */}
            {loading ? (
                <StatsGridSkeleton />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat) => (
                        <div key={stat.label} className="rounded-lg border p-6 hover:border-[#BC8010]/30 transition-colors">
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
            )}

            {/* Search and Filter Section */}
            <div className="flex gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search by title, artist, or medium..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            className={`flex items-center gap-2 px-4 py-2 ${hasActiveFilters ? 'border-[#BC8010] text-[#BC8010]' : ''}`}
                        >
                            <Filter className="w-5 h-5" />
                            Filter
                            {hasActiveFilters && (
                                <Badge className="ml-1 bg-[#BC8010] text-white text-xs">
                                    {[filters.status !== 'all', filters.certificate !== 'all', filters.nfc !== 'all'].filter(Boolean).length}
                                </Badge>
                            )}
                            <ChevronDown className="w-4 h-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>Status</DropdownMenuLabel>
                        {(['all', 'authenticated', 'pending_verification', 'needs_review', 'unverified'] as FilterStatus[]).map((status) => (
                            <DropdownMenuItem
                                key={status}
                                onClick={() => setFilters(f => ({ ...f, status }))}
                                className={filters.status === status ? 'bg-primary/10' : ''}
                            >
                                {status === 'all' ? 'All Statuses' : status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
                            </DropdownMenuItem>
                        ))}

                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>Certificate</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => setFilters(f => ({ ...f, certificate: 'all' }))} className={filters.certificate === 'all' ? 'bg-primary/10' : ''}>
                            All
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setFilters(f => ({ ...f, certificate: 'with' }))} className={filters.certificate === 'with' ? 'bg-primary/10' : ''}>
                            With Certificate
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setFilters(f => ({ ...f, certificate: 'without' }))} className={filters.certificate === 'without' ? 'bg-primary/10' : ''}>
                            Without Certificate
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>NFC Tag</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => setFilters(f => ({ ...f, nfc: 'all' }))} className={filters.nfc === 'all' ? 'bg-primary/10' : ''}>
                            All
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setFilters(f => ({ ...f, nfc: 'linked' }))} className={filters.nfc === 'linked' ? 'bg-primary/10' : ''}>
                            NFC Linked
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setFilters(f => ({ ...f, nfc: 'not-linked' }))} className={filters.nfc === 'not-linked' ? 'bg-primary/10' : ''}>
                            No NFC
                        </DropdownMenuItem>

                        {hasActiveFilters && (
                            <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={clearFilters} className="text-[#CA5B2B]">
                                    Clear All Filters
                                </DropdownMenuItem>
                            </>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Active filters display */}
            {hasActiveFilters && (
                <div className="flex flex-wrap gap-2">
                    {filters.status !== 'all' && (
                        <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
                            Status: {filters.status.replace('_', ' ')}
                            <button onClick={() => setFilters(f => ({ ...f, status: 'all' }))}>
                                <X className="w-3 h-3 ml-1" />
                            </button>
                        </Badge>
                    )}
                    {filters.certificate !== 'all' && (
                        <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
                            {filters.certificate === 'with' ? 'Has Certificate' : 'No Certificate'}
                            <button onClick={() => setFilters(f => ({ ...f, certificate: 'all' }))}>
                                <X className="w-3 h-3 ml-1" />
                            </button>
                        </Badge>
                    )}
                    {filters.nfc !== 'all' && (
                        <Badge variant="outline" className="flex items-center gap-1 px-3 py-1">
                            {filters.nfc === 'linked' ? 'NFC Linked' : 'No NFC'}
                            <button onClick={() => setFilters(f => ({ ...f, nfc: 'all' }))}>
                                <X className="w-3 h-3 ml-1" />
                            </button>
                        </Badge>
                    )}
                </div>
            )}

            {/* Loading State */}
            {loading && <ArtworkGridSkeleton count={6} />}

            {/* Error State */}
            {error && !loading && (
                <DataError
                    title="Failed to load artworks"
                    error={error}
                    onRetry={loadArtworks}
                />
            )}

            {/* Empty State - No artworks at all */}
            {!loading && !error && artworks.length === 0 && (
                <EmptyArtworks onRegister={() => setShowRegisterForm(true)} />
            )}

            {/* Empty State - No search results */}
            {!loading && !error && artworks.length > 0 && filteredArtworks.length === 0 && (
                <EmptySearchResults
                    searchQuery={searchQuery || 'your filters'}
                    onClearSearch={clearFilters}
                />
            )}

            {/* Artworks Grid */}
            {!loading && !error && filteredArtworks.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredArtworks.map((artwork) => {
                        const hasCertificate = artwork.certificates && artwork.certificates.length > 0;
                        const hasNFC = artwork.nfc_tags && artwork.nfc_tags.some(tag => tag.is_bound);

                        return (
                            <Card key={artwork.id} className="border border-border bg-card overflow-hidden hover:shadow-lg hover:border-[#BC8010]/20 transition-all">
                                <div className="aspect-w-16 aspect-h-9 bg-muted">
                                    <img
                                        src={artwork.image_url || '/placeholder-artwork.jpg'}
                                        alt={artwork.title}
                                        className="object-cover w-full h-48"
                                    />
                                </div>
                                <CardContent className="p-4">
                                    <div className="mb-3">
                                        <h3 className="font-semibold text-lg text-foreground mb-1">{artwork.title}</h3>
                                        <p className="text-foreground text-sm mb-1">{formatArtistName(artwork.artist)}</p>
                                        <p className="text-muted-foreground text-xs">{artwork.year} • {artwork.medium}</p>
                                    </div>

                                    {/* Certificate Status */}
                                    <div className="mb-3">
                                        {hasCertificate ? (
                                            <div className="flex items-center gap-2 mb-2">
                                                <CheckCircle className="h-4 w-4 text-foreground" />
                                                <span className="text-sm font-medium text-foreground">Certificate Issued</span>
                                                <Badge variant="outline" className="text-xs border-border text-foreground">
                                                    {artwork.certificates?.[0]?.certificate_id}
                                                </Badge>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 mb-2">
                                                <AlertCircle className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-sm text-muted-foreground">No Certificate</span>
                                            </div>
                                        )}

                                        {/* NFC Status */}
                                        <div className="flex items-center gap-2 mb-2">
                                            {hasNFC ? (
                                                <>
                                                    <Wifi className="h-4 w-4 text-foreground" />
                                                    <span className="text-xs text-foreground">NFC Linked</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Wifi className="h-4 w-4 text-muted-foreground" />
                                                    <span className="text-xs text-muted-foreground">No NFC</span>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Status and Date */}
                                    <div className="flex justify-between items-center mb-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${artwork.status === 'authenticated'
                                            ? 'bg-primary text-primary-foreground'
                                            : artwork.status === 'pending_verification'
                                                ? 'bg-[#BC8010]/10 text-[#BC8010]'
                                                : 'bg-muted text-muted-foreground'
                                            }`}>
                                            {artwork.status.replace('_', ' ').toUpperCase()}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {new Date(artwork.created_at).toLocaleDateString()}
                                        </span>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2">
                                        <Button
                                            onClick={() => handleViewArtwork(artwork)}
                                            size="sm"
                                            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                                        >
                                            <Eye className="h-3 w-3 mr-1" />
                                            View Details
                                        </Button>

                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="border-destructive text-destructive hover:bg-destructive/10"
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
                                                            <span className="block mt-2 text-[#CA5B2B]">
                                                                ⚠️ This artwork has certificates and NFC tags that will also be deleted.
                                                            </span>
                                                        )}
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => handleDeleteArtwork(artwork.id)}
                                                        className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
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
