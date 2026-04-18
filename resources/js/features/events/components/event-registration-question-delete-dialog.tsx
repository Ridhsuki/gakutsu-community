import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import type { EventRegistrationQuestionItem } from '@/features/events/types';

export default function EventRegistrationQuestionDeleteDialog({
    open,
    onOpenChange,
    question,
    onConfirm,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    question: EventRegistrationQuestionItem | null;
    onConfirm: () => void;
}) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Delete Registration Question</DialogTitle>
                </DialogHeader>

                <p className="text-sm text-muted-foreground">
                    Are you sure you want to delete{' '}
                    <span className="font-medium text-foreground">
                        {question?.label ?? 'this question'}
                    </span>?
                </p>

                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button type="button" variant="destructive" onClick={onConfirm}>
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
