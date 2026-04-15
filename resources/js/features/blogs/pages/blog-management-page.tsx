import { Head } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import PaginationBar from '@/components/data-table/pagination-bar';
import ResourceToolbar from '@/components/data-table/resource-toolbar';
import SearchInput from '@/components/data-table/search-input';
import { Button } from '@/components/ui/button';
import BlogPostCreateDialog from '@/features/blogs/components/blog-post-create-dialog';
import BlogPostDeleteDialog from '@/features/blogs/components/blog-post-delete-dialog';
import BlogPostEditDialog from '@/features/blogs/components/blog-post-edit-dialog';
import BlogPostTable from '@/features/blogs/components/blog-post-table';
import useBlogManagement from '@/features/blogs/hooks/use-blog-management';
import type { BlogPost, BlogPostSortField } from '@/features/blogs/types';
import type { IndexFilters } from '@/types/filters';
import type { PaginatedResponse } from '@/types/pagination';

export interface BlogManagementPageSharedProps {
    posts: PaginatedResponse<BlogPost>;
    filters: IndexFilters<BlogPostSortField>;
}

interface BlogManagementPageProps extends BlogManagementPageSharedProps {
    endpoint: string;
    headTitle: string;
    title: string;
    description: string;
    searchPlaceholder?: string;
}

export default function BlogManagementPage({
    posts,
    filters,
    endpoint,
    headTitle,
    title,
    description,
    searchPlaceholder = 'Search by title, slug, or author...',
}: BlogManagementPageProps) {
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
        selectedPost,
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
        uploadEditorImage,
    } = useBlogManagement({
        endpoint,
        initialFilters: filters,
    });

    return (
        <>
            <Head title={headTitle} />

            <div className="flex h-full w-full flex-col space-y-6 p-6">
                <ResourceToolbar
                    title={title}
                    description={description}
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
                        placeholder={searchPlaceholder}
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
                onOpenChange={handleCreateOpenChange}
                form={createForm}
                onSubmit={handleCreateSubmit}
                onUploadImage={uploadEditorImage}
            />

            <BlogPostEditDialog
                open={isEditOpen}
                onOpenChange={handleEditOpenChange}
                form={editForm}
                currentPost={selectedPost}
                onSubmit={handleEditSubmit}
                onUploadImage={uploadEditorImage}
            />

            <BlogPostDeleteDialog
                open={isDeleteOpen}
                onOpenChange={handleDeleteOpenChange}
                post={selectedPost}
                isDeleting={isDeleting}
                onConfirm={handleDelete}
            />
        </>
    );
}
