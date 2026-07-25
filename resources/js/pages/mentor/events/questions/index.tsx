import EventRegistrationQuestionManagementPage from '@/features/events/pages/event-registration-question-management-page';
import type { EventItem } from '@/features/events/types';
import type { PaginatedResponse } from '@/types/pagination';

interface Props {
    event: EventItem;
    questions: PaginatedResponse;
    filters: {
        search?: string | null;
    };
}

export default function MentorEventRegistrationQuestionsIndex(props: Props) {
    return (
        <EventRegistrationQuestionManagementPage
            {...props}
            endpoint={`/mentor/events/${props.event.id}/registration-questions`}
            fallbackHref="/mentor/events"
            headTitle={`Registration Form - ${props.event.title}`}
        />
    );
}
