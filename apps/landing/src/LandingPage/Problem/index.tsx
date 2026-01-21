"use client";

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { FileX, Clock, Unlink } from 'lucide-react';

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

const Problem = () => {
    const problems = [
        {
            icon: <FileX size={32} className="text-aether-terracotta" />,
            title: "Paper fails",
            description:
                "Signatures can be copied. Stamps can be forged. A decent printer and some fancy paper is all it takes to fake a certificate. And buyers can't tell the difference.",
        },
        {
            icon: <Clock size={32} className="text-aether-terracotta" />,
            title: "Time erases",
            description:
                "Paper yellows. Ink fades. Documents get lost in moves, floods, forgotten boxes. In 20 years, how will anyone prove what's real?",
        },
        {
            icon: <Unlink size={32} className="text-aether-terracotta" />,
            title: "Stories disappear",
            description:
                "Your art travels the world, but documentation doesn't follow. After decades of sales and transfers, the chain breaks. The history vanishes.",
        },
    ];

    // Floating art images
    const artImages = [
        {
            src: '/IMG_6262-2.jpg',
            alt: 'Artwork 1',
            size: 'w-48 h-64 md:w-64 md:h-80',
            position: { top: '15%', left: '15%' },
            floatDuration: 6,
            delay: 0.2
        },
        {
            src: '/IMG_8423-2.jpg',
            alt: 'Artwork 2',
            size: 'w-40 h-56 md:w-56 md:h-72',
            position: { top: '60%', right: '3%' },
            floatDuration: 7,
            delay: 0.5
        },
        {
            src: '/IMG_8591-2.jpg',
            alt: 'Artwork 3',
            size: 'w-44 h-60 md:w-52 md:h-68',
            position: { bottom: '10%', left: '8%' },
            floatDuration: 6.5,
            delay: 0.3
        }
    ];

    return (
        <section className="relative w-full py-24 md:py-32 px-6 md:px-12 bg-white overflow-hidden">

            {/* Floating Art Images - hidden on mobile */}
            {artImages.map((art, index) => (
                <div
                    key={index}
                    className="absolute hidden lg:block pointer-events-none z-0"
                    style={{
                        ...art.position,
                    }}
                >
                    <div
                        className={`${art.size} relative rounded-lg overflow-hidden bg-white 
                                   shadow-[0_25px_80px_rgba(0,0,0,0.12)] border border-gray-100`}
                        style={{
                            animation: `float ${art.floatDuration}s ease-in-out infinite ${art.delay}s`,
                        }}
                    >
                        <Image
                            src={art.src}
                            alt={art.alt}
                            fill
                            className="object-cover opacity-60"
                            sizes="(max-width: 1024px) 0px, 300px"
                        />
                    </div>
                </div>
            ))}

            {/* Float animation */}
            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-15px); }
                }
            `}</style>

            <div className="relative z-10 max-w-5xl mx-auto">

                {/* Section Header */}
                <div className="text-center mb-16 md:mb-20">
                    <FadeInElement delay={0}>
                        <span className="inline-block text-sm font-libre tracking-widest uppercase text-aether-gray mb-6">
                            The Problem
                        </span>
                    </FadeInElement>

                    <FadeInElement delay={100}>
                        <h2 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-medium text-aether-dark mb-6 max-w-2xl mx-auto leading-tight">
                            Your art deserves better than a piece of paper
                        </h2>
                    </FadeInElement>

                    <FadeInElement delay={200}>
                        <p className="font-cormorant text-xl md:text-2xl text-aether-gray leading-relaxed max-w-2xl mx-auto">
                            For over a century, we have trusted paper certificates to prove authenticity.
                            A signature. A stamp. A promise.
                        </p>
                    </FadeInElement>

                    <FadeInElement delay={300}>
                        <p className="font-playfair text-xl md:text-2xl text-aether-terracotta leading-relaxed mt-4 italic">
                            But paper was never built to last.
                        </p>
                    </FadeInElement>
                </div>

                {/* Problem Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
                    {problems.map((problem, index) => (
                        <FadeInElement key={index} delay={400 + (index * 150)}>
                            <div className="flex flex-col space-y-4 bg-white p-8 rounded-2xl 
                                          border border-aether-gray/20 hover:border-aether-terracotta/30 
                                          transition-all duration-300 h-full">
                                <div className="w-14 h-14 rounded-full bg-aether-terracotta/10 
                                              flex items-center justify-center">
                                    {problem.icon}
                                </div>
                                <h3 className="font-libre text-xl font-medium text-aether-dark">
                                    {problem.title}
                                </h3>
                                <p className="font-cormorant text-lg text-aether-dark/80 leading-relaxed">
                                    {problem.description}
                                </p>
                            </div>
                        </FadeInElement>
                    ))}
                </div>

                {/* Closing statement */}
                <FadeInElement delay={850} className="text-center mt-16 md:mt-20">
                    <p className="font-cormorant text-xl md:text-2xl text-aether-dark leading-relaxed max-w-2xl mx-auto">
                        When the proof disappears, the story disappears with it.
                    </p>
                    <p className="font-cormorant text-lg text-aether-gray leading-relaxed mt-3">
                        The art is still beautiful. But something is missing.
                    </p>
                    <p className="font-playfair text-lg text-aether-dark leading-relaxed mt-3 font-medium">
                        Its identity. Its history. Its value.
                    </p>
                </FadeInElement>
            </div>
        </section>
    );
};

export default Problem;