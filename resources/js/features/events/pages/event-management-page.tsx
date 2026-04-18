import { Head } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import IndexToolbar from '@/components/data-table/index-toolbar';
import PaginationBar from '@/components/data-table/pagination-bar';
import { Button } from '@/components/ui/button';
import EventCreateDialog from '@/features/events/components/event-create-dialog';
import EventDeleteDialog from '@/features/events/components/event-delete-dialog';
import EventEditDialog from '@/features/events/components/event-edit-dialog';
import EventTable from '@/features/events/components/event-table';
import useEventManagement from '@/features/events/hooks/use-event-management';
import type {
    EventItem,
    EventMentorOption,
    EventSortField,
} from '@/features/events/types';
import type { IndexFilters } from '@/types/filters';
import type { PaginatedResponse } from '@/types/pagination';

export interface EventManagementPageSharedProps {
    events: PaginatedResponse<EventItem>;
    filters: IndexFilters<EventSortField>;
    mentors?: EventMentorOption[];
}

interface EventManagementPageProps extends EventManagementPageSharedProps {
    endpoint: string;
    headTitle: string;
    title: string;
    description: string;
    registrationsBaseUrl: string;
    canAssignInstructor?: boolean;
}

export default function EventManagementPage({
    events,
    filters,
    mentors = [],
    endpoint,
    headTitle,
    title,
    description,
    registrationsBaseUrl,
    canAssignInstructor = false,
}: EventManagementPageProps) {
    const {
        search,
        setSearch,
        sortField,
        sortDirection,
        isReloading,
        handleSort,
        isCreateOpen,
        isEditOpen,
        isDeleteOpen,
        isDeleting,
        selectedEvent,
        createForm,
        editForm,
        openCreateModal,
        openEditModal,
        openDeleteModal,
        handleCreateSubmit,
        handleEditSubmit,
        handleDelete,
        handleCreateOpenChange,
        handleEditOpenChange,
        handleDeleteOpenChange,
    } = useEventManagement({
        endpoint,
        initialFilters: filters,
    });

    return (
        <>
            <Head title={headTitle} />

            <div className="flex h-full w-full flex-col space-y-6 p-6">
                <IndexToolbar
                    title={title}
                    description={description}
                    searchValue={search}
                    onSearchChange={setSearch}
                    searchPlaceholder="Search by title, category, slug, or instructor..."
                    actions={
                        <Button
                            type="button"
                            onClick={openCreateModal}
                            className="w-full bg-[#106b42] text-white hover:bg-[#0c5132] sm:w-auto"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Add Event
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
                        onEdit={openEditModal}
                        onDelete={openDeleteModal}
                        registrationsBaseUrl={registrationsBaseUrl}
                        questionsBaseUrl={endpoint}
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

            <EventCreateDialog
                open={isCreateOpen}
                onOpenChange={handleCreateOpenChange}
                form={createForm}
                onSubmit={handleCreateSubmit}
                mentors={mentors}
                canAssignInstructor={canAssignInstructor}
            />

            <EventEditDialog
                open={isEditOpen}
                onOpenChange={handleEditOpenChange}
                form={editForm}
                currentEvent={selectedEvent}
                onSubmit={handleEditSubmit}
                mentors={mentors}
                canAssignInstructor={canAssignInstructor}
            />

            <EventDeleteDialog
                open={isDeleteOpen}
                onOpenChange={handleDeleteOpenChange}
                event={selectedEvent}
                isDeleting={isDeleting}
                onConfirm={handleDelete}
            />
        </>
    );
}
