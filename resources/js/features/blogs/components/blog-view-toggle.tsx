import { LayoutGrid, Rows3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { BlogManagementViewMode } from '@/features/blogs/types';

interface BlogViewToggleProps {
    value: BlogManagementViewMode;
    onChange: (value: BlogManagementViewMode) => void;
}

export default function BlogViewToggle({
    value,
    onChange,
}: BlogViewToggleProps) {
    return (
        <div className="grid w-full grid-cols-2 items-center rounded-lg border border-border bg-background gap-1 p-1 sm:inline-grid sm:w-auto sm:gap-0 sm:p-0">
            <Button
                type="button"
                size="sm"
                variant={value === 'table' ? 'secondary' : 'ghost'}
                className="h-9 w-full px-3"
                onClick={() => onChange('table')}
                aria-pressed={value === 'table'}
            >
                <Rows3 className="mr-2 h-4 w-4" />
                Table
            </Button>

            <Button
                type="button"
                size="sm"
                variant={value === 'cards' ? 'secondary' : 'ghost'}
                className="h-9 w-full px-3"
                onClick={() => onChange('cards')}
                aria-pressed={value === 'cards'}
            >
                <LayoutGrid className="mr-2 h-4 w-4" />
                Cards
            </Button>
        </div>
    );
}
