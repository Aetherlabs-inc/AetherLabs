'use client'

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Sparkles, Network, Heart, ArrowRight } from 'lucide-react';

const Community = () => {
    const router = useRouter();

    const handleJoinWaitlist = () => {
        router.push('/waitlist');
    };

    const communityPillars = [
        {
            icon: <Sparkles className="h-6 w-6 text-aether-gold" />,
            title: "Empowering Artists",
            description: "Give artists the tools and platform to protect their work, build their reputation, and connect directly with collectors and galleries.",
            color: "from-aether-gold/20 to-aether-terracotta/20"
        },
        {
            icon: <Network className="h-6 w-6 text-aether-gold" />,
            title: "Connecting Collectors",
            description: "Build trust and transparency in the art market. Collectors can verify authenticity instantly and discover new artists through our network.",
            color: "from-aether-gold/20 to-aether-terracotta/20"
        },
        {
            icon: <Users className="h-6 w-6 text-aether-gold" />,
            title: "Supporting Galleries",
            description: "Galleries can showcase authenticated works, build buyer confidence, and streamline their operations with our platform.",
            color: "from-aether-gold/20 to-aether-terracotta/20"
        }
    ];

    const connections = [
        {
            from: "Artists",
            to: "Galleries",
            description: "Direct connections for exhibitions and sales"
        },
        {
            from: "Collectors",
            to: "Artists",
            description: "Discover and support emerging talent"
        },
        {
            from: "Galleries",
            to: "Collectors",
            description: "Trusted marketplace with verified authenticity"
        }
    ];

    return (
        <section className="w-full py-20 md:py-24 px-6 md:px-12 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto relative z-10 space-y-16">
                {/* Header Section */}
                <div className="text-center space-y-6 max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-aether-gold/10 border border-aether-gold/20">
                        <Heart className="h-4 w-4 text-aether-gold" />
                        <span className="text-sm font-libre text-aether-dark">More Than Authentication</span>
                    </div>

                    <h2 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-aether-dark">
                        Building a Connected
                        <span className="block text-aether-gold italic">Art Community</span>
                    </h2>

                    <p className="font-cormorant text-xl md:text-2xl text-aether-gray leading-relaxed max-w-3xl mx-auto">
                        AetherLabs isn&apos;t just about protecting art—it&apos;s about empowering artists,
                        connecting collectors, and supporting galleries. We&apos;re building the infrastructure
                        for a more transparent, accessible, and vibrant art ecosystem.
                    </p>
                </div>

                {/* Three Pillars */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                    {communityPillars.map((pillar, index) => (
                        <Card
                            key={index}
                            className="group border border-aether-gray/30 hover:border-aether-gold/50 transition-all duration-300 overflow-hidden bg-white"
                        >
                            <CardContent className="p-8 space-y-4 text-center">
                                <div className="w-16 h-16 rounded-full bg-aether-gold/10 flex items-center justify-center mx-auto">
                                    {pillar.icon}
                                </div>
                                <h3 className="font-libre text-xl font-medium text-aether-dark">{pillar.title}</h3>
                                <p className="font-cormorant text-lg text-aether-dark leading-relaxed">{pillar.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Connection Flow */}
                <div className="space-y-8">
                    <div className="text-center">
                        <h3 className="font-playfair text-2xl md:text-3xl font-medium tracking-tight text-aether-dark mb-3">
                            Connecting the Art World
                        </h3>
                        <p className="font-cormorant text-xl text-aether-gray max-w-2xl mx-auto leading-relaxed">
                            Our platform creates meaningful connections between all participants in the art ecosystem
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {connections.map((connection, index) => (
                            <div
                                key={index}
                                className="relative p-6 rounded-xl border border-aether-gray/30 bg-white hover:border-aether-gold/50 transition-all duration-300"
                            >
                                <div className="flex items-center justify-center gap-3 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-aether-gold/10 flex items-center justify-center">
                                        <Network className="h-5 w-5 text-aether-gold" />
                                    </div>
                                    <div className="text-center">
                                        <div className="font-libre font-medium text-aether-dark">{connection.from}</div>
                                        <ArrowRight className="h-4 w-4 text-aether-gray mx-auto my-1" />
                                        <div className="font-libre font-medium text-aether-dark">{connection.to}</div>
                                    </div>
                                </div>
                                <p className="font-cormorant text-lg text-aether-gray text-center leading-relaxed">{connection.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA Section */}
                <div className="text-center space-y-6 pt-8">
                    <div className="space-y-3">
                        <h3 className="font-playfair text-2xl md:text-3xl font-medium tracking-tight text-aether-dark">
                            Join the Movement
                        </h3>
                        <p className="font-cormorant text-xl text-aether-gray max-w-2xl mx-auto leading-relaxed">
                            Be part of a community that&apos;s revolutionizing how art is authenticated,
                            collected, and shared. Together, we&apos;re building the future of the art world.
                        </p>
                    </div>
                    <Button
                        onClick={handleJoinWaitlist}
                        className="bg-aether-dark text-white hover:bg-aether-gold shadow-lg hover:shadow-xl px-8 h-12 font-libre"
                    >
                        Join the Community
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default Community;
