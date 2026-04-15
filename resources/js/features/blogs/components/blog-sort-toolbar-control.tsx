import { ArrowDownAZ, ArrowUpAZ } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { BLOG_SORT_OPTIONS } from '@/features/blogs/constants';
import type { BlogPostSortField } from '@/features/blogs/types';
import type { SortDirection } from '@/types/filters';

interface BlogSortToolbarControlProps {
    sortField: BlogPostSortField;
    sortDirection: SortDirection;
    onSortFieldChange: (field: BlogPostSortField) => void;
    onSortDirectionToggle: () => void;
}

export default function BlogSortToolbarControl({
    sortField,
    sortDirection,
    onSortFieldChange,
    onSortDirectionToggle,
}: BlogSortToolbarControlProps) {
    const isAscending = sortDirection === 'asc';

    return (
        <div className="grid w-full gap-2 sm:grid-cols-[minmax(180px,220px)_auto] sm:w-auto">
            <Select
                value={sortField}
                onValueChange={(value) => onSortFieldChange(value as BlogPostSortField)}
            >
                <SelectTrigger className="h-9 w-full">
                    <SelectValue placeholder="Sort by" />
                </SelectTrigger>

                <SelectContent>
                    {BLOG_SORT_OPTIONS.map((option) => (
                        <SelectItem
                            key={option.value}
                            value={option.value}
                        >
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
                title={isAscending ? 'Ascending' : 'Descending'}
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
