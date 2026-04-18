import type { SyntheticEvent } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import EventFormFields from '@/features/events/components/event-form-fields';
import type { EventMentorOption } from '@/features/events/types';

interface EventCreateDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    form: any;
    onSubmit: (event: SyntheticEvent<HTMLFormElement>) => void;
    mentors?: EventMentorOption[];
    canAssignMentor?: boolean;
}

export default function EventCreateDialog({
    open,
    onOpenChange,
    form,
    onSubmit,
    mentors = [],
    canAssignMentor = false,
}: EventCreateDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Add Event</DialogTitle>
                </DialogHeader>

                <form onSubmit={onSubmit} className="space-y-6">
                    <EventFormFields
                        form={form}
                        mentors={mentors}
                        canAssignMentor={canAssignMentor}
                    />

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={form.processing}>
                            {form.processing ? 'Saving...' : 'Save'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
