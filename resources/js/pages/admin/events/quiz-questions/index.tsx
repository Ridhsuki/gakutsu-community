import QuizQuestionManagementPage from '@/features/quizzes/pages/quiz-question-management-page';

export default function AdminQuizQuestionsIndex(props: any) {
    return (
        <QuizQuestionManagementPage
            {...props}
            routePrefix={`/admin/events/${props.event.id}/quiz-questions`}
            backHref="/admin/events"
            headTitle={`Quiz Questions - ${props.event.title}`}
        />
    );
}
