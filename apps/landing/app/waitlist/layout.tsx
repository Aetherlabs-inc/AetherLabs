import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Join the Waitlist",
    description: "Join the AetherLabs waitlist and be among the first to experience NFC-enabled art authentication. Sign up as an artist, collector, or gallery to get early access.",
    keywords: [
        'AetherLabs waitlist',
        'art authentication waitlist',
        'early access',
        'NFC art certificates',
        'art authentication platform',
        'join waitlist',
        'art technology',
        'AetherLabs beta'
    ],
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://aetherlabs.art/waitlist',
        siteName: 'AetherLabs',
        title: 'Join the Waitlist | AetherLabs',
        description: 'Join the AetherLabs waitlist and be among the first to experience NFC-enabled art authentication.',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Join the Waitlist | AetherLabs',
        description: 'Join the AetherLabs waitlist and be among the first to experience NFC-enabled art authentication.',
        creator: '@AetherLabs',
        site: '@AetherLabs',
    },
    alternates: {
        canonical: 'https://aetherlabs.art/waitlist',
    },
};

export default function WaitlistLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <>{children}</>;
}

