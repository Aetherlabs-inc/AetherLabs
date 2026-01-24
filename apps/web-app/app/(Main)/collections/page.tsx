import type { Metadata } from 'next';
import CollectionsComingSoon from '@/src/features/collections/CollectionsComingSoon';

export const metadata: Metadata = {
    title: "Collections | AetherLabs",
    description: "Organize and manage your art collections with AetherLabs. Create curated collections of authenticated artwork.",
    robots: {
        index: false,
        follow: false,
    },
};

export default function CollectionsPage() {
    return <CollectionsComingSoon />;
}