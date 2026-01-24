import type { Metadata } from 'next';
import Certificates from '@/src/features/certificates/Certificates';

export const metadata: Metadata = {
    title: "Certificates | AetherLabs",
    description: "View and manage your NFC-enabled certificates of authenticity (COA) for your artwork. Verify and track certificate status.",
    robots: {
        index: false,
        follow: false,
    },
};

export default function CertificatesPage() {
    return <Certificates />;
}