import { Link, usePage } from '@inertiajs/react';
import { FileCheck2, FileQuestion } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { appendFrom } from '@/lib/navigation';

export default function EventQuizShortcuts({
    eventId,
    rolePrefix,
    variant = 'menu',
}: {
    eventId: number;
    rolePrefix: '/admin' | '/mentor';
    variant?: 'menu' | 'inline';
}) {
    const page = usePage();

    const questionHref = appendFrom(`${rolePrefix}/events/${eventId}/quiz-questions`, page.url);
    const attemptsHref = appendFrom(`${rolePrefix}/events/${eventId}/quiz-attempts`, page.url);

    if (variant === 'inline') {
        return (
            <div className="flex flex-wrap items-center gap-2">
                <Button type="button" variant="outline" size="sm" asChild>
                    <Link href={questionHref}>
                        <FileQuestion className="mr-2 h-4 w-4" />
                        Quiz Questions
                    </Link>
                </Button>

                <Button type="button" variant="outline" size="sm" asChild>
                    <Link href={attemptsHref}>
                        <FileCheck2 className="mr-2 h-4 w-4" />
                        Quiz Attempts
                    </Link>
                </Button>
            </div>
        );
    }

    return (
        <>
            <DropdownMenuItem asChild>
                <Link href={questionHref}>
                    <FileQuestion className="mr-2 h-4 w-4" />
                    Quiz Questions
                </Link>
            </DropdownMenuItem>

            <DropdownMenuItem asChild>
                <Link href={attemptsHref}>
                    <FileCheck2 className="mr-2 h-4 w-4" />
                    Quiz Attempts
                </Link>
            </DropdownMenuItem>
        </>
    );
}
