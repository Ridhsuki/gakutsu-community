import { router, useForm } from '@inertiajs/react';
import type { SyntheticEvent } from 'react';
import { useState } from 'react';
import {
    getDefaultCreateEventRegistrationQuestionForm,
    getDefaultEditEventRegistrationQuestionForm,
    mapQuestionToEditForm,
} from '@/features/events/question-form-helpers';
import type {
    CreateEventRegistrationQuestionForm,
    EditEventRegistrationQuestionForm,
    EventRegistrationQuestionItem,
} from '@/features/events/types';
import useIndexFilters from '@/hooks/use-index-filters';

interface UseEventRegistrationQuestionManagementOptions {
    endpoint: string;
    initialSearch?: string;
    only?: string[];
}

export default function useEventRegistrationQuestionManagement({
    endpoint,
    initialSearch = '',
    only = ['questions', 'filters'],
}: UseEventRegistrationQuestionManagementOptions) {
    const { search, setSearch, isReloading } = useIndexFilters({
        endpoint,
        initialFilters: {
            search: initialSearch,
            sort_field: undefined,
            sort_direction: undefined,
        },
        allowedSortFields: ['created_at'] as const,
        only,
        debounceMs: 350,
    });

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedQuestion, setSelectedQuestion] =
        useState<EventRegistrationQuestionItem | null>(null);

    const createForm = useForm<CreateEventRegistrationQuestionForm>(
        getDefaultCreateEventRegistrationQuestionForm(),
    );

    const editForm = useForm<EditEventRegistrationQuestionForm>(
        getDefaultEditEventRegistrationQuestionForm(),
    );

    const openCreateModal = () => {
        createForm.reset();
        createForm.clearErrors();
        setIsCreateOpen(true);
    };

    const openEditModal = (question: EventRegistrationQuestionItem) => {
        setSelectedQuestion(question);
        editForm.setData(mapQuestionToEditForm(question));
        editForm.clearErrors();
        setIsEditOpen(true);
    };

    const openDeleteModal = (question: EventRegistrationQuestionItem) => {
        setSelectedQuestion(question);
        setIsDeleteOpen(true);
    };

    const handleCreateSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();

        createForm.post(endpoint, {
            preserveScroll: true,
            onSuccess: () => {
                setIsCreateOpen(false);
                createForm.reset();
            },
        });
    };

    const handleEditSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!selectedQuestion) {
return;
}

        editForm.put(`${endpoint}/${selectedQuestion.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setIsEditOpen(false);
                setSelectedQuestion(null);
            },
        });
    };

    const handleDelete = () => {
        if (!selectedQuestion) {
return;
}

        router.delete(`${endpoint}/${selectedQuestion.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                setIsDeleteOpen(false);
                setSelectedQuestion(null);
            },
        });
    };

    return {
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

        handleCreateOpenChange: (open: boolean) => setIsCreateOpen(open),
        handleEditOpenChange: (open: boolean) => {
            setIsEditOpen(open);

            if (!open) {
setSelectedQuestion(null);
}
        },
        handleDeleteOpenChange: (open: boolean) => {
            setIsDeleteOpen(open);

            if (!open) {
setSelectedQuestion(null);
}
        },
    };
}
