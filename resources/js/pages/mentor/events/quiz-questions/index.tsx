import QuizQuestionManagementPage from '@/features/quizzes/pages/quiz-question-management-page';

export default function MentorQuizQuestionsIndex(props: any) {
    return (
        <QuizQuestionManagementPage
            {...props}
            routePrefix={`/mentor/events/${props.event.id}/quiz-questions`}
            backHref="/mentor/events"
            headTitle={`Quiz Questions - ${props.event.title}`}
        />
    );
}
