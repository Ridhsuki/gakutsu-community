import { Head } from '@inertiajs/react';
import { FileSearch } from 'lucide-react';
import ContextBackButton from '@/components/navigation/context-back-button';
import { Badge } from '@/components/ui/badge';
import QuizManualGradeCard from '@/features/quizzes/components/quiz-manual-grade-card';
import type {
    EventQuizAttemptItem,
    QuizEventSummary,
} from '@/features/quizzes/types';

export default function QuizAttemptDetailPage({
    attempt,
    backHref,
    gradeBaseHref,
    headTitle,
}: {
    event: QuizEventSummary;
    attempt: EventQuizAttemptItem;
    backHref: string;
    gradeBaseHref: string;
    headTitle: string;
}) {
    return (
        <>
            <Head title={headTitle} />

            <div className="flex h-full w-full flex-col space-y-6 p-6">
                <div className="space-y-3">
                    <ContextBackButton
                        fallbackHref={backHref}
                        label="Back to attempts"
                    />

                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <FileSearch className="h-5 w-5 text-primary" />
                            <h1 className="text-2xl font-semibold tracking-tight">
                                Attempt Detail · {attempt.user?.name ?? 'User'}
                            </h1>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                            <span>
                                Score: {attempt.total_score} /{' '}
                                {attempt.max_score}
                            </span>
                            <Badge
                                variant={
                                    attempt.status === 'graded'
                                        ? 'default'
                                        : 'secondary'
                                }
                            >
                                {attempt.status}
                            </Badge>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    {(attempt.answers ?? []).map((answer) => (
                        <div
                            key={answer.id}
                            className="rounded-xl border border-border bg-card p-5 shadow-sm"
                        >
                            <div className="space-y-3">
                                <div className="flex flex-wrap items-center gap-2">
                                    <Badge variant="secondary">
                                        {answer.question_type_snapshot ===
                                        'multiple_choice'
                                            ? 'Multiple Choice'
                                            : 'Short Text'}
                                    </Badge>

                                    <Badge variant="outline">
                                        {answer.question_points_snapshot} pts
                                    </Badge>
                                </div>

                                <h3 className="font-semibold">
                                    {answer.question_prompt_snapshot}
                                </h3>

                                {answer.question_type_snapshot ===
                                'multiple_choice' ? (
                                    <div className="space-y-2 text-sm text-muted-foreground">
                                        <p>
                                            Selected answer:{' '}
                                            {answer.option_text_snapshot ?? '-'}
                                        </p>
                                        <p>
                                            Result:{' '}
                                            {answer.is_correct
                                                ? 'Correct'
                                                : 'Incorrect'}
                                        </p>
                                        <p>
                                            Score: {answer.awarded_score} /{' '}
                                            {answer.question_points_snapshot}
                                        </p>
                                    </div>
                                ) : (
                                    <QuizManualGradeCard
                                        answer={answer}
                                        submitUrl={`${gradeBaseHref}/answers/${answer.id}`}
                                    />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}
