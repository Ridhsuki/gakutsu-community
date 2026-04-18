import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { EventItem, EventRegistrationQuestionItem } from '@/features/events/types';

interface PageProps {
    event: EventItem;
    registrationQuestions: EventRegistrationQuestionItem[];
    alreadyRegistered: boolean;
}

function formatDate(value: string | null) {
    if (!value) return '-';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return '-';

    return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}

export default function EventsShow({
    event,
    registrationQuestions,
    alreadyRegistered,
}: PageProps) {
    const initialAnswers = registrationQuestions.reduce<Record<string, string>>(
        (carry, question) => {
            carry[String(question.id)] = '';
            return carry;
        },
        {},
    );

    const form = useForm({
        answers: initialAnswers,
    });

    const handleRegister = () => {
        form.post(`/events/${event.id}/registrations`, {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title={event.title} />

            <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8">
                <div className="space-y-2">
                    <Link href="/events" className="text-sm text-muted-foreground underline">
                        Back to events
                    </Link>

                    <h1 className="text-3xl font-semibold">{event.title}</h1>
                    <p className="text-sm text-muted-foreground">{event.category}</p>
                    <p className="text-sm text-muted-foreground">
                        Instructor: {event.instructor?.name ?? '-'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Start: {formatDate(event.starts_at)}
                    </p>
                </div>

                <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                    <div className="prose max-w-none text-sm text-foreground">
                        {event.description}
                    </div>

                    <div className="mt-8 space-y-6">
                        {registrationQuestions.length > 0 ? (
                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold">Registration Form</h2>

                                {registrationQuestions.map((question) => (
                                    <div key={question.id} className="grid gap-2">
                                        <label className="text-sm font-medium">
                                            {question.label}
                                            {question.is_required ? (
                                                <span className="ml-1 text-red-600">*</span>
                                            ) : null}
                                        </label>

                                        {question.help_text ? (
                                            <p className="text-xs text-muted-foreground">
                                                {question.help_text}
                                            </p>
                                        ) : null}

                                        {question.type === 'short_text' ? (
                                            <Input
                                                value={form.data.answers[String(question.id)] ?? ''}
                                                onChange={(e) =>
                                                    form.setData('answers', {
                                                        ...form.data.answers,
                                                        [String(question.id)]: e.currentTarget.value,
                                                    })
                                                }
                                                placeholder={question.placeholder ?? ''}
                                            />
                                        ) : null}

                                        {question.type === 'long_text' ? (
                                            <textarea
                                                value={form.data.answers[String(question.id)] ?? ''}
                                                onChange={(e) =>
                                                    form.setData('answers', {
                                                        ...form.data.answers,
                                                        [String(question.id)]: e.currentTarget.value,
                                                    })
                                                }
                                                placeholder={question.placeholder ?? ''}
                                                className="min-h-28 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                            />
                                        ) : null}

                                        {question.type === 'select' ? (
                                            <select
                                                value={form.data.answers[String(question.id)] ?? ''}
                                                onChange={(e) =>
                                                    form.setData('answers', {
                                                        ...form.data.answers,
                                                        [String(question.id)]: e.currentTarget.value,
                                                    })
                                                }
                                                className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                            >
                                                <option value="">Select an option</option>
                                                {(question.options ?? []).map((option) => (
                                                    <option key={option} value={option}>
                                                        {option}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : null}

                                        {form.errors[`answers.${question.id}`] ? (
                                            <p className="text-sm text-red-600">
                                                {form.errors[`answers.${question.id}`]}
                                            </p>
                                        ) : null}
                                    </div>
                                ))}
                            </div>
                        ) : null}

                        <div className="flex flex-wrap gap-3">
                            {alreadyRegistered ? (
                                <Button type="button" disabled>
                                    Already Registered
                                </Button>
                            ) : (
                                <Button
                                    type="button"
                                    onClick={handleRegister}
                                    disabled={form.processing}
                                >
                                    {form.processing ? 'Registering...' : 'Register Event'}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
