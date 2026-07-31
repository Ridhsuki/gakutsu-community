import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import type { BlogPost } from '@/features/blogs/types';

interface BlogPostDeleteDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    post: BlogPost | null;
    isDeleting: boolean;
    onConfirm: () => void;
}

export default function BlogPostDeleteDialog({
    open,
    onOpenChange,
    post,
    isDeleting,
    onConfirm,
}: BlogPostDeleteDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Delete Blog Post</DialogTitle>
                </DialogHeader>

                <p className="text-sm text-muted-foreground">
                    Are you sure you want to delete{' '}
                    <span className="font-semibold text-foreground">
                        {post?.title}
                    </span>
                    ? This action cannot be undone.
                </p>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        disabled={isDeleting}
                        onClick={onConfirm}
                    >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
