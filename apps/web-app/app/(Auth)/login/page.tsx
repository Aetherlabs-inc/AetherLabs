import React from "react"
import type { Metadata } from "next"
import { SupabaseLoginForm } from "@/src/auth/supabase-login-form"

export const metadata: Metadata = {
    title: "Sign In",
    description: "Sign in to your AetherLabs account to manage your artwork, certificates, and collections.",
    robots: {
        index: false,
        follow: false,
    },
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://aetherlabs.art/login',
        siteName: 'AetherLabs',
        title: 'Sign In | AetherLabs',
        description: 'Sign in to your AetherLabs account to manage your artwork, certificates, and collections.',
    },
    alternates: {
        canonical: 'https://aetherlabs.art/login',
    },
}

export default function LoginPage() {
    return (
        <SupabaseLoginForm />
    )
}
