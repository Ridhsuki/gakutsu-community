import EventRegistrationDetailPage from '@/features/events/pages/event-registration-detail-page';
import type { EventItem, EventRegistrationItem } from '@/features/events/types';

export default function AdminEventRegistrationShow({
    event,
    registration,
}: {
    event: EventItem;
    registration: EventRegistrationItem;
}) {
    return (
        <EventRegistrationDetailPage
            event={event}
            registration={registration}
            backHref={`/admin/events/${event.id}/registrations`}
            headTitle={`Registration Detail - ${registration.name_snapshot}`}
        />
    );
}
