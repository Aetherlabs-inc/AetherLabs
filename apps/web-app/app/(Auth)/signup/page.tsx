import type { Metadata } from "next"
import { redirect } from "next/navigation"
// import { SupabaseMultiStepSignup } from "@/src/auth/supabase-multi-step-signup"

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
    // Signup is disabled during testing - redirect to waitlist
    // All signup code is preserved above and can be re-enabled by uncommenting the component
    redirect('/waitlist')

    // return (
    //     <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center p-6">
    //         <div className="w-full max-w-2xl">
    //             <SupabaseMultiStepSignup />
    //         </div>
    //     </div>
    // )
}
