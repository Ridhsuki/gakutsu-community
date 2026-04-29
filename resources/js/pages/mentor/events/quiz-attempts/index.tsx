import QuizAttemptsPage from '@/features/quizzes/pages/quiz-attempts-page';

export default function MentorQuizAttemptsIndex(props: any) {
    return (
        <QuizAttemptsPage
            {...props}
            backHref="/mentor/events"
            detailBaseHref={`/mentor/events/${props.event.id}/quiz-attempts`}
            headTitle={`Quiz Attempts - ${props.event.title}`}
        />
    );
}
