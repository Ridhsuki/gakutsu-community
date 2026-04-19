import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface EventFilterToolbarControlProps {
    statusFilter: string;
    publicationFilter: string;
    accessTypeFilter: string;
    onStatusChange: (value: string) => void;
    onPublicationChange: (value: string) => void;
    onAccessTypeChange: (value: string) => void;
    onClear: () => void;
}

export default function EventFilterToolbarControl({
    statusFilter,
    publicationFilter,
    accessTypeFilter,
    onStatusChange,
    onPublicationChange,
    onAccessTypeChange,
    onClear,
}: EventFilterToolbarControlProps) {
    const hasActiveFilters =
        statusFilter !== 'all' ||
        publicationFilter !== 'all' ||
        accessTypeFilter !== 'all';

    return (
        <div className="grid w-full gap-2 lg:grid-cols-[repeat(3,minmax(140px,1fr))_auto]">
            <Select value={statusFilter} onValueChange={onStatusChange}>
                <SelectTrigger className="h-9 w-full">
                    <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
            </Select>

            <Select value={publicationFilter} onValueChange={onPublicationChange}>
                <SelectTrigger className="h-9 w-full">
                    <SelectValue placeholder="Publication" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All publication</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
            </Select>

            <Select value={accessTypeFilter} onValueChange={onAccessTypeChange}>
                <SelectTrigger className="h-9 w-full">
                    <SelectValue placeholder="Access type" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All access</SelectItem>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                </SelectContent>
            </Select>

            <Button
                type="button"
                variant="outline"
                className="h-9 w-full lg:w-auto"
                onClick={onClear}
                disabled={!hasActiveFilters}
            >
                Clear
            </Button>
        </div>
    );
}
