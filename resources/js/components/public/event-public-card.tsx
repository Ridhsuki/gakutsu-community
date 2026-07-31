import { Link } from '@inertiajs/react';
import { CalendarDays, User2 } from 'lucide-react';
import EventPosterThumbnail from '@/features/events/components/event-poster-thumbnail';
import EventStatusBadge from '@/features/events/components/event-status-badge';

type EventCardItem = {
    id: number;
    title: string;
    slug: string;
    category: string;
    starts_at: string;
    status: 'upcoming' | 'completed' | 'cancelled';
    poster_image_url?: string | null;
    mentor?: {
        name: string;
    } | null;
};

function formatDate(value: string) {
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

export default function EventPublicCard({
    event,
    archive = false,
}: {
    event: EventCardItem;
    archive?: boolean;
}) {
    return (
        <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <EventPosterThumbnail
                src={event.poster_image_url ?? null}
                alt={`Poster ${event.title}`}
                className="aspect-[4/3] w-full rounded-none border-0"
            />

            <div className="space-y-4 p-5">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <p className="mb-1 text-xs font-medium tracking-wide text-primary uppercase">
                            {event.category}
                        </p>
                        <h3 className="line-clamp-2 text-lg font-semibold">
                            {event.title}
                        </h3>
                    </div>
                    <EventStatusBadge status={event.status} />
                </div>

                <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4" />
                        <span>{formatDate(event.starts_at)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <User2 className="h-4 w-4" />
                        <span>{event.mentor?.name ?? '-'}</span>
                    </div>
                </div>

                <div className="pt-1">
                    {archive ? (
                        <span className="inline-flex h-10 items-center rounded-xl border border-border px-4 text-sm text-muted-foreground">
                            Arsip Kegiatan
                        </span>
                    ) : (
                        <Link
                            href={`/events/${event.slug}`}
                            className="inline-flex h-10 items-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground"
                        >
                            Lihat Detail
                        </Link>
                    )}
                </div>
            </div>
        </article>
    );
}
