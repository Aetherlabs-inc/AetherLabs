"use client";

import React, { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const Header = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 16);
        };

        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToWaitlist = () => {
        const waitlistSection = document.getElementById('waitlist');
        if (waitlistSection) {
            waitlistSection.scrollIntoView({ behavior: 'smooth' });
        }
        setMobileMenuOpen(false);
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
                isScrolled
                    ? "bg-white/80 backdrop-blur-md border-b border-aether-gray/10"
                    : "bg-transparent"
            )}
        >
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 md:h-20">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <span
                            aria-label="AetherLabs"
                            className={cn(
                                "inline-flex h-9 w-9 items-center justify-center rounded-lg font-playfair font-medium text-lg transition-all duration-300",
                                isScrolled
                                    ? "bg-aether-dark text-white"
                                    : "bg-aether-dark/90 text-white group-hover:bg-aether-dark"
                            )}
                        >
                            Æ
                        </span>
                        <span
                            className={cn(
                                "font-playfair text-lg tracking-tight transition-all duration-300",
                                isScrolled
                                    ? "text-aether-dark"
                                    : "text-aether-dark/90 group-hover:text-aether-dark"
                            )}
                        >
                            AetherLabs
                        </span>
                    </Link>

                    {/* Desktop CTA */}
                    <button
                        onClick={scrollToWaitlist}
                        className={cn(
                            "hidden md:inline-flex items-center px-5 py-2 rounded-lg font-libre text-sm transition-all duration-300",
                            isScrolled
                                ? "bg-aether-dark text-white hover:bg-aether-gold"
                                : "bg-aether-dark/90 text-white hover:bg-aether-dark"
                        )}
                    >
                        Join the waitlist
                    </button>

                    {/* Mobile menu button */}
                    <button
                        className="md:hidden p-2 -mr-2 text-aether-dark/70 hover:text-aether-dark transition-colors"
                        onClick={toggleMobileMenu}
                        aria-label="Toggle navigation"
                        aria-expanded={mobileMenuOpen}
                    >
                        {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            <div
                className={cn(
                    "md:hidden absolute top-full left-0 right-0 transition-all duration-300 overflow-hidden",
                    mobileMenuOpen
                        ? "max-h-40 opacity-100"
                        : "max-h-0 opacity-0"
                )}
            >
                <div className="bg-white/95 backdrop-blur-md border-b border-aether-gray/10 px-6 py-4">
                    <button
                        onClick={scrollToWaitlist}
                        className="w-full py-3 bg-aether-dark text-white font-libre text-sm rounded-lg
                                 hover:bg-aether-gold transition-colors"
                    >
                        Join the waitlist
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;