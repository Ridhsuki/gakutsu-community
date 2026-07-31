import { router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import type { SyntheticEvent } from 'react';
import { EVENT_ALLOWED_SORT_FIELDS } from '@/features/events/constants';
import {
    getDefaultCreateEventForm,
    getDefaultEditEventForm,
    mapEventToEditEventForm,
} from '@/features/events/form-helpers';
import type {
    CreateEventForm,
    EditEventForm,
    EventItem,
    EventSortField,
} from '@/features/events/types';
import useIndexFilters from '@/hooks/use-index-filters';
import type { IndexFilters } from '@/types/filters';

interface UseEventManagementOptions {
    endpoint: string;
    initialFilters: IndexFilters<EventSortField>;
    only?: string[];
}

export default function useEventManagement({
    endpoint,
    initialFilters,
    only = ['events', 'filters'],
}: UseEventManagementOptions) {
    const {
        search,
        setSearch,
        sortField,
        sortDirection,
        isReloading,
        handleSort,
    } = useIndexFilters<EventSortField>({
        endpoint,
        initialFilters,
        allowedSortFields: EVENT_ALLOWED_SORT_FIELDS,
        only,
        debounceMs: 350,
    });

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

    const createForm = useForm<CreateEventForm>(getDefaultCreateEventForm());
    const editForm = useForm<EditEventForm>(getDefaultEditEventForm());

    const closeCreateModal = () => {
        setIsCreateOpen(false);
        createForm.reset();
        createForm.clearErrors();
    };

    const closeEditModal = () => {
        setIsEditOpen(false);
        setSelectedEvent(null);
        editForm.reset();
        editForm.clearErrors();
    };

    const closeDeleteModal = () => {
        setIsDeleteOpen(false);
        setSelectedEvent(null);
    };

    const openCreateModal = () => {
        createForm.reset();
        createForm.clearErrors();
        setIsCreateOpen(true);
    };

    const openEditModal = (event: EventItem) => {
        setSelectedEvent(event);
        editForm.setData(mapEventToEditEventForm(event));
        editForm.clearErrors();
        setIsEditOpen(true);
    };

    const openDeleteModal = (event: EventItem) => {
        setSelectedEvent(event);
        setIsDeleteOpen(true);
    };

    const handleCreateSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();

        createForm.post(endpoint, {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: closeCreateModal,
        });
    };

    const handleEditSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!selectedEvent) {
            return;
        }

        editForm.put(`${endpoint}/${selectedEvent.id}`, {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: closeEditModal,
        });
    };

    const handleDelete = () => {
        if (!selectedEvent) {
            return;
        }

        setIsDeleting(true);

        router.delete(`${endpoint}/${selectedEvent.id}`, {
            preserveScroll: true,
            onSuccess: closeDeleteModal,
            onFinish: () => setIsDeleting(false),
        });
    };

    return {
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

        handleCreateOpenChange: (open: boolean) =>
            open ? setIsCreateOpen(true) : closeCreateModal(),
        handleEditOpenChange: (open: boolean) =>
            open ? setIsEditOpen(true) : closeEditModal(),
        handleDeleteOpenChange: (open: boolean) =>
            open ? setIsDeleteOpen(true) : closeDeleteModal(),
    };
}
