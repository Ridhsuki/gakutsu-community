import type { ReactNode } from 'react';

interface ResourceToolbarProps {
    title: string;
    description?: string;
    actions?: ReactNode;
    children?: ReactNode;
    className?: string;
}

export default function ResourceToolbar({
    title,
    description,
    actions,
    children,
    className = '',
}: ResourceToolbarProps) {
    return (
        <div className={`flex flex-col gap-4 ${className}`}>
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
                    {description ? (
                        <p className="text-sm text-muted-foreground">{description}</p>
                    ) : null}
                </div>

                {actions ? <div className="shrink-0">{actions}</div> : null}
            </div>

            {children ? (
                <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                    {children}
                </div>
            ) : null}
        </div>
    );
}
