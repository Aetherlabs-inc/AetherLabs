import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Help & Support",
    description: "Get help and support for using AetherLabs. Find answers to common questions about art authentication, NFC certificates, and platform features.",
    robots: {
        index: false,
        follow: false,
    },
};

const SupportPage: React.FC = () => {
    return (
        <div>
            <h1>Support Page</h1>
            <p>This is a dummy support page.</p>
        </div>
    );
};

export default SupportPage;