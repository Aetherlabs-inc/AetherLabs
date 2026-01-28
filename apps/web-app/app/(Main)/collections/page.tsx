import type { Metadata } from 'next';
import Collections from '@/src/features/collections/Collections';

export const metadata: Metadata = {
    title: "Collections | AetherLabs",
    description: "Organize and manage your art collections with AetherLabs. Create curated collections of authenticated artwork.",
    robots: {
        index: false,
        follow: false,
    },
};

export default function CollectionsPage() {
    return <Collections />;
}