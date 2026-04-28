import { Head } from '@inertiajs/react';

type SeoHeadProps = {
    title: string;
    description: string;
    image?: string | null;
    type?: 'website' | 'article';
};

const siteName = 'Yok Pelajarin';

export default function SeoHead({
    title,
    description,
    image = null,
    type = 'website',
}: SeoHeadProps) {
    const fullTitle = title === siteName ? siteName : `${title} - ${siteName}`;

    return (
        <Head>
            <title>{fullTitle}</title>

            <meta head-key="description" name="description" content={description} />

            <meta head-key="og:title" property="og:title" content={fullTitle} />
            <meta head-key="og:description" property="og:description" content={description} />
            <meta head-key="og:type" property="og:type" content={type} />

            <meta head-key="twitter:card" name="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
            <meta head-key="twitter:title" name="twitter:title" content={fullTitle} />
            <meta head-key="twitter:description" name="twitter:description" content={description} />

            {image ? (
                <>
                    <meta head-key="og:image" property="og:image" content={image} />
                    <meta head-key="twitter:image" name="twitter:image" content={image} />
                </>
            ) : null}
        </Head>
    );
}
