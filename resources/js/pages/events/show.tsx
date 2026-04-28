import { Head, Link, usePage } from '@inertiajs/react';
import { CalendarDays, CircleHelp, LockKeyhole, User2 } from 'lucide-react';
import PublicLayout from '@/layouts/public-layout';
import EventPosterThumbnail from '@/features/events/components/event-poster-thumbnail';
import EventStatusBadge from '@/features/events/components/event-status-badge';
import RenderRichText from '@/components/rich-text/render-rich-text';
import SeoHead from '@/components/public/seo-head';

type PageAuth = {
    auth?: {
        user?: {
            id: number;
            name: string;
        } | null;
    };
};

type EventItem = {
    id: number;
    title: string;
    slug: string;
    category: string;
    description: string;
    starts_at: string;
    status: 'upcoming' | 'completed' | 'cancelled';
    meeting_url?: string | null;
    poster_image_url?: string | null;
    mentor?: {
        name: string;
    } | null;
};

export default function EventShow({
    event,
    alreadyRegistered,
    canViewMeetingLink,
    questionCount,
}: {
    event: EventItem;
    alreadyRegistered: boolean;
    canViewMeetingLink: boolean;
    questionCount: number;
}) {
    const { props } = usePage<PageAuth>();
    const isLoggedIn = Boolean(props.auth?.user);

    return (
        <PublicLayout>
            <SeoHead
                title={event.title}
                description={String(event.description ?? '').replace(/<[^>]*>/g, '').slice(0, 155)}
                image={event.poster_image_url ?? null}
            />

            <div className="mx-auto max-w-6xl px-4 py-12">
                <Link href="/events" className="inline-flex text-sm font-medium text-primary">
                    ← Kembali ke events
                </Link>

                <div className="mt-6 grid gap-10 lg:grid-cols-[1.15fr_0.85fr]">
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <div className="flex flex-wrap items-center gap-3">
                                <EventStatusBadge status={event.status} />
                                <span className="text-sm font-medium text-primary">{event.category}</span>
                            </div>
                            <h1 className="text-4xl font-semibold tracking-tight">{event.title}</h1>
                        </div>

                        <EventPosterThumbnail
                            src={event.poster_image_url ?? null}
                            alt={`Poster ${event.title}`}
                            className="aspect-[4/3] w-full rounded-3xl"
                        />

                        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
                            <RenderRichText html={event.description} />
                        </div>
                    </div>

                    <aside className="space-y-6">
                        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
                            <h2 className="text-lg font-semibold">Informasi Event</h2>

                            <div className="mt-5 space-y-4 text-sm">
                                <div className="flex items-center gap-3">
                                    <CalendarDays className="h-4 w-4 text-primary" />
                                    <span>
                                        {new Date(event.starts_at).toLocaleDateString('id-ID', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric',
                                        })}
                                    </span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <User2 className="h-4 w-4 text-primary" />
                                    <span>{event.mentor?.name ?? '-'}</span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <CircleHelp className="h-4 w-4 text-primary" />
                                    <span>{questionCount} pertanyaan registrasi</span>
                                </div>
                            </div>

                            <div className="mt-6 flex flex-col gap-3">
                                {alreadyRegistered ? (
                                    <div className="inline-flex h-11 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-sm font-medium text-primary">
                                        Sudah terdaftar
                                    </div>
                                ) : isLoggedIn ? (
                                    <Link
                                        href={`/events/${event.slug}/register`}
                                        className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground"
                                    >
                                        Jawab Pertanyaan & Daftar
                                    </Link>
                                ) : (
                                    <Link
                                        href="/login"
                                        className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground"
                                    >
                                        Masuk untuk Mendaftar
                                    </Link>
                                )}

                                {canViewMeetingLink && event.meeting_url ? (
                                    <a
                                        href={event.meeting_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex h-11 items-center justify-center rounded-xl border border-border px-5 text-sm font-medium"
                                    >
                                        Buka Meeting Link
                                    </a>
                                ) : (
                                    <div className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-3 text-sm text-muted-foreground">
                                        <LockKeyhole className="h-4 w-4" />
                                        Link meeting tampil setelah registrasi
                                    </div>
                                )}
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </PublicLayout>
    );
}
