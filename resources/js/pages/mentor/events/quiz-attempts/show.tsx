import QuizAttemptDetailPage from '@/features/quizzes/pages/quiz-attempt-detail-page';

export default function MentorQuizAttemptShow(props: any) {
    return (
        <QuizAttemptDetailPage
            {...props}
            backHref={`/mentor/events/${props.event.id}/quiz-attempts`}
            gradeBaseHref={`/mentor/events/${props.event.id}/quiz-attempts/${props.attempt.id}`}
            headTitle={`Quiz Attempt - ${props.attempt.user?.name ?? 'User'}`}
        />
    );
}
