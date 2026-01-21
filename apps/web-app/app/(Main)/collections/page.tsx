import ComingSoon from '@/components/ComingSoon';
import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Collections",
    description: "Organize and manage your art collections with AetherLabs. Create curated collections of authenticated artwork.",
    robots: {
        index: false,
        follow: false,
    },
};

const CollectionsPage: React.FC = () => {
    return (
        <div>
            <ComingSoon />
        </div>
    );
};

export default CollectionsPage;