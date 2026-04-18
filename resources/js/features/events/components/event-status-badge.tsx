import { cn } from '@/lib/utils';
import type { EventStatus } from '@/features/events/types';

interface EventStatusBadgeProps {
    status: EventStatus;
}

const labelMap: Record<EventStatus, string> = {
    upcoming: 'Upcoming',
    cancelled: 'Cancelled',
    completed: 'Completed',
};

const classMap: Record<EventStatus, string> = {
    upcoming: 'border-blue-200 bg-blue-50 text-blue-700',
    cancelled: 'border-red-200 bg-red-50 text-red-700',
    completed: 'border-emerald-200 bg-emerald-50 text-emerald-700',
};

export default function EventStatusBadge({ status }: EventStatusBadgeProps) {
    return (
        <span
            className={cn(
                'inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium',
                classMap[status],
            )}
        >
            {labelMap[status]}
        </span>
    );
}
