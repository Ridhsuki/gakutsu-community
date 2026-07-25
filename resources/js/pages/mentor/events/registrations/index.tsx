import EventRegistrationsPage from '@/features/events/pages/event-registrations-page';
import type { EventItem } from '@/features/events/types';
import type { PaginatedResponse } from '@/types/pagination';

interface Props {
    event: EventItem;
    registrations: PaginatedResponse;
    filters: {
        search?: string | null;
    };
}

export default function MentorEventRegistrationsIndex(props: Props) {
    return (
        <EventRegistrationsPage
            {...props}
            endpoint={`/mentor/events/${props.event.id}/registrations`}
            detailBaseUrl={`/mentor/events/${props.event.id}/registrations`}
            fallbackHref="/mentor/events"
            headTitle={`Registrants - ${props.event.title}`}
        />
    );
}
