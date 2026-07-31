import { Users } from 'lucide-react';
import EventAccessBadge from '@/features/events/components/event-access-badge';
import EventPosterThumbnail from '@/features/events/components/event-poster-thumbnail';
import EventPublishBadge from '@/features/events/components/event-publish-badge';
import EventRowActionsMenu from '@/features/events/components/event-row-actions-menu';
import EventStatusBadge from '@/features/events/components/event-status-badge';
import type { EventItem } from '@/features/events/types';

function formatDate(value: string | null) {
    if (!value) {
return '-';
}

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
return '-';
}

    return date.toLocaleDateString('id-ID', {
        day: '2-digit', month: 'short', year: 'numeric',
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
    event, showBaseUrl, editBaseUrl, registrationsBaseUrl, questionsBaseUrl, onDelete,
}: EventCardProps) {
    return (
        <article className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm">
            <div className="p-4 pb-0">
                <EventPosterThumbnail src={event.poster_image_url} alt={`Poster for ${event.title}`} className="aspect-[4/3] w-full" />
            </div>

            <div className="flex flex-1 flex-col p-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <h3 className="line-clamp-2 text-base font-semibold">{event.title}</h3>
                        <p className="mt-1 text-xs text-muted-foreground line-clamp-1">/{event.slug}</p>
                    </div>
                    <EventStatusBadge status={event.status} />
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                    <EventPublishBadge isPublished={event.is_published} />
                    <EventAccessBadge accessType={event.access_type} />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-4 text-sm">
                    <div>
                        <div className="text-xs text-muted-foreground">Mentor</div>
                        <div className="mt-0.5 font-medium line-clamp-1">{event.mentor?.name ?? '-'}</div>
                    </div>
                    <div>
                        <div className="text-xs text-muted-foreground">Start</div>
                        <div className="mt-0.5 font-medium">{formatDate(event.starts_at)}</div>
                    </div>

                    <div className="col-span-2 flex items-center justify-between rounded-md bg-muted/40 px-3 py-2.5">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span>Total Registrants</span>
                        </div>
                        <span className="font-semibold">{event.registrations_count ?? 0}</span>
                    </div>
                </div>

                <div className="mt-4 flex items-center justify-end border-t border-border pt-4">
                    <EventRowActionsMenu
                        event={event}
                        showBaseUrl={showBaseUrl}
                        editBaseUrl={editBaseUrl}
                        registrationsBaseUrl={registrationsBaseUrl}
                        questionsBaseUrl={questionsBaseUrl}
                        onDelete={onDelete}
                    />
                </div>
            </div>
        </article>
    );
}
