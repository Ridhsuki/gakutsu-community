import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import EmptyState from '@/components/ui/empty-state';
import { cn } from '@/lib/utils';

interface EmptyStateRowProps {
    colSpan: number;
    icon?: LucideIcon;
    title?: string;
    description?: string;
    action?: ReactNode;
    message?: string;
    className?: string;
}

export default function EmptyStateRow({
    colSpan,
    icon,
    title,
    description,
    action,
    message,
    className,
}: EmptyStateRowProps) {
    const resolvedTitle = title ?? message ?? 'No data found';
    const resolvedDescription = title || description ? description : undefined;

    return (
        <tr>
            <td colSpan={colSpan} className="p-4">
                <EmptyState
                    icon={icon}
                    title={resolvedTitle}
                    description={resolvedDescription}
                    action={action}
                    size="md"
                    className={cn(
                        'min-h-[220px] border-0 bg-transparent p-4',
                        className,
                    )}
                />
            </td>
        </tr>
    );
}
