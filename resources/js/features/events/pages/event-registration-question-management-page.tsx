import { Head } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import IndexToolbar from '@/components/data-table/index-toolbar';
import PaginationBar from '@/components/data-table/pagination-bar';
import { Button } from '@/components/ui/button';
import EventRegistrationQuestionCreateDialog from '@/features/events/components/event-registration-question-create-dialog';
import EventRegistrationQuestionDeleteDialog from '@/features/events/components/event-registration-question-delete-dialog';
import EventRegistrationQuestionEditDialog from '@/features/events/components/event-registration-question-edit-dialog';
import EventRegistrationQuestionTable from '@/features/events/components/event-registration-question-table';
import useEventRegistrationQuestionManagement from '@/features/events/hooks/use-event-registration-question-management';
import type { EventItem, EventRegistrationQuestionItem } from '@/features/events/types';
import type { PaginatedResponse } from '@/types/pagination';

interface PageProps {
    event: EventItem;
    questions: PaginatedResponse<EventRegistrationQuestionItem>;
    filters: { search?: string | null };
    endpoint: string;
    headTitle: string;
}

export default function EventRegistrationQuestionManagementPage({
    event,
    questions,
    filters,
    endpoint,
    headTitle,
}: PageProps) {
    const {
        search,
        setSearch,
        isReloading,
        isCreateOpen,
        isEditOpen,
        isDeleteOpen,
        selectedQuestion,
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
    } = useEventRegistrationQuestionManagement({
        endpoint,
        initialSearch: filters.search ?? '',
    });

    return (
        <>
            <Head title={headTitle} />

            <div className="flex h-full w-full flex-col space-y-6 p-6">
                <IndexToolbar
                    title={`Registration Form - ${event.title}`}
                    description={`Instructor: ${event.instructor?.name ?? '-'}`}
                    searchValue={search}
                    onSearchChange={setSearch}
                    searchPlaceholder="Search registration question..."
                    actions={
                        <Button
                            type="button"
                            onClick={openCreateModal}
                            className="w-full bg-[#106b42] text-white hover:bg-[#0c5132] sm:w-auto"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Add Question
                        </Button>
                    }
                    meta={
                        isReloading
                            ? 'Refreshing data...'
                            : `Total questions: ${questions.total}`
                    }
                />

                <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 text-card-foreground shadow-sm">
                    <EventRegistrationQuestionTable
                        questions={questions.data}
                        onEdit={openEditModal}
                        onDelete={openDeleteModal}
                    />

                    <PaginationBar
                        links={questions.links}
                        from={questions.from}
                        to={questions.to}
                        total={questions.total}
                        lastPage={questions.last_page}
                        only={['questions', 'filters']}
                    />
                </div>
            </div>

            <EventRegistrationQuestionCreateDialog
                open={isCreateOpen}
                onOpenChange={handleCreateOpenChange}
                form={createForm}
                onSubmit={handleCreateSubmit}
            />

            <EventRegistrationQuestionEditDialog
                open={isEditOpen}
                onOpenChange={handleEditOpenChange}
                form={editForm}
                currentQuestion={selectedQuestion}
                onSubmit={handleEditSubmit}
            />

            <EventRegistrationQuestionDeleteDialog
                open={isDeleteOpen}
                onOpenChange={handleDeleteOpenChange}
                question={selectedQuestion}
                onConfirm={handleDelete}
            />
        </>
    );
}
