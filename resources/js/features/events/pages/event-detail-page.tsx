import { Head, Link, usePage } from '@inertiajs/react';
import { ClipboardList, Edit, Users } from 'lucide-react';
import ContextBackButton from '@/components/navigation/context-back-button';
import RenderRichText from '@/components/rich-text/render-rich-text';
import { Button } from '@/components/ui/button';
import EventPosterThumbnail from '@/features/events/components/event-poster-thumbnail';
import EventQuizShortcuts from '@/features/events/components/event-quiz-shortcuts';
import EventStatusBadge from '@/features/events/components/event-status-badge';
import type { EventItem } from '@/features/events/types';
import { appendFrom } from '@/lib/navigation';

function formatDate(value: string | null) {
    if (!value) {
        return '-';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return '-';
    }

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
    const page = usePage();
    const rolePrefix: '/admin' | '/mentor' = editHref.startsWith('/mentor')
        ? '/mentor'
        : '/admin';

    return (
        <>
            <Head title={title ?? `Event Detail - ${event.title}`} />

            <div className="flex h-full w-full flex-col space-y-6 p-6">
                <div className="space-y-3">
                    <ContextBackButton
                        fallbackHref={backHref}
                        label="Back to events"
                    />

                    <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                            <EventStatusBadge status={event.status} />
                            <h1 className="text-2xl font-semibold tracking-tight">
                                {event.title}
                            </h1>
                        </div>

                        <p className="text-sm text-muted-foreground">
                            {event.category} · Mentor:{' '}
                            {event.mentor?.name ?? '-'}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            asChild
                        >
                            <Link href={appendFrom(questionsHref, page.url)}>
                                <ClipboardList className="mr-2 h-4 w-4" />
                                Registration Form
                            </Link>
                        </Button>

                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            asChild
                        >
                            <Link
                                href={appendFrom(registrationsHref, page.url)}
                            >
                                <Users className="mr-2 h-4 w-4" />
                                Registrants
                            </Link>
                        </Button>

                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            asChild
                        >
                            <Link href={appendFrom(editHref, page.url)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Event
                            </Link>
                        </Button>
                    </div>

                    <EventQuizShortcuts
                        eventId={event.id}
                        rolePrefix={rolePrefix}
                        variant="inline"
                    />
                </div>

                <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
                    <div className="space-y-6">
                        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                            <h2 className="mb-4 text-base font-semibold">
                                Description
                            </h2>
                            <RenderRichText html={event.description ?? ''} />
                        </div>

                        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-base font-semibold">
                                    Registration Form Preview
                                </h2>
                            </div>

                            {event.registration_questions &&
                            event.registration_questions.length > 0 ? (
                                <div className="space-y-4">
                                    {event.registration_questions.map(
                                        (question) => (
                                            <div
                                                key={question.id}
                                                className="rounded-lg border border-border p-4"
                                            >
                                                <div className="mb-2 flex flex-wrap items-center gap-2">
                                                    <span className="font-medium">
                                                        {question.label}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {question.type} ·{' '}
                                                        {question.is_required
                                                            ? 'Required'
                                                            : 'Optional'}
                                                    </span>
                                                </div>

                                                {question.help_text ? (
                                                    <p className="text-sm text-muted-foreground">
                                                        {question.help_text}
                                                    </p>
                                                ) : null}
                                            </div>
                                        ),
                                    )}
                                </div>
                            ) : (
                                <div className="text-sm text-muted-foreground">
                                    No registration questions configured yet.
                                </div>
                            )}
                        </div>

                        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-base font-semibold">
                                    Recent Registrants
                                </h2>

                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    asChild
                                >
                                    <Link
                                        href={appendFrom(
                                            registrationsHref,
                                            page.url,
                                        )}
                                    >
                                        View all
                                    </Link>
                                </Button>
                            </div>

                            {event.registrations &&
                            event.registrations.length > 0 ? (
                                <div className="space-y-3">
                                    {event.registrations.map((registration) => (
                                        <div
                                            key={registration.id}
                                            className="flex items-center justify-between rounded-lg border border-border p-4"
                                        >
                                            <div className="space-y-1">
                                                <div className="font-medium">
                                                    {registration.name_snapshot}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {
                                                        registration.email_snapshot
                                                    }
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    Answers:{' '}
                                                    {registration.answers_count ??
                                                        0}
                                                </div>
                                            </div>

                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                asChild
                                            >
                                                <Link
                                                    href={appendFrom(
                                                        `${registrationDetailBaseHref}/${registration.id}`,
                                                        page.url,
                                                    )}
                                                >
                                                    View
                                                </Link>
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-sm text-muted-foreground">
                                    No registrants yet.
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                            <h2 className="mb-4 text-base font-semibold">
                                Poster
                            </h2>
                            <EventPosterThumbnail
                                src={event.poster_image_url}
                                alt={`Poster for ${event.title}`}
                                className="w-full"
                            />
                        </div>

                        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                            <h2 className="mb-4 text-base font-semibold">
                                Summary
                            </h2>

                            <div className="grid gap-4 text-sm">
                                <div>
                                    <div className="text-muted-foreground">
                                        Registrants
                                    </div>
                                    <div className="font-medium">
                                        {event.registrations_count ?? 0}
                                    </div>
                                </div>

                                <div>
                                    <div className="text-muted-foreground">
                                        Questions
                                    </div>
                                    <div className="font-medium">
                                        {event.registration_questions_count ??
                                            0}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
                            <h2 className="mb-4 text-base font-semibold">
                                Event Info
                            </h2>

                            <div className="grid gap-4 text-sm">
                                <div>
                                    <div className="text-muted-foreground">
                                        Start
                                    </div>
                                    <div className="font-medium">
                                        {formatDate(event.starts_at)}
                                    </div>
                                </div>

                                <div>
                                    <div className="text-muted-foreground">
                                        End
                                    </div>
                                    <div className="font-medium">
                                        {formatDate(event.ends_at)}
                                    </div>
                                </div>

                                <div>
                                    <div className="text-muted-foreground">
                                        Registration Closes
                                    </div>
                                    <div className="font-medium">
                                        {formatDate(
                                            event.registration_closes_at,
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <div className="text-muted-foreground">
                                        Access Type
                                    </div>
                                    <div className="font-medium">
                                        {event.access_type === 'free'
                                            ? 'Free'
                                            : 'Paid'}
                                    </div>
                                </div>

                                <div>
                                    <div className="text-muted-foreground">
                                        Publish
                                    </div>
                                    <div className="font-medium">
                                        {event.is_published
                                            ? 'Published'
                                            : 'Draft'}
                                    </div>
                                </div>

                                <div>
                                    <div className="text-muted-foreground">
                                        Slug
                                    </div>
                                    <div className="font-medium">
                                        /{event.slug}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
