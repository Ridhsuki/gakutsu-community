import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import type { EventItem } from '@/features/events/types';

interface PageProps {
    event: EventItem;
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

export default function EventsShow({ event, alreadyRegistered }: PageProps) {
    const form = useForm({});

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

                    <div className="mt-6 flex flex-wrap gap-3">
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

                        {event.meeting_url ? (
                            <a
                                href={event.meeting_url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex h-9 items-center justify-center rounded-md border border-input px-4 text-sm font-medium"
                            >
                                Meeting Link
                            </a>
                        ) : null}
                    </div>
                </div>
            </div>
        </>
    );
}
