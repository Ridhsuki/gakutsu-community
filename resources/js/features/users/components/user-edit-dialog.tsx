import type { SyntheticEvent } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import UserFormFields from '@/features/users/components/user-form-fields';
import type { UserFormLike } from '@/features/users/form-types';
import type { EditUserForm } from '@/features/users/types';

interface UserEditDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    form: UserFormLike<EditUserForm>;
    onSubmit: (event: SyntheticEvent<HTMLFormElement>) => void;
}

export default function UserEditDialog({
    open,
    onOpenChange,
    form,
    onSubmit,
}: UserEditDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit User</DialogTitle>
                </DialogHeader>

                <form onSubmit={onSubmit} className="space-y-4">
                    <UserFormFields form={form} mode="edit" />

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
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
