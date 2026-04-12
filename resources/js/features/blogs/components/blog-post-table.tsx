import { Button } from '@/components/ui/button';
import EmptyStateRow from '@/components/data-table/empty-state-row';
import SortableHeader from '@/components/data-table/sortable-header';
import BlogPostStatusBadge from '@/features/blogs/components/blog-post-status-badge';
import type { BlogPost, BlogPostSortField } from '@/features/blogs/types';
import type { SortDirection } from '@/types/filters';
import { Edit, Trash2 } from 'lucide-react';

interface BlogPostTableProps {
    posts: BlogPost[];
    sortField: BlogPostSortField;
    sortDirection: SortDirection;
    onSort: (field: BlogPostSortField) => void;
    onEdit: (post: BlogPost) => void;
    onDelete: (post: BlogPost) => void;
}

function formatDate(value: string | null) {
    if (!value) return '-';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return '-';

    return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
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
            <table className="w-full min-w-[900px] text-left text-sm">
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
                                    <div className="font-medium">{post.title}</div>
                                    <div className="text-xs text-muted-foreground">/{post.slug}</div>
                                </td>
                                <td className="px-4 py-3">
                                    <BlogPostStatusBadge status={post.status} />
                                </td>
                                <td className="px-4 py-3 text-muted-foreground">
                                    {formatDate(post.published_at)}
                                </td>
                                <td className="px-4 py-3 text-muted-foreground">
                                    {formatDate(post.created_at)}
                                </td>
                                <td className="px-4 py-3 text-muted-foreground">
                                    {post.author?.name ?? '-'}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center justify-end gap-2">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => onEdit(post)}
                                            aria-label={`Edit ${post.title}`}
                                        >
                                            <Edit className="h-4 w-4 text-blue-500" />
                                        </Button>

                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => onDelete(post)}
                                            aria-label={`Delete ${post.title}`}
                                        >
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <EmptyStateRow colSpan={6} message="No blog posts found." />
                    )}
                </tbody>
            </table>
        </div>
    );
}
