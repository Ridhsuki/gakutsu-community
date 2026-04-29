import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, ClipboardList, Edit, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EventStatusBadge from '@/features/events/components/event-status-badge';
import type { EventItem } from '@/features/events/types';
import RenderRichText from '@/components/rich-text/render-rich-text';
import EventPosterThumbnail from '@/features/events/components/event-poster-thumbnail';

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

interface EventDetailPageProps {
    event: EventItem;
    backHref: string;
    editHref: string;
    registrationsHref: string;
    registrationDetailBaseHref: string;
    questionsHref: string;
    title?: string;
}

export default function EventDetailPage({
    event,
    backHref,
    editHref,
    registrationsHref,
    registrationDetailBaseHref,
    questionsHref,
    title,
}: EventDetailPageProps) {
    return (
        <>
            <Head title={title ?? event.title} />

            <div className="flex h-full w-full flex-col space-y-6 p-6">
                <div className="flex flex-col gap-3">
                    <Button
                        type="button"
                        variant="ghost"
                        asChild
                        className="w-fit mb-4"
                    >
                        <Link href={backHref}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to events
                        </Link>
                    </Button>

                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                        <div className="space-y-2">
                            <h1 className="text-2xl font-semibold tracking-tight">{event.title}</h1>
                            <div className="flex flex-wrap items-center gap-2">
                                <EventStatusBadge status={event.status} />
                                <span className="text-sm text-muted-foreground">{event.category}</span>
                                <span className="text-sm text-muted-foreground">
                                    Mentor: {event.mentor?.name ?? '-'}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                            <Button type="button" variant="outline" asChild>
                                <Link href={questionsHref}>
                                    <ClipboardList className="mr-2 h-4 w-4" />
                                    Registration Form
                                </Link>
                            </Button>

                            <Button type="button" variant="outline" asChild>
                                <Link href={registrationsHref}>
                                    <Users className="mr-2 h-4 w-4" />
                                    Registrants
                                </Link>
                            </Button>

                            <Button type="button" asChild>
                                <Link href={editHref}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Event
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
                    <div className="space-y-6">
                        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                            <h2 className="text-base font-semibold">Description</h2>
                            <RenderRichText html={event.description} className="mt-3" />
                        </div>

                        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                            <h2 className="text-base font-semibold">Registration Form Preview</h2>
                            <div className="mt-3 space-y-3">
                                {event.registration_questions && event.registration_questions.length > 0 ? (
                                    event.registration_questions.map((question) => (
                                        <div key={question.id} className="rounded-lg border border-border p-3">
                                            <div className="font-medium">{question.label}</div>
                                            <div className="text-xs text-muted-foreground">
                                                {question.type} · {question.is_required ? 'Required' : 'Optional'}
                                            </div>
                                            {question.help_text ? (
                                                <div className="mt-1 text-xs text-muted-foreground">
                                                    {question.help_text}
                                                </div>
                                            ) : null}
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-sm text-muted-foreground">
                                        No registration questions configured yet.
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                            <div className="flex items-center justify-between gap-3">
                                <h2 className="text-base font-semibold">Recent Registrants</h2>
                                <Button type="button" variant="ghost" asChild>
                                    <Link href={registrationsHref}>View all</Link>
                                </Button>
                            </div>

                            <div className="mt-4 space-y-3">
                                {event.registrations && event.registrations.length > 0 ? (
                                    event.registrations.map((registration) => (
                                        <div
                                            key={registration.id}
                                            className="flex items-center justify-between gap-3 rounded-lg border border-border p-3"
                                        >
                                            <div>
                                                <div className="font-medium">{registration.name_snapshot}</div>
                                                <div className="text-xs text-muted-foreground">
                                                    {registration.email_snapshot}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <div className="text-xs text-muted-foreground">
                                                    Answers: {registration.answers_count ?? 0}
                                                </div>
                                                <Button type="button" variant="outline" size="sm" asChild>
                                                    <Link href={`${registrationDetailBaseHref}/${registration.id}`}>
                                                        View
                                                    </Link>
                                                </Button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-sm text-muted-foreground">
                                        No registrants yet.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                            <h2 className="text-base font-semibold">Poster</h2>

                            <EventPosterThumbnail
                                src={event.poster_image_url}
                                alt={`Poster for ${event.title}`}
                                className="aspect-[4/3] w-full"
                            />
                        </div>

                        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                            <h2 className="text-base font-semibold">Summary</h2>

                            <div className="mt-4 grid gap-3">
                                <div className="rounded-lg border border-border p-3">
                                    <div className="text-xs uppercase tracking-wide text-muted-foreground">Registrants</div>
                                    <div className="mt-1 text-2xl font-semibold">{event.registrations_count ?? 0}</div>
                                </div>

                                <div className="rounded-lg border border-border p-3">
                                    <div className="text-xs uppercase tracking-wide text-muted-foreground">Questions</div>
                                    <div className="mt-1 text-2xl font-semibold">{event.registration_questions_count ?? 0}</div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                            <h2 className="text-base font-semibold">Event Info</h2>

                            <dl className="mt-4 space-y-3 text-sm">
                                <div>
                                    <dt className="text-muted-foreground">Start</dt>
                                    <dd className="font-medium">{formatDate(event.starts_at)}</dd>
                                </div>

                                <div>
                                    <dt className="text-muted-foreground">End</dt>
                                    <dd className="font-medium">{formatDate(event.ends_at)}</dd>
                                </div>

                                <div>
                                    <dt className="text-muted-foreground">Registration Closes</dt>
                                    <dd className="font-medium">{formatDate(event.registration_closes_at)}</dd>
                                </div>

                                <div>
                                    <dt className="text-muted-foreground">Access Type</dt>
                                    <dd className="font-medium">{event.access_type === 'free' ? 'Free' : 'Paid'}</dd>
                                </div>

                                <div>
                                    <dt className="text-muted-foreground">Publish</dt>
                                    <dd className="font-medium">{event.is_published ? 'Published' : 'Draft'}</dd>
                                </div>

                                <div>
                                    <dt className="text-muted-foreground">Slug</dt>
                                    <dd className="font-medium">/{event.slug}</dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
