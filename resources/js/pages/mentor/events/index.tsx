import EventManagementPage, {
    type EventManagementPageSharedProps,
} from '@/features/events/pages/event-management-page';
import { MENTOR_EVENTS_INDEX_URL } from '@/features/events/constants';

export default function MentorEventIndex(props: EventManagementPageSharedProps) {
    return (
        <EventManagementPage
            {...props}
            endpoint={MENTOR_EVENTS_INDEX_URL}
            headTitle="My Events"
            title="My Events"
            description="Manage your own webinar and community events."
            registrationsBaseUrl={MENTOR_EVENTS_INDEX_URL}
        />
    );
}
