import React from 'react';
import { Shield, QrCode, Hash, User, FileText, CheckCircle, AlertTriangle, Wifi, Building2, UserCheck } from 'lucide-react';
import { formatArtistName } from '@/src/utils/artist-utils';

interface COACertificateProps {
    artworkData: {
        title: string;
        year: string;
        medium: string;
        dimensions: string;
        artistName: string;
        imageUrl?: string;
    };
    certificateData: {
        certificateId: string;
        qrCode: string;
        blockchainHash: string;
        generatedAt: string;
    };
    verificationLevel: {
        level: 'unverified' | 'artist_verified' | 'gallery_verified' | 'third_party_verified';
        hasNFC: boolean;
        nfcUid?: string;
    };
    className?: string;
}

const COACertificate: React.FC<COACertificateProps> = ({
    artworkData,
    certificateData,
    verificationLevel,
    className = ""
}) => {
    const getVerificationInfo = () => {
        switch (verificationLevel.level) {
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
                    icon: UserCheck,
                    label: 'Artist Verified',
                    description: 'Verified by the artist',
                    color: 'text-black dark:text-white',
                    bgColor: 'bg-gray-100 dark:bg-gray-800'
                };
            case 'gallery_verified':
                return {
                    icon: Building2,
                    label: 'Gallery Verified',
                    description: 'AetherLabs Trusted Gallery',
                    color: 'text-black dark:text-white',
                    bgColor: 'bg-gray-100 dark:bg-gray-800'
                };
            case 'third_party_verified':
                return {
                    icon: CheckCircle,
                    label: 'Third Party Verified',
                    description: 'Independent verification',
                    color: 'text-black dark:text-white',
                    bgColor: 'bg-gray-100 dark:bg-gray-800'
                };
        }
    };

    const verificationInfo = getVerificationInfo();
    const VerificationIcon = verificationInfo.icon;
    return (
        <div className={`bg-white dark:bg-black border-2 border-black dark:border-white p-8 max-w-4xl mx-auto ${className}`}>
            {/* Certificate Header */}
            <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-4">
                    <div className="w-16 h-16 bg-black dark:bg-white rounded-full flex items-center justify-center mr-4">
                        <Shield className="h-8 w-8 text-white dark:text-black" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-black dark:text-white">CERTIFICATE OF AUTHENTICITY</h1>
                        <p className="text-sm text-black dark:text-white mt-1">Digital Certificate • Blockchain Verified</p>
                    </div>
                </div>
                <div className="w-full h-0.5 bg-black dark:bg-white"></div>
            </div>

            {/* Certificate Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Left Column - Artwork Image */}
                <div className="lg:col-span-1">
                    <h2 className="text-xl font-bold text-black dark:text-white mb-4 flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Artwork
                    </h2>
                    <div className="border border-black dark:border-white rounded-lg overflow-hidden">
                        {artworkData.imageUrl ? (
                            <img
                                src={artworkData.imageUrl}
                                alt={artworkData.title}
                                className="w-full h-64 object-cover"
                            />
                        ) : (
                            <div className="w-full h-64 bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                                <div className="text-center">
                                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                                    <p className="text-sm text-gray-500 dark:text-gray-400">No Image Available</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Middle Column - Artwork Details */}
                <div className="lg:col-span-1">
                    <h2 className="text-xl font-bold text-black dark:text-white mb-4 flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Details
                    </h2>
                    <div className="space-y-3">
                        <div className="flex justify-between border-b border-gray-300 dark:border-gray-600 pb-2">
                            <span className="font-semibold text-black dark:text-white">Title:</span>
                            <span className="text-black dark:text-white text-right">{artworkData.title}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-300 dark:border-gray-600 pb-2">
                            <span className="font-semibold text-black dark:text-white">Artist:</span>
                            <span className="text-black dark:text-white text-right">{formatArtistName(artworkData.artistName)}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-300 dark:border-gray-600 pb-2">
                            <span className="font-semibold text-black dark:text-white">Year:</span>
                            <span className="text-black dark:text-white text-right">{artworkData.year}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-300 dark:border-gray-600 pb-2">
                            <span className="font-semibold text-black dark:text-white">Medium:</span>
                            <span className="text-black dark:text-white text-right">{artworkData.medium}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-300 dark:border-gray-600 pb-2">
                            <span className="font-semibold text-black dark:text-white">Dimensions:</span>
                            <span className="text-black dark:text-white text-right">{artworkData.dimensions}</span>
                        </div>
                    </div>
                </div>

                {/* Right Column - Verification & Certificate Details */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Verification Level */}
                    <div>
                        <h2 className="text-xl font-bold text-black dark:text-white mb-4 flex items-center gap-2">
                            <VerificationIcon className="h-5 w-5" />
                            Verification Level
                        </h2>
                        <div className={`${verificationInfo.bgColor} border border-black dark:border-white rounded-lg p-4`}>
                            <div className="flex items-center gap-3 mb-2">
                                <VerificationIcon className={`h-6 w-6 ${verificationInfo.color}`} />
                                <div>
                                    <p className={`font-bold ${verificationInfo.color}`}>{verificationInfo.label}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">{verificationInfo.description}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* NFC Status */}
                    <div>
                        <h3 className="text-lg font-semibold text-black dark:text-white mb-2 flex items-center gap-2">
                            <Wifi className="h-4 w-4" />
                            Physical Verification
                        </h3>
                        <div className={`${verificationLevel.hasNFC ? 'bg-gray-100 dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-900'} border border-black dark:border-white rounded-lg p-3`}>
                            <div className="flex items-center gap-2 mb-2">
                                {verificationLevel.hasNFC ? (
                                    <CheckCircle className="h-5 w-5 text-black dark:text-white" />
                                ) : (
                                    <AlertTriangle className="h-5 w-5 text-gray-500" />
                                )}
                                <span className={`font-semibold ${verificationLevel.hasNFC ? 'text-black dark:text-white' : 'text-gray-500'}`}>
                                    {verificationLevel.hasNFC ? 'NFC Tag Linked' : 'No NFC Tag'}
                                </span>
                            </div>
                            {verificationLevel.hasNFC && verificationLevel.nfcUid && (
                                <p className="text-xs text-black dark:text-white font-mono">
                                    NFC UID: {verificationLevel.nfcUid}
                                </p>
                            )}
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                {verificationLevel.hasNFC
                                    ? 'Physical verification enabled'
                                    : 'No physical verification available'
                                }
                            </p>
                        </div>
                    </div>

                    {/* Certificate Details */}
                    <div>
                        <h3 className="text-lg font-semibold text-black dark:text-white mb-2 flex items-center gap-2">
                            <Shield className="h-4 w-4" />
                            Certificate Details
                        </h3>
                        <div className="space-y-2">
                            <div className="flex justify-between border-b border-gray-300 dark:border-gray-600 pb-1">
                                <span className="font-semibold text-black dark:text-white text-sm">ID:</span>
                                <span className="text-black dark:text-white font-mono text-xs text-right">{certificateData.certificateId}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-300 dark:border-gray-600 pb-1">
                                <span className="font-semibold text-black dark:text-white text-sm">Generated:</span>
                                <span className="text-black dark:text-white text-xs text-right">{new Date(certificateData.generatedAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Blockchain Hash */}
                    <div>
                        <h3 className="text-lg font-semibold text-black dark:text-white mb-2 flex items-center gap-2">
                            <Hash className="h-4 w-4" />
                            Blockchain Hash
                        </h3>
                        <div className="bg-gray-100 dark:bg-gray-900 border border-black dark:border-white rounded p-2">
                            <p className="font-mono text-xs text-black dark:text-white break-all">
                                {certificateData.blockchainHash}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Verification Section */}
            <div className="border-t border-black dark:border-white pt-6 mb-6">
                <h2 className="text-xl font-bold text-black dark:text-white mb-4 text-center">Verification</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="text-center">
                        <div className="w-24 h-24 bg-gray-100 dark:bg-gray-900 border border-black dark:border-white rounded mx-auto mb-3 flex items-center justify-center">
                            <QrCode className="h-12 w-12 text-black dark:text-white" />
                        </div>
                        <p className="text-sm text-black dark:text-white">Scan QR Code for Verification</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{certificateData.qrCode}</p>
                    </div>
                    <div className="text-center">
                        <div className="w-24 h-24 bg-gray-100 dark:bg-gray-900 border border-black dark:border-white rounded mx-auto mb-3 flex items-center justify-center">
                            <Shield className="h-12 w-12 text-black dark:text-white" />
                        </div>
                        <p className="text-sm text-black dark:text-white">Blockchain Verified</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Immutable Record</p>
                    </div>
                </div>
            </div>

            {/* Certificate Footer */}
            <div className="border-t border-black dark:border-white pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div>
                        <p className="text-sm font-semibold text-black dark:text-white">AetherLabs Platform</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Digital Art Registry</p>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-black dark:text-white">Certificate Valid</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Permanently Recorded</p>
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-black dark:text-white">Verification</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Blockchain Secured</p>
                    </div>
                </div>

                <div className="mt-4 text-center">
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                        This certificate is digitally signed and recorded on the blockchain.
                        Any modifications to this document will invalidate its authenticity.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default COACertificate;
