import { Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { BlogPost } from '@/features/blogs/types';

interface BlogPostRowActionsProps {
    post: BlogPost;
    onEdit: (post: BlogPost) => void;
    onDelete: (post: BlogPost) => void;
}

export default function BlogPostRowActions({
    post,
    onEdit,
    onDelete,
}: BlogPostRowActionsProps) {
    return (
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
    );
}
