import { FileText } from 'lucide-react';

import EmptyState from '@/components/ui/empty-state';
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
            <EmptyState
                icon={FileText}
                title="No blog posts found"
                description="Try changing your search keyword or create a new blog post."
                size="lg"
            />
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
