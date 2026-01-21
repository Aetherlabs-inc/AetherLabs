import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Users Management",
    description: "Manage users in your AetherLabs account. View and manage user profiles, permissions, and account status.",
    robots: {
        index: false,
        follow: false,
    },
};

const UsersPage: React.FC = () => {
    return (
        <div>
            <h1>Users Management</h1>
            <p>This is the users management page.</p>
        </div>
    );
};

export default UsersPage;