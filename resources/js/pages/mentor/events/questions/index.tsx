import EventRegistrationQuestionManagementPage from '@/features/events/pages/event-registration-question-management-page';
import type { EventItem, EventRegistrationQuestionItem } from '@/features/events/types';
import type { PaginatedResponse } from '@/types/pagination';

interface Props {
    event: EventItem;
    questions: PaginatedResponse<EventRegistrationQuestionItem>;
    filters: { search?: string | null };
}

export default function MentorEventRegistrationQuestionsIndex(props: Props) {
    return (
        <EventRegistrationQuestionManagementPage
            {...props}
            endpoint={`/mentor/events/${props.event.id}/registration-questions`}
            headTitle="Registration Form Management"
        />
    );
}
