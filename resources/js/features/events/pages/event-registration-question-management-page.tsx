import { Head } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import IndexToolbar from '@/components/data-table/index-toolbar';
import PaginationBar from '@/components/data-table/pagination-bar';
import ContextBackButton from '@/components/navigation/context-back-button';
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
    filters: {
        search?: string | null;
    };
    endpoint: string;
    headTitle: string;
    fallbackHref: string;
}

export default function EventRegistrationQuestionManagementPage({
    event,
    questions,
    filters,
    endpoint,
    headTitle,
    fallbackHref,
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
                <div className="space-y-3">
                    <ContextBackButton fallbackHref={fallbackHref} label="Back" />

                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Registration Form · {event.title}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Manage additional registration questions for this event.
                        </p>
                    </div>
                </div>

                <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                    <IndexToolbar
                        title="Registration Questions"
                        description="Optional additional questions shown when users register for the event."
                        searchValue={search}
                        onSearchChange={setSearch}
                        searchPlaceholder="Search questions..."
                        actions={
                            <Button type="button" onClick={openCreateModal}>
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

                    <div className="mt-4 overflow-x-auto rounded-lg border border-border">
                        <EventRegistrationQuestionTable
                            questions={questions.data}
                            onEdit={openEditModal}
                            onDelete={openDeleteModal}
                        />
                    </div>

                    <div className="mt-4">
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
