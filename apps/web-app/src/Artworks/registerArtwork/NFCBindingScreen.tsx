import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Label, Switch } from '@aetherlabs/ui';
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
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <Button
                        onClick={onBack}
                        variant="ghost"
                        className="mb-4 flex items-center gap-2 text-foreground hover:text-muted-foreground"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to COA Generation
                    </Button>

                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-foreground mb-4">
                            NFC Tag Binding
                        </h1>
                        <p className="text-xl text-foreground">
                            Bind an NFC tag to &quot;{artworkData.title}&quot; for physical verification
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* NFC Binding Options */}
                    <Card className="border border-border bg-card">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-foreground">
                                <Wifi className="h-5 w-5" />
                                NFC Binding Options
                            </CardTitle>
                            <CardDescription className="text-muted-foreground">
                                Choose how to bind your NFC tag to the artwork
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Wifi className="h-5 w-5 text-foreground" />
                                        <div>
                                            <h4 className="font-semibold text-foreground">Bind NFC Tag</h4>
                                            <p className="text-sm text-muted-foreground">
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
                                        <div className="bg-muted border border-border rounded-lg p-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Smartphone className="h-5 w-5 text-foreground" />
                                                <span className="font-semibold text-foreground">
                                                    NFC Scanning Instructions
                                                </span>
                                            </div>
                                            <ul className="text-sm text-foreground space-y-1">
                                                <li>• Hold your NFC-enabled device close to the tag</li>
                                                <li>• Ensure NFC is enabled on your device</li>
                                                <li>• Keep the device steady for 2-3 seconds</li>
                                                <li>• Wait for the binding confirmation</li>
                                            </ul>
                                        </div>

                                        {!isScanning && !nfcData && (
                                            <Button
                                                onClick={simulateNFCDetection}
                                                className="w-full py-3 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
                                            >
                                                <Wifi className="h-5 w-5 mr-2" />
                                                Start NFC Scan
                                            </Button>
                                        )}

                                        {isScanning && (
                                            <div className="text-center space-y-4">
                                                <div className="flex items-center justify-center">
                                                    <Loader2 className="h-8 w-8 animate-spin text-foreground" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-foreground">
                                                        Scanning for NFC Tag...
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Hold your device close to the NFC tag
                                                    </p>
                                                </div>
                                                <div className="flex items-center justify-center gap-2">
                                                    <div className="w-2 h-2 bg-foreground rounded-full animate-pulse"></div>
                                                    <div className="w-2 h-2 bg-foreground rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                                                    <div className="w-2 h-2 bg-foreground rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                                                </div>
                                            </div>
                                        )}

                                        {nfcData && nfcData.bindingStatus === 'success' && (
                                            <div className="bg-muted border border-border rounded-lg p-4">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <CheckCircle className="h-5 w-5 text-foreground" />
                                                    <span className="font-semibold text-foreground">
                                                        NFC Tag Successfully Bound
                                                    </span>
                                                </div>
                                                <p className="text-sm text-foreground mb-2">
                                                    NFC UID: {nfcData.nfcUid}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
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
                    <Card className="border border-border bg-card">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-foreground">
                                <Shield className="h-5 w-5" />
                                Artwork Summary
                            </CardTitle>
                            <CardDescription className="text-muted-foreground">
                                Details of your artwork and certificate
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3">
                                <div>
                                    <Label className="text-muted-foreground">Artwork Title</Label>
                                    <p className="font-semibold text-foreground">{artworkData.title}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-muted-foreground">Year</Label>
                                        <p className="font-semibold text-foreground">{artworkData.year}</p>
                                    </div>
                                    <div>
                                        <Label className="text-muted-foreground">Medium</Label>
                                        <p className="font-semibold text-foreground">{artworkData.medium}</p>
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-muted-foreground">Dimensions</Label>
                                    <p className="font-semibold text-foreground">{artworkData.dimensions}</p>
                                </div>
                            </div>

                            {coaData && (
                                <div className="border-t border-border pt-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        <CheckCircle className="h-5 w-5 text-foreground" />
                                        <span className="font-semibold text-foreground">Certificate of Authenticity</span>
                                    </div>
                                    <div className="space-y-2">
                                        <div>
                                            <Label className="text-muted-foreground">Certificate ID</Label>
                                            <p className="font-mono text-sm text-foreground">{coaData.certificateId}</p>
                                        </div>
                                        <div>
                                            <Label className="text-muted-foreground">Blockchain Hash</Label>
                                            <p className="font-mono text-xs text-muted-foreground break-all">
                                                {coaData.blockchainHash.substring(0, 20)}...
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="border-t border-border pt-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <Wifi className="h-5 w-5 text-foreground" />
                                    <span className="font-semibold text-foreground">NFC Status</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {nfcData && nfcData.isBound ? (
                                        <>
                                            <CheckCircle className="h-4 w-4 text-foreground" />
                                            <span className="text-sm text-foreground">NFC Tag Bound</span>
                                        </>
                                    ) : bindNFC ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin text-accent" />
                                            <span className="text-sm text-accent">Scanning...</span>
                                        </>
                                    ) : (
                                        <>
                                            <AlertCircle className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm text-muted-foreground">No NFC Tag</span>
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
                        className="px-8 py-3 text-lg font-semibold border-border text-foreground hover:bg-muted"
                    >
                        Skip NFC Binding
                    </Button>
                    <Button
                        onClick={handleComplete}
                        className="px-8 py-3 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                        Complete Registration
                        <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                </div>

                {/* Additional Info */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-muted-foreground">
                        You can bind an NFC tag later from your artwork&apos;s detail page
                    </p>
                </div>
            </div>
        </div>
    );
};

export default NFCBindingScreen;
