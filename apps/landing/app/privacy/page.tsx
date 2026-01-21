import React from 'react';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getMDXContent } from '@/lib/mdx';
import NavBar from '@/src/NavBar';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
    const { frontmatter } = getMDXContent('privacy');
    const lastUpdated = frontmatter.lastUpdated || '2025-11-04';

    const title = 'Privacy Policy | AetherLabs';
    const description = 'AetherLabs Privacy Policy: Learn how we collect, use, and protect your personal information across our website, apps, NFC-enabled features, and marketplace. Effective as of November 4, 2025.';
    const url = 'https://aetherlabs.art/privacy';

    return {
        title,
        description,
        keywords: [
            'privacy policy',
            'data protection',
            'GDPR',
            'PIPEDA',
            'personal information',
            'data privacy',
            'AetherLabs',
            'art authentication',
            'NFC certificates',
            'user privacy'
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

export default async function PrivacyPage() {
    const { content, frontmatter } = getMDXContent('privacy');

    const lastUpdated = frontmatter.lastUpdated || '2025-11-04';

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'LegalDocument',
        name: 'Privacy Policy',
        description: 'AetherLabs Privacy Policy outlining data collection, usage, and protection practices',
        datePublished: '2025-11-04',
        dateModified: lastUpdated,
        publisher: {
            '@type': 'Organization',
            name: 'AetherLabs Inc.',
            url: 'https://aetherlabs.art',
        },
        inLanguage: 'en-US',
        license: 'https://aetherlabs.art/privacy',
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
                        className="font-libre max-w-none [&_h1]:text-4xl [&_h1]:font-bold [&_h1]:mb-6 [&_h1]:mt-8 [&_h1]:text-foreground [&_h2]:text-3xl [&_h2]:font-semibold [&_h2]:mb-4 [&_h2]:mt-8 [&_h2]:text-foreground [&_h3]:text-2xl [&_h3]:font-semibold [&_h3]:mb-3 [&_h3]:mt-6 [&_h3]:text-foreground [&_p]:mb-4 [&_p]:text-muted-foreground [&_p]:leading-7 [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-4 [&_ul]:space-y-2 [&_li]:text-muted-foreground [&_strong]:font-semibold [&_strong]:text-foreground"
                        itemScope
                        itemType="https://schema.org/LegalDocument"
                    >
                        <MDXRemote source={content} />
                    </article>
                </main>
                {/* <Footer /> */}
            </div>
        </>
    );
}
