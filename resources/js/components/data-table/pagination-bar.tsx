import { Link } from '@inertiajs/react';
import { cleanPaginationLabel } from '@/lib/pagination';
import { cn } from '@/lib/utils';
import type { PaginationLink } from '@/types/pagination';

interface PaginationBarProps {
    links: PaginationLink[];
    from: number | null;
    to: number | null;
    total: number;
    lastPage: number;
    only?: string[];
}

function isNavigationLabel(label: string) {
    const normalized = cleanPaginationLabel(label).toLowerCase();

    return normalized.includes('previous') || normalized.includes('next');
}

export default function PaginationBar({
    links,
    from,
    to,
    total,
    lastPage,
    only = [],
}: PaginationBarProps) {
    if (lastPage <= 1) {
        return null;
    }

    const previousLink = links.find((link) =>
        cleanPaginationLabel(link.label).toLowerCase().includes('previous'),
    );

    const nextLink = links.find((link) =>
        cleanPaginationLabel(link.label).toLowerCase().includes('next'),
    );

    const pageLinks = links.filter((link) => !isNavigationLabel(link.label));

    const activePageLink = pageLinks.find((link) => {
        const label = cleanPaginationLabel(link.label);

        return link.active && !Number.isNaN(Number(label));
    });

    const currentPage = activePageLink
        ? Number(cleanPaginationLabel(activePageLink.label))
        : 1;

    const inertiaProps = {
        preserveScroll: true,
        preserveState: true,
        ...(only.length ? { only } : {}),
    };

    return (
        <div className="flex flex-col gap-3 border-t border-border pt-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                    Showing {from ?? 0} to {to ?? 0} of {total} items
                </p>

                <div className="flex items-center justify-between gap-2 sm:hidden">
                    {previousLink?.url ? (
                        <Link
                            href={previousLink.url}
                            {...inertiaProps}
                            className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium text-foreground transition hover:bg-accent"
                        >
                            Previous
                        </Link>
                    ) : (
                        <span className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-muted px-3 text-sm font-medium text-muted-foreground">
                            Previous
                        </span>
                    )}

                    <span className="min-w-[96px] text-center text-sm text-muted-foreground">
                        Page {currentPage} of {lastPage}
                    </span>

                    {nextLink?.url ? (
                        <Link
                            href={nextLink.url}
                            {...inertiaProps}
                            className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium text-foreground transition hover:bg-accent"
                        >
                            Next
                        </Link>
                    ) : (
                        <span className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-muted px-3 text-sm font-medium text-muted-foreground">
                            Next
                        </span>
                    )}
                </div>

                <div className="hidden flex-wrap items-center justify-end gap-1 sm:flex">
                    {links.map((link, index) => {
                        const label = cleanPaginationLabel(link.label);

                        if (!link.url) {
                            return (
                                <span
                                    key={`${label}-${index}`}
                                    className={cn(
                                        'inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-3 text-sm',
                                        link.active
                                            ? 'border-primary bg-primary text-primary-foreground'
                                            : 'border-input bg-muted text-muted-foreground',
                                    )}
                                >
                                    {label}
                                </span>
                            );
                        }

                        return (
                            <Link
                                key={`${label}-${index}`}
                                href={link.url}
                                {...inertiaProps}
                                className={cn(
                                    'inline-flex h-9 min-w-9 items-center justify-center rounded-md border px-3 text-sm font-medium transition',
                                    link.active
                                        ? 'border-primary bg-primary text-primary-foreground'
                                        : 'border-input bg-background text-foreground hover:bg-accent',
                                )}
                            >
                                {label}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
