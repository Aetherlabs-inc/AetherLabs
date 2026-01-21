'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { userProfileService, UserProfile, UserStats } from '@/src/services/user-profile-service';
import { ArtworkService } from '@/src/services/artwork-service';
import { ArtworkWithDetails } from '@/src/types/database';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Avatar, AvatarFallback, AvatarImage, Badge, Button } from '@aetherlabs/ui';
import { User, Loader2, CheckCircle, Wifi, MapPin, Globe, Calendar } from 'lucide-react';
import { formatArtistName } from '@/src/utils/artist-utils';

export default function PublicProfilePage() {
    const params = useParams();
    const username = params.username as string;
    
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [stats, setStats] = useState<UserStats | null>(null);
    const [artworks, setArtworks] = useState<ArtworkWithDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPublicProfile = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch public profile by username
            const publicProfile = await userProfileService.getPublicProfile(username);
            
            if (!publicProfile) {
                setError('Profile not found');
                return;
            }

            setProfile(publicProfile);

            // Fetch public stats
            const publicStats = await userProfileService.getPublicStats(publicProfile.id);
            setStats(publicStats);

            // Fetch public artworks
            const publicArtworks = await ArtworkService.getPublicArtworks(publicProfile.id);
            setArtworks(publicArtworks);
        } catch (err) {
            console.error('Error fetching public profile:', err);
            setError(err instanceof Error ? err.message : 'Failed to load profile');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (username) {
            fetchPublicProfile();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [username]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen px-4">
                <div className="text-center space-y-4 max-w-md">
                    <h1 className="text-3xl font-bold">Profile Not Found</h1>
                    <p className="text-muted-foreground">
                        {error || 'The profile you are looking for does not exist or is private.'}
                    </p>
                    <Button onClick={() => window.location.href = '/'}>
                        Go Home
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4 max-w-6xl">
            <div className="space-y-8">
                {/* Profile Header */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                            <Avatar className="h-32 w-32">
                                <AvatarImage src={profile.avatar_url || ''} />
                                <AvatarFallback>
                                    <User className="h-16 w-16" />
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-3 flex-wrap">
                                    <h1 className="text-3xl font-bold">
                                        {profile.full_name || 'Unnamed User'}
                                    </h1>
                                    <Badge variant="outline" className="capitalize">
                                        {profile.user_type}
                                    </Badge>
                                </div>
                                {profile.username && (
                                    <p className="text-muted-foreground font-mono">
                                        @{profile.username}
                                    </p>
                                )}
                                {profile.bio && (
                                    <p className="text-base text-foreground max-w-2xl">
                                        {profile.bio}
                                    </p>
                                )}
                                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground pt-2">
                                    {profile.location && (
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4" />
                                            <span>{profile.location}</span>
                                        </div>
                                    )}
                                    {profile.website && (
                                        <div className="flex items-center gap-2">
                                            <Globe className="h-4 w-4" />
                                            <a 
                                                href={profile.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="hover:underline"
                                            >
                                                Website
                                            </a>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        <span>Member since {new Date(profile.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Stats */}
                {stats && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card>
                            <CardContent className="pt-6">
                                <div className="text-center">
                                    <div className="text-3xl font-bold">{stats.artworks_count}</div>
                                    <div className="text-sm text-muted-foreground mt-1">Artworks</div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6">
                                <div className="text-center">
                                    <div className="text-3xl font-bold">{stats.certificates_count}</div>
                                    <div className="text-sm text-muted-foreground mt-1">Certificates</div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-6">
                                <div className="text-center">
                                    <div className="text-3xl font-bold">{stats.collections_count}</div>
                                    <div className="text-sm text-muted-foreground mt-1">Collections</div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Artworks Section */}
                <div>
                    <h2 className="text-2xl font-bold mb-6">Artworks</h2>
                    {artworks.length === 0 ? (
                        <Card>
                            <CardContent className="pt-6">
                                <p className="text-center text-muted-foreground">
                                    No artworks available to view.
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {artworks.map((artwork) => {
                                const hasCertificate = artwork.certificates && artwork.certificates.length > 0;
                                const hasNFC = artwork.nfc_tags && artwork.nfc_tags.some(tag => tag.is_bound);

                                return (
                                    <Card 
                                        key={artwork.id} 
                                        className="border border-black dark:border-white bg-white dark:bg-black overflow-hidden hover:shadow-lg transition-shadow"
                                    >
                                        <div className="aspect-w-16 aspect-h-9 bg-gray-100 dark:bg-gray-900">
                                            <img
                                                src={artwork.image_url || '/placeholder-artwork.jpg'}
                                                alt={artwork.title}
                                                className="object-cover w-full h-48"
                                            />
                                        </div>
                                        <CardContent className="p-4">
                                            <div className="mb-3">
                                                <h3 className="font-semibold text-lg text-black dark:text-white mb-1">
                                                    {artwork.title}
                                                </h3>
                                                <p className="text-black dark:text-white text-sm mb-1">
                                                    {formatArtistName(artwork.artist)}
                                                </p>
                                                <p className="text-gray-600 dark:text-gray-400 text-xs">
                                                    {artwork.year} • {artwork.medium}
                                                </p>
                                            </div>

                                            {/* Certificate Status */}
                                            <div className="mb-3">
                                                {hasCertificate ? (
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <CheckCircle className="h-4 w-4 text-black dark:text-white" />
                                                        <span className="text-sm font-medium text-black dark:text-white">
                                                            Certificate Issued
                                                        </span>
                                                        {artwork.certificates?.[0]?.certificate_id && (
                                                            <Badge 
                                                                variant="outline" 
                                                                className="text-xs border-black dark:border-white text-black dark:text-white"
                                                            >
                                                                {artwork.certificates[0].certificate_id}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <CheckCircle className="h-4 w-4 text-gray-500" />
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

                                            {/* Status */}
                                            <div className="flex justify-between items-center">
                                                <span 
                                                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                        artwork.status === 'authenticated'
                                                            ? 'bg-black dark:bg-white text-white dark:text-black'
                                                            : artwork.status === 'pending_verification'
                                                                ? 'bg-yellow-500 text-black'
                                                                : 'bg-gray-500 text-white'
                                                    }`}
                                                >
                                                    {artwork.status.replace('_', ' ').toUpperCase()}
                                                </span>
                                                <span className="text-xs text-gray-600 dark:text-gray-400">
                                                    {new Date(artwork.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
