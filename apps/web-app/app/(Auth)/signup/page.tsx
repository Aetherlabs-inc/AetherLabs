import type { Metadata } from "next"
import { SupabaseSignupForm } from "@/src/auth/supabase-signup-form"

export const metadata: Metadata = {
    title: "Sign Up",
    description: "Create your AetherLabs account to start authenticating and managing your artwork with NFC-enabled certificates of authenticity.",
    robots: {
        index: false,
        follow: false,
    },
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://aetherlabs.art/signup',
        siteName: 'AetherLabs',
        title: 'Sign Up | AetherLabs',
        description: 'Create your AetherLabs account to start authenticating and managing your artwork with NFC-enabled certificates of authenticity.',
    },
    alternates: {
        canonical: 'https://aetherlabs.art/signup',
    },
}

export default function SignupPage() {
    return (
        <SupabaseSignupForm />
    )
}
