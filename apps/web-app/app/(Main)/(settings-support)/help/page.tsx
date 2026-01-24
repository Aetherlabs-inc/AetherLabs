import type { Metadata } from 'next';
import SupportPage from '@/src/features/support/SupportPage';

export const metadata: Metadata = {
    title: "Help & Support",
    description: "Get help and support for using AetherLabs. Find answers to common questions about art authentication, NFC certificates, and platform features.",
    robots: {
        index: false,
        follow: false,
    },
};

export default function Page() {
    return <SupportPage />;
}
