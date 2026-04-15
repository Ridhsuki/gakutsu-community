import BlogPostCoverThumbnail from '@/features/blogs/components/blog-post-cover-thumbnail';
import BlogPostRowActions from '@/features/blogs/components/blog-post-row-actions';
import BlogPostStatusBadge from '@/features/blogs/components/blog-post-status-badge';
import {
    formatBlogPostDate,
    getBlogPostExcerpt,
} from '@/features/blogs/lib/blog-post-formatters';
import type { BlogPost } from '@/features/blogs/types';

interface BlogPostCardProps {
    post: BlogPost;
    onEdit: (post: BlogPost) => void;
    onDelete: (post: BlogPost) => void;
}

export default function BlogPostCard({
    post,
    onEdit,
    onDelete,
}: BlogPostCardProps) {
    return (
        <article className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm">
            <div className="p-4 pb-0">
                <BlogPostCoverThumbnail
                    src={post.cover_image_url}
                    alt={`Cover image for ${post.title}`}
                    className="aspect-[16/9] w-full"
                />
            </div>

            <div className="flex flex-1 flex-col p-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        <h3 className="line-clamp-2 text-base font-semibold">
                            {post.title}
                        </h3>
                        <p className="mt-1 truncate text-xs text-muted-foreground">
                            /{post.slug}
                        </p>
                    </div>

                    <BlogPostStatusBadge status={post.status} />
                </div>

                <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
                    {getBlogPostExcerpt(post.content)}
                </p>

                <dl className="mt-4 grid grid-cols-1 gap-3 text-sm text-muted-foreground sm:grid-cols-2">
                    <div>
                        <dt className="text-[11px] font-medium uppercase tracking-wide text-foreground/70">
                            Author
                        </dt>
                        <dd className="mt-1">{post.author?.name ?? '-'}</dd>
                    </div>

                    <div>
                        <dt className="text-[11px] font-medium uppercase tracking-wide text-foreground/70">
                            Published
                        </dt>
                        <dd className="mt-1">{formatBlogPostDate(post.published_at)}</dd>
                    </div>

                    <div className="sm:col-span-2">
                        <dt className="text-[11px] font-medium uppercase tracking-wide text-foreground/70">
                            Created
                        </dt>
                        <dd className="mt-1">{formatBlogPostDate(post.created_at)}</dd>
                    </div>
                </dl>

                <div className="mt-4 flex items-center justify-end border-t border-border pt-4">
                    <BlogPostRowActions
                        post={post}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                </div>
            </div>
        </article>
    );
}
