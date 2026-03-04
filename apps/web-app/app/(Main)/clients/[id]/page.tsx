import type { Metadata } from 'next'
import ClientDetailPage from '@/src/features/clients/ClientDetailPage'

export const metadata: Metadata = {
    title: 'Client Details',
    description: 'View and manage client details, transactions, and quotations.',
    robots: {
        index: false,
        follow: false,
    },
}

interface ClientPageProps {
    params: Promise<{ id: string }>
}

export default async function ClientPage({ params }: ClientPageProps) {
    const { id } = await params
    return (
        <div className="min-h-screen">
            <ClientDetailPage clientId={id} />
        </div>
    )
}
