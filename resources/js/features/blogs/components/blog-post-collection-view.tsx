import BlogPostCardGrid from '@/features/blogs/components/blog-post-card-grid';
import BlogPostTable from '@/features/blogs/components/blog-post-table';
import type {
    BlogManagementViewMode,
    BlogPost,
    BlogPostSortField,
} from '@/features/blogs/types';
import type { SortDirection } from '@/types/filters';

interface BlogPostCollectionViewProps {
    viewMode: BlogManagementViewMode;
    posts: BlogPost[];
    sortField: BlogPostSortField;
    sortDirection: SortDirection;
    onSort: (field: BlogPostSortField) => void;
    onEdit: (post: BlogPost) => void;
    onDelete: (post: BlogPost) => void;
}

export default function BlogPostCollectionView({
    viewMode,
    posts,
    sortField,
    sortDirection,
    onSort,
    onEdit,
    onDelete,
}: BlogPostCollectionViewProps) {
    if (viewMode === 'cards') {
        return (
            <BlogPostCardGrid
                posts={posts}
                onEdit={onEdit}
                onDelete={onDelete}
            />
        );
    }

    return (
        <BlogPostTable
            posts={posts}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={onSort}
            onEdit={onEdit}
            onDelete={onDelete}
        />
    );
}
