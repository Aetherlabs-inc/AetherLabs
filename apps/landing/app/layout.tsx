import React from "react";
import type { Metadata } from "next";
import "./../styles/globals.css";
import NavBar from "@/src/NavBar";
import Footer from "@/src/Footer";
export const metadata: Metadata = {
    metadataBase: new URL('https://aetherlabs.art'),
    title: {
        default: "AetherLabs - Bringing Authenticity to Creativity",
        template: "%s | AetherLabs"
    },
    description: "AetherLabs is the premier platform for art authentication, providing NFC-enabled certificates of authenticity (COA) for artists, galleries, and collectors. Protect your artwork and verify authenticity with cutting-edge technology.",
    keywords: [
        'art authentication',
        'NFC certificates',
        'certificate of authenticity',
        'art verification',
        'artwork authentication',
        'art marketplace',
        'digital art certificates',
        'art provenance',
        'art collection management',
        'AetherLabs',
        'art security',
        'secure art certificates',
        'art authentication platform'
    ],
    authors: [{ name: 'AetherLabs Inc.' }],
    creator: 'AetherLabs Inc.',
    publisher: 'AetherLabs Inc.',
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://aetherlabs.art',
        siteName: 'AetherLabs',
        title: 'AetherLabs - Bringing Authenticity to Creativity',
        description: 'Premier platform for art authentication with NFC-enabled certificates of authenticity. Protect and verify artwork with cutting-edge technology.',
        images: [
            {
                url: '/AetherLabs-logo.png',
                width: 1200,
                height: 630,
                alt: 'AetherLabs - Art Authentication Platform',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'AetherLabs - Bringing Authenticity to Creativity',
        description: 'Premier platform for art authentication with NFC-enabled certificates of authenticity.',
        creator: '@AetherLabs',
        site: '@AetherLabs',
        images: ['/AetherLabs-logo.png'],
    },
    alternates: {
        canonical: 'https://aetherlabs.art',
    },
    category: 'art technology',
    classification: 'Art Authentication Platform',
    icons: {
        icon: [
            { url: '/AetherLabs-logo.png', type: 'image/png' },
        ],
        shortcut: '/AetherLabs-logo.png',
        apple: '/AetherLabs-logo.png',
    },
};



export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link rel="stylesheet" href="https://use.typekit.net/gtt1ipu.css"></link>
            </head>
            <body className="flex flex-col">
                <main className="">
                    <NavBar />
                    {children}
                    <Footer />
                </main>
            </body>

        </html>
    );
}
