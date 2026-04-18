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
import type { EventItem, EventMentorOption } from '@/features/events/types';

interface EventEditDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    form: any;
    currentEvent: EventItem | null;
    onSubmit: (event: SyntheticEvent<HTMLFormElement>) => void;
    mentors?: EventMentorOption[];
    canAssignInstructor?: boolean;
}

export default function EventEditDialog({
    open,
    onOpenChange,
    form,
    currentEvent,
    onSubmit,
    mentors = [],
    canAssignInstructor = false,
}: EventEditDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Edit Event</DialogTitle>
                </DialogHeader>

                <form onSubmit={onSubmit} className="space-y-6">
                    <EventFormFields
                        form={form}
                        mentors={mentors}
                        canAssignInstructor={canAssignInstructor}
                    />

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={form.processing || !currentEvent}>
                            {form.processing ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
