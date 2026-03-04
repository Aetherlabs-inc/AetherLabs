import type { Metadata } from 'next'
import Clients from '@/src/features/clients/Clients'

export const metadata: Metadata = {
    title: 'Clients',
    description: 'Manage your clients and client relationships.',
    robots: {
        index: false,
        follow: false,
    },
}

export default function ClientsPage() {
    return (
        <div className="min-h-screen">
            <Clients />
        </div>
    )
}
