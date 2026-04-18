import EventFormPage from '@/features/events/pages/event-form-page';

export default function MentorEventCreate() {
    return (
        <EventFormPage
            mode="create"
            title="Create Event"
            submitUrl="/mentor/events"
            method="post"
            backHref="/mentor/events"
        />
    );
}
