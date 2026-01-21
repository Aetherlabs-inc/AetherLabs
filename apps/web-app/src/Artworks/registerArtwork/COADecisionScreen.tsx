import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Shield, ArrowLeft, ArrowRight } from 'lucide-react';

interface COADecisionScreenProps {
    artworkTitle: string;
    onBack: () => void;
    onGenerateCOA: () => void;
    onSkipCOA: () => void;
}

const COADecisionScreen: React.FC<COADecisionScreenProps> = ({
    artworkTitle,
    onBack,
    onGenerateCOA,
    onSkipCOA
}) => {
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
                        Back to Artwork Registration
                    </Button>

                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-black dark:text-white mb-4">
                            Certificate of Authenticity
                        </h1>
                        <p className="text-xl text-black dark:text-white mb-4">
                            Would you like to create a COA for &quot;{artworkTitle}&quot;?
                        </p>
                    </div>
                </div>

                {/* COA Preview */}
                <Card className="border border-black dark:border-white bg-white dark:bg-black mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-black dark:text-white">
                            <Shield className="h-5 w-5" />
                            Certificate of Authenticity Preview
                        </CardTitle>
                        <CardDescription className="text-black dark:text-white">
                            A digital certificate will be generated for &quot;{artworkTitle}&quot;
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="bg-gray-100 dark:bg-gray-900 border border-black dark:border-white rounded-lg p-6">
                            <div className="text-center mb-6">
                                <div className="mx-auto w-16 h-16 bg-black dark:bg-white rounded-full flex items-center justify-center mb-4">
                                    <Shield className="h-8 w-8 text-white dark:text-black" />
                                </div>
                                <h3 className="text-xl font-bold text-black dark:text-white mb-2">Certificate of Authenticity</h3>
                                <p className="text-sm text-black dark:text-white">Digital Certificate Preview</p>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-black dark:text-white font-semibold">Artwork:</span>
                                        <p className="text-black dark:text-white">{artworkTitle}</p>
                                    </div>
                                    <div>
                                        <span className="text-black dark:text-white font-semibold">Certificate ID:</span>
                                        <p className="text-black dark:text-white font-mono">COA-XXXX-XXXX</p>
                                    </div>
                                    <div>
                                        <span className="text-black dark:text-white font-semibold">Blockchain Hash:</span>
                                        <p className="text-black dark:text-white font-mono text-xs">0x1234...5678</p>
                                    </div>
                                    <div>
                                        <span className="text-black dark:text-white font-semibold">Status:</span>
                                        <p className="text-black dark:text-white">Pending Generation</p>
                                    </div>
                                </div>

                                <div className="border-t border-black dark:border-white pt-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-2 h-2 bg-black dark:bg-white rounded-full"></div>
                                        <span className="text-sm text-black dark:text-white font-semibold">Features Included:</span>
                                    </div>
                                    <ul className="text-sm text-black dark:text-white space-y-1 ml-4">
                                        <li>• Blockchain verification</li>
                                        <li>• Unique certificate ID</li>
                                        <li>• QR code for verification</li>
                                        <li>• NFC tag binding capability</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="flex gap-4 justify-center">
                    <Button
                        onClick={onSkipCOA}
                        variant="outline"
                        className="px-8 py-3 text-lg font-semibold border-black dark:border-white text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-900"
                    >
                        <FileText className="h-5 w-5 mr-2" />
                        Skip COA
                    </Button>
                    <Button
                        onClick={onGenerateCOA}
                        className="px-8 py-3 text-lg font-semibold bg-black hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 text-white dark:text-black"
                    >
                        <Shield className="h-5 w-5 mr-2" />
                        Generate COA
                        <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                </div>

                {/* Additional Info */}
                <div className="mt-12 text-center">
                    <p className="text-sm text-black dark:text-white">
                        You can always generate a COA later from your artwork&apos;s detail page
                    </p>
                </div>
            </div>
        </div>
    );
};

export default COADecisionScreen;
