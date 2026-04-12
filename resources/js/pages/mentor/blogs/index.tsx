import type { SyntheticEvent } from 'react';
import { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import PaginationBar from '@/components/data-table/pagination-bar';
import ResourceToolbar from '@/components/data-table/resource-toolbar';
import SearchInput from '@/components/data-table/search-input';
import useIndexFilters from '@/hooks/use-index-filters';
import BlogPostCreateDialog from '@/features/blogs/components/blog-post-create-dialog';
import BlogPostDeleteDialog from '@/features/blogs/components/blog-post-delete-dialog';
import BlogPostEditDialog from '@/features/blogs/components/blog-post-edit-dialog';
import BlogPostTable from '@/features/blogs/components/blog-post-table';
import {
    BLOG_ALLOWED_SORT_FIELDS,
    MENTOR_BLOGS_INDEX_URL,
} from '@/features/blogs/constants';
import {
    getDefaultCreateBlogPostForm,
    getDefaultEditBlogPostForm,
    mapBlogPostToEditBlogPostForm,
} from '@/features/blogs/form-helpers';
import type { BlogPost, BlogPostSortField, CreateBlogPostForm, EditBlogPostForm } from '@/features/blogs/types';
import type { PaginatedResponse } from '@/types/pagination';
import type { IndexFilters } from '@/types/filters';
import { Plus } from 'lucide-react';

interface PageProps {
    posts: PaginatedResponse<BlogPost>;
    filters: IndexFilters<BlogPostSortField>;
}

export default function MentorBlogIndex({ posts, filters }: PageProps) {
    const {
        search,
        setSearch,
        sortField,
        sortDirection,
        isReloading,
        handleSort,
    } = useIndexFilters<BlogPostSortField>({
        endpoint: MENTOR_BLOGS_INDEX_URL,
        initialFilters: filters,
        allowedSortFields: BLOG_ALLOWED_SORT_FIELDS,
        only: ['posts', 'filters'],
        debounceMs: 350,
    });

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

    const createForm = useForm<CreateBlogPostForm>(getDefaultCreateBlogPostForm());
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

        createForm.post(MENTOR_BLOGS_INDEX_URL, {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                closeCreateModal();
            },
        });
    };

    const handleEditSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!selectedPost) return;

        editForm.put(`${MENTOR_BLOGS_INDEX_URL}/${selectedPost.id}`, {
            preserveScroll: true,
            forceFormData: true,
            onSuccess: () => {
                closeEditModal();
            },
        });
    };

    const handleDelete = () => {
        if (!selectedPost) return;

        setIsDeleting(true);

        router.delete(`${MENTOR_BLOGS_INDEX_URL}/${selectedPost.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                closeDeleteModal();
            },
            onFinish: () => {
                setIsDeleting(false);
            },
        });
    };

    const uploadEditorImage = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('image', file);

        const csrfToken =
            document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '';

        const response = await fetch('/editor/blog-images', {
            method: 'POST',
            headers: {
                'X-CSRF-TOKEN': csrfToken,
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json',
            },
            body: formData,
        });

        const contentType = response.headers.get('content-type') ?? '';
        const isJson = contentType.includes('application/json');

        const payload = isJson ? await response.json() : await response.text();

        if (!response.ok) {
            if (isJson && typeof payload === 'object' && payload !== null) {
                const validationMessage =
                    Array.isArray((payload as any).errors?.image)
                        ? (payload as any).errors.image[0]
                        : null;

                const generalMessage =
                    (payload as any).message ?? validationMessage;

                throw new Error(generalMessage || 'Failed to upload image.');
            }

            throw new Error(
                typeof payload === 'string' && payload.trim() !== ''
                    ? payload
                    : 'Failed to upload image.'
            );
        }

        return (payload as { url: string }).url;
    };

    return (
        <>
            <Head title="My Blog Posts" />

            <div className="flex h-full w-full flex-col space-y-6 p-6">
                <ResourceToolbar
                    title="My Blog Posts"
                    description="Manage your own draft and published blog posts."
                    actions={
                        <Button
                            type="button"
                            onClick={openCreateModal}
                            className="bg-[#106b42] text-white hover:bg-[#0c5132]"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Add Blog Post
                        </Button>
                    }
                >
                    <SearchInput
                        value={search}
                        onChange={setSearch}
                        placeholder="Search by title, slug, or author..."
                    />

                    <div className="text-sm text-muted-foreground">
                        {isReloading ? 'Refreshing data...' : `Total posts: ${posts.total}`}
                    </div>
                </ResourceToolbar>

                <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 text-card-foreground shadow-sm">
                    <BlogPostTable
                        posts={posts.data}
                        sortField={sortField}
                        sortDirection={sortDirection}
                        onSort={handleSort}
                        onEdit={openEditModal}
                        onDelete={openDeleteModal}
                    />

                    <PaginationBar
                        links={posts.links}
                        from={posts.from}
                        to={posts.to}
                        total={posts.total}
                        lastPage={posts.last_page}
                        only={['posts', 'filters']}
                    />
                </div>
            </div>

            <BlogPostCreateDialog
                open={isCreateOpen}
                onOpenChange={(open) => (open ? setIsCreateOpen(true) : closeCreateModal())}
                form={createForm}
                onSubmit={handleCreateSubmit}
                onUploadImage={uploadEditorImage}
            />

            <BlogPostEditDialog
                open={isEditOpen}
                onOpenChange={(open) => (open ? setIsEditOpen(true) : closeEditModal())}
                form={editForm}
                currentPost={selectedPost}
                onSubmit={handleEditSubmit}
                onUploadImage={uploadEditorImage}
            />

            <BlogPostDeleteDialog
                open={isDeleteOpen}
                onOpenChange={(open) => (open ? setIsDeleteOpen(true) : closeDeleteModal())}
                post={selectedPost}
                isDeleting={isDeleting}
                onConfirm={handleDelete}
            />
        </>
    );
}
