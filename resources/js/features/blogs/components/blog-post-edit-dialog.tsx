import type { SyntheticEvent } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import BlogPostFormFields from '@/features/blogs/components/blog-post-form-fields';
import type { BlogPostFormLike } from '@/features/blogs/form-types';
import type { BlogPost, EditBlogPostForm } from '@/features/blogs/types';

interface BlogPostEditDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    form: BlogPostFormLike<EditBlogPostForm>;
    currentPost: BlogPost | null;
    onSubmit: (event: SyntheticEvent<HTMLFormElement>) => void;
    onUploadImage?: (file: File) => Promise<string>;
}

export default function BlogPostEditDialog({
    open,
    onOpenChange,
    form,
    currentPost,
    onSubmit,
    onUploadImage,
}: BlogPostEditDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
                <DialogHeader>
                    <DialogTitle>Edit Blog Post</DialogTitle>
                </DialogHeader>

                <form onSubmit={onSubmit} className="space-y-6">
                    <BlogPostFormFields
                        form={form}
                        mode="edit"
                        currentPost={currentPost}
                        onUploadImage={onUploadImage}
                    />

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={form.processing}
                            className="bg-[#106b42] text-white hover:bg-[#0c5132]"
                        >
                            {form.processing ? 'Updating...' : 'Update'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
