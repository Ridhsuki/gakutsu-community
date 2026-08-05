export interface BreadcrumbItemInput {
    name: string;
    url: string;
    href?: string;
    current?: boolean;
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
 * Extracts the root-relative path (pathname + search + hash) from an absolute HTTP/HTTPS URL
 * for same-origin Inertia navigation while preserving subdirectory deployments.
 */
export function toInertiaHref(
    absoluteUrl: string | null | undefined,
): string | null {
    if (!absoluteUrl || typeof absoluteUrl !== 'string') {
        return null;
    }

    const trimmed = absoluteUrl.trim();

    if (!trimmed || !/^https?:\/\//i.test(trimmed)) {
        return null;
    }

    try {
        const parsed = new URL(trimmed);

        if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
            return null;
        }

        return `${parsed.pathname}${parsed.search}${parsed.hash}`;
    } catch {
        return null;
    }
}
