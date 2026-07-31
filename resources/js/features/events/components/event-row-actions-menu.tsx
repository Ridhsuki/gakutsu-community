import { Link, usePage } from '@inertiajs/react';
import { MoreHorizontal, Eye, ClipboardList, Users, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import EventQuizShortcuts from '@/features/events/components/event-quiz-shortcuts';
import type { EventItem } from '@/features/events/types';
import { appendFrom } from '@/lib/navigation';

interface EventRowActionsMenuProps {
    event: EventItem;
    showBaseUrl: string;
    editBaseUrl: string;
    registrationsBaseUrl: string;
    questionsBaseUrl: string;
    onDelete: (event: EventItem) => void;
}

export default function EventRowActionsMenu({
    event,
    showBaseUrl,
    editBaseUrl,
    registrationsBaseUrl,
    questionsBaseUrl,
    onDelete,
}: EventRowActionsMenuProps) {
    const page = usePage();
    const rolePrefix: '/admin' | '/mentor' = showBaseUrl.startsWith('/mentor') ? '/mentor' : '/admin';

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button type="button" variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                    <Link href={appendFrom(`${showBaseUrl}/${event.id}`, page.url)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View details
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                    <Link href={appendFrom(`${questionsBaseUrl}/${event.id}/registration-questions`, page.url)}>
                        <ClipboardList className="mr-2 h-4 w-4" />
                        Registration Form
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                    <Link href={appendFrom(`${registrationsBaseUrl}/${event.id}/registrations`, page.url)}>
                        <Users className="mr-2 h-4 w-4" />
                        Registrants
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <EventQuizShortcuts eventId={event.id} rolePrefix={rolePrefix} />

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                    <Link href={appendFrom(`${editBaseUrl}/${event.id}/edit`, page.url)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={() => onDelete(event)}
                    className="text-destructive focus:text-destructive"
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
