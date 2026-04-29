import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { EventQuizAnswerItem } from '@/features/quizzes/types';

export default function QuizManualGradeCard({
    answer,
    submitUrl,
}: {
    answer: EventQuizAnswerItem;
    submitUrl: string;
}) {
    const form = useForm({
        awarded_score: answer.awarded_score,
        feedback: answer.feedback ?? '',
    });

    const submit = () => {
        form.patch(submitUrl, {
            preserveScroll: true,
        });
    };

    return (
        <div className="space-y-4">
            <div className="rounded-lg border border-border bg-muted/30 p-4">
                <p className="whitespace-pre-wrap text-sm">
                    {answer.answer_text || '-'}
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-[140px_minmax(0,1fr)]">
                <div className="grid gap-2">
                    <label className="text-sm font-medium">Score</label>
                    <Input
                        type="number"
                        min={0}
                        max={answer.question_points_snapshot}
                        value={form.data.awarded_score}
                        onChange={(e) =>
                            form.setData('awarded_score', Number(e.currentTarget.value))
                        }
                    />
                </div>

                <div className="grid gap-2">
                    <label className="text-sm font-medium">Feedback</label>
                    <Textarea
                        className="min-h-24"
                        value={form.data.feedback}
                        onChange={(e) => form.setData('feedback', e.currentTarget.value)}
                    />
                </div>
            </div>

            <div className="flex justify-end">
                <Button type="button" onClick={submit} disabled={form.processing}>
                    Save Grade
                </Button>
            </div>
        </div>
    );
}
