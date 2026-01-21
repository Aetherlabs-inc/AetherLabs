import React from 'react';
import Link from 'next/link';

const Footer = () => {
    const year = new Date().getFullYear();

    return (
        <footer className="w-full py-12 px-6 md:px-12 bg-white">
            <div className="max-w-5xl mx-auto">
                <div className="flex flex-col items-center space-y-8">

                    {/* Logo - smaller, lighter */}
                    <Link href="/" className="flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-aether-dark text-white font-playfair text-sm">
                            Æ
                        </span>
                        <span className="font-playfair text-base tracking-tight text-aether-dark">
                            AetherLabs
                        </span>
                    </Link>

                    {/* Social links - subtle */}
                    <div className="flex items-center gap-4">
                        <a
                            href="https://x.com/aetherlabs"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="AetherLabs on X"
                            className="h-9 w-9 rounded-full flex items-center justify-center text-aether-gray/60 
                                     hover:text-aether-gold transition-colors"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                            </svg>
                        </a>
                        <a
                            href="https://instagram.com/aetherlabs"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="AetherLabs on Instagram"
                            className="h-9 w-9 rounded-full flex items-center justify-center text-aether-gray/60 
                                     hover:text-aether-gold transition-colors"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                                <rect x="2" y="2" width="20" height="20" rx="5" />
                                <circle cx="12" cy="12" r="4" />
                                <circle cx="18" cy="6" r="1.5" fill="currentColor" stroke="none" />
                            </svg>
                        </a>
                        <a
                            href="https://linkedin.com/company/aetherlabs"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="AetherLabs on LinkedIn"
                            className="h-9 w-9 rounded-full flex items-center justify-center text-aether-gray/60 
                                     hover:text-aether-gold transition-colors"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                            </svg>
                        </a>
                    </div>

                    {/* Divider */}
                    <div className="w-16 h-[1px] bg-aether-gray/20" />

                    {/* Legal links and copyright - very subtle */}
                    <div className="flex flex-col md:flex-row items-center gap-3 md:gap-6 text-sm">
                        <div className="flex items-center gap-4 font-cormorant text-aether-gray/50">
                            <Link
                                href="/terms"
                                className="hover:text-aether-dark transition-colors"
                            >
                                Terms
                            </Link>
                            <span className="text-aether-gray/30">·</span>
                            <Link
                                href="/privacy"
                                className="hover:text-aether-dark transition-colors"
                            >
                                Privacy
                            </Link>
                        </div>
                        <span className="hidden md:inline text-aether-gray/30">·</span>
                        <span className="font-cormorant text-aether-gray/40">
                            © {year} AetherLabs
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;