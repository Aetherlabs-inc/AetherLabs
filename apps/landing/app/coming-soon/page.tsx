import React from "react";
import type { Metadata } from "next";
import ComingSoon from "@/src/ComingSoon";

export const metadata: Metadata = {
    title: "Coming Soon | AetherLabs",
    description: "We're working hard to bring you something amazing. This page will be available soon!",
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://aetherlabs.art/coming-soon',
        siteName: 'AetherLabs',
        title: 'Coming Soon | AetherLabs',
        description: "We're working hard to bring you something amazing. This page will be available soon!",
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Coming Soon | AetherLabs',
        description: "We're working hard to bring you something amazing. This page will be available soon!",
    },
};

export default function ComingSoonPage() {
    return <ComingSoon />;
}

