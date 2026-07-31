import { Badge } from '@/components/ui/badge';
import type { EventStatus } from '@/features/events/types';

interface EventStatusBadgeProps {
    status: EventStatus;
}

const statusConfig: Record<EventStatus, { label: string; className: string }> =
    {
        upcoming: {
            label: 'Upcoming',
            className: [
                'inline-flex items-center px-2.5 py-0.5',
                'text-[11px] font-medium tracking-wide',
                'rounded-full border',
                'bg-blue-500/10 border-blue-500/20 text-blue-500',
                'backdrop-blur-sm',
                'dark:bg-blue-500/10 dark:border-blue-400/20 dark:text-blue-400',
            ].join(' '),
        },
        cancelled: {
            label: 'Cancelled',
            className: [
                'inline-flex items-center px-2.5 py-0.5',
                'text-[11px] font-medium tracking-wide',
                'rounded-full border',
                'bg-red-500/10 border-red-500/20 text-red-500',
                'backdrop-blur-sm',
                'dark:bg-red-500/10 dark:border-red-400/20 dark:text-red-400',
            ].join(' '),
        },
        completed: {
            label: 'Completed',
            className: [
                'inline-flex items-center px-2.5 py-0.5',
                'text-[11px] font-medium tracking-wide',
                'rounded-full border',
                'bg-emerald-500/10 border-emerald-500/20 text-emerald-500',
                'backdrop-blur-sm',
                'dark:bg-emerald-500/10 dark:border-emerald-400/20 dark:text-emerald-400',
            ].join(' '),
        },
    };

export default function EventStatusBadge({ status }: EventStatusBadgeProps) {
    const config = statusConfig[status];

    return <Badge className={config.className}>{config.label}</Badge>;
}
