import EventFormPage from '@/features/events/pages/event-form-page';
import type { EventMentorOption } from '@/features/events/types';

export default function AdminEventCreate({
    mentors,
}: {
    mentors: EventMentorOption[];
}) {
    return (
        <EventFormPage
            mode="create"
            title="Create Event"
            submitUrl="/admin/events"
            method="post"
            backHref="/admin/events"
            mentors={mentors}
            canAssignMentor
        />
    );
}
