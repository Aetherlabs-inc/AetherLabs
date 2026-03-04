import type { Metadata } from 'next'
import ArtworkDetailPage from '@/src/features/artworks/ArtworkDetailPage'

export const metadata: Metadata = {
    title: 'Artwork Details',
    description: 'View artwork details, certificates, and verification status.',
    robots: {
        index: false,
        follow: false,
    },
}

interface ArtworkPageProps {
    params: Promise<{ id: string }>
}

export default async function ArtworkPage({ params }: ArtworkPageProps) {
    const { id } = await params
    return (
        <div className="min-h-screen">
            <ArtworkDetailPage artworkId={id} />
        </div>
    )
}
