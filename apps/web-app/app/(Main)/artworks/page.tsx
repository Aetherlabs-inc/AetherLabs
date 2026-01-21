import React from 'react';
import type { Metadata } from 'next';
import Artworks from '@/src/Artworks/Artworks';

export const metadata: Metadata = {
    title: "Artworks",
    description: "Manage your artwork collection with AetherLabs. Register, authenticate, and track all your artworks with NFC-enabled certificates of authenticity.",
    robots: {
        index: false,
        follow: false,
    },
};

const ArtworksPage: React.FC = () => {
    return (
        <div className="min-h-screen">
            <Artworks />
        </div>
    );
};

export default ArtworksPage;