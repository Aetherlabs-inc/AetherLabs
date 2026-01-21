import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Profile",
    description: "Manage your AetherLabs profile settings, account information, and view your account statistics.",
    robots: {
        index: false,
        follow: false,
    },
};

export default function ProfileLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <>{children}</>;
}

