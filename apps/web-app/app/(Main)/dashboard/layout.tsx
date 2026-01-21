import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Dashboard",
    description: "Your AetherLabs dashboard - manage your artwork, certificates, collections, and view your account statistics.",
    robots: {
        index: false,
        follow: false,
    },
};

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <>{children}</>;
}

