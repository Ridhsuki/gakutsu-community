import { Head, router, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import { Plus, Save, Trash2, Pencil, ListChecks } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import ContextBackButton from '@/components/navigation/context-back-button';
import EventQuizQuestionDeleteDialog from '@/features/quizzes/components/event-quiz-question-delete-dialog';
import type {
    EventQuizQuestionItem,
    EventQuizQuestionType,
    QuizEventSummary,
} from '@/features/quizzes/types';

type OptionDraft = {
    option_text: string;
    is_correct: boolean;
    sort_order: number;
};

function makeDefaultOptions(): OptionDraft[] {
    return [
        { option_text: '', is_correct: false, sort_order: 0 },
        { option_text: '', is_correct: false, sort_order: 1 },
    ];
}

function makeDefaultForm() {
    return {
        type: 'multiple_choice' as EventQuizQuestionType,
        prompt: '',
        points: 10,
        is_active: true,
        sort_order: 0,
        explanation: '',
        options: makeDefaultOptions(),
    };
}

export default function QuizQuestionManagementPage({
    event,
    questions,
    routePrefix,
    backHref,
    headTitle,
}: {
    event: QuizEventSummary;
    questions: EventQuizQuestionItem[];
    routePrefix: string;
    backHref: string;
    headTitle: string;
}) {
    const [editingQuestion, setEditingQuestion] = useState<EventQuizQuestionItem | null>(null);
    const [deletingQuestion, setDeletingQuestion] = useState<EventQuizQuestionItem | null>(null);
    const form = useForm(makeDefaultForm());
    const questionCount = questions.length;

    const resetForm = () => {
        setEditingQuestion(null);
        form.setData(makeDefaultForm());
        form.clearErrors();
    };

    const startEdit = (question: EventQuizQuestionItem) => {
        setEditingQuestion(question);
        form.setData({
            type: question.type,
            prompt: question.prompt,
            points: question.points,
            is_active: question.is_active,
            sort_order: question.sort_order,
            explanation: question.explanation ?? '',
            options:
                question.type === 'multiple_choice'
                    ? question.options.map((option) => ({
                          option_text: option.option_text,
                          is_correct: option.is_correct,
                          sort_order: option.sort_order,
                      }))
                    : makeDefaultOptions(),
        });
    };

    const submit = () => {
        if (editingQuestion) {
            form.put(`${routePrefix}/${editingQuestion.id}`, {
                preserveScroll: true,
                onSuccess: resetForm,
            });
            return;
        }

        form.post(routePrefix, {
            preserveScroll: true,
            onSuccess: resetForm,
        });
    };

    const handleDeleteConfirm = () => {
        if (!deletingQuestion) {
            return;
        }

        router.delete(`${routePrefix}/${deletingQuestion.id}`, {
            preserveScroll: true,
            onFinish: () => setDeletingQuestion(null),
        });
    };

    const addOption = () => {
        form.setData('options', [
            ...form.data.options,
            {
                option_text: '',
                is_correct: false,
                sort_order: form.data.options.length,
            },
        ]);
    };

    const updateOption = (index: number, key: keyof OptionDraft, value: string | boolean | number) => {
        const next = [...form.data.options];
        next[index] = {
            ...next[index],
            [key]: value,
        };
        form.setData('options', next);
    };

    const removeOption = (index: number) => {
        const next = form.data.options
            .filter((_, currentIndex) => currentIndex !== index)
            .map((option, currentIndex) => ({
                ...option,
                sort_order: currentIndex,
            }));

        form.setData('options', next.length > 0 ? next : makeDefaultOptions());
    };

    const orderedQuestions = useMemo(
        () => [...questions].sort((a, b) => a.sort_order - b.sort_order || a.id - b.id),
        [questions]
    );

    return (
        <>
            <Head title={headTitle} />

            <div className="flex h-full w-full flex-col space-y-6 p-6">
                <div className="space-y-3">
                    <ContextBackButton fallbackHref={backHref} label="Back" />

                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <ListChecks className="h-5 w-5 text-primary" />
                            <h1 className="text-2xl font-semibold tracking-tight">
                                Quiz Questions · {event.title}
                            </h1>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Manage optional post-event quiz questions for this event.
                        </p>
                    </div>
                </div>

                <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_420px]">
                    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <h2 className="text-base font-semibold">Question List</h2>
                                <p className="text-sm text-muted-foreground">
                                    Total questions: {questionCount}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {orderedQuestions.length === 0 ? (
                                <div className="rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground">
                                    No quiz questions yet.
                                </div>
                            ) : (
                                orderedQuestions.map((question) => (
                                    <div
                                        key={question.id}
                                        className="rounded-lg border border-border p-4 transition-colors hover:bg-muted/20"
                                    >
                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                            <div className="min-w-0 space-y-2">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <Badge variant="secondary">
                                                        {question.type === 'multiple_choice'
                                                            ? 'Multiple Choice'
                                                            : 'Short Text'}
                                                    </Badge>

                                                    <Badge variant="outline">
                                                        {question.points} pts
                                                    </Badge>

                                                    <Badge
                                                        variant={question.is_active ? 'default' : 'outline'}
                                                    >
                                                        {question.is_active ? 'Active' : 'Inactive'}
                                                    </Badge>
                                                </div>

                                                <p className="font-medium leading-6">{question.prompt}</p>

                                                {question.type === 'multiple_choice' ? (
                                                    <ul className="space-y-1 text-sm text-muted-foreground">
                                                        {question.options.map((option) => (
                                                            <li key={option.id}>
                                                                {option.is_correct ? '✓' : '•'} {option.option_text}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <p className="text-sm text-muted-foreground">
                                                        Manual grading required.
                                                    </p>
                                                )}
                                            </div>

                                            <div className="flex shrink-0 items-center gap-2">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => startEdit(question)}
                                                >
                                                    <Pencil className="mr-2 h-4 w-4" />
                                                    Edit
                                                </Button>

                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setDeletingQuestion(question)}
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                        <div className="space-y-1">
                            <h2 className="text-base font-semibold">
                                {editingQuestion ? 'Edit Question' : 'Create Question'}
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Multiple choice questions are auto-graded. Short text answers require manual grading.
                            </p>
                        </div>

                        <div className="mt-4 grid gap-4">
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Question Type</label>
                                <Select
                                    value={form.data.type}
                                    onValueChange={(value: EventQuizQuestionType) =>
                                        form.setData('type', value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                                        <SelectItem value="short_text">Short Text</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Prompt</label>
                                <Textarea
                                    value={form.data.prompt}
                                    onChange={(e) => form.setData('prompt', e.currentTarget.value)}
                                    className="min-h-28"
                                />
                                {form.errors.prompt ? (
                                    <p className="text-sm text-red-500">{form.errors.prompt}</p>
                                ) : null}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">Points</label>
                                    <Input
                                        type="number"
                                        min={1}
                                        value={form.data.points}
                                        onChange={(e) => form.setData('points', Number(e.currentTarget.value))}
                                    />
                                </div>

                                <div className="grid gap-2">
                                    <label className="text-sm font-medium">Sort Order</label>
                                    <Input
                                        type="number"
                                        min={0}
                                        value={form.data.sort_order}
                                        onChange={(e) => form.setData('sort_order', Number(e.currentTarget.value))}
                                    />
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Explanation</label>
                                <Textarea
                                    value={form.data.explanation}
                                    onChange={(e) => form.setData('explanation', e.currentTarget.value)}
                                    className="min-h-24"
                                />
                            </div>

                            <label className="flex items-center gap-2 text-sm font-medium">
                                <Checkbox
                                    checked={form.data.is_active}
                                    onCheckedChange={(checked) => form.setData('is_active', Boolean(checked))}
                                />
                                Active
                            </label>

                            {form.data.type === 'multiple_choice' ? (
                                <div className="space-y-3 rounded-lg border border-border p-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-semibold">Options</h3>
                                        <Button type="button" variant="outline" size="sm" onClick={addOption}>
                                            <Plus className="mr-2 h-4 w-4" />
                                            Add Option
                                        </Button>
                                    </div>

                                    <div className="space-y-3">
                                        {form.data.options.map((option, index) => (
                                            <div key={index} className="grid gap-2 rounded-md border border-border p-3">
                                                <Input
                                                    value={option.option_text}
                                                    onChange={(e) =>
                                                        updateOption(index, 'option_text', e.currentTarget.value)
                                                    }
                                                    placeholder={`Option ${index + 1}`}
                                                />

                                                <div className="flex items-center justify-between">
                                                    <label className="flex items-center gap-2 text-sm">
                                                        <Checkbox
                                                            checked={option.is_correct}
                                                            onCheckedChange={(checked) =>
                                                                updateOption(index, 'is_correct', Boolean(checked))
                                                            }
                                                        />
                                                        Correct answer
                                                    </label>

                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeOption(index)}
                                                    >
                                                        Remove
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {form.errors.options ? (
                                        <p className="text-sm text-red-500">{form.errors.options}</p>
                                    ) : null}
                                </div>
                            ) : null}

                            <div className="flex items-center gap-2 pt-2">
                                <Button type="button" onClick={submit} disabled={form.processing}>
                                    <Save className="mr-2 h-4 w-4" />
                                    {editingQuestion ? 'Save Changes' : 'Create Question'}
                                </Button>

                                {editingQuestion ? (
                                    <Button type="button" variant="outline" onClick={resetForm}>
                                        Cancel
                                    </Button>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <EventQuizQuestionDeleteDialog
                open={deletingQuestion !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setDeletingQuestion(null);
                    }
                }}
                question={deletingQuestion}
                onConfirm={handleDeleteConfirm}
            />
        </>
    );
}
