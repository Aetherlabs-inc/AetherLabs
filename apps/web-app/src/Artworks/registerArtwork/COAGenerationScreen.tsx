import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Shield,
    ArrowLeft,
    ArrowRight,
    CheckCircle,
    Download,
    Copy,
    Loader2
} from 'lucide-react';
import COACertificate from './COACertificate';
import { ArtworkRegistrationService } from '@/src/services/artwork-registration-service';

interface COAGenerationScreenProps {
    artworkData: {
        title: string;
        year: string;
        medium: string;
        dimensions: string;
        artistName: string;
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
    const [artistName, setArtistName] = useState('');

    const generationSteps = [
        'Validating artwork data...',
        'Generating unique certificate ID...',
        'Creating digital signature...',
        'Registering on blockchain...',
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

    const generateCOA = async () => {
        try {
            // Generate COA using the service
            const newCOAData = await ArtworkRegistrationService.generateCOA('temp-artwork-id');

            setCoaData(newCOAData);
            setIsGenerating(false);
        } catch (error) {
            console.error('Error generating COA:', error);
            alert(`Error generating COA: ${error instanceof Error ? error.message : 'Unknown error'}`);
            setIsGenerating(false);
        }
    };

    const handleGenerate = () => {
        if (!artistName.trim()) {
            alert('Please enter the artist name');
            return;
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
        // You could add a toast notification here
    };

    const downloadCOA = () => {
        // In a real app, this would generate and download a PDF
        alert('COA PDF download would be implemented here');
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
                        Back to COA Decision
                    </Button>

                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-black dark:text-white mb-4">
                            Generate Certificate of Authenticity
                        </h1>
                        <p className="text-xl text-black dark:text-white">
                            Create a blockchain-verified certificate for &quot;{artworkData.title}&quot;
                        </p>
                    </div>
                </div>

                {!isGenerating && !coaData && (
                    <Card className="border border-black dark:border-white bg-white dark:bg-black">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-black dark:text-white">
                                <Shield className="h-5 w-5" />
                                Artist Information
                            </CardTitle>
                            <CardDescription className="text-black dark:text-white">
                                Please provide the artist name for the certificate
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="artistName" className="text-black dark:text-white">
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

                            <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4">
                                <h4 className="font-semibold text-black dark:text-white mb-2">Artwork Details</h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-black dark:text-white">Title:</span>
                                        <p className="font-medium text-black dark:text-white">{artworkData.title}</p>
                                    </div>
                                    <div>
                                        <span className="text-black dark:text-white">Year:</span>
                                        <p className="font-medium text-black dark:text-white">{artworkData.year}</p>
                                    </div>
                                    <div>
                                        <span className="text-black dark:text-white">Medium:</span>
                                        <p className="font-medium text-black dark:text-white">{artworkData.medium}</p>
                                    </div>
                                    <div>
                                        <span className="text-black dark:text-white">Dimensions:</span>
                                        <p className="font-medium text-black dark:text-white">{artworkData.dimensions}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <Button
                                    onClick={handleGenerate}
                                    disabled={!artistName.trim()}
                                    className="flex-1 py-3 text-lg font-semibold bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black"
                                >
                                    <Shield className="h-5 w-5 mr-2" />
                                    Generate COA
                                </Button>
                                <Button
                                    onClick={onSkip}
                                    variant="outline"
                                    className="px-6 py-3 text-lg font-semibold border-black dark:border-white text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900"
                                >
                                    Skip
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {isGenerating && (
                    <Card className="border border-black dark:border-white bg-white dark:bg-black">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-black dark:text-white">
                                <Loader2 className="h-5 w-5 animate-spin" />
                                Generating Certificate
                            </CardTitle>
                            <CardDescription className="text-black dark:text-white">
                                Creating your blockchain-verified certificate of authenticity
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                {generationSteps.map((step, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${index < generationStep
                                            ? 'bg-black dark:bg-white text-white dark:text-black'
                                            : index === generationStep
                                                ? 'bg-yellow-500 text-black'
                                                : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
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
                                            ? 'text-black dark:text-white'
                                            : 'text-gray-500 dark:text-gray-400'
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
                        {/* Certificate Display */}
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-black dark:text-white mb-4 text-center">
                                Your Certificate of Authenticity
                            </h2>
                            <COACertificate
                                artworkData={{
                                    title: artworkData.title,
                                    year: artworkData.year,
                                    medium: artworkData.medium,
                                    dimensions: artworkData.dimensions,
                                    artistName: artistName,
                                    imageUrl: undefined // You can add image URL here when available
                                }}
                                certificateData={coaData}
                                verificationLevel={{
                                    level: 'artist_verified', // Default to artist verified for now
                                    hasNFC: false, // Will be updated when NFC is bound
                                    nfcUid: undefined
                                }}
                                className="shadow-lg"
                            />
                        </div>

                        {/* Action Buttons */}
                        <Card className="border border-black dark:border-white bg-white dark:bg-black">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-black dark:text-white">
                                    <CheckCircle className="h-5 w-5 text-black dark:text-white" />
                                    Certificate Generated Successfully
                                </CardTitle>
                                <CardDescription className="text-black dark:text-white">
                                    Your certificate of authenticity has been created and registered on the blockchain
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="bg-gray-100 dark:bg-gray-900 border border-black dark:border-white rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <CheckCircle className="h-5 w-5 text-black dark:text-white" />
                                        <span className="font-semibold text-black dark:text-white">
                                            Certificate ID: {coaData.certificateId}
                                        </span>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => copyToClipboard(coaData.certificateId)}
                                            className="text-black dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800"
                                        >
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <p className="text-sm text-black dark:text-white">
                                        This certificate is now permanently recorded on the blockchain
                                    </p>
                                </div>

                                <div className="flex gap-4">
                                    <Button
                                        onClick={downloadCOA}
                                        variant="outline"
                                        className="flex-1 py-3 text-lg font-semibold border-black dark:border-white text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900"
                                    >
                                        <Download className="h-5 w-5 mr-2" />
                                        Download COA PDF
                                    </Button>
                                    <Button
                                        onClick={handleComplete}
                                        className="flex-1 py-3 text-lg font-semibold bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black"
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
