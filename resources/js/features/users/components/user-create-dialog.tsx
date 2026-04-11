import type { SyntheticEvent } from 'react';
import { Button } from '@/components/ui/button';
import UserFormFields from '@/features/users/components/user-form-fields';
import type { UserFormLike } from '@/features/users/form-types';
import type { CreateUserForm } from '@/features/users/types';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface UserCreateDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    form: UserFormLike<CreateUserForm>;
    onSubmit: (event: SyntheticEvent<HTMLFormElement>) => void;
}

export default function UserCreateDialog({
    open,
    onOpenChange,
    form,
    onSubmit,
}: UserCreateDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
                </DialogHeader>

                <form onSubmit={onSubmit} className="space-y-4">
                    <UserFormFields form={form} mode="create" />

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={form.processing}
                            className="bg-[#106b42] text-white hover:bg-[#0c5132]"
                        >
                            {form.processing ? 'Saving...' : 'Save'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
