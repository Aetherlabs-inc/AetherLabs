import React from 'react';
import { ArrowLeft, Eye, FileText, Wifi, Shield, QrCode, CheckCircle, AlertTriangle, User, Calendar, Ruler, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ArtworkWithDetails } from '@/src/types/database';
import { formatArtistName } from '@/src/utils/artist-utils';


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
    const getVerificationInfo = () => {
        const latestVerification = artwork.verification_levels?.[0];
        const verificationLevel = latestVerification?.level ?? 'unverified';

        switch (verificationLevel) {
            case 'unverified':
                return {
                    icon: AlertTriangle,
                    label: 'Unverified',
                    description: 'Artist self-registered',
                    color: 'text-gray-500',
                    bgColor: 'bg-gray-100 dark:bg-gray-800'
                };
            case 'artist_verified':
                return {
                    icon: CheckCircle,
                    label: 'Artist Verified',
                    description: 'Verified by the artist',
                    color: 'text-black dark:text-white',
                    bgColor: 'bg-gray-100 dark:bg-gray-800'
                };
            case 'gallery_verified':
                return {
                    icon: Shield,
                    label: 'Gallery Verified',
                    description: 'AetherLabs Trusted Gallery',
                    color: 'text-black dark:text-white',
                    bgColor: 'bg-gray-100 dark:bg-gray-800'
                };
            case 'third_party_verified':
                return {
                    icon: Shield,
                    label: 'Third Party Verified',
                    description: 'Independent verification',
                    color: 'text-black dark:text-white',
                    bgColor: 'bg-gray-100 dark:bg-gray-800'
                };
            default:
                return {
                    icon: AlertTriangle,
                    label: 'Unknown',
                    description: 'Verification status unknown',
                    color: 'text-gray-500',
                    bgColor: 'bg-gray-100 dark:bg-gray-800'
                };
        }
    };

    const verificationInfo = getVerificationInfo();
    const VerificationIcon = verificationInfo.icon;
    const verificationBgColor = verificationInfo.bgColor;

    return (
        <div className="min-h-screen bg-white dark:bg-black p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Button
                        onClick={onBack}
                        variant="ghost"
                        className="mb-4 flex items-center gap-2 text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Artworks
                    </Button>

                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-4xl font-bold text-black dark:text-white mb-2">
                                {artwork.title}
                            </h1>
                            <p className="text-xl text-black dark:text-white mb-4">
                                by {formatArtistName(artwork.artist)}
                            </p>
                            <div className="flex items-center gap-4">
                                <Badge
                                    variant="outline"
                                    className={`px-3 py-1 ${artwork.status === 'authenticated'
                                        ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                                        : artwork.status === 'pending_verification'
                                            ? 'bg-yellow-500 text-black border-yellow-500'
                                            : 'bg-gray-500 text-white border-gray-500'
                                        }`}
                                >
                                    {artwork.status.replace('_', ' ').toUpperCase()}
                                </Badge>
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                    Added {new Date(artwork.created_at).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Artwork Image */}
                    <div className="lg:col-span-2">
                        <Card className="border border-black dark:border-white bg-white dark:bg-black">
                            <CardHeader>
                                <CardTitle className="text-black dark:text-white">Artwork</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="border border-black dark:border-white rounded-lg overflow-hidden">
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
                        <Card className="border border-black dark:border-white bg-white dark:bg-black">
                            <CardHeader>
                                <CardTitle className="text-black dark:text-white">Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <User className="h-4 w-4 text-black dark:text-white" />
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Artist</p>
                                        <p className="font-semibold text-black dark:text-white">{formatArtistName(artwork.artist)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Calendar className="h-4 w-4 text-black dark:text-white" />
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Year</p>
                                        <p className="font-semibold text-black dark:text-white">{artwork.year.toString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Ruler className="h-4 w-4 text-black dark:text-white" />
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Dimensions</p>
                                        <p className="font-semibold text-black dark:text-white">{artwork.dimensions}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Medium</p>
                                    <p className="font-semibold text-black dark:text-white">{artwork.medium}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Verification Status */}
                        <Card className="border border-black dark:border-white bg-white dark:bg-black">
                            <CardHeader>
                                <CardTitle className="text-black dark:text-white">Verification</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className={`${verificationBgColor} border border-black dark:border-white rounded-lg p-4`}>
                                    <div className="flex items-center gap-3">
                                        <VerificationIcon className={`h-6 w-6 ${verificationInfo.color}`} />
                                        <div>
                                            <p className={`font-bold ${verificationInfo.color}`}>{verificationInfo.label}</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">{verificationInfo.description}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Certificate Status */}
                                <div className="border-t border-gray-300 dark:border-gray-600 pt-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-semibold text-black dark:text-white">Certificate</span>
                                        {artwork.certificates && artwork.certificates.length > 0 ? (
                                            <div className="flex items-center gap-2">
                                                <CheckCircle className="h-4 w-4 text-black dark:text-white" />
                                                <span className="text-sm text-black dark:text-white">Issued</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <AlertTriangle className="h-4 w-4 text-gray-500" />
                                                <span className="text-sm text-gray-500">Not Issued</span>
                                            </div>
                                        )}
                                    </div>
                                    {artwork.certificates && artwork.certificates.length > 0 && (
                                        <p className="text-xs text-gray-600 dark:text-gray-400 font-mono">
                                            {artwork.certificates[0].certificate_id}
                                        </p>
                                    )}
                                </div>

                                {/* NFC Status */}
                                <div className="border-t border-gray-300 dark:border-gray-600 pt-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-semibold text-black dark:text-white">NFC Tag</span>
                                        {artwork.nfc_tags && artwork.nfc_tags.some(tag => tag.is_bound) ? (
                                            <div className="flex items-center gap-2">
                                                <Wifi className="h-4 w-4 text-black dark:text-white" />
                                                <span className="text-sm text-black dark:text-white">Connected</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <Wifi className="h-4 w-4 text-gray-400" />
                                                <span className="text-sm text-gray-500">Not Connected</span>
                                            </div>
                                        )}
                                    </div>
                                    {artwork.nfc_tags && artwork.nfc_tags.some(tag => tag.is_bound) && (
                                        <p className="text-xs text-gray-600 dark:text-gray-400 font-mono">
                                            {artwork.nfc_tags.find(tag => tag.is_bound)?.nfc_uid}
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Action Buttons */}
                        <Card className="border border-black dark:border-white bg-white dark:bg-black">
                            <CardHeader>
                                <CardTitle className="text-black dark:text-white">Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {artwork.certificates && artwork.certificates.length > 0 ? (
                                    <Button
                                        onClick={onViewCOA}
                                        className="w-full bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black"
                                    >
                                        <Eye className="h-4 w-4 mr-2" />
                                        View Certificate
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={onGenerateCOA}
                                        className="w-full bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black"
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
                                            className="w-full border-black dark:border-white text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900"
                                        >
                                            <Wifi className="h-4 w-4 mr-2" />
                                            Connect NFC Tag
                                        </Button>
                                    )}

                                {artwork.certificates && artwork.certificates.length > 0 && (
                                    <Button
                                        variant="outline"
                                        className="w-full border-black dark:border-white text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900"
                                    >
                                        <QrCode className="h-4 w-4 mr-2" />
                                        Share Certificate
                                    </Button>
                                )}

                                {onDelete && (
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className="w-full border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
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
                                                        <span className="block mt-2 text-amber-600 dark:text-amber-400">
                                                            ⚠️ This artwork has certificates and NFC tags that will also be deleted.
                                                        </span>
                                                    )}
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction
                                                    onClick={() => onDelete(artwork.id)}
                                                    className="bg-red-600 hover:bg-red-700 text-white"
                                                >
                                                    Delete
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArtworkDetails;
