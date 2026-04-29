import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import QuizManualGradeCard from '@/features/quizzes/components/quiz-manual-grade-card';
import type { EventQuizAttemptItem, QuizEventSummary } from '@/features/quizzes/types';

export default function QuizAttemptDetailPage({
    event,
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
                <div className="flex flex-col gap-3">
                    <div>
                        <Button type="button" variant="ghost" asChild className="px-0">
                            <Link href={backHref}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to attempts
                            </Link>
                        </Button>
                    </div>

                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Attempt Detail · {attempt.user?.name ?? 'User'}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Score: {attempt.total_score} / {attempt.max_score} · Status: {attempt.status}
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    {(attempt.answers ?? []).map((answer) => (
                        <div key={answer.id} className="rounded-xl border border-border bg-card p-5 shadow-sm">
                            <div className="space-y-2">
                                <div className="text-sm font-medium text-primary">
                                    {answer.question_type_snapshot === 'multiple_choice'
                                        ? 'Multiple Choice'
                                        : 'Short Text'}
                                </div>

                                <h3 className="font-semibold">{answer.question_prompt_snapshot}</h3>

                                {answer.question_type_snapshot === 'multiple_choice' ? (
                                    <>
                                        <p className="text-sm text-muted-foreground">
                                            Selected answer: {answer.option_text_snapshot ?? '-'}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Result: {answer.is_correct ? 'Correct' : 'Incorrect'}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Score: {answer.awarded_score} / {answer.question_points_snapshot}
                                        </p>
                                    </>
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
