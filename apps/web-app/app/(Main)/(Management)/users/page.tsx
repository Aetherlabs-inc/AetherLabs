import type { Metadata } from 'next';
import UsersPage from '@/src/features/management/UsersPage';

export const metadata: Metadata = {
    title: "Users Management",
    description: "Manage users in your AetherLabs account. View and manage user profiles, permissions, and account status.",
    robots: {
        index: false,
        follow: false,
    },
};

export default function Page() {
    return <UsersPage />;
}
