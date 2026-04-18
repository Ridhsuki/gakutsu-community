import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { Plus } from 'lucide-react';
import IndexToolbar from '@/components/data-table/index-toolbar';
import PaginationBar from '@/components/data-table/pagination-bar';
import { Button } from '@/components/ui/button';
import EventDeleteDialog from '@/features/events/components/event-delete-dialog';
import EventTable from '@/features/events/components/event-table';
import useIndexFilters from '@/hooks/use-index-filters';
import type { EventItem, EventSortField } from '@/features/events/types';
import type { IndexFilters } from '@/types/filters';
import type { PaginatedResponse } from '@/types/pagination';

export interface EventManagementPageSharedProps {
    events: PaginatedResponse<EventItem>;
    filters: IndexFilters<EventSortField>;
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
    const { search, setSearch, sortField, sortDirection, isReloading, handleSort } =
        useIndexFilters<EventSortField>({
            endpoint: deleteBaseUrl,
            initialFilters: filters,
            allowedSortFields: ['title', 'category', 'status', 'starts_at', 'created_at', 'mentor'],
            only: ['events', 'filters'],
            debounceMs: 350,
        });

    const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const openDeleteModal = (event: EventItem) => {
        setSelectedEvent(event);
        setIsDeleteOpen(true);
    };

    const handleDelete = () => {
        if (!selectedEvent) return;

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
                    meta={
                        isReloading ? 'Refreshing data...' : `Total events: ${events.total}`
                    }
                />

                <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 text-card-foreground shadow-sm">
                    <EventTable
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
