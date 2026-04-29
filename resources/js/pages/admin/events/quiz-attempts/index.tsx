import QuizAttemptsPage from '@/features/quizzes/pages/quiz-attempts-page';

export default function AdminQuizAttemptsIndex(props: any) {
    return (
        <QuizAttemptsPage
            {...props}
            backHref="/admin/events"
            detailBaseHref={`/admin/events/${props.event.id}/quiz-attempts`}
            headTitle={`Quiz Attempts - ${props.event.title}`}
        />
    );
}
