import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ResourceToolbarProps {
    title: string;
    description?: string;
    actions?: ReactNode;
    children?: ReactNode;
    meta?: ReactNode;
    className?: string;
    headerClassName?: string;
    contentClassName?: string;
}

export default function ResourceToolbar({
    title,
    description,
    actions,
    children,
    meta,
    className,
    headerClassName,
    contentClassName,
}: ResourceToolbarProps) {
    return (
        <section className={cn('flex flex-col gap-4', className)}>
            <div
                className={cn(
                    'flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between',
                    headerClassName,
                )}
            >
                <div className="min-w-0 space-y-1">
                    <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>

                    {description ? (
                        <p className="max-w-3xl text-sm text-muted-foreground">
                            {description}
                        </p>
                    ) : null}
                </div>

                {actions ? (
                    <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:justify-end">
                        {actions}
                    </div>
                ) : null}
            </div>

            {children || meta ? (
                <div
                    className={cn(
                        'grid gap-3 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-start',
                        contentClassName,
                    )}
                >
                    <div className="min-w-0">{children}</div>

                    {meta ? (
                        <div className="flex min-h-9 items-center text-sm text-muted-foreground xl:justify-end">
                            {meta}
                        </div>
                    ) : null}
                </div>
            ) : null}
        </section>
    );
}
