import EventFormPage from '@/features/events/pages/event-form-page';
import type { EventItem, EventMentorOption } from '@/features/events/types';

export default function AdminEventEdit({
    event,
    mentors,
}: {
    event: EventItem;
    mentors: EventMentorOption[];
}) {
    return (
        <EventFormPage
            mode="edit"
            title={`Edit Event - ${event.title}`}
            submitUrl={`/admin/events/${event.id}`}
            method="put"
            backHref="/admin/events"
            event={event}
            mentors={mentors}
            canAssignMentor
            manageQuestionsHref={`/admin/events/${event.id}/registration-questions`}
            registrationQuestions={event.registration_questions ?? []}
        />
    );
}
