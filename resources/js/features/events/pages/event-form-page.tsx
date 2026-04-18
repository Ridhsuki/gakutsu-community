import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, ClipboardList, Save } from 'lucide-react';
import EmptyState from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';
import EventFormFields from '@/features/events/components/event-form-fields';
import { getDefaultCreateEventForm, mapEventToEditEventForm } from '@/features/events/form-helpers';
import type { EventItem, EventMentorOption, EventRegistrationQuestionItem } from '@/features/events/types';

interface EventFormPageProps {
    mode: 'create' | 'edit';
    title: string;
    submitUrl: string;
    method: 'post' | 'put';
    backHref: string;
    event?: EventItem | null;
    mentors?: EventMentorOption[];
    canAssignMentor?: boolean;
    manageQuestionsHref?: string | null;
    registrationQuestions?: EventRegistrationQuestionItem[];
}

export default function EventFormPage({
    mode,
    title,
    submitUrl,
    method,
    backHref,
    event = null,
    mentors = [],
    canAssignMentor = false,
    manageQuestionsHref = null,
    registrationQuestions = [],
}: EventFormPageProps) {
    const form = useForm(
        event ? mapEventToEditEventForm(event) : getDefaultCreateEventForm(),
    );

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (method === 'post') {
            form.post(submitUrl, {
                preserveScroll: true,
                forceFormData: true,
            });
            return;
        }

        form.put(submitUrl, {
            preserveScroll: true,
            forceFormData: true,
        });
    };

    return (
        <>
            <Head title={title} />

            <div className="flex h-full w-full flex-col space-y-6 p-6">
                <div className="flex flex-col gap-3">
                    <div>
                        <Button type="button" variant="ghost" asChild className="px-0">
                            <Link href={backHref}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to events
                            </Link>
                        </Button>
                    </div>

                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
                        <p className="text-sm text-muted-foreground">
                            {mode === 'create'
                                ? 'Create a new event and save it before configuring the registration form.'
                                : 'Update event information and manage the registration form below.'}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
                    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                        <EventFormFields
                            form={form}
                            mentors={mentors}
                            canAssignMentor={canAssignMentor}
                        />
                    </div>

                    <div className="space-y-6">
                        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                            <h2 className="text-base font-semibold">Actions</h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Save the event first, then continue with registration form setup.
                            </p>

                            <div className="mt-4 flex flex-col gap-3">
                                <Button type="submit" disabled={form.processing}>
                                    <Save className="mr-2 h-4 w-4" />
                                    {form.processing
                                        ? 'Saving...'
                                        : mode === 'create'
                                            ? 'Create Event'
                                            : 'Save Changes'}
                                </Button>

                                <Button type="button" variant="outline" asChild>
                                    <Link href={backHref}>Cancel</Link>
                                </Button>
                            </div>
                        </div>

                        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <h2 className="text-base font-semibold">Registration Form</h2>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Additional questions for participants.
                                    </p>
                                </div>

                                {manageQuestionsHref ? (
                                    <Button type="button" variant="outline" asChild>
                                        <Link href={manageQuestionsHref}>
                                            <ClipboardList className="mr-2 h-4 w-4" />
                                            Manage
                                        </Link>
                                    </Button>
                                ) : null}
                            </div>

                            <div className="mt-4">
                                {mode === 'create' || !event ? (
                                    <EmptyState
                                        size="md"
                                        title="Save event first"
                                        description="Registration questions can be configured after the event has been created."
                                    />
                                ) : registrationQuestions.length > 0 ? (
                                    <div className="space-y-3">
                                        <div className="text-sm text-muted-foreground">
                                            Total questions: {registrationQuestions.length}
                                        </div>

                                        <div className="rounded-lg border border-border">
                                            <div className="divide-y divide-border">
                                                {registrationQuestions.slice(0, 5).map((question) => (
                                                    <div key={question.id} className="flex items-start justify-between gap-3 p-3">
                                                        <div>
                                                            <div className="font-medium">{question.label}</div>
                                                            <div className="text-xs text-muted-foreground">
                                                                {question.type} · {question.is_required ? 'Required' : 'Optional'}
                                                            </div>
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">
                                                            #{question.sort_order}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <EmptyState
                                        size="md"
                                        title="No registration questions yet"
                                        description="You can keep registration simple or add custom questions."
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}
