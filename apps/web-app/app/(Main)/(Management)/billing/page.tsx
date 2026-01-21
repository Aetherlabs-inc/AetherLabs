import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Billing",
    description: "Manage your AetherLabs billing information, subscription, payment methods, and invoices.",
    robots: {
        index: false,
        follow: false,
    },
};

const BillingPage: React.FC = () => {
    return (
        <div>
            <h1>Billing Management</h1>
            <p>This is the billing management page.</p>
        </div>
    );
};

export default BillingPage;