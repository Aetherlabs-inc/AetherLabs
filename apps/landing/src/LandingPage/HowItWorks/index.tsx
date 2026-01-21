import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Upload, CreditCard, Shield } from 'lucide-react';

const HowItWorks = () => {
    const steps = [
        {
            icon: <Upload className="h-8 w-8 text-aether-gold" />,
            title: "Step 1: Register Your Artwork",
            description: "Upload high-resolution images, artwork details, and artist information. Our system generates a unique secure digital certificate stored permanently in tamper-proof digital records.",
            bullets: [
                "Accepts JPG, PNG, TIFF formats",
                "Certificate created in under 2 minutes",
                "Cryptographically secured permanent record"
            ]
        },
        {
            icon: <CreditCard className="h-8 w-8 text-aether-gold" />,
            title: "Step 2: Attach NFC Tag",
            description: "Receive tamper-proof NFC tags that cryptographically link to your digital certificate. Simply attach to the back of your artwork or frame.",
            bullets: [
                "Military-grade encryption",
                "Water & weather resistant",
                "Works through glass and frames"
            ]
        },
        {
            icon: <Shield className="h-8 w-8 text-aether-gold" />,
            title: "Step 3: Instant Verification",
            description: "Anyone with a smartphone can tap the NFC tag to instantly verify authenticity, view provenance history, and see ownership records.",
            bullets: [
                "Works on any NFC-enabled phone",
                "No app download required",
                "Complete ownership history"
            ]
        }
    ];

    return (
        <section className="w-full py-20 px-6 md:px-12 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto space-y-16 relative z-10">
                <div className="text-center space-y-4 max-w-3xl mx-auto">
                    <h2 className="font-playfair text-3xl md:text-4xl font-medium tracking-tight text-aether-dark">
                        Three Simple Steps to Secure Your Art
                    </h2>
                    <p className="font-cormorant text-xl text-aether-gray leading-relaxed">
                        From creation to verification, we&apos;ve made art authentication effortless
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {steps.map((step, index) => (
                        <Card key={index} className="border border-aether-gray/30 bg-white hover:border-aether-gold/50 transition-all duration-300">
                            <CardContent className="p-8 text-center space-y-6">
                                <div className="mx-auto w-16 h-16 rounded-full bg-aether-gold/10 flex items-center justify-center text-3xl font-libre font-bold text-aether-gold">
                                    {index + 1}
                                </div>
                                <h3 className="font-libre text-xl font-medium text-aether-dark">{step.title}</h3>
                                <p className="font-cormorant text-lg text-aether-dark leading-relaxed">{step.description}</p>
                                {step.bullets && (
                                    <div className="space-y-2 text-left">
                                        {step.bullets.map((bullet, i) => (
                                            <div key={i} className="flex items-center gap-2 text-sm font-cormorant text-aether-dark">
                                                <CheckCircle className="h-4 w-4 text-aether-gold flex-shrink-0" />
                                                <span>{bullet}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="text-center">
                    <p className="font-cormorant text-xl text-aether-gray mb-6 leading-relaxed">
                        With our streamlined platform, artists and collectors can authenticate and manage artworks securely and efficiently
                    </p>
                    <div className="flex items-center justify-center gap-2 text-sm font-cormorant text-aether-dark">
                        <CheckCircle className="h-4 w-4 text-aether-gold" />
                        <span>Transparent and secure system with all certificates recorded permanently in tamper-proof digital records</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
