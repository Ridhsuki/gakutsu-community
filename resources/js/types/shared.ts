import type { PageProps } from '@inertiajs/core';
export interface FlashMessages {
    success?: string | null;
    error?: string | null;
    warning?: string | null;
    info?: string | null;
    status?: string | null;
}

export interface SeoMetadata {
    siteName: string;
    canonicalUrl: string | null;
    robots: string;
    baseUrl?: string | null;
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
