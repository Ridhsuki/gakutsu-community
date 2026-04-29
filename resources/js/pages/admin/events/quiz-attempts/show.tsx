import QuizAttemptDetailPage from '@/features/quizzes/pages/quiz-attempt-detail-page';

export default function AdminQuizAttemptShow(props: any) {
    return (
        <QuizAttemptDetailPage
            {...props}
            backHref={`/admin/events/${props.event.id}/quiz-attempts`}
            gradeBaseHref={`/admin/events/${props.event.id}/quiz-attempts/${props.attempt.id}`}
            headTitle={`Quiz Attempt - ${props.attempt.user?.name ?? 'User'}`}
        />
    );
}
