import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Sign In | AetherLabs",
    description: "Sign in to your AetherLabs account to manage your artwork, certificates, and collections.",
    robots: {
        index: false,
        follow: false,
    },
};

interface AuthLayoutProps {
    children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className="relative min-h-svh overflow-hidden bg-[#f9f8f6]" role="main">
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-32 right-0 h-72 w-72 rounded-full bg-[#BC8010]/20 blur-3xl" />
                <div className="absolute -bottom-32 left-0 h-80 w-80 rounded-full bg-[#CA5B2B]/15 blur-3xl" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(42,33,33,0.06),_transparent_60%)]" />
            </div>

            <div className="relative mx-auto flex min-h-svh max-w-5xl flex-col px-6 py-10 sm:py-14">
                <header className="flex items-center justify-center sm:justify-between">
                    <Link
                        href="/"
                        className="flex items-center gap-2 font-medium tracking-wide hover:opacity-80 transition-opacity"
                        aria-label="Return to home"
                    >
                        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#2A2121] text-[#f9f8f6]">
                            Æ
                        </div>
                        <span className="text-sm uppercase text-[#2A2121]/80">AetherLabs</span>
                    </Link>
                    <p className="hidden text-sm text-[#2A2121]/60 sm:block">
                        A quiet portal for verified art.
                    </p>
                </header>

                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-md rounded-3xl border border-[#2A2121]/10 bg-white/80 p-6 shadow-[0_30px_80px_-50px_rgba(42,33,33,0.7)] backdrop-blur">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
