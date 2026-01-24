import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Label, Switch } from '@aetherlabs/ui';
import {
    Wifi,
    ArrowLeft,
    ArrowRight,
    CheckCircle,
    Smartphone,
    Shield,
} from 'lucide-react';

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
    const bindNFC = false;

    const handleComplete = () => {
        onComplete({
            nfcUid: '',
            isBound: false,
            bindingStatus: 'pending'
        });
    };

    const handleSkip = () => {
        onSkip({
            nfcUid: '',
            isBound: false,
            bindingStatus: 'pending'
        });
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
                                        disabled
                                    />
                                </div>

                                <div className="space-y-4">
                                    <div className="bg-muted border border-border rounded-lg p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Smartphone className="h-5 w-5 text-foreground" />
                                            <span className="font-semibold text-foreground">
                                                NFC Binding Coming Soon
                                            </span>
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            NFC binding is temporarily disabled during testing. You can continue and bind a tag later.
                                        </p>
                                    </div>
                                </div>
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
                                    </div>
                                </div>
                            )}

                            <div className="border-t border-border pt-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <Wifi className="h-5 w-5 text-foreground" />
                                    <span className="font-semibold text-foreground">NFC Status</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">NFC binding disabled</span>
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
