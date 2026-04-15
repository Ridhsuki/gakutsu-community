import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Inbox } from 'lucide-react';

import { cn } from '@/lib/utils';

type EmptyStateSize = 'sm' | 'md' | 'lg';

interface EmptyStateProps {
    icon?: LucideIcon;
    title?: string;
    description?: string;
    action?: ReactNode;
    size?: EmptyStateSize;
    className?: string;
    iconClassName?: string;
    titleClassName?: string;
    descriptionClassName?: string;
}

const sizeClasses: Record<EmptyStateSize, string> = {
    sm: 'min-h-[180px] p-5',
    md: 'min-h-[220px] p-6',
    lg: 'min-h-[280px] p-8',
};

export default function EmptyState({
    icon: Icon = Inbox,
    title = 'No data found',
    description = 'There is no data to display right now.',
    action,
    size = 'lg',
    className,
    iconClassName,
    titleClassName,
    descriptionClassName,
}: EmptyStateProps) {
    return (
        <div
            className={cn(
                'flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 text-center',
                sizeClasses[size],
                className,
            )}
        >
            <div
                className={cn(
                    'mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-background text-muted-foreground',
                    iconClassName,
                )}
            >
                <Icon className="h-5 w-5" />
            </div>

            <div className="max-w-md space-y-1.5">
                <h3 className={cn('text-base font-semibold', titleClassName)}>
                    {title}
                </h3>

                {description ? (
                    <p
                        className={cn(
                            'text-sm text-muted-foreground',
                            descriptionClassName,
                        )}
                    >
                        {description}
                    </p>
                ) : null}
            </div>

            {action ? <div className="mt-4 flex flex-wrap justify-center gap-2">{action}</div> : null}
        </div>
    );
}
