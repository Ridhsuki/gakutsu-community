import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { EventQuizQuestionItem } from '@/features/quizzes/types';

interface EventQuizQuestionDeleteDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    question: EventQuizQuestionItem | null;
    onConfirm: () => void;
}

export default function EventQuizQuestionDeleteDialog({
    open,
    onOpenChange,
    question,
    onConfirm,
}: EventQuizQuestionDeleteDialogProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete quiz question?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone.
                        {question ? (
                            <>
                                {' '}
                                The question{' '}
                                <span className="font-medium text-foreground">
                                    "{question.prompt}"
                                </span>{' '}
                                will be permanently removed.
                            </>
                        ) : (
                            ' The selected question will be permanently removed.'
                        )}
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        onClick={onConfirm}
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
