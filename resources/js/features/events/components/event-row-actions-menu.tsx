import { MoreHorizontal, Eye, ClipboardList, Users, Edit, Trash2 } from 'lucide-react';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { EventItem } from '@/features/events/types';

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
    return (
        <div onClick={(e) => e.stopPropagation()}>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button type="button" variant="ghost" size="icon" aria-label={`Actions for ${event.title}`}>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-52">
                    <DropdownMenuItem onSelect={() => router.visit(`${showBaseUrl}/${event.id}`)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View details
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        onSelect={() =>
                            router.visit(`${questionsBaseUrl}/${event.id}/registration-questions`)
                        }
                    >
                        <ClipboardList className="mr-2 h-4 w-4" />
                        Registration questions
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        onSelect={() =>
                            router.visit(`${registrationsBaseUrl}/${event.id}/registrations`)
                        }
                    >
                        <Users className="mr-2 h-4 w-4" />
                        Registrants
                    </DropdownMenuItem>

                    <DropdownMenuItem onSelect={() => router.visit(`${editBaseUrl}/${event.id}/edit`)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                        variant="destructive"
                        onSelect={() => onDelete(event)}
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
