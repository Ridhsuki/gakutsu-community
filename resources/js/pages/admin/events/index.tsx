import EventManagementPage from '@/features/events/pages/event-management-page';
import type { EventManagementPageSharedProps } from '@/features/events/pages/event-management-page';

export default function AdminEventIndex(
    props: EventManagementPageSharedProps['events'] extends never ? never : any,
) {
    return (
        <EventManagementPage
            {...props}
            createHref="/admin/events/create"
            showBaseUrl="/admin/events"
            editBaseUrl="/admin/events"
            registrationsBaseUrl="/admin/events"
            questionsBaseUrl="/admin/events"
            deleteBaseUrl="/admin/events"
            headTitle="Event Management"
            title="Event Management"
            description="Manage webinar and community events."
        />
    );
}
