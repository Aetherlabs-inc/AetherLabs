import type { Metadata } from 'next';
import ExhibitionsPage from '@/src/features/exhibitions/ExhibitionsPage';

export const metadata: Metadata = {
    title: "Exhibitions",
    description: "Manage and view your art exhibitions with AetherLabs. Create and organize exhibitions featuring authenticated artwork.",
    robots: {
        index: false,
        follow: false,
    },
};

export default function Page() {
    return <ExhibitionsPage />;
}
