import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
            <Head title={headTitle ?? `Registration Detail - ${registration.name_snapshot}`} />

            <div className="flex h-full w-full flex-col space-y-6 p-6">
                <div className="flex flex-col gap-3">
                    <Button type="button" variant="ghost" asChild className="px-0">
                        <Link href={backHref}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to registrations
                        </Link>
                    </Button>

                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Registration Detail
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {registration.name_snapshot} · {registration.email_snapshot}
                        </p>
                    </div>
                </div>

                <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
                    <div className="space-y-6">
                        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                            <h2 className="text-base font-semibold">Registrant Info</h2>

                            <dl className="mt-4 space-y-3 text-sm">
                                <div>
                                    <dt className="text-muted-foreground">Name</dt>
                                    <dd className="font-medium">{registration.name_snapshot}</dd>
                                </div>

                                <div>
                                    <dt className="text-muted-foreground">Email</dt>
                                    <dd className="font-medium">{registration.email_snapshot}</dd>
                                </div>

                                <div>
                                    <dt className="text-muted-foreground">Registered At</dt>
                                    <dd className="font-medium">{formatDate(registration.registered_at)}</dd>
                                </div>

                                <div>
                                    <dt className="text-muted-foreground">Answers Count</dt>
                                    <dd className="font-medium">{registration.answers_count ?? 0}</dd>
                                </div>
                            </dl>
                        </div>

                        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                            <h2 className="text-base font-semibold">Event Info</h2>

                            <dl className="mt-4 space-y-3 text-sm">
                                <div>
                                    <dt className="text-muted-foreground">Title</dt>
                                    <dd className="font-medium">{event.title}</dd>
                                </div>

                                <div>
                                    <dt className="text-muted-foreground">Mentor</dt>
                                    <dd className="font-medium">{event.mentor?.name ?? '-'}</dd>
                                </div>

                                <div>
                                    <dt className="text-muted-foreground">Category</dt>
                                    <dd className="font-medium">{event.category}</dd>
                                </div>
                            </dl>
                        </div>
                    </div>

                    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                        <h2 className="text-base font-semibold">Question Answers</h2>

                        <div className="mt-4 space-y-4">
                            {registration.answers && registration.answers.length > 0 ? (
                                registration.answers.map((answer) => (
                                    <div
                                        key={answer.id}
                                        className="rounded-lg border border-border p-4"
                                    >
                                        <div className="font-medium">
                                            {answer.question?.label ?? answer.question_label_snapshot}
                                        </div>
                                        <div className="mt-1 text-xs text-muted-foreground">
                                            {answer.question?.type ?? answer.question_type_snapshot}
                                        </div>
                                        <div className="mt-3 whitespace-pre-line text-sm text-foreground">
                                            {answer.answer_value || '-'}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-sm text-muted-foreground">
                                    This registrant did not submit additional answers.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
