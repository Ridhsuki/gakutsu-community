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

export default function AdminEventRegistrationsIndex(props: Props) {
    return (
        <EventRegistrationsPage
            {...props}
            endpoint={`/admin/events/${props.event.id}/registrations`}
            detailBaseUrl={`/admin/events/${props.event.id}/registrations`}
            fallbackHref="/admin/events"
            headTitle={`Registrants - ${props.event.title}`}
        />
    );
}
