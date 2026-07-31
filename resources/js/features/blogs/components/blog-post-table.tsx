import { FileText } from 'lucide-react';
import EmptyStateRow from '@/components/data-table/empty-state-row';
import SortableHeader from '@/components/data-table/sortable-header';
import BlogPostCoverThumbnail from '@/features/blogs/components/blog-post-cover-thumbnail';
import BlogPostRowActions from '@/features/blogs/components/blog-post-row-actions';
import BlogPostStatusBadge from '@/features/blogs/components/blog-post-status-badge';
import { formatBlogPostDate } from '@/features/blogs/lib/blog-post-formatters';
import type { BlogPost, BlogPostSortField } from '@/features/blogs/types';
import type { SortDirection } from '@/types/filters';

interface BlogPostTableProps {
    posts: BlogPost[];
    sortField: BlogPostSortField;
    sortDirection: SortDirection;
    onSort: (field: BlogPostSortField) => void;
    onEdit: (post: BlogPost) => void;
    onDelete: (post: BlogPost) => void;
}

export default function BlogPostTable({
    posts,
    sortField,
    sortDirection,
    onSort,
    onEdit,
    onDelete,
}: BlogPostTableProps) {
    return (
        <div className="overflow-x-auto rounded-lg border border-border bg-card">
            <table className="w-full min-w-[980px] text-left text-sm">
                <thead className="bg-muted/50">
                    <tr className="border-b">
                        <SortableHeader
                            label="Title"
                            field="title"
                            currentField={sortField}
                            currentDirection={sortDirection}
                            onSort={onSort}
                        />

                        <SortableHeader
                            label="Status"
                            field="status"
                            currentField={sortField}
                            currentDirection={sortDirection}
                            onSort={onSort}
                        />

                        <SortableHeader
                            label="Published"
                            field="published_at"
                            currentField={sortField}
                            currentDirection={sortDirection}
                            onSort={onSort}
                        />

                        <SortableHeader
                            label="Created"
                            field="created_at"
                            currentField={sortField}
                            currentDirection={sortDirection}
                            onSort={onSort}
                        />

                        <SortableHeader
                            label="Author"
                            field="author"
                            currentField={sortField}
                            currentDirection={sortDirection}
                            onSort={onSort}
                        />

                        <th className="px-4 py-3 text-right font-medium">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {posts.length > 0 ? (
                        posts.map((post) => (
                            <tr
                                key={post.id}
                                className="border-b border-border transition hover:bg-accent/50"
                            >
                                <td className="px-4 py-3">
                                    <div className="flex min-w-0 items-center gap-3">
                                        <BlogPostCoverThumbnail
                                            src={post.cover_image_url}
                                            alt={`Cover image for ${post.title}`}
                                            className="h-14 w-24 shrink-0"
                                        />

                                        <div className="min-w-0 max-w-[320px]">
                                            <div className="truncate font-medium">{post.title}</div>
                                            <div className="truncate text-xs text-muted-foreground">
                                                /{post.slug}
                                            </div>
                                        </div>
                                    </div>
                                </td>

                                <td className="px-4 py-3">
                                    <BlogPostStatusBadge status={post.status} />
                                </td>

                                <td className="px-4 py-3 text-muted-foreground">
                                    {formatBlogPostDate(post.published_at)}
                                </td>

                                <td className="px-4 py-3 text-muted-foreground">
                                    {formatBlogPostDate(post.created_at)}
                                </td>

                                <td className="px-4 py-3 text-muted-foreground">
                                    {post.author?.name ?? '-'}
                                </td>

                                <td className="px-4 py-3">
                                    <BlogPostRowActions
                                        post={post}
                                        onEdit={onEdit}
                                        onDelete={onDelete}
                                    />
                                </td>
                            </tr>
                        ))
                    ) : (
                        <EmptyStateRow
                            colSpan={6}
                            icon={FileText}
                            title="No blog posts found"
                            description="Try adjusting your search or create a new blog post to get started."
                        />
                    )}
                </tbody>
            </table>
        </div>
    );
}
