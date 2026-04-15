import { FileText } from 'lucide-react';
import BlogPostCard from '@/features/blogs/components/blog-post-card';
import type { BlogPost } from '@/features/blogs/types';

interface BlogPostCardGridProps {
    posts: BlogPost[];
    onEdit: (post: BlogPost) => void;
    onDelete: (post: BlogPost) => void;
}

export default function BlogPostCardGrid({
    posts,
    onEdit,
    onDelete,
}: BlogPostCardGridProps) {
    if (posts.length === 0) {
        return (
            <div className="flex min-h-[280px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/20 p-8 text-center">
                <FileText className="mb-3 h-8 w-8 text-muted-foreground" />
                <h3 className="text-base font-semibold">No blog posts found</h3>
                <p className="mt-1 max-w-md text-sm text-muted-foreground">
                    Try changing your search keyword or create a new blog post.
                </p>
            </div>
        );
    }

    return (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {posts.map((post) => (
                <BlogPostCard
                    key={post.id}
                    post={post}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}
