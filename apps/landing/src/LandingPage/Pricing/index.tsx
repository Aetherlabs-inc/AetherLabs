'use client'

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

const Pricing = () => {
    const router = useRouter();
    
    const handleJoinWaitlist = () => {
        router.push('/waitlist');
    };
    
    const plans = [
        {
            name: "Artist",
            price: "Contact",
            period: "for details",
            description: "Perfect for solo creators",
            features: [
                "Up to 50 artworks/year",
                "50 NFC tags included",
                "Secure digital certificates",
                "Online portfolio",
                "Email support"
            ],
            buttonVariant: "outline" as const,
            popular: false
        },
        {
            name: "Studio",
            price: "Contact",
            period: "for details",
            description: "For growing studios",
            features: [
                "Up to 200 artworks/year",
                "200 NFC tags included",
                "Everything in Artist",
                "Bulk upload tools",
                "Priority support",
                "Advanced analytics"
            ],
            buttonVariant: "default" as const,
            popular: true
        },
        {
            name: "Gallery",
            price: "Contact",
            period: "for details",
            description: "For professional galleries",
            features: [
                "Unlimited artworks",
                "500 NFC tags included",
                "White-label certificates",
                "API access",
                "Dedicated support",
                "Custom branding",
                "Exhibition management"
            ],
            buttonVariant: "outline" as const,
            popular: false
        }
    ];

    return (
        <section id="pricing" className="w-full py-20 px-6 md:px-12 bg-white">
            <div className="max-w-7xl mx-auto space-y-16">
                <div className="text-center space-y-4 max-w-3xl mx-auto">
                    <h2 className="font-playfair text-3xl md:text-4xl font-medium tracking-tight text-aether-dark">
                        Early Access Pricing
                    </h2>
                    <p className="font-cormorant text-xl text-aether-gray leading-relaxed">
                        Contact us for early access pricing details. Be among the first to join!
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`p-6 rounded-xl border flex flex-col h-full ${plan.popular
                                ? "border-aether-gold/50 bg-white"
                                : "border-aether-gray/30 bg-white"
                                } transition-all duration-300 relative`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-aether-gold text-white text-sm rounded-full font-libre">
                                    Most Popular
                                </div>
                            )}

                            <div className="mb-auto">
                                <h3 className="font-libre text-2xl font-medium tracking-tight mb-1 text-aether-dark">{plan.name}</h3>

                                <div className="mb-4">
                                    <div className="flex items-baseline gap-2">
                                        <span className="font-playfair text-3xl font-medium tracking-tight text-aether-dark">{plan.price}</span>
                                    </div>
                                    {plan.period && <div className="font-cormorant text-lg text-aether-gray">{plan.period}</div>}
                                </div>

                                <p className="font-cormorant text-lg text-aether-gray mb-6 leading-relaxed">{plan.description}</p>

                                <div className="space-y-3 mb-8">
                                    {plan.features.map((feature, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className="h-5 w-5 rounded-full bg-aether-gold/20 flex items-center justify-center flex-shrink-0">
                                                <Check className="h-3 w-3 text-aether-gold" />
                                            </div>
                                            <span className="font-cormorant text-lg text-aether-dark">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-6">
                                <Button
                                    onClick={handleJoinWaitlist}
                                    className={
                                        plan.buttonVariant === "default"
                                            ? "w-full bg-aether-dark text-white hover:bg-aether-gold shadow-lg hover:shadow-xl font-libre"
                                            : "w-full border-aether-gray/30 text-aether-dark hover:bg-aether-gold/10 hover:border-aether-gold font-libre"
                                    }
                                    variant={plan.buttonVariant}
                                >
                                    Join Waitlist - Contact for Pricing
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center space-y-4">
                    <h3 className="font-playfair text-2xl font-medium tracking-tight text-aether-dark pt-4">
                        Ready to Protect Your Art?
                    </h3>
                    <p className="font-cormorant text-xl text-aether-gray max-w-2xl mx-auto leading-relaxed">
                        Join the waitlist and be among the first to authenticate your artwork with secure digital certificates and tamper-proof digital records.
                    </p>
                    <Button 
                        onClick={handleJoinWaitlist}
                        className="mt-4 bg-aether-dark text-white hover:bg-aether-gold shadow-lg hover:shadow-xl px-8 h-12 font-libre"
                    >
                        Join Waitlist - Be Among the First
                    </Button>
                    <div className="font-cormorant text-lg text-aether-gray pt-4">
                        Have questions? <a href="mailto:hello@aetherlabs.com" className="text-aether-gold hover:underline">Email us at hello@aetherlabs.com</a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Pricing;
