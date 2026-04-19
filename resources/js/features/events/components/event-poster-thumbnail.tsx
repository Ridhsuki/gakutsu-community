import { useState } from 'react';
import { ImageOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EventPosterThumbnailProps {
    src: string | null;
    alt: string;
    className?: string;
    imageClassName?: string;
}

export default function EventPosterThumbnail({
    src,
    alt,
    className,
    imageClassName,
}: EventPosterThumbnailProps) {
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
                    className={cn('h-full w-full object-contain', imageClassName)}
                />
            ) : (
                <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
                    <ImageOff className="h-5 w-5" />
                    <span className="sr-only">No poster image</span>
                </div>
            )}
        </div>
    );
}
