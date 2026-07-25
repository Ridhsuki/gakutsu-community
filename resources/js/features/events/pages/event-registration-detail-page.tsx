import { Head } from '@inertiajs/react';
import ContextBackButton from '@/components/navigation/context-back-button';
import type { EventItem, EventRegistrationItem } from '@/features/events/types';

interface EventRegistrationDetailPageProps {
    event: EventItem;
    registration: EventRegistrationItem;
    backHref: string;
    headTitle?: string;
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

export default function EventRegistrationDetailPage({
    event,
    registration,
    backHref,
    headTitle,
}: EventRegistrationDetailPageProps) {
    return (
        <>
            <Head title={headTitle ?? 'Registration Detail'} />

            <div className="flex h-full w-full flex-col space-y-6 p-6">
                <div className="space-y-3">
                    <ContextBackButton fallbackHref={backHref} label="Back to registrations" />

                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold tracking-tight">Registration Detail</h1>
                        <p className="text-sm text-muted-foreground">
                            {registration.name_snapshot} · {registration.email_snapshot}
                        </p>
                    </div>
                </div>

                <div className="grid gap-6 xl:grid-cols-2">
                    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                        <h2 className="mb-4 text-base font-semibold">Registrant Info</h2>

                        <div className="grid gap-4 text-sm">
                            <div>
                                <div className="text-muted-foreground">Name</div>
                                <div className="font-medium">{registration.name_snapshot}</div>
                            </div>

                            <div>
                                <div className="text-muted-foreground">Email</div>
                                <div className="font-medium">{registration.email_snapshot}</div>
                            </div>

                            <div>
                                <div className="text-muted-foreground">Registered At</div>
                                <div className="font-medium">{formatDate(registration.registered_at)}</div>
                            </div>

                            <div>
                                <div className="text-muted-foreground">Answers Count</div>
                                <div className="font-medium">{registration.answers_count ?? 0}</div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                        <h2 className="mb-4 text-base font-semibold">Event Info</h2>

                        <div className="grid gap-4 text-sm">
                            <div>
                                <div className="text-muted-foreground">Title</div>
                                <div className="font-medium">{event.title}</div>
                            </div>

                            <div>
                                <div className="text-muted-foreground">Mentor</div>
                                <div className="font-medium">{event.mentor?.name ?? '-'}</div>
                            </div>

                            <div>
                                <div className="text-muted-foreground">Category</div>
                                <div className="font-medium">{event.category}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                    <h2 className="mb-4 text-base font-semibold">Question Answers</h2>

                    {registration.answers && registration.answers.length > 0 ? (
                        <div className="space-y-4">
                            {registration.answers.map((answer) => (
                                <div key={answer.id} className="rounded-lg border border-border p-4">
                                    <div className="mb-2 text-sm font-medium">
                                        {answer.question?.label ?? answer.question_label_snapshot}
                                    </div>
                                    <div className="mb-2 text-xs text-muted-foreground">
                                        {answer.question?.type ?? answer.question_type_snapshot}
                                    </div>
                                    <div className="whitespace-pre-wrap text-sm">
                                        {answer.answer_value || '-'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-sm text-muted-foreground">
                            This registrant did not submit additional answers.
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
