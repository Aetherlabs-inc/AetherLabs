import ComingSoon from '@/components/ComingSoon';
import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Exhibitions",
    description: "Manage and view your art exhibitions with AetherLabs. Create and organize exhibitions featuring authenticated artwork.",
    robots: {
        index: false,
        follow: false,
    },
};

const ExhibitionsPage: React.FC = () => {
    return (
        <ComingSoon />
    );
};

export default ExhibitionsPage;