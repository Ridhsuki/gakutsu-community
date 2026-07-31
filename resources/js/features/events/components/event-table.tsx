import { router } from '@inertiajs/react';
import { CalendarDays, Users } from 'lucide-react';
import EmptyStateRow from '@/components/data-table/empty-state-row';
import SortableHeader from '@/components/data-table/sortable-header';
import EventAccessBadge from '@/features/events/components/event-access-badge';
import EventPosterThumbnail from '@/features/events/components/event-poster-thumbnail';
import EventPublishBadge from '@/features/events/components/event-publish-badge';
import EventRowActionsMenu from '@/features/events/components/event-row-actions-menu';
import EventStatusBadge from '@/features/events/components/event-status-badge';
import type { EventItem, EventSortField } from '@/features/events/types';
import type { SortDirection } from '@/types/filters';

interface EventTableProps {
    events: EventItem[];
    sortField: EventSortField;
    sortDirection: SortDirection;
    onSort: (field: EventSortField) => void;
    onDelete: (event: EventItem) => void;
    showBaseUrl: string;
    editBaseUrl: string;
    registrationsBaseUrl: string;
    questionsBaseUrl: string;
}

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

export default function EventTable({
    events, sortField, sortDirection, onSort, onDelete,
    showBaseUrl, editBaseUrl, registrationsBaseUrl, questionsBaseUrl,
}: EventTableProps) {
    return (
        <div className="overflow-x-auto rounded-lg border border-border bg-card">
            <table className="w-full min-w-[1200px] text-left text-sm">
                <thead className="bg-muted/50">
                    <tr className="border-b">
                        <SortableHeader label="Title" field="title" currentField={sortField} currentDirection={sortDirection} onSort={onSort} />
                        <SortableHeader label="Category" field="category" currentField={sortField} currentDirection={sortDirection} onSort={onSort} />
                        <SortableHeader label="Mentor" field="mentor" currentField={sortField} currentDirection={sortDirection} onSort={onSort} />
                        <SortableHeader label="Start" field="starts_at" currentField={sortField} currentDirection={sortDirection} onSort={onSort} />
                        <SortableHeader label="Status" field="status" currentField={sortField} currentDirection={sortDirection} onSort={onSort} />
                        <th className="px-4 py-3 font-medium">Publish</th>
                        <th className="px-4 py-3 font-medium">Access</th>
                        <th className="px-4 py-3 font-medium">Registrants</th>
                        <th className="px-4 py-3 text-right font-medium">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {events.length > 0 ? (
                        events.map((event) => (
                            <tr
                                key={event.id}
                                className="cursor-pointer border-b border-border transition hover:bg-accent/50"
                                onClick={() => router.visit(`${showBaseUrl}/${event.id}`)}
                            >
                                <td className="px-4 py-3">
                                    <div className="flex min-w-0 items-center gap-3">
                                        <EventPosterThumbnail src={event.poster_image_url} alt={`Poster for ${event.title}`} className="h-16 w-24 shrink-0" />
                                        <div className="min-w-0 max-w-[320px]">
                                            <div className="truncate font-medium">{event.title}</div>
                                            <div className="truncate text-xs text-muted-foreground">/{event.slug}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-muted-foreground">{event.category}</td>
                                <td className="px-4 py-3 text-muted-foreground">{event.mentor?.name ?? '-'}</td>
                                <td className="px-4 py-3 text-muted-foreground">{formatDate(event.starts_at)}</td>
                                <td className="px-4 py-3"><EventStatusBadge status={event.status} /></td>
                                <td className="px-4 py-3"><EventPublishBadge isPublished={event.is_published} /></td>
                                <td className="px-4 py-3"><EventAccessBadge accessType={event.access_type} /></td>

                                <td className="px-4 py-3">
                                    <div className="flex w-fit items-center gap-1.5 rounded-md bg-muted/60 px-2 py-1 text-xs font-medium text-muted-foreground">
                                        <Users className="h-3.5 w-3.5" />
                                        <span>{event.registrations_count ?? 0}</span>
                                    </div>
                                </td>

                                <td className="px-4 py-3">
                                    <div className="flex items-center justify-end">
                                        <EventRowActionsMenu
                                            event={event}
                                            showBaseUrl={showBaseUrl}
                                            editBaseUrl={editBaseUrl}
                                            registrationsBaseUrl={registrationsBaseUrl}
                                            questionsBaseUrl={questionsBaseUrl}
                                            onDelete={onDelete}
                                        />
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <EmptyStateRow colSpan={9} icon={CalendarDays} title="No events found" description="Try adjusting your search or create a new event." />
                    )}
                </tbody>
            </table>
        </div>
    );
}
