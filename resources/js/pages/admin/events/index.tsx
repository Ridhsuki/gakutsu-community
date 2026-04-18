import EventManagementPage, {
    type EventManagementPageSharedProps,
} from '@/features/events/pages/event-management-page';
import { ADMIN_EVENTS_INDEX_URL } from '@/features/events/constants';

export default function AdminEventIndex(props: EventManagementPageSharedProps) {
    return (
        <EventManagementPage
            {...props}
            endpoint={ADMIN_EVENTS_INDEX_URL}
            headTitle="Event Management"
            title="Event Management"
            description="Manage webinar and community events."
            registrationsBaseUrl={ADMIN_EVENTS_INDEX_URL}
            canAssignMentor
        />
    );
}
