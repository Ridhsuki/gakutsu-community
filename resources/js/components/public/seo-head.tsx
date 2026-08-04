import { Head, usePage } from '@inertiajs/react';
import { safeJsonLdStringify } from '@/lib/structured-data';
import type { SharedPageProps } from '@/types/shared';

type SeoHeadProps = {
    title?: string;
    description?: string;
    image?: string | null;
    imageAlt?: string | null;
    type?: 'website' | 'article';
    canonical?: string | null;
    robots?: string | null;
    jsonLdGraph?: Array<Record<string, unknown>> | null;
};

export default function SeoHead({
    title,
    description,
    image = null,
    imageAlt = null,
    type = 'website',
    canonical,
    robots,
    jsonLdGraph = null,
}: SeoHeadProps) {
    const page = usePage<SharedPageProps>();
    const sharedSeo = page.props.seo;

    const siteName = sharedSeo?.siteName || page.props.name || 'Gakutsu';

    const resolvedTitle = title || siteName;
    const fullTitle =
        resolvedTitle === siteName
            ? siteName
            : `${resolvedTitle} - ${siteName}`;

    const resolvedDescription = description || '';
    const robotsDirective = robots ?? sharedSeo?.robots ?? 'index, follow';
    const canonicalUrl =
        canonical !== undefined ? canonical : (sharedSeo?.canonicalUrl ?? null);

    let absoluteImageUrl: string | null = null;

    if (image) {
        if (image.startsWith('http://') || image.startsWith('https://')) {
            absoluteImageUrl = image;
        } else if (sharedSeo?.baseUrl) {
            const cleanBaseUrl = sharedSeo.baseUrl.replace(/\/+$/, '');
            const cleanImagePath = image.startsWith('/') ? image : `/${image}`;
            absoluteImageUrl = `${cleanBaseUrl}${cleanImagePath}`;
        } else {
            absoluteImageUrl = image;
        }
    }

    const shouldRenderJsonLd =
        robotsDirective === 'index, follow' &&
        Boolean(canonicalUrl) &&
        Boolean(jsonLdGraph && jsonLdGraph.length > 0);

    const jsonLdPayload = shouldRenderJsonLd
        ? {
              '@context': 'https://schema.org',
              '@graph': jsonLdGraph,
          }
        : null;

    return (
        <Head>
            <title>{fullTitle}</title>

            {resolvedDescription ? (
                <meta
                    head-key="description"
                    name="description"
                    content={resolvedDescription}
                />
            ) : null}

            <meta head-key="robots" name="robots" content={robotsDirective} />

            {canonicalUrl ? (
                <link
                    head-key="canonical"
                    rel="canonical"
                    href={canonicalUrl}
                />
            ) : null}

            <meta head-key="og:title" property="og:title" content={fullTitle} />
            {resolvedDescription ? (
                <meta
                    head-key="og:description"
                    property="og:description"
                    content={resolvedDescription}
                />
            ) : null}
            <meta head-key="og:type" property="og:type" content={type} />
            <meta
                head-key="og:site_name"
                property="og:site_name"
                content={siteName}
            />

            {canonicalUrl ? (
                <meta
                    head-key="og:url"
                    property="og:url"
                    content={canonicalUrl}
                />
            ) : null}

            <meta
                head-key="twitter:card"
                name="twitter:card"
                content={absoluteImageUrl ? 'summary_large_image' : 'summary'}
            />
            <meta
                head-key="twitter:title"
                name="twitter:title"
                content={fullTitle}
            />
            {resolvedDescription ? (
                <meta
                    head-key="twitter:description"
                    name="twitter:description"
                    content={resolvedDescription}
                />
            ) : null}

            {absoluteImageUrl ? (
                <meta
                    head-key="og:image"
                    property="og:image"
                    content={absoluteImageUrl}
                />
            ) : null}
            {absoluteImageUrl ? (
                <meta
                    head-key="twitter:image"
                    name="twitter:image"
                    content={absoluteImageUrl}
                />
            ) : null}
            {absoluteImageUrl && imageAlt ? (
                <meta
                    head-key="og:image:alt"
                    property="og:image:alt"
                    content={imageAlt}
                />
            ) : null}
            {absoluteImageUrl && imageAlt ? (
                <meta
                    head-key="twitter:image:alt"
                    name="twitter:image:alt"
                    content={imageAlt}
                />
            ) : null}

            {jsonLdPayload ? (
                <script
                    head-key="structured-data"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: safeJsonLdStringify(jsonLdPayload),
                    }}
                />
            ) : null}
        </Head>
    );
}
