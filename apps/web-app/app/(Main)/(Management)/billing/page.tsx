import type { Metadata } from 'next';
import BillingPage from '@/src/features/management/BillingPage';

export const metadata: Metadata = {
    title: "Billing",
    description: "Manage your AetherLabs billing information, subscription, payment methods, and invoices.",
    robots: {
        index: false,
        follow: false,
    },
};

export default function Page() {
    return <BillingPage />;
}
