import EventDetailPage from '@/features/events/pages/event-detail-page';
import type { EventItem } from '@/features/events/types';

export default function AdminEventShow({ event }: { event: EventItem }) {
    return (
        <EventDetailPage
            event={event}
            backHref="/admin/events"
            editHref={`/admin/events/${event.id}/edit`}
            registrationsHref={`/admin/events/${event.id}/registrations`}
            registrationDetailBaseHref={`/admin/events/${event.id}/registrations`}
            questionsHref={`/admin/events/${event.id}/registration-questions`}
            title={`Event Detail - ${event.title}`}
        />
    );
}
