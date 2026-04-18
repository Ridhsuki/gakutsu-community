import EventRegistrationsPage from '@/features/events/pages/event-registrations-page';
import type { EventItem, EventRegistrationItem } from '@/features/events/types';
import type { PaginatedResponse } from '@/types/pagination';

interface Props {
    event: EventItem;
    registrations: PaginatedResponse<EventRegistrationItem>;
    filters: { search?: string | null };
}

export default function MentorEventRegistrationsIndex(props: Props) {
    return (
        <EventRegistrationsPage
            {...props}
            endpoint={`/mentor/events/${props.event.id}/registrations`}
            headTitle={`Registrations - ${props.event.title}`}
        />
    );
}
