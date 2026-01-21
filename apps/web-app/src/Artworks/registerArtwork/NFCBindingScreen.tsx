import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
    Wifi,
    ArrowLeft,
    ArrowRight,
    CheckCircle,
    AlertCircle,
    Loader2,
    Smartphone,
    Shield,
} from 'lucide-react';
import { ArtworkRegistrationService } from '@/src/services/artwork-registration-service';

interface NFCBindingScreenProps {
    artworkData: {
        title: string;
        year: string;
        medium: string;
        dimensions: string;
    };
    coaData?: {
        certificateId: string;
        qrCode: string;
        blockchainHash: string;
        generatedAt: string;
    };
    onBack: () => void;
    onComplete: (nfcData: NFCData) => void;
    onSkip: (nfcData: NFCData) => void;
}

interface NFCData {
    nfcUid: string;
    isBound: boolean;
    bindingStatus: 'pending' | 'success' | 'failed';
}

const NFCBindingScreen: React.FC<NFCBindingScreenProps> = ({
    artworkData,
    coaData,
    onBack,
    onComplete,
    onSkip
}) => {
    const [bindNFC, setBindNFC] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [nfcData, setNfcData] = useState<NFCData | null>(null);
    const [scanAttempts, setScanAttempts] = useState(0);

    const handleNFCScan = async () => {
        setIsScanning(true);
        setScanAttempts(prev => prev + 1);
        console.log('Scan attempt:', scanAttempts);

        try {
            // Simulate NFC scanning
            await new Promise(resolve => setTimeout(resolve, 3000));

            // Generate NFC UID and bind to artwork
            const nfcUid = `NFC-${Date.now()}-${Math.random().toString(36).substr(2, 8).toUpperCase()}`;
            const newNFCData = await ArtworkRegistrationService.bindNFCTag('temp-artwork-id', nfcUid);

            setNfcData(newNFCData);
            setIsScanning(false);
        } catch (error) {
            console.error('NFC scan failed:', error);
            alert(`Error binding NFC tag: ${error instanceof Error ? error.message : 'Unknown error'}`);
            setIsScanning(false);
        }
    };

    const handleComplete = () => {
        if (nfcData) {
            onComplete(nfcData);
        } else {
            onComplete({
                nfcUid: '',
                isBound: false,
                bindingStatus: 'pending'
            });
        }
    };

    const handleSkip = () => {
        onSkip({
            nfcUid: '',
            isBound: false,
            bindingStatus: 'pending'
        });
    };

    const simulateNFCDetection = () => {
        // In a real app, this would use the Web NFC API
        // For now, we'll simulate the detection
        handleNFCScan();
    };

    return (
        <div className="min-h-screen bg-white dark:bg-black p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Button
                        onClick={onBack}
                        variant="ghost"
                        className="mb-4 flex items-center gap-2 text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to COA Generation
                    </Button>

                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-black dark:text-white mb-4">
                            NFC Tag Binding
                        </h1>
                        <p className="text-xl text-black dark:text-white">
                            Bind an NFC tag to &quot;{artworkData.title}&quot; for physical verification
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* NFC Binding Options */}
                    <Card className="border border-black dark:border-white bg-white dark:bg-black">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-black dark:text-white">
                                <Wifi className="h-5 w-5" />
                                NFC Binding Options
                            </CardTitle>
                            <CardDescription className="text-black dark:text-white">
                                Choose how to bind your NFC tag to the artwork
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Wifi className="h-5 w-5 text-black dark:text-white" />
                                        <div>
                                            <h4 className="font-semibold text-black dark:text-white">Bind NFC Tag</h4>
                                            <p className="text-sm text-black dark:text-white">
                                                Scan and bind an NFC tag to this artwork
                                            </p>
                                        </div>
                                    </div>
                                    <Switch
                                        checked={bindNFC}
                                        onCheckedChange={setBindNFC}
                                    />
                                </div>

                                {bindNFC && (
                                    <div className="space-y-4">
                                        <div className="bg-gray-100 dark:bg-gray-900 border border-black dark:border-white rounded-lg p-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Smartphone className="h-5 w-5 text-black dark:text-white" />
                                                <span className="font-semibold text-black dark:text-white">
                                                    NFC Scanning Instructions
                                                </span>
                                            </div>
                                            <ul className="text-sm text-black dark:text-white space-y-1">
                                                <li>• Hold your NFC-enabled device close to the tag</li>
                                                <li>• Ensure NFC is enabled on your device</li>
                                                <li>• Keep the device steady for 2-3 seconds</li>
                                                <li>• Wait for the binding confirmation</li>
                                            </ul>
                                        </div>

                                        {!isScanning && !nfcData && (
                                            <Button
                                                onClick={simulateNFCDetection}
                                                className="w-full py-3 text-lg font-semibold bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black"
                                            >
                                                <Wifi className="h-5 w-5 mr-2" />
                                                Start NFC Scan
                                            </Button>
                                        )}

                                        {isScanning && (
                                            <div className="text-center space-y-4">
                                                <div className="flex items-center justify-center">
                                                    <Loader2 className="h-8 w-8 animate-spin text-black dark:text-white" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-black dark:text-white">
                                                        Scanning for NFC Tag...
                                                    </p>
                                                    <p className="text-sm text-black dark:text-white">
                                                        Hold your device close to the NFC tag
                                                    </p>
                                                </div>
                                                <div className="flex items-center justify-center gap-2">
                                                    <div className="w-2 h-2 bg-black dark:bg-white rounded-full animate-pulse"></div>
                                                    <div className="w-2 h-2 bg-black dark:bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                                                    <div className="w-2 h-2 bg-black dark:bg-white rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                                                </div>
                                            </div>
                                        )}

                                        {nfcData && nfcData.bindingStatus === 'success' && (
                                            <div className="bg-gray-100 dark:bg-gray-900 border border-black dark:border-white rounded-lg p-4">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <CheckCircle className="h-5 w-5 text-black dark:text-white" />
                                                    <span className="font-semibold text-black dark:text-white">
                                                        NFC Tag Successfully Bound
                                                    </span>
                                                </div>
                                                <p className="text-sm text-black dark:text-white mb-2">
                                                    NFC UID: {nfcData.nfcUid}
                                                </p>
                                                <p className="text-sm text-black dark:text-white">
                                                    This tag is now linked to your artwork and COA
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Artwork & COA Summary */}
                    <Card className="border border-black dark:border-white bg-white dark:bg-black">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-black dark:text-white">
                                <Shield className="h-5 w-5" />
                                Artwork Summary
                            </CardTitle>
                            <CardDescription className="text-black dark:text-white">
                                Details of your artwork and certificate
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3">
                                <div>
                                    <Label className="text-black dark:text-white">Artwork Title</Label>
                                    <p className="font-semibold text-black dark:text-white">{artworkData.title}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-black dark:text-white">Year</Label>
                                        <p className="font-semibold text-black dark:text-white">{artworkData.year}</p>
                                    </div>
                                    <div>
                                        <Label className="text-black dark:text-white">Medium</Label>
                                        <p className="font-semibold text-black dark:text-white">{artworkData.medium}</p>
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-black dark:text-white">Dimensions</Label>
                                    <p className="font-semibold text-black dark:text-white">{artworkData.dimensions}</p>
                                </div>
                            </div>

                            {coaData && (
                                <div className="border-t pt-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        <CheckCircle className="h-5 w-5 text-black dark:text-white" />
                                        <span className="font-semibold text-black dark:text-white">Certificate of Authenticity</span>
                                    </div>
                                    <div className="space-y-2">
                                        <div>
                                            <Label className="text-black dark:text-white">Certificate ID</Label>
                                            <p className="font-mono text-sm text-black dark:text-white">{coaData.certificateId}</p>
                                        </div>
                                        <div>
                                            <Label className="text-black dark:text-white">Blockchain Hash</Label>
                                            <p className="font-mono text-xs text-black dark:text-white break-all">
                                                {coaData.blockchainHash.substring(0, 20)}...
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="border-t pt-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <Wifi className="h-5 w-5 text-black dark:text-white" />
                                    <span className="font-semibold text-black dark:text-white">NFC Status</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {nfcData && nfcData.isBound ? (
                                        <>
                                            <CheckCircle className="h-4 w-4 text-black dark:text-white" />
                                            <span className="text-sm text-black dark:text-white">NFC Tag Bound</span>
                                        </>
                                    ) : bindNFC ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin text-yellow-500" />
                                            <span className="text-sm text-yellow-600 dark:text-yellow-400">Scanning...</span>
                                        </>
                                    ) : (
                                        <>
                                            <AlertCircle className="h-4 w-4 text-gray-400" />
                                            <span className="text-sm text-gray-500">No NFC Tag</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex gap-4 justify-center">
                    <Button
                        onClick={handleSkip}
                        variant="outline"
                        className="px-8 py-3 text-lg font-semibold border-black dark:border-white text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900"
                    >
                        Skip NFC Binding
                    </Button>
                    <Button
                        onClick={handleComplete}
                        className="px-8 py-3 text-lg font-semibold bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black"
                    >
                        Complete Registration
                        <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                </div>

                {/* Additional Info */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-black dark:text-white">
                        You can bind an NFC tag later from your artwork&apos;s detail page
                    </p>
                </div>
            </div>
        </div>
    );
};

export default NFCBindingScreen;
