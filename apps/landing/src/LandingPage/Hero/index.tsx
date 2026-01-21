"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

const Hero = () => {
    const [visibleLines, setVisibleLines] = useState<number[]>([]);

    useEffect(() => {
        const delays = [200, 500, 800, 1100, 1400];
        delays.forEach((delay, index) => {
            setTimeout(() => {
                setVisibleLines(prev => [...prev, index]);
            }, delay);
        });
    }, []);

    const scrollToWaitlist = () => {
        const waitlistSection = document.getElementById('waitlist');
        if (waitlistSection) {
            waitlistSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const isVisible = (index: number) => visibleLines.includes(index);

    return (
        <section className="relative min-h-screen flex items-center overflow-hidden bg-white">

            {/* Subtle texture overlay */}
            <div className="absolute inset-0 opacity-30 pointer-events-none">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(42,33,33,0.03) 1px, transparent 0)`,
                        backgroundSize: '40px 40px'
                    }}
                />
            </div>

            {/* Main container */}
            <div className="w-full max-w-[1800px] mx-auto px-6 md:px-12 lg:px-16 py-20 lg:py-0">
                <div className="flex flex-col lg:flex-row items-center min-h-screen">

                    {/* Left side - Text content */}
                    <div className="w-full lg:w-1/2 lg:pr-12 xl:pr-20 flex flex-col justify-center py-12 lg:py-0">

                        {/* Line 1 */}
                        <p
                            className={`font-cormorant text-3xl md:text-4xl xl:text-5xl text-aether-dark leading-relaxed mb-6
                                       transition-all duration-700 ease-out
                                       ${isVisible(0) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                        >
                            Every piece of art carries a story.
                        </p>

                        {/* Line 2 */}
                        <p
                            className={`font-cormorant text-xl md:text-2xl text-aether-gray leading-relaxed mb-8
                                       transition-all duration-700 ease-out
                                       ${isVisible(1) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                        >
                            Who made it. Who owned it. Where it&apos;s been.
                        </p>

                        {/* Line 3 - with provenance tooltip */}
                        <p
                            className={`font-cormorant text-xl md:text-2xl text-aether-dark leading-relaxed mb-8
                                       transition-all duration-700 ease-out
                                       ${isVisible(2) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                        >
                            This is called{' '}
                            <span className="relative inline-block group">
                                <span className="text-aether-gold font-medium border-b border-dotted border-aether-gold cursor-help">
                                    provenance
                                </span>
                                {/* Tooltip */}
                                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-4 py-3
                                                bg-aether-dark text-white text-base rounded-lg shadow-xl
                                                min-w-[280px] text-center z-50 font-cormorant leading-relaxed
                                                opacity-0 group-hover:opacity-100 transition-opacity duration-200
                                                pointer-events-none">
                                    The documented history of an artwork - who created it, who owned it, and how it changed hands over time.
                                    <span className="absolute top-full left-1/2 -translate-x-1/2 
                                                   border-8 border-transparent border-t-aether-dark" />
                                </span>
                            </span>
                            {' '}- the chain of ownership that follows a piece through time.
                        </p>

                        {/* Line 4 */}
                        <p
                            className={`font-playfair text-2xl md:text-3xl text-aether-dark leading-relaxed mb-12 font-medium
                                       transition-all duration-700 ease-out
                                       ${isVisible(3) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                        >
                            We built AetherLabs to protect it.
                        </p>

                        {/* CTA Button */}
                        <div
                            className={`transition-all duration-700 ease-out
                                       ${isVisible(4) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                        >
                            <button
                                onClick={scrollToWaitlist}
                                className="inline-block px-8 py-4 bg-aether-dark text-white font-libre text-lg
                                         rounded-lg hover:bg-aether-gold transition-colors duration-300
                                         shadow-lg hover:shadow-xl"
                            >
                                Join the waitlist
                            </button>
                        </div>
                    </div>

                    {/* Right side - Images at random positions */}
                    <div className="hidden lg:block w-1/2 h-screen relative">

                        {/* Image 1 - Top left area */}
                        <div
                            className="absolute rounded-xl overflow-hidden shadow-2xl"
                            style={{
                                top: '8%',
                                left: '55%',
                                width: '65%',
                                height: '38%',
                            }}
                        >
                            <Image
                                src="/IMG_6262-2.jpg"
                                alt="Artwork by Bandu Manamperi"
                                fill
                                className="object-cover"
                                sizes="25vw"
                                priority
                            />
                        </div>

                        {/* Image 2 - Top right area */}
                        <div
                            className="absolute rounded-xl overflow-hidden shadow-2xl"
                            style={{
                                top: '12%',
                                left: '-10%',
                                width: '38%',
                                height: '32%',
                            }}
                        >
                            <Image
                                src="/IMG_8423-2.jpg"
                                alt="Artwork by Bandu Manamperi"
                                fill
                                className="object-cover"
                                sizes="20vw"
                                priority
                            />
                        </div>

                        {/* Image 3 - Bottom left area */}
                        <div
                            className="absolute rounded-xl overflow-hidden shadow-2xl"
                            style={{
                                bottom: '18%',
                                left: '-10%',
                                width: '70%',
                                height: '34%',
                            }}
                        >
                            <Image
                                src="/IMG_8518.jpg"
                                alt="Artwork by Bandu Manamperi"
                                fill
                                className="object-cover"
                                sizes="22vw"
                            />
                        </div>

                        {/* Image 4 - Bottom right area */}
                        <div
                            className="absolute rounded-xl overflow-hidden shadow-2xl"
                            style={{
                                bottom: '8%',
                                right: '-24%',
                                width: '75%',
                                height: '30%',
                            }}
                        >
                            <Image
                                src="/IMG_8591-2.jpg"
                                alt="Artwork by Bandu Manamperi"
                                fill
                                className="object-cover"
                                sizes="22vw"
                            />
                        </div>

                    </div>
                </div>
            </div>

            {/* Scroll indicator - centered on mobile, left-aligned on desktop */}
            {/* <div
                className={`absolute bottom-8 left-1/2 lg:left-[25%] -translate-x-1/2 z-20
                           transition-all duration-700 ease-out delay-500
                           ${isVisible(4) ? 'opacity-100' : 'opacity-0'}`}
            >
                <div className="flex flex-col items-center gap-2">
                    <span className="font-libre text-sm text-aether-gray tracking-wide">Scroll</span>
                    <div className="w-6 h-10 border-2 border-aether-gray/50 rounded-full flex justify-center">
                        <div className="w-1 h-3 bg-aether-gray/50 rounded-full mt-2 animate-bounce" />
                    </div>
                </div>
            </div> */}
        </section>
    );
};

export default Hero;