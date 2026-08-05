import { Head, usePage } from '@inertiajs/react';
import { safeJsonLdStringify } from '@/lib/structured-data';
import type { SharedPageProps } from '@/types/shared';

export default function SeoHead() {
    const page = usePage<SharedPageProps>();
    const seo = page.props.seo;

    if (!seo) {
        return null;
    }

    return (
        <Head>
            <title>{seo.title}</title>

            {seo.description ? (
                <meta
                    head-key="description"
                    name="description"
                    content={seo.description}
                />
            ) : null}

            <meta head-key="robots" name="robots" content={seo.robots} />

            {seo.canonicalUrl ? (
                <link
                    head-key="canonical"
                    rel="canonical"
                    href={seo.canonicalUrl}
                />
            ) : null}

            <meta head-key="og:title" property="og:title" content={seo.title} />
            {seo.description ? (
                <meta
                    head-key="og:description"
                    property="og:description"
                    content={seo.description}
                />
            ) : null}
            <meta head-key="og:type" property="og:type" content={seo.type} />
            <meta
                head-key="og:site_name"
                property="og:site_name"
                content={seo.siteName}
            />

            {seo.canonicalUrl ? (
                <meta
                    head-key="og:url"
                    property="og:url"
                    content={seo.canonicalUrl}
                />
            ) : null}

            <meta
                head-key="twitter:card"
                name="twitter:card"
                content={seo.twitterCard}
            />
            <meta
                head-key="twitter:title"
                name="twitter:title"
                content={seo.title}
            />
            {seo.description ? (
                <meta
                    head-key="twitter:description"
                    name="twitter:description"
                    content={seo.description}
                />
            ) : null}

            {seo.image ? (
                <meta
                    head-key="og:image"
                    property="og:image"
                    content={seo.image}
                />
            ) : null}
            {seo.image ? (
                <meta
                    head-key="twitter:image"
                    name="twitter:image"
                    content={seo.image}
                />
            ) : null}
            {seo.image && seo.imageAlt ? (
                <meta
                    head-key="og:image:alt"
                    property="og:image:alt"
                    content={seo.imageAlt}
                />
            ) : null}
            {seo.image && seo.imageAlt ? (
                <meta
                    head-key="twitter:image:alt"
                    name="twitter:image:alt"
                    content={seo.imageAlt}
                />
            ) : null}

            {seo.jsonLd ? (
                <script
                    head-key="structured-data"
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: safeJsonLdStringify(seo.jsonLd),
                    }}
                />
            ) : null}
        </Head>
    );
}
