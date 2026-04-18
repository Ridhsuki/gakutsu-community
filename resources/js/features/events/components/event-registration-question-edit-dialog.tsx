import type { SyntheticEvent } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import EventRegistrationQuestionFormFields from '@/features/events/components/event-registration-question-form-fields';
import type { EventRegistrationQuestionItem } from '@/features/events/types';

export default function EventRegistrationQuestionEditDialog({
    open,
    onOpenChange,
    form,
    currentQuestion,
    onSubmit,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    form: any;
    currentQuestion: EventRegistrationQuestionItem | null;
    onSubmit: (event: SyntheticEvent<HTMLFormElement>) => void;
}) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Edit Registration Question</DialogTitle>
                </DialogHeader>

                <form onSubmit={onSubmit} className="space-y-6">
                    <EventRegistrationQuestionFormFields form={form} />

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={form.processing || !currentQuestion}>
                            {form.processing ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
