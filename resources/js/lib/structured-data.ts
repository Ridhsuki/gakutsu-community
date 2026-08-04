export interface WebSiteSchemaInput {
    canonicalHomeUrl: string;
    siteName: string;
}

export interface OrganizationSchemaInput {
    canonicalHomeUrl: string;
    siteName: string;
    description?: string | null;
}

export interface BlogPostingSchemaInput {
    canonicalUrl: string;
    baseUrl: string;
    siteName: string;
    title: string;
    description?: string | null;
    publishedAt?: string | null;
    updatedAt?: string | null;
    authorName?: string | null;
    coverImageUrl?: string | null;
}

/**
 * Safely stringifies structured data JSON to be embedded inside an HTML script tag.
 * Escapes script-terminating and HTML-sensitive characters (<, >, &, U+2028, U+2029).
 */
export function safeJsonLdStringify(data: unknown): string {
    const json = JSON.stringify(data);

    return json
        .replace(/&/g, '\\u0026')
        .replace(/</g, '\\u003c')
        .replace(/>/g, '\\u003e')
        .replace(/\u2028/g, '\\u2028')
        .replace(/\u2029/g, '\\u2029');
}

/**
 * Validates and normalizes an image URL for structured data.
 * Accepts absolute http/https URLs or relative root paths resolved against baseUrl.
 * Rejects protocol-relative (//), data, blob, and javascript URLs.
 */
export function normalizeImageUrl(
    url: string | null | undefined,
    baseUrl: string,
): string | null {
    if (!url || typeof url !== 'string') {
        return null;
    }

    const trimmed = url.trim();

    if (!trimmed) {
        return null;
    }

    if (trimmed.startsWith('//') || /^(data|blob|javascript):/i.test(trimmed)) {
        return null;
    }

    if (/^https?:\/\//i.test(trimmed)) {
        try {
            const parsed = new URL(trimmed);

            if (parsed.protocol === 'http:' || parsed.protocol === 'https:') {
                return parsed.href;
            }
        } catch {
            return null;
        }

        return null;
    }

    if (trimmed.startsWith('/')) {
        try {
            const cleanBase = baseUrl.replace(/\/+$/, '');

            return `${cleanBase}${trimmed}`;
        } catch {
            return null;
        }
    }

    return null;
}

/**
 * Formats a date string to ISO 8601 string with UTC timezone offset.
 * Returns null if invalid.
 */
export function formatIsoDate(
    dateStr: string | null | undefined,
): string | null {
    if (!dateStr || typeof dateStr !== 'string') {
        return null;
    }

    const timestamp = Date.parse(dateStr);

    if (isNaN(timestamp)) {
        return null;
    }

    try {
        return new Date(timestamp).toISOString();
    } catch {
        return null;
    }
}

/**
 * Constructs a WebSite schema node.
 */
export function createWebSiteSchema(input: WebSiteSchemaInput) {
    const cleanHomeUrl = input.canonicalHomeUrl.replace(/\/+$/, '') + '/';

    return {
        '@type': 'WebSite',
        '@id': `${cleanHomeUrl}#website`,
        url: cleanHomeUrl,
        name: input.siteName,
        publisher: {
            '@id': `${cleanHomeUrl}#organization`,
        },
    };
}

/**
 * Constructs an Organization schema node.
 */
export function createOrganizationSchema(input: OrganizationSchemaInput) {
    const cleanHomeUrl = input.canonicalHomeUrl.replace(/\/+$/, '') + '/';
    const node: Record<string, unknown> = {
        '@type': 'Organization',
        '@id': `${cleanHomeUrl}#organization`,
        name: input.siteName,
        url: cleanHomeUrl,
    };

    if (input.description && input.description.trim()) {
        node.description = input.description.trim();
    }

    return node;
}

/**
 * Constructs a BlogPosting schema node.
 * Strictly respects factual dateModified rules and safe image URL normalization.
 */
export function createBlogPostingSchema(input: BlogPostingSchemaInput) {
    const cleanHomeUrl = input.baseUrl.replace(/\/+$/, '') + '/';
    const publishedIso = formatIsoDate(input.publishedAt);
    const updatedIso = formatIsoDate(input.updatedAt);

    let finalModifiedIso: string | null = null;

    if (publishedIso && updatedIso) {
        const pubTime = Date.parse(publishedIso);
        const modTime = Date.parse(updatedIso);

        if (!isNaN(pubTime) && !isNaN(modTime) && modTime >= pubTime) {
            finalModifiedIso = updatedIso;
        }
    }

    const node: Record<string, unknown> = {
        '@type': 'BlogPosting',
        '@id': `${input.canonicalUrl}#article`,
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': input.canonicalUrl,
        },
        headline: input.title,
    };

    if (input.description && input.description.trim()) {
        node.description = input.description.trim();
    }

    if (publishedIso) {
        node.datePublished = publishedIso;
    }

    if (finalModifiedIso) {
        node.dateModified = finalModifiedIso;
    }

    if (input.authorName && input.authorName.trim()) {
        node.author = {
            '@type': 'Person',
            name: input.authorName.trim(),
        };
    }

    node.publisher = {
        '@type': 'Organization',
        '@id': `${cleanHomeUrl}#organization`,
        name: input.siteName,
        url: cleanHomeUrl,
    };

    const imageUrl = normalizeImageUrl(input.coverImageUrl, input.baseUrl);

    if (imageUrl) {
        node.image = [imageUrl];
    }

    return node;
}
