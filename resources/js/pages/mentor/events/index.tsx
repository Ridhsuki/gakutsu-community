import EventManagementPage from '@/features/events/pages/event-management-page';

export default function MentorEventIndex(props: any) {
    return (
        <EventManagementPage
            {...props}
            createHref="/mentor/events/create"
            showBaseUrl="/mentor/events"
            editBaseUrl="/mentor/events"
            registrationsBaseUrl="/mentor/events"
            questionsBaseUrl="/mentor/events"
            deleteBaseUrl="/mentor/events"
            headTitle="My Events"
            title="My Events"
            description="Manage your own webinar and community events."
        />
    );
}
