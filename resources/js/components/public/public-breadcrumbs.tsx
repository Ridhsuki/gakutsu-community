import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import type { BreadcrumbItemInput } from '@/lib/structured-data';

interface PublicBreadcrumbsProps {
    items: BreadcrumbItemInput[];
    className?: string;
}

export default function PublicBreadcrumbs({
    items,
    className = '',
}: PublicBreadcrumbsProps) {
    if (!items || items.length === 0) {
        return null;
    }

    return (
        <nav aria-label="Breadcrumb" className={className}>
            <ol className="flex flex-wrap items-center gap-1.5 text-sm break-words text-muted-foreground">
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;
                    const isCurrent = item.current ?? isLast;
                    const navigationHref = item.href || item.url;

                    return (
                        <li
                            key={`${item.url}-${index}`}
                            className="inline-flex min-w-0 items-center gap-1.5"
                        >
                            {index > 0 ? (
                                <ChevronRight
                                    className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60 select-none"
                                    aria-hidden="true"
                                />
                            ) : null}

                            {isCurrent ? (
                                <span
                                    aria-current="page"
                                    title={item.name}
                                    className="inline-block max-w-[200px] truncate align-bottom font-medium text-foreground sm:max-w-[350px] md:max-w-md"
                                >
                                    {item.name}
                                </span>
                            ) : (
                                <Link
                                    href={navigationHref}
                                    className="shrink-0 rounded-sm font-medium transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
                                >
                                    {item.name}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
