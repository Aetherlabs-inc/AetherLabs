import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Settings",
    description: "Manage your AetherLabs account settings, preferences, and security options.",
    robots: {
        index: false,
        follow: false,
    },
};

const SettingsPage: React.FC = () => {
    return (
        <div>
            <h1>Settings Page</h1>
            <p>This is a dummy settings page.</p>
        </div>
    );
};

export default SettingsPage;