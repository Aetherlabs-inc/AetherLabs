"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Smartphone, Shield, Fingerprint, Palette, Building2, TrendingUp, Gem } from 'lucide-react';

// Animated element that fades in on scroll
const FadeInElement = ({
    children,
    delay = 0,
    className = ''
}: {
    children: React.ReactNode;
    delay?: number;
    className?: string;
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setTimeout(() => setIsVisible(true), delay);
                    observer.unobserve(entry.target);
                }
            },
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [delay]);

    return (
        <div
            ref={ref}
            className={`transition-all duration-700 ease-out ${className}`}
            style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : 'translateY(24px)',
            }}
        >
            {children}
        </div>
    );
};

// Tooltip component
const Tooltip = ({ children, content }: { children: React.ReactNode; content: string }) => {
    return (
        <span className="relative inline-block group">
            <span className="text-aether-gold font-medium border-b border-dotted border-aether-gold cursor-help">
                {children}
            </span>
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-4 py-3
                           bg-aether-dark text-white text-base rounded-lg shadow-xl
                           min-w-[260px] text-center z-50 font-cormorant leading-relaxed
                           opacity-0 group-hover:opacity-100 transition-opacity duration-200
                           pointer-events-none">
                {content}
                <span className="absolute top-full left-1/2 -translate-x-1/2 
                               border-8 border-transparent border-t-aether-dark" />
            </span>
        </span>
    );
};

// NFC Tap Diagram Component
const NFCDiagram = () => {
    return (
        <div className="relative w-full max-w-lg mx-auto">
            {/* Phone */}
            <div className="relative mx-auto w-48 h-80 bg-gradient-to-b from-gray-800 to-gray-900 rounded-[2.5rem] p-2 shadow-2xl">
                {/* Phone screen */}
                <div className="w-full h-full bg-white rounded-[2rem] overflow-hidden relative">
                    {/* Screen content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                        {/* Verification animation circles */}
                        <div className="relative w-20 h-20 mb-4">
                            <div className="absolute inset-0 rounded-full border-2 border-aether-gold/30 animate-ping" />
                            <div className="absolute inset-2 rounded-full border-2 border-aether-gold/50 animate-ping" style={{ animationDelay: '0.2s' }} />
                            <div className="absolute inset-4 rounded-full bg-aether-gold/10 flex items-center justify-center">
                                <Shield className="w-8 h-8 text-aether-gold" />
                            </div>
                        </div>
                        <p className="font-libre text-sm text-aether-dark font-medium">Verified</p>
                        <p className="font-cormorant text-xs text-aether-gray mt-1">Authentic Artwork</p>
                    </div>
                </div>
                {/* Phone notch */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-6 bg-gray-900 rounded-full" />
            </div>

            {/* NFC Tag */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 translate-y-full">
                <div className="relative">
                    {/* Signal waves */}
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
                        <div className="w-8 h-1 bg-aether-gold/60 rounded-full animate-pulse" />
                        <div className="w-12 h-1 bg-aether-gold/40 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }} />
                        <div className="w-16 h-1 bg-aether-gold/20 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                    </div>

                    {/* Tag */}
                    <div className="w-24 h-24 bg-gradient-to-br from-aether-gold/20 to-aether-terracotta/20 
                                  rounded-2xl border-2 border-aether-gold/30 flex items-center justify-center
                                  shadow-lg">
                        <div className="text-center">
                            <div className="w-10 h-10 mx-auto mb-1 rounded-full bg-aether-gold/20 
                                          flex items-center justify-center">
                                <Smartphone className="w-5 h-5 text-aether-gold" />
                            </div>
                            <p className="font-libre text-xs text-aether-dark">NFC Tag</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tap instruction */}
            <div className="absolute -right-4 top-1/2 -translate-y-1/2 translate-x-full hidden lg:block">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-[2px] bg-aether-gold/50" />
                    <p className="font-cormorant text-lg text-aether-gray italic">Just tap</p>
                </div>
            </div>
        </div>
    );
};

const Solution = () => {
    const howItWorks = [
        {
            icon: <Fingerprint size={32} className="text-aether-gold" />,
            step: "01",
            title: "Register",
            description: "Upload your artwork details and images. We create a unique digital certificate stored permanently in secure records.",
            highlights: ["2 minute setup", "Permanent record", "High-res images"]
        },
        {
            icon: <Smartphone size={32} className="text-aether-gold" />,
            step: "02",
            title: "Attach",
            description: "Place a small NFC tag on your artwork or frame. It links directly to the certificate and works through glass.",
            highlights: ["Water resistant", "Tamper evident", "Works through frames"]
        },
        {
            icon: <Shield size={32} className="text-aether-gold" />,
            step: "03",
            title: "Verify",
            description: "Anyone with a smartphone can tap and instantly see the full history. No app needed. No account required.",
            highlights: ["Instant verification", "No app needed", "Full provenance"]
        }
    ];

    const userGroups = [
        {
            icon: <Palette size={28} className="text-aether-gold" />,
            title: "Artists",
            tagline: "You pour yourself into your work.",
            description: "Protect it, build your portfolio, and follow your pieces wherever they go.",
            color: "#BC8010",
            features: ["Authenticate unlimited works", "Track where your art travels", "Build verified portfolio"]
        },
        {
            icon: <Building2 size={28} className="text-aether-gold" />,
            title: "Galleries",
            tagline: "Trust is your currency.",
            description: "Authenticate every sale and show collectors the proof they need.",
            color: "#BC8010",
            features: ["Bulk authentication", "Exhibition management", "Instant buyer confidence"]
        },
        {
            icon: <TrendingUp size={28} className="text-aether-terracotta" />,
            title: "Dealers",
            tagline: "One bad piece can cost everything.",
            description: "Verify before you buy. Complete history. No surprises.",
            color: "#CA5B2B",
            features: ["Pre-purchase verification", "Complete provenance", "Risk protection"]
        },
        {
            icon: <Gem size={28} className="text-aether-gold" />,
            title: "Collectors",
            tagline: "Your collection tells a story.",
            description: "Own it with proof. Every piece verified, every history preserved.",
            color: "#BC8010",
            features: ["Digital collection", "Insurance documentation", "Verified resale"]
        }
    ];

    return (
        <section className="relative w-full py-24 md:py-32 px-6 md:px-12 bg-white overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Texture */}
                <div
                    className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(188,128,16,0.05) 1px, transparent 0)`,
                        backgroundSize: '48px 48px'
                    }}
                />
                {/* Gradient blobs */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-aether-gold/5 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-aether-terracotta/5 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                              w-[900px] h-[900px] bg-aether-gold/3 rounded-full blur-3xl" />
            </div>

            {/* Decorative lines */}
            <div className="absolute top-32 left-8 w-32 h-[1px] bg-gradient-to-r from-aether-gold/30 to-transparent hidden lg:block" />
            <div className="absolute top-32 right-8 w-32 h-[1px] bg-gradient-to-l from-aether-gold/30 to-transparent hidden lg:block" />
            <div className="absolute bottom-32 left-8 w-48 h-[1px] bg-gradient-to-r from-aether-terracotta/20 to-transparent hidden lg:block" />
            <div className="absolute bottom-32 right-8 w-48 h-[1px] bg-gradient-to-l from-aether-terracotta/20 to-transparent hidden lg:block" />

            <div className="relative z-10 max-w-7xl mx-auto">

                {/* Section Header */}
                <div className="text-center mb-16 md:mb-20">
                    <FadeInElement delay={0}>
                        <span className="inline-block text-sm font-libre tracking-widest uppercase text-aether-gray mb-6">
                            The Solution
                        </span>
                    </FadeInElement>

                    <FadeInElement delay={100}>
                        <p className="font-playfair text-2xl md:text-3xl text-aether-gold leading-relaxed italic mb-6">
                            There&apos;s a better way.
                        </p>
                    </FadeInElement>

                    <FadeInElement delay={200}>
                        <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-medium text-aether-dark mb-6 max-w-3xl mx-auto leading-tight">
                            A certificate that lives with your art
                        </h2>
                    </FadeInElement>

                    <FadeInElement delay={300}>
                        <p className="font-cormorant text-xl md:text-2xl text-aether-dark leading-relaxed max-w-2xl mx-auto">
                            We built AetherLabs to protect what paper can not. A digital{' '}
                            <Tooltip content="A document that confirms an artwork is genuine, usually signed by the artist or an authority.">
                                certificate of authenticity
                            </Tooltip>
                            {' '}that stays with the piece itself.
                        </p>
                    </FadeInElement>
                </div>

                {/* NFC Diagram Section */}
                <FadeInElement delay={400} className="mb-20 md:mb-28">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                        {/* Left: Explanation */}
                        <div className="space-y-6 order-2 lg:order-1">
                            <h3 className="font-playfair text-2xl md:text-3xl font-medium text-aether-dark">
                                Tap to verify. That&apos;s it.
                            </h3>
                            <p className="font-cormorant text-xl text-aether-dark/80 leading-relaxed">
                                Every artwork gets a small{' '}
                                <Tooltip content="Near Field Communication. A technology that lets devices share information with a simple tap.">
                                    NFC
                                </Tooltip>
                                {' '}tag. A tap from any smartphone reveals everything: the artist, the history, the proof.
                            </p>
                            <p className="font-cormorant text-xl text-aether-dark/80 leading-relaxed">
                                No app to download. No account to create. No friction.
                            </p>
                            <p className="font-cormorant text-xl text-aether-dark/80 leading-relaxed">
                                The record is{' '}
                                <Tooltip content="Protected using advanced math that makes the data nearly impossible to fake or alter.">
                                    cryptographically secured
                                </Tooltip>
                                . It can not be forged. It can not be lost. It stays with the art, always.  
                            </p>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-aether-gray/20">
                                <div className="text-center">
                                    <p className="font-playfair text-3xl text-aether-gold font-medium">2s</p>
                                    <p className="font-cormorant text-sm text-aether-gray">to verify</p>
                                </div>
                                <div className="text-center">
                                    <p className="font-playfair text-3xl text-aether-gold font-medium">0</p>
                                    <p className="font-cormorant text-sm text-aether-gray">apps needed</p>
                                </div>
                                <div className="text-center">
                                    <p className="font-playfair text-3xl text-aether-gold font-medium">∞</p>
                                    <p className="font-cormorant text-sm text-aether-gray">years secure</p>
                                </div>
                            </div>
                        </div>

                        {/* Right: Diagram */}
                        <div className="order-1 lg:order-2 py-8 lg:py-0">
                            <NFCDiagram />
                        </div>
                    </div>
                </FadeInElement>

                {/* How It Works Cards */}
                <div className="mb-20 md:mb-28">
                    <FadeInElement delay={500}>
                        <h3 className="font-libre text-lg text-aether-gray text-center mb-12 tracking-wide uppercase">
                            How it works
                        </h3>
                    </FadeInElement>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                        {howItWorks.map((step, index) => (
                            <FadeInElement key={index} delay={600 + (index * 150)}>
                                <div className="relative bg-white p-8 rounded-2xl border border-aether-gray/20 
                                              hover:border-aether-gold/40 transition-all duration-300 h-full
                                              shadow-sm hover:shadow-lg group">
                                    {/* Step number */}
                                    <div className="absolute -top-4 -right-4 w-12 h-12 bg-aether-gold/10 
                                                  rounded-full flex items-center justify-center
                                                  group-hover:bg-aether-gold/20 transition-colors">
                                        <span className="font-libre text-sm font-medium text-aether-gold">
                                            {step.step}
                                        </span>
                                    </div>

                                    {/* Icon */}
                                    <div className="w-16 h-16 rounded-2xl bg-aether-gold/10 
                                                  flex items-center justify-center mb-6
                                                  group-hover:bg-aether-gold/15 transition-colors">
                                        {step.icon}
                                    </div>

                                    {/* Content */}
                                    <h4 className="font-libre text-xl font-medium text-aether-dark mb-3">
                                        {step.title}
                                    </h4>
                                    <p className="font-cormorant text-lg text-aether-dark/80 leading-relaxed mb-6">
                                        {step.description}
                                    </p>

                                    {/* Highlights */}
                                    <div className="flex flex-wrap gap-2">
                                        {step.highlights.map((highlight, i) => (
                                            <span
                                                key={i}
                                                className="px-3 py-1 bg-aether-gold/5 rounded-full
                                                         font-cormorant text-sm text-aether-dark/70"
                                            >
                                                {highlight}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </FadeInElement>
                        ))}
                    </div>
                </div>

                {/* User Groups */}
                <div className="mb-16">
                    <FadeInElement delay={1050}>
                        <h3 className="font-libre text-lg text-aether-gray text-center mb-4 tracking-wide uppercase">
                            Built for everyone in the art world
                        </h3>
                        <p className="font-cormorant text-xl text-aether-dark/70 text-center mb-12 max-w-2xl mx-auto">
                            Whether you create, curate, trade, or collect, AetherLabs protects what matters.
                        </p>
                    </FadeInElement>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {userGroups.map((group, index) => (
                            <FadeInElement key={index} delay={1150 + (index * 100)}>
                                <div
                                    className="relative bg-white p-6 rounded-2xl border border-aether-gray/20 
                                              hover:border-opacity-50 transition-all duration-300 h-full
                                              shadow-sm hover:shadow-lg group"
                                    style={{
                                        '--hover-color': group.color,
                                    } as React.CSSProperties}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = group.color + '50';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = '';
                                    }}
                                >
                                    {/* Top accent line */}
                                    <div
                                        className="absolute top-0 left-6 right-6 h-[3px] rounded-full opacity-0 
                                                  group-hover:opacity-100 transition-opacity"
                                        style={{ backgroundColor: group.color }}
                                    />

                                    {/* Icon */}
                                    <div
                                        className="w-14 h-14 rounded-xl flex items-center justify-center mb-5"
                                        style={{ backgroundColor: group.color + '15' }}
                                    >
                                        {group.icon}
                                    </div>

                                    {/* Content */}
                                    <h4
                                        className="font-libre text-lg font-medium mb-2"
                                        style={{ color: group.color }}
                                    >
                                        {group.title}
                                    </h4>
                                    <p className="font-cormorant text-lg text-aether-dark font-medium mb-2">
                                        {group.tagline}
                                    </p>
                                    <p className="font-cormorant text-base text-aether-dark/70 leading-relaxed mb-5">
                                        {group.description}
                                    </p>

                                    {/* Features */}
                                    <div className="space-y-2">
                                        {group.features.map((feature, i) => (
                                            <div key={i} className="flex items-center gap-2">
                                                <div
                                                    className="w-1.5 h-1.5 rounded-full"
                                                    style={{ backgroundColor: group.color }}
                                                />
                                                <span className="font-cormorant text-sm text-aether-dark/70">
                                                    {feature}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </FadeInElement>
                        ))}
                    </div>
                </div>

                {/* Closing statement */}
                <FadeInElement delay={1550} className="text-center">
                    <div className="max-w-2xl mx-auto py-12 px-8 rounded-3xl bg-gradient-to-b from-aether-gold/5 to-transparent
                                  border border-aether-gold/10">
                        <p className="font-playfair text-2xl md:text-3xl text-aether-dark leading-relaxed font-medium">
                            Your art&apos;s story, preserved. Permanently.       
                        </p>
                    </div>
                </FadeInElement>
            </div>
        </section>
    );
};

export default Solution;