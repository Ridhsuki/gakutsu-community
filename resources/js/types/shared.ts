import type { PageProps } from '@inertiajs/core';
export interface FlashMessages {
    success?: string | null;
    error?: string | null;
    warning?: string | null;
    info?: string | null;
    status?: string | null;
}

export interface StructuredDataDocument {
    '@context': string;
    '@graph': Array<Record<string, unknown>>;
}

export interface SeoMetadata {
    siteName: string;
    title: string;
    description: string | null;
    robots: 'index, follow' | 'noindex, follow' | 'noindex, nofollow';
    canonicalUrl: string | null;
    baseUrl: string;
    type: 'website' | 'article';
    image: string | null;
    imageAlt: string | null;
    twitterCard: 'summary' | 'summary_large_image';
    jsonLd: StructuredDataDocument | null;
}

export interface SharedPageProps extends PageProps {
    name?: string;
    sidebarOpen?: boolean;
    flash?: FlashMessages;
    auth?: {
        user?: {
            id: number;
            name: string;
            email?: string;
        } | null;
    };
    seo?: SeoMetadata;
}
