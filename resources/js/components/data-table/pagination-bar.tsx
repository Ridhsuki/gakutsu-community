import { Link } from '@inertiajs/react';
import type { PaginationLink } from '@/types/pagination';
import { cleanPaginationLabel } from '@/lib/pagination';

interface PaginationBarProps {
    links: PaginationLink[];
    from: number | null;
    to: number | null;
    total: number;
    lastPage: number;
    only?: string[];
}

export default function PaginationBar({
    links,
    from,
    to,
    total,
    lastPage,
    only = [],
}: PaginationBarProps) {
    if (lastPage <= 1) return null;

    return (
        <div className="flex flex-col items-start justify-between gap-3 border-t border-border pt-4 sm:flex-row sm:items-center">
            <div className="text-sm text-muted-foreground">
                Showing {from ?? 0} to {to ?? 0} of {total} items
            </div>

            <div className="flex flex-wrap gap-2">
                {links.map((link, index) => {
                    const label = cleanPaginationLabel(link.label);

                    if (!link.url) {
                        return (
                            <span
                                key={`disabled-${label}-${index}`}
                                className="rounded-md border border-border px-3 py-1.5 text-sm text-muted-foreground opacity-50"
                            >
                                {label}
                            </span>
                        );
                    }

                    return (
                        <Link
                            key={`${label}-${index}`}
                            href={link.url}
                            only={only}
                            preserveState
                            preserveScroll
                            className={`rounded-md border px-3 py-1.5 text-sm transition ${
                                link.active
                                    ? 'border-primary bg-primary text-primary-foreground'
                                    : 'border-border text-muted-foreground hover:bg-accent hover:text-foreground'
                            }`}
                        >
                            {label}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
