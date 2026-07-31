import EventFormPage from '@/features/events/pages/event-form-page';
import type { EventItem } from '@/features/events/types';

export default function MentorEventEdit({ event }: { event: EventItem }) {
    return (
        <EventFormPage
            mode="edit"
            title={`Edit Event - ${event.title}`}
            submitUrl={`/mentor/events/${event.id}`}
            method="put"
            backHref="/mentor/events"
            event={event}
            manageQuestionsHref={`/mentor/events/${event.id}/registration-questions`}
            registrationQuestions={event.registration_questions ?? []}
        />
    );
}
