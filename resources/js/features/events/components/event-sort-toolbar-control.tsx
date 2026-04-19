import { ArrowDownAZ, ArrowUpAZ } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { EventSortField } from '@/features/events/types';

interface EventSortToolbarControlProps {
    sortField: EventSortField;
    sortDirection: 'asc' | 'desc';
    onSortFieldChange: (field: EventSortField) => void;
    onSortDirectionToggle: () => void;
}

const SORT_OPTIONS: Array<{ value: EventSortField; label: string }> = [
    { value: 'starts_at', label: 'Start date' },
    { value: 'created_at', label: 'Created date' },
    { value: 'title', label: 'Title' },
    { value: 'category', label: 'Category' },
    { value: 'status', label: 'Status' },
    { value: 'mentor', label: 'Mentor' },
];

export default function EventSortToolbarControl({
    sortField,
    sortDirection,
    onSortFieldChange,
    onSortDirectionToggle,
}: EventSortToolbarControlProps) {
    const isAscending = sortDirection === 'asc';

    return (
        <div className="grid w-full gap-2 sm:grid-cols-[minmax(180px,220px)_auto] sm:w-auto">
            <Select
                value={sortField}
                onValueChange={(value) => onSortFieldChange(value as EventSortField)}
            >
                <SelectTrigger className="h-9 w-full">
                    <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                    {SORT_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Button
                type="button"
                variant="outline"
                className="h-9 w-full sm:w-9 sm:px-0"
                onClick={onSortDirectionToggle}
                aria-label={
                    isAscending
                        ? 'Change sort direction to descending'
                        : 'Change sort direction to ascending'
                }
            >
                {isAscending ? (
                    <ArrowUpAZ className="h-4 w-4" />
                ) : (
                    <ArrowDownAZ className="h-4 w-4" />
                )}
                <span className="ml-2 sm:hidden">
                    {isAscending ? 'Ascending' : 'Descending'}
                </span>
            </Button>
        </div>
    );
}
