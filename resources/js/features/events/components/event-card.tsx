import { ClipboardList, Edit, Eye, Trash2, Users } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import EventPosterThumbnail from '@/features/events/components/event-poster-thumbnail';
import EventStatusBadge from '@/features/events/components/event-status-badge';
import type { EventItem } from '@/features/events/types';

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

interface EventCardProps {
    event: EventItem;
    showBaseUrl: string;
    editBaseUrl: string;
    registrationsBaseUrl: string;
    questionsBaseUrl: string;
    onDelete: (event: EventItem) => void;
}

export default function EventCard({
    event,
    showBaseUrl,
    editBaseUrl,
    registrationsBaseUrl,
    questionsBaseUrl,
    onDelete,
}: EventCardProps) {
    return (
        <article className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm">
            <div className="p-4 pb-0">
                <EventPosterThumbnail
                    src={event.poster_image_url}
                    alt={`Poster for ${event.title}`}
                    className="aspect-[4/3] w-full"
                />
            </div>

            <div className="flex flex-1 flex-col p-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <h3 className="line-clamp-2 text-base font-semibold">{event.title}</h3>
                        <p className="mt-1 text-xs text-muted-foreground">{event.category}</p>
                    </div>

                    <EventStatusBadge status={event.status} />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div>
                        <div className="text-xs text-muted-foreground">Mentor</div>
                        <div className="font-medium">{event.mentor?.name ?? '-'}</div>
                    </div>

                    <div>
                        <div className="text-xs text-muted-foreground">Start</div>
                        <div className="font-medium">{formatDate(event.starts_at)}</div>
                    </div>

                    <div>
                        <div className="text-xs text-muted-foreground">Registrants</div>
                        <div className="font-medium">{event.registrations_count ?? 0}</div>
                    </div>

                    <div>
                        <div className="text-xs text-muted-foreground">Questions</div>
                        <div className="font-medium">{event.registration_questions_count ?? 0}</div>
                    </div>
                </div>

                <div className="mt-4 flex items-center justify-end gap-2 border-t border-border pt-4">
                    <Button type="button" variant="ghost" size="icon" asChild>
                        <Link href={`${showBaseUrl}/${event.id}`} aria-label={`View ${event.title}`}>
                            <Eye className="h-4 w-4 text-slate-600" />
                        </Link>
                    </Button>

                    <Button type="button" variant="ghost" size="icon" asChild>
                        <Link
                            href={`${questionsBaseUrl}/${event.id}/registration-questions`}
                            aria-label={`Manage registration form for ${event.title}`}
                        >
                            <ClipboardList className="h-4 w-4 text-emerald-600" />
                        </Link>
                    </Button>

                    <Button type="button" variant="ghost" size="icon" asChild>
                        <Link
                            href={`${registrationsBaseUrl}/${event.id}/registrations`}
                            aria-label={`View registrations for ${event.title}`}
                        >
                            <Users className="h-4 w-4 text-amber-600" />
                        </Link>
                    </Button>

                    <Button type="button" variant="ghost" size="icon" asChild>
                        <Link href={`${editBaseUrl}/${event.id}/edit`} aria-label={`Edit ${event.title}`}>
                            <Edit className="h-4 w-4 text-blue-500" />
                        </Link>
                    </Button>

                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(event)}
                        aria-label={`Delete ${event.title}`}
                    >
                        <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                </div>
            </div>
        </article>
    );
}
