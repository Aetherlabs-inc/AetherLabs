import type { Metadata } from 'next';
import ArtistsPage from '@/src/features/management/ArtistsPage';

export const metadata: Metadata = {
    title: "Artists Management",
    description: "Manage artists in your AetherLabs account. View and manage artist profiles, artworks, and authentication records.",
    robots: {
        index: false,
        follow: false,
    },
};

export default function Page() {
    return <ArtistsPage />;
}
