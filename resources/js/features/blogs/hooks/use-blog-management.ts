import { router, useForm } from '@inertiajs/react';
import { useState } from 'react';
import type { SyntheticEvent } from 'react';
import { BLOG_ALLOWED_SORT_FIELDS } from '@/features/blogs/constants';
import {
    getDefaultCreateBlogPostForm,
    getDefaultEditBlogPostForm,
    mapBlogPostToEditBlogPostForm,
} from '@/features/blogs/form-helpers';
import { uploadEditorImage } from '@/features/blogs/lib/upload-editor-image';
import type {
    BlogPost,
    BlogPostSortField,
    CreateBlogPostForm,
    EditBlogPostForm,
} from '@/features/blogs/types';
import useIndexFilters from '@/hooks/use-index-filters';
import type { IndexFilters } from '@/types/filters';

interface UseBlogManagementOptions {
    endpoint: string;
    initialFilters: IndexFilters<BlogPostSortField>;
    only?: string[];
}

export default function useBlogManagement({
    endpoint,
    initialFilters,
    only = ['posts', 'filters'],
}: UseBlogManagementOptions) {
    const {
        search,
        setSearch,
        sortField,
        sortDirection,
        isReloading,
        handleSort,
        setSortFieldAndReload,
        setSortDirectionAndReload,
        toggleSortDirection,
    } = useIndexFilters<BlogPostSortField>({
        endpoint,
        initialFilters,
        allowedSortFields: BLOG_ALLOWED_SORT_FIELDS,
        only,
        debounceMs: 350,
    });

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

    const createForm = useForm<CreateBlogPostForm>(
        getDefaultCreateBlogPostForm(),
    );
    const editForm = useForm<EditBlogPostForm>(getDefaultEditBlogPostForm());

    const closeCreateModal = () => {
        setIsCreateOpen(false);
        createForm.reset();
        createForm.clearErrors();
    };

    const closeEditModal = () => {
        setIsEditOpen(false);
        setSelectedPost(null);
        editForm.reset();
        editForm.clearErrors();
    };

    const closeDeleteModal = () => {
        setIsDeleteOpen(false);
        setSelectedPost(null);
    };

    const openCreateModal = () => {
        createForm.reset();
        createForm.clearErrors();
        setIsCreateOpen(true);
    };

    const openEditModal = (post: BlogPost) => {
        setSelectedPost(post);
        editForm.setData(mapBlogPostToEditBlogPostForm(post));
        editForm.clearErrors();
        setIsEditOpen(true);
    };

    const openDeleteModal = (post: BlogPost) => {
        setSelectedPost(post);
        setIsDeleteOpen(true);
    };

    const handleCreateSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();

        createForm.post(endpoint, {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                closeCreateModal();
            },
        });
    };

    const handleEditSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!selectedPost) {
            return;
        }

        editForm.put(`${endpoint}/${selectedPost.id}`, {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                closeEditModal();
            },
        });
    };

    const handleDelete = () => {
        if (!selectedPost) {
            return;
        }

        setIsDeleting(true);

        router.delete(`${endpoint}/${selectedPost.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                closeDeleteModal();
            },
            onFinish: () => {
                setIsDeleting(false);
            },
        });
    };

    const handleCreateOpenChange = (open: boolean) => {
        if (open) {
            setIsCreateOpen(true);

            return;
        }

        closeCreateModal();
    };

    const handleEditOpenChange = (open: boolean) => {
        if (open) {
            setIsEditOpen(true);

            return;
        }

        closeEditModal();
    };

    const handleDeleteOpenChange = (open: boolean) => {
        if (open) {
            setIsDeleteOpen(true);

            return;
        }

        closeDeleteModal();
    };

    return {
        search,
        setSearch,
        sortField,
        sortDirection,
        isReloading,
        handleSort,
        setSortFieldAndReload,
        setSortDirectionAndReload,
        toggleSortDirection,

        isCreateOpen,
        isEditOpen,
        isDeleteOpen,
        isDeleting,
        selectedPost,

        createForm,
        editForm,

        openCreateModal,
        openEditModal,
        openDeleteModal,
        closeCreateModal,
        closeEditModal,
        closeDeleteModal,

        handleCreateSubmit,
        handleEditSubmit,
        handleDelete,

        handleCreateOpenChange,
        handleEditOpenChange,
        handleDeleteOpenChange,

        uploadEditorImage,
    };
}
