import { ImageOff } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface BlogPostCoverThumbnailProps {
    src: string | null;
    alt: string;
    className?: string;
    imageClassName?: string;
}

export default function BlogPostCoverThumbnail({
    src,
    alt,
    className,
    imageClassName,
}: BlogPostCoverThumbnailProps) {
    const [hasError, setHasError] = useState(false);

    const showImage = Boolean(src) && !hasError;

    return (
        <div
            className={cn(
                'relative overflow-hidden rounded-lg border border-border bg-muted',
                className,
            )}
        >
            {showImage ? (
                <img
                    src={src ?? undefined}
                    alt={alt}
                    loading="lazy"
                    decoding="async"
                    onError={() => setHasError(true)}
                    className={cn('h-full w-full object-cover', imageClassName)}
                />
            ) : (
                <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                    <ImageOff className="h-5 w-5" />
                    <span className="sr-only">No cover image</span>
                </div>
            )}
        </div>
    );
}
