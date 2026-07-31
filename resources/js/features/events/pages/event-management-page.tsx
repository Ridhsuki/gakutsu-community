import { Head, Link, router } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import IndexToolbar from '@/components/data-table/index-toolbar';
import PaginationBar from '@/components/data-table/pagination-bar';
import { Button } from '@/components/ui/button';
import EventCollectionView from '@/features/events/components/event-collection-view';
import EventDeleteDialog from '@/features/events/components/event-delete-dialog';
import EventFilterToolbarControl from '@/features/events/components/event-filter-toolbar-control';
import EventSortToolbarControl from '@/features/events/components/event-sort-toolbar-control';
import EventViewToggle from '@/features/events/components/event-view-toggle';
import useEventIndexFilters from '@/features/events/hooks/use-event-index-filters';
import useEventViewMode from '@/features/events/hooks/use-event-view-mode';
import type { EventItem, EventSortField } from '@/features/events/types';
import type { IndexFilters } from '@/types/filters';
import type { PaginatedResponse } from '@/types/pagination';

export interface EventManagementPageSharedProps {
    events: PaginatedResponse<EventItem>;
    filters: IndexFilters<EventSortField> & {
        status?: string | null;
        publication?: string | null;
        access_type?: string | null;
    };
    createHref: string;
    showBaseUrl: string;
    editBaseUrl: string;
    registrationsBaseUrl: string;
    questionsBaseUrl: string;
    title: string;
    description: string;
    headTitle: string;
    deleteBaseUrl: string;
}

export default function EventManagementPage({
    events,
    filters,
    createHref,
    showBaseUrl,
    editBaseUrl,
    registrationsBaseUrl,
    questionsBaseUrl,
    title,
    description,
    headTitle,
    deleteBaseUrl,
}: EventManagementPageSharedProps) {
    const {
        search,
        setSearch,
        sortField,
        sortDirection,
        isReloading,
        handleSort,
        setSortFieldAndReload,
        toggleSortDirection,
        statusFilter,
        publicationFilter,
        accessTypeFilter,
        setStatusFilterAndReload,
        setPublicationFilterAndReload,
        setAccessTypeFilterAndReload,
        clearFilters,
    } = useEventIndexFilters({
        endpoint: deleteBaseUrl,
        initialFilters: filters,
        only: ['events', 'filters'],
        debounceMs: 350,
    });

    const { viewMode, setViewMode } = useEventViewMode();

    const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const openDeleteModal = (event: EventItem) => {
        setSelectedEvent(event);
        setIsDeleteOpen(true);
    };

    const handleDelete = () => {
        if (!selectedEvent) {
            return;
        }

        setIsDeleting(true);

        router.delete(`${deleteBaseUrl}/${selectedEvent.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setIsDeleteOpen(false);
                setSelectedEvent(null);
            },
            onFinish: () => setIsDeleting(false),
        });
    };

    return (
        <>
            <Head title={headTitle} />

            <div className="flex h-full w-full flex-col space-y-6 p-6">
                <IndexToolbar
                    title={title}
                    description={description}
                    searchValue={search}
                    onSearchChange={setSearch}
                    searchPlaceholder="Search by title, category, slug, or mentor..."
                    actions={
                        <Button
                            type="button"
                            asChild
                            className="w-full bg-[#106b42] text-white hover:bg-[#0c5132] sm:w-auto"
                        >
                            <Link href={createHref}>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Event
                            </Link>
                        </Button>
                    }
                    filters={
                        <EventFilterToolbarControl
                            statusFilter={statusFilter}
                            publicationFilter={publicationFilter}
                            accessTypeFilter={accessTypeFilter}
                            onStatusChange={setStatusFilterAndReload}
                            onPublicationChange={setPublicationFilterAndReload}
                            onAccessTypeChange={setAccessTypeFilterAndReload}
                            onClear={clearFilters}
                        />
                    }
                    controls={
                        <>
                            <EventViewToggle
                                value={viewMode}
                                onChange={setViewMode}
                            />

                            {viewMode === 'cards' ? (
                                <EventSortToolbarControl
                                    sortField={sortField}
                                    sortDirection={sortDirection}
                                    onSortFieldChange={setSortFieldAndReload}
                                    onSortDirectionToggle={toggleSortDirection}
                                />
                            ) : null}
                        </>
                    }
                    meta={
                        isReloading
                            ? 'Refreshing data...'
                            : `Total events: ${events.total}`
                    }
                />

                <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 text-card-foreground shadow-sm">
                    <EventCollectionView
                        viewMode={viewMode}
                        events={events.data}
                        sortField={sortField}
                        sortDirection={sortDirection}
                        onSort={handleSort}
                        onDelete={openDeleteModal}
                        showBaseUrl={showBaseUrl}
                        editBaseUrl={editBaseUrl}
                        registrationsBaseUrl={registrationsBaseUrl}
                        questionsBaseUrl={questionsBaseUrl}
                    />

                    <PaginationBar
                        links={events.links}
                        from={events.from}
                        to={events.to}
                        total={events.total}
                        lastPage={events.last_page}
                        only={['events', 'filters']}
                    />
                </div>
            </div>

            <EventDeleteDialog
                open={isDeleteOpen}
                onOpenChange={setIsDeleteOpen}
                event={selectedEvent}
                isDeleting={isDeleting}
                onConfirm={handleDelete}
            />
        </>
    );
}
