import DOMPurify from 'dompurify';
import { useMemo } from 'react';
import { cn } from '@/lib/utils';

export default function RenderRichText({
    html,
    className,
}: {
    html: string;
    className?: string;
}) {
    const sanitizedHtml = useMemo(
        () =>
            DOMPurify.sanitize(html, {
                USE_PROFILES: { html: true },
            }),
        [html],
    );

    return (
        <div
            className={cn('prose prose-sm max-w-none dark:prose-invert', className)}
            dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
        />
    );
}
