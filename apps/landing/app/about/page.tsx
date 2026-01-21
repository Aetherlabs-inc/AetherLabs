import React from "react";
import type { Metadata } from "next";
import AboutAetherLabs from "@/src/about";

export const metadata: Metadata = {
    title: "About Us",
    description: "Learn about AetherLabs - our mission to bring authenticity to creativity through NFC-enabled art authentication technology. Discover how we're revolutionizing art verification.",
    keywords: [
        'about AetherLabs',
        'art authentication company',
        'NFC art technology',
        'art verification platform',
        'certificate of authenticity',
        'art authentication mission',
        'AetherLabs story',
        'art technology company'
    ],
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://aetherlabs.art/about',
        siteName: 'AetherLabs',
        title: 'About Us | AetherLabs',
        description: 'Learn about AetherLabs - our mission to bring authenticity to creativity through NFC-enabled art authentication technology.',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'About Us | AetherLabs',
        description: 'Learn about AetherLabs - our mission to bring authenticity to creativity through NFC-enabled art authentication technology.',
        creator: '@AetherLabs',
        site: '@AetherLabs',
    },
    alternates: {
        canonical: 'https://aetherlabs.art/about',
    },
};

export default function About() {
    return (
        <div>
            <AboutAetherLabs />
        </div>
    );
}
