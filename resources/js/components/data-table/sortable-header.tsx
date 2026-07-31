import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import type { SortDirection } from '@/types/filters';

interface SortableHeaderProps<TField extends string> {
    label: string;
    field: TField;
    currentField: TField;
    currentDirection: SortDirection;
    onSort: (field: TField) => void;
    className?: string;
    align?: 'left' | 'right' | 'center';
}

export default function SortableHeader<TField extends string>({
    label,
    field,
    currentField,
    currentDirection,
    onSort,
    className = '',
    align = 'left',
}: SortableHeaderProps<TField>) {
    const renderSortIcon = () => {
        if (currentField !== field) {
            return <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />;
        }

        return currentDirection === 'asc' ? (
            <ArrowUp className="ml-2 h-4 w-4 text-primary" />
        ) : (
            <ArrowDown className="ml-2 h-4 w-4 text-primary" />
        );
    };

    const alignClass =
        align === 'right'
            ? 'text-right'
            : align === 'center'
              ? 'text-center'
              : 'text-left';

    return (
        <th className={`px-4 py-3 font-medium ${alignClass} ${className}`}>
            <button
                type="button"
                onClick={() => onSort(field)}
                className="inline-flex items-center font-medium transition hover:text-primary"
                aria-label={`Sort by ${label}`}
            >
                {label}
                {renderSortIcon()}
            </button>
        </th>
    );
}
