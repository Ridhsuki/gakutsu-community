import { Head, Link } from '@inertiajs/react';
import PaginationBar from '@/components/data-table/pagination-bar';
import EmptyState from '@/components/ui/empty-state';
import type { EventItem } from '@/features/events/types';
import type { PaginatedResponse } from '@/types/pagination';
import { CalendarDays } from 'lucide-react';

interface PageProps {
    events: PaginatedResponse<EventItem>;
}

function formatDate(value: string) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return '-';

    return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}

export default function EventsIndex({ events }: PageProps) {
    return (
        <>
            <Head title="Events" />

            <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8">
                <div className="space-y-1">
                    <h1 className="text-2xl font-semibold">Upcoming Events</h1>
                    <p className="text-sm text-muted-foreground">
                        Explore upcoming webinar and community learning sessions.
                    </p>
                </div>

                {events.data.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {events.data.map((event) => (
                            <article
                                key={event.id}
                                className="rounded-xl border border-border bg-card p-4 shadow-sm"
                            >
                                <div className="space-y-2">
                                    <h2 className="text-lg font-semibold">{event.title}</h2>
                                    <p className="text-sm text-muted-foreground">{event.category}</p>
                                    <p className="text-sm text-muted-foreground">
                                        Mentor: {event.mentor?.name ?? '-'}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        Starts: {formatDate(event.starts_at)}
                                    </p>
                                </div>

                                <div className="mt-4">
                                    <Link
                                        href={`/events/${event.slug}`}
                                        className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        icon={CalendarDays}
                        title="No upcoming events"
                        description="Please check back later for new webinars and community sessions."
                    />
                )}

                <PaginationBar
                    links={events.links}
                    from={events.from}
                    to={events.to}
                    total={events.total}
                    lastPage={events.last_page}
                />
            </div>
        </>
    );
}
