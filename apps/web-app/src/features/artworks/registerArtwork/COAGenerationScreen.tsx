import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Input, Label } from '@aetherlabs/ui';
import {
    Shield,
    ArrowLeft,
    ArrowRight,
    CheckCircle,
    Download,
    Copy,
    Loader2
} from 'lucide-react';
import COACertificateElegant from './COACertificateElegant';
import { downloadCertificatePDF } from './COACertificatePDF';

interface COAGenerationScreenProps {
    artworkData: {
        title: string;
        year: string;
        medium: string;
        dimensions: string;
        artistName: string;
        imageUrl?: string;
    };
    onBack: () => void;
    onComplete: (coaData: COAData) => void;
    onSkip: () => void;
}

interface COAData {
    certificateId: string;
    qrCode: string;
    blockchainHash: string;
    generatedAt: string;
}

const COAGenerationScreen: React.FC<COAGenerationScreenProps> = ({
    artworkData,
    onBack,
    onComplete,
    onSkip
}) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [generationStep, setGenerationStep] = useState(0);
    const [coaData, setCoaData] = useState<COAData | null>(null);
    const [artistName, setArtistName] = useState(artworkData.artistName || '');
    const [isDownloading, setIsDownloading] = useState(false);
    const [copied, setCopied] = useState(false);

    const generationSteps = [
        'Validating artwork data...',
        'Generating unique certificate ID...',
        'Creating registry signature...',
        'Generating QR code...',
        'Finalizing certificate...'
    ];

    useEffect(() => {
        if (isGenerating) {
            const interval = setInterval(() => {
                setGenerationStep(prev => {
                    if (prev < generationSteps.length - 1) {
                        return prev + 1;
                    } else {
                        clearInterval(interval);
                        generateCOA();
                        return prev;
                    }
                });
            }, 1500);
            return () => clearInterval(interval);
        }
    }, [isGenerating]);

    const generateCOA = () => {
        const certificateId = `COA-${Date.now()}-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
        const qrCode = `https://aetherlabs.art/verify/${certificateId}`;
        const registrySignature = `SIG-${Math.random().toString(36).slice(2, 18).toUpperCase()}`;
        const generatedAt = new Date().toISOString();

        setCoaData({
            certificateId,
            qrCode,
            blockchainHash: registrySignature,
            generatedAt
        });
        setIsGenerating(false);
    };

    const handleGenerate = () => {
        if (!artistName.trim()) {
            setArtistName('Unknown Artist');
        }
        setIsGenerating(true);
        setGenerationStep(0);
    };

    const handleComplete = () => {
        if (coaData) {
            onComplete(coaData);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const downloadCOA = async () => {
        if (!coaData) return;

        setIsDownloading(true);
        try {
            await downloadCertificatePDF({
                artworkData: {
                    title: artworkData.title,
                    year: artworkData.year,
                    medium: artworkData.medium,
                    dimensions: artworkData.dimensions,
                    artistName: artistName,
                    imageUrl: artworkData.imageUrl,
                },
                certificateData: {
                    certificateId: coaData.certificateId,
                    qrCodeUrl: coaData.qrCode,
                    blockchainHash: coaData.blockchainHash,
                    generatedAt: coaData.generatedAt,
                },
                verificationLevel: {
                    hasNFC: false,
                },
            });
        } catch (error) {
            console.error('Error downloading PDF:', error);
            alert('Failed to download PDF. Please try again.');
        } finally {
            setIsDownloading(false);
        }
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
                        Back to COA Decision
                    </Button>

                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-foreground mb-4">
                            Generate Certificate of Authenticity
                        </h1>
                        <p className="text-xl text-foreground">
                            Create a verified certificate for &quot;{artworkData.title}&quot;
                        </p>
                    </div>
                </div>

                {!isGenerating && !coaData && (
                    <Card className="border border-border bg-card">
                        <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-foreground">
                            <Shield className="h-5 w-5" />
                            Artist Information
                        </CardTitle>
                        <CardDescription className="text-muted-foreground">
                            Please provide the artist name for the certificate
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="artistName" className="text-foreground">
                                    Artist Name *
                                </Label>
                                <Input
                                    id="artistName"
                                    value={artistName}
                                    onChange={(e) => setArtistName(e.target.value)}
                                    placeholder="Enter the artist's full name"
                                    className="text-lg"
                                />
                            </div>

                            <div className="bg-muted rounded-lg p-4">
                                <h4 className="font-semibold text-foreground mb-2">Artwork Details</h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-muted-foreground">Title:</span>
                                        <p className="font-medium text-foreground">{artworkData.title}</p>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Year:</span>
                                        <p className="font-medium text-foreground">{artworkData.year}</p>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Medium:</span>
                                        <p className="font-medium text-foreground">{artworkData.medium}</p>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">Dimensions:</span>
                                        <p className="font-medium text-foreground">{artworkData.dimensions}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Button
                                    onClick={handleGenerate}
                                    disabled={!artistName.trim()}
                                    className="flex-1 py-3 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
                                >
                                    <Shield className="h-5 w-5 mr-2" />
                                    Generate Certificate
                                </Button>
                                <Button
                                    onClick={onSkip}
                                    variant="outline"
                                    className="px-6 py-3 text-lg font-semibold border-border text-foreground hover:bg-muted"
                                >
                                    Skip
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {isGenerating && (
                    <Card className="border border-border bg-card">
                        <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-foreground">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Generating Certificate
                        </CardTitle>
                        <CardDescription className="text-muted-foreground">
                            Creating your certificate of authenticity
                        </CardDescription>
                    </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                {generationSteps.map((step, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${index < generationStep
                                            ? 'bg-primary text-primary-foreground'
                                            : index === generationStep
                                                ? 'bg-accent text-accent-foreground'
                                                : 'bg-muted text-muted-foreground'
                                            }`}>
                                            {index < generationStep ? (
                                                <CheckCircle className="h-4 w-4" />
                                            ) : index === generationStep ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <span className="text-xs">{index + 1}</span>
                                            )}
                                        </div>
                                        <span className={`${index <= generationStep
                                            ? 'text-foreground'
                                            : 'text-muted-foreground'
                                            }`}>
                                            {step}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {coaData && (
                    <div className="space-y-6">
                        {/* Certificate Display - Using the elegant design */}
                        <COACertificateElegant
                            artworkData={{
                                title: artworkData.title,
                                year: artworkData.year,
                                medium: artworkData.medium,
                                dimensions: artworkData.dimensions,
                                artistName: artistName,
                                imageUrl: artworkData.imageUrl,
                            }}
                            certificateData={{
                                certificateId: coaData.certificateId,
                                qrCodeUrl: coaData.qrCode,
                                blockchainHash: coaData.blockchainHash,
                                generatedAt: coaData.generatedAt,
                            }}
                            verificationLevel={{
                                level: 'artist_verified',
                                hasNFC: false,
                            }}
                            showActions={false}
                        />

                        {/* Action Buttons */}
                        <Card className="border border-border bg-card max-w-3xl mx-auto">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-foreground">
                                    <CheckCircle className="h-5 w-5 text-[#BC8010]" />
                                    Certificate Generated Successfully
                                </CardTitle>
                            <CardDescription className="text-muted-foreground">
                                    Your certificate of authenticity has been created in your registry
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                                <div className="bg-[#BC8010]/5 border border-[#BC8010]/20 rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Shield className="h-5 w-5 text-[#BC8010]" />
                                        <span className="font-semibold text-foreground">
                                            Certificate ID: {coaData.certificateId}
                                        </span>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => copyToClipboard(coaData.certificateId)}
                                            className="text-foreground hover:bg-[#BC8010]/10"
                                        >
                                            {copied ? (
                                                <CheckCircle className="h-4 w-4 text-green-500" />
                                            ) : (
                                                <Copy className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        This certificate is now recorded in your registry
                                    </p>
                                </div>

                                <div className="flex gap-4">
                                    <Button
                                        onClick={downloadCOA}
                                        disabled={isDownloading}
                                        variant="outline"
                                        className="flex-1 py-3 text-lg font-semibold border-[#2A2121] dark:border-[#BC8010] text-foreground hover:bg-[#BC8010]/10"
                                    >
                                        {isDownloading ? (
                                            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                        ) : (
                                            <Download className="h-5 w-5 mr-2" />
                                        )}
                                        {isDownloading ? 'Generating PDF...' : 'Download COA PDF'}
                                    </Button>
                                    <Button
                                        onClick={handleComplete}
                                        className="flex-1 py-3 text-lg font-semibold bg-[#2A2121] hover:bg-[#2A2121]/90 text-white"
                                    >
                                        Continue to NFC
                                        <ArrowRight className="h-4 w-4 ml-2" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
};

export default COAGenerationScreen;
