import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Certificates",
    description: "View and manage your NFC-enabled certificates of authenticity (COA) for your artwork. Verify and track certificate status.",
    robots: {
        index: false,
        follow: false,
    },
};

const CertificatesPage: React.FC = () => {
    return (
        <div>
            <h1>Certificates</h1>
            <p>This is the certificates page.</p>
        </div>
    );
};

export default CertificatesPage;