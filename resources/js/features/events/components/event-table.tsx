import { ClipboardList, CalendarDays, Edit, Trash2, Users } from 'lucide-react';
import { Link } from '@inertiajs/react';
import EmptyStateRow from '@/components/data-table/empty-state-row';
import SortableHeader from '@/components/data-table/sortable-header';
import { Button } from '@/components/ui/button';
import EventStatusBadge from '@/features/events/components/event-status-badge';
import type { EventItem, EventSortField } from '@/features/events/types';
import type { SortDirection } from '@/types/filters';

interface EventTableProps {
    events: EventItem[];
    sortField: EventSortField;
    sortDirection: SortDirection;
    onSort: (field: EventSortField) => void;
    onEdit: (event: EventItem) => void;
    onDelete: (event: EventItem) => void;
    registrationsBaseUrl: string;
    questionsBaseUrl: string;
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

export default function EventTable({
    events,
    sortField,
    sortDirection,
    onSort,
    onEdit,
    onDelete,
    registrationsBaseUrl,
    questionsBaseUrl
}: EventTableProps) {
    return (
        <div className="overflow-x-auto rounded-lg border border-border bg-card">
            <table className="w-full min-w-[1100px] text-left text-sm">
                <thead className="bg-muted/50">
                    <tr className="border-b">
                        <SortableHeader
                            label="Title"
                            field="title"
                            currentField={sortField}
                            currentDirection={sortDirection}
                            onSort={onSort}
                        />
                        <SortableHeader
                            label="Category"
                            field="category"
                            currentField={sortField}
                            currentDirection={sortDirection}
                            onSort={onSort}
                        />
                        <SortableHeader
                            label="Instructor"
                            field="instructor"
                            currentField={sortField}
                            currentDirection={sortDirection}
                            onSort={onSort}
                        />
                        <SortableHeader
                            label="Start"
                            field="starts_at"
                            currentField={sortField}
                            currentDirection={sortDirection}
                            onSort={onSort}
                        />
                        <SortableHeader
                            label="Status"
                            field="status"
                            currentField={sortField}
                            currentDirection={sortDirection}
                            onSort={onSort}
                        />
                        <th className="px-4 py-3 font-medium">Publish</th>
                        <th className="px-4 py-3 font-medium">Access</th>
                        <th className="px-4 py-3 text-right font-medium">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {events.length > 0 ? (
                        events.map((event) => (
                            <tr key={event.id} className="border-b border-border transition hover:bg-accent/50">
                                <td className="px-4 py-3">
                                    <div className="font-medium">{event.title}</div>
                                    <div className="text-xs text-muted-foreground">/{event.slug}</div>
                                </td>
                                <td className="px-4 py-3 text-muted-foreground">{event.category}</td>
                                <td className="px-4 py-3 text-muted-foreground">{event.instructor?.name ?? '-'}</td>
                                <td className="px-4 py-3 text-muted-foreground">{formatDate(event.starts_at)}</td>
                                <td className="px-4 py-3"><EventStatusBadge status={event.status} /></td>
                                <td className="px-4 py-3 text-muted-foreground">{event.is_published ? 'Published' : 'Draft'}</td>
                                <td className="px-4 py-3 text-muted-foreground">{event.access_type === 'free' ? 'Free' : 'Paid'}</td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center justify-end gap-2">
                                        <Button type="button" variant="ghost" size="icon" asChild>
                                            <Link
                                                href={`${questionsBaseUrl}/${event.id}/registration-questions`}
                                                aria-label={`Manage registration form for ${event.title}`}
                                            >
                                                <ClipboardList className="h-4 w-4 text-emerald-600" />
                                            </Link>
                                        </Button>

                                        <Button type="button" variant="ghost" size="icon" asChild>
                                            <Link href={`${registrationsBaseUrl}/${event.id}/registrations`} aria-label={`View registrations for ${event.title}`}>
                                                <Users className="h-4 w-4 text-amber-600" />
                                            </Link>
                                        </Button>

                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => onEdit(event)}
                                            aria-label={`Edit ${event.title}`}
                                        >
                                            <Edit className="h-4 w-4 text-blue-500" />
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
                                </td>
                            </tr>
                        ))
                    ) : (
                        <EmptyStateRow
                            colSpan={8}
                            icon={CalendarDays}
                            title="No events found"
                            description="Try adjusting your search or create a new event."
                        />
                    )}
                </tbody>
            </table>
        </div>
    );
}
