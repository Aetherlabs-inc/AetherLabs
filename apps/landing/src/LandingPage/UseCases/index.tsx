'use client'

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Palette, Building2, Gem } from 'lucide-react';

const UseCases = () => {
    const router = useRouter();

    const handleJoinWaitlist = () => {
        router.push('/waitlist');
    };

    const useCases = [
        {
            icon: <Palette className="h-8 w-8 text-aether-gold" />,
            title: "For Artists",
            description: "Build your professional portfolio and protect your work from day one. Increase resale value with verifiable authenticity.",
            features: [
                "Authenticate unlimited artworks",
                "Create stunning online portfolios",
                "Track where your art travels",
                "Receive royalties on resales"
            ],
            bgColor: "bg-aether-gold/5"
        },
        {
            icon: <Building2 className="h-8 w-8 text-aether-gold" />,
            title: "For Galleries",
            description: "Manage entire exhibitions with confidence. Provide buyers with instant proof of authenticity at point of sale.",
            features: [
                "Bulk authentication for exhibitions",
                "White-label certificates",
                "Integration with inventory systems",
                "Enhanced buyer confidence"
            ],
            bgColor: "bg-aether-gold/5"
        },
        {
            icon: <Gem className="h-8 w-8 text-aether-gold" />,
            title: "For Collectors",
            description: "Build and manage your collection with complete provenance records. Verify authenticity before you buy.",
            features: [
                "Instant verification before purchase",
                "Digital collection management",
                "Insurance documentation",
                "Easy resale with proven authenticity"
            ],
            bgColor: "bg-aether-gold/5"
        }
    ];

    return (
        <section className="w-full py-20 px-6 md:px-12 bg-white">
            <div className="max-w-7xl mx-auto space-y-16">
                <div className="text-center space-y-4 max-w-3xl mx-auto">
                    <h2 className="font-playfair text-3xl md:text-4xl font-medium tracking-tight text-aether-dark">
                        Built for Every Stage of the Art Journey
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {useCases.map((useCase, index) => (
                        <Card key={index} className={`border border-aether-gray/30 ${useCase.bgColor} hover:border-aether-gold/50 transition-all duration-300 bg-white`}>
                            <CardContent className="p-8 space-y-6">
                                <div className="w-16 h-16 rounded-full bg-aether-gold/10 flex items-center justify-center">
                                    {useCase.icon}
                                </div>
                                <h3 className="font-libre text-2xl font-medium text-aether-dark">{useCase.title}</h3>
                                <p className="font-cormorant text-lg text-aether-dark leading-relaxed">{useCase.description}</p>
                                <div className="space-y-3">
                                    {useCase.features.map((feature, i) => (
                                        <div key={i} className="flex items-center gap-2 font-cormorant text-lg text-aether-dark">
                                            <span className="text-aether-gold font-bold">•</span>
                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="text-center space-y-4 pt-8">
                    <h3 className="font-playfair text-2xl font-medium tracking-tight text-aether-dark">
                        Ready to protect your art journey?
                    </h3>
                    <p className="font-cormorant text-xl text-aether-gray max-w-2xl mx-auto leading-relaxed">
                        Join artists, galleries, and collectors who are securing their artwork with secure digital certificates and tamper-proof digital records.
                    </p>
                    <Button
                        onClick={handleJoinWaitlist}
                        className="mt-4 bg-aether-dark text-white hover:bg-aether-gold shadow-lg hover:shadow-xl px-8 h-12 font-libre"
                    >
                        Join Waitlist - Get Started Today
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default UseCases;
