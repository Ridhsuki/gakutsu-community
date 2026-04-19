import { CalendarDays } from 'lucide-react';
import EmptyState from '@/components/ui/empty-state';
import EventCard from '@/features/events/components/event-card';
import type { EventItem } from '@/features/events/types';

interface EventCardGridProps {
    events: EventItem[];
    showBaseUrl: string;
    editBaseUrl: string;
    registrationsBaseUrl: string;
    questionsBaseUrl: string;
    onDelete: (event: EventItem) => void;
}

export default function EventCardGrid({
    events,
    showBaseUrl,
    editBaseUrl,
    registrationsBaseUrl,
    questionsBaseUrl,
    onDelete,
}: EventCardGridProps) {
    if (events.length === 0) {
        return (
            <EmptyState
                icon={CalendarDays}
                title="No events found"
                description="Try adjusting your search or create a new event."
                size="lg"
            />
        );
    }

    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {events.map((event) => (
                <EventCard
                    key={event.id}
                    event={event}
                    showBaseUrl={showBaseUrl}
                    editBaseUrl={editBaseUrl}
                    registrationsBaseUrl={registrationsBaseUrl}
                    questionsBaseUrl={questionsBaseUrl}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}
