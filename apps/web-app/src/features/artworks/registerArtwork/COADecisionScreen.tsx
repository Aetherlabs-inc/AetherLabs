import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button } from '@aetherlabs/ui';
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
                        Back to Artwork Registration
                    </Button>

                    <div className="text-center">
                        <h1 className="text-4xl font-bold text-foreground mb-4">
                            Certificate of Authenticity
                        </h1>
                        <p className="text-xl text-foreground mb-4">
                            Would you like to create a COA for &quot;{artworkTitle}&quot;?
                        </p>
                    </div>
                </div>

                {/* COA Preview */}
                <Card className="border border-border bg-card mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-foreground">
                            <Shield className="h-5 w-5" />
                            Certificate of Authenticity Preview
                        </CardTitle>
                        <CardDescription className="text-muted-foreground">
                            A digital certificate will be generated for &quot;{artworkTitle}&quot;
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="bg-muted border border-border rounded-lg p-6">
                            <div className="text-center mb-6">
                                <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
                                    <Shield className="h-8 w-8 text-primary-foreground" />
                                </div>
                                <h3 className="text-xl font-bold text-foreground mb-2">Certificate of Authenticity</h3>
                                <p className="text-sm text-muted-foreground">Digital Certificate Preview</p>
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-foreground font-semibold">Artwork:</span>
                                        <p className="text-foreground">{artworkTitle}</p>
                                    </div>
                                    <div>
                                        <span className="text-foreground font-semibold">Certificate ID:</span>
                                        <p className="text-foreground font-mono">COA-XXXX-XXXX</p>
                                    </div>
                                    <div>
                                        <span className="text-foreground font-semibold">Blockchain Hash:</span>
                                        <p className="text-muted-foreground font-mono text-xs">0x1234...5678</p>
                                    </div>
                                    <div>
                                        <span className="text-foreground font-semibold">Status:</span>
                                        <p className="text-foreground">Pending Generation</p>
                                    </div>
                                </div>

                                <div className="border-t border-border pt-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-2 h-2 bg-foreground rounded-full"></div>
                                        <span className="text-sm text-foreground font-semibold">Features Included:</span>
                                    </div>
                                    <ul className="text-sm text-foreground space-y-1 ml-4">
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
                        className="px-8 py-3 text-lg font-semibold border-border text-foreground hover:bg-muted"
                    >
                        <FileText className="h-5 w-5 mr-2" />
                        Skip COA
                    </Button>
                    <Button
                        onClick={onGenerateCOA}
                        className="px-8 py-3 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                        <Shield className="h-5 w-5 mr-2" />
                        Generate COA
                        <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                </div>

                {/* Additional Info */}
                <div className="mt-12 text-center">
                    <p className="text-sm text-muted-foreground">
                        You can always generate a COA later from your artwork&apos;s detail page
                    </p>
                </div>
            </div>
        </div>
    );
};

export default COADecisionScreen;
