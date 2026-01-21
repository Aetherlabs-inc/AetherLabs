import React from "react";
import type { Metadata } from "next";
import LandingPage from "@/src/LandingPage";

export const metadata: Metadata = {
    title: "AetherLabs - Art Authentication Platform",
    description: "Bringing Authenticity to Creativity. AetherLabs provides NFC-enabled certificates of authenticity (COA) for artists, galleries, and collectors. Protect your artwork and verify authenticity with cutting-edge technology.",
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
        'art authentication platform',
        'art authentication service',
        'verify artwork',
        'authentic art'
    ],
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
};

export default function Home() {
  return (
    <div>
      <LandingPage />
    </div>
  );
}
