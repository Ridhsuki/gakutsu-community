import EventCardGrid from '@/features/events/components/event-card-grid';
import EventTable from '@/features/events/components/event-table';
import type {
    EventItem,
    EventManagementViewMode,
    EventSortField,
} from '@/features/events/types';
import type { SortDirection } from '@/types/filters';

interface EventCollectionViewProps {
    viewMode: EventManagementViewMode;
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

export default function EventCollectionView({
    viewMode,
    events,
    sortField,
    sortDirection,
    onSort,
    onDelete,
    showBaseUrl,
    editBaseUrl,
    registrationsBaseUrl,
    questionsBaseUrl,
}: EventCollectionViewProps) {
    if (viewMode === 'cards') {
        return (
            <EventCardGrid
                events={events}
                showBaseUrl={showBaseUrl}
                editBaseUrl={editBaseUrl}
                registrationsBaseUrl={registrationsBaseUrl}
                questionsBaseUrl={questionsBaseUrl}
                onDelete={onDelete}
            />
        );
    }

    return (
        <EventTable
            events={events}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={onSort}
            onDelete={onDelete}
            showBaseUrl={showBaseUrl}
            editBaseUrl={editBaseUrl}
            registrationsBaseUrl={registrationsBaseUrl}
            questionsBaseUrl={questionsBaseUrl}
        />
    );
}
