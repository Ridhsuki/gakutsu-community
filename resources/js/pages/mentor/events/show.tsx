import EventDetailPage from '@/features/events/pages/event-detail-page';
import type { EventItem } from '@/features/events/types';

export default function MentorEventShow({
    event,
}: {
    event: EventItem;
}) {
    return (
        <EventDetailPage
            event={event}
            backHref="/mentor/events"
            editHref={`/mentor/events/${event.id}/edit`}
            registrationsHref={`/mentor/events/${event.id}/registrations`}
            questionsHref={`/mentor/events/${event.id}/registration-questions`}
            title={`Event Detail - ${event.title}`}
        />
    );
}
