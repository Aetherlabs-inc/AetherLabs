import React from 'react';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getMDXContent } from '@/lib/mdx';
import NavBar from '@/src/NavBar';
import Footer from '@/src/Footer';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
    const { frontmatter } = getMDXContent('cookies');
    const lastUpdated = frontmatter.lastUpdated || '2025-11-04';

    const title = 'Cookie Policy | AetherLabs';
    const description = 'AetherLabs Cookie Policy: Learn about how we use cookies and similar tracking technologies on our website and apps. Understand your options for managing cookies.';
    const url = 'https://aetherlabs.art/cookies';

    return {
        title,
        description,
        keywords: [
            'cookie policy',
            'cookies',
            'tracking technologies',
            'privacy',
            'data protection',
            'AetherLabs',
            'web cookies',
            'cookie consent',
            'analytics cookies',
            'functional cookies'
        ],
        authors: [{ name: 'AetherLabs Inc.' }],
        creator: 'AetherLabs Inc.',
        publisher: 'AetherLabs Inc.',
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
        openGraph: {
            type: 'website',
            locale: 'en_US',
            url,
            title,
            description,
            siteName: 'AetherLabs',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            creator: '@AetherLabs',
            site: '@AetherLabs',
        },
        alternates: {
            canonical: url,
        },
        other: {
            'last-modified': lastUpdated,
        },
    };
}

export default async function CookiesPage() {
    const { content, frontmatter } = getMDXContent('cookies');

    const lastUpdated = frontmatter.lastUpdated || '2025-11-04';

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'LegalDocument',
        name: 'Cookie Policy',
        description: 'AetherLabs Cookie Policy explaining how we use cookies and similar tracking technologies',
        datePublished: '2025-11-04',
        dateModified: lastUpdated,
        publisher: {
            '@type': 'Organization',
            name: 'AetherLabs Inc.',
            url: 'https://aetherlabs.art',
        },
        inLanguage: 'en-US',
        license: 'https://aetherlabs.art/cookies',
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className="min-h-screen flex flex-col">
                <NavBar />
                <main className="flex-grow max-w-4xl mx-auto px-6 py-12 md:py-16">
                    <article
                        className="max-w-none [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:mb-6 [&_h1]:mt-8 [&_h1]:text-foreground [&_h2]:text-3xl [&_h2]:font-semibold [&_h2]:mb-4 [&_h2]:mt-8 [&_h2]:text-foreground [&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:mb-3 [&_h3]:mt-6 [&_h3]:text-foreground [&_p]:mb-4 [&_p]:text-muted-foreground [&_p]:leading-7 [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-4 [&_ul]:space-y-2 [&_li]:text-muted-foreground [&_strong]:font-semibold [&_strong]:text-foreground"
                        itemScope
                        itemType="https://schema.org/LegalDocument"
                    >
                        <MDXRemote source={content} />
                    </article>
                </main>
                <Footer />
            </div>
        </>
    );
}

