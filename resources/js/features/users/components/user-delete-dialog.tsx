import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import type { User } from '@/features/users/types';

interface UserDeleteDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: User | null;
    isDeleting: boolean;
    onConfirm: () => void;
}

export default function UserDeleteDialog({
    open,
    onOpenChange,
    user,
    isDeleting,
    onConfirm,
}: UserDeleteDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Delete User</DialogTitle>
                </DialogHeader>

                <p className="text-sm text-muted-foreground">
                    Are you sure you want to delete{' '}
                    <span className="font-semibold text-foreground">
                        {user?.name}
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
