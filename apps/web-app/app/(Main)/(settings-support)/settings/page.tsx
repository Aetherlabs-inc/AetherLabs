import type { Metadata } from 'next';
import SettingsPageClient from '@/src/features/settings/SettingsPageClient';

export const metadata: Metadata = {
    title: "Settings",
    description: "Manage your AetherLabs account settings, preferences, and security options.",
    robots: {
        index: false,
        follow: false,
    },
};

export default function SettingsPage() {
    return <SettingsPageClient />;
}
