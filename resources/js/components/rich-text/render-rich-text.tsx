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
            className={cn('rich-content max-w-none text-foreground', className)}
            dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
        />
    );
}
