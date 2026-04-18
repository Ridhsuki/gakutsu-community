import EventRegistrationDetailPage from '@/features/events/pages/event-registration-detail-page';
import type { EventItem, EventRegistrationItem } from '@/features/events/types';

export default function MentorEventRegistrationShow({
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
            backHref={`/mentor/events/${event.id}/registrations`}
            headTitle={`Registration Detail - ${registration.name_snapshot}`}
        />
    );
}
