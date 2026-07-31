import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    containerClassName?: string;
}

export default function SearchInput({
    value,
    onChange,
    placeholder = 'Search...',
    className,
    containerClassName,
}: SearchInputProps) {
    return (
        <div
            className={cn(
                'relative w-full sm:max-w-xs md:max-w-sm',
                containerClassName,
            )}
        >
            <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <input
                type="search"
                value={value}
                onChange={(e) => onChange(e.currentTarget.value)}
                placeholder={placeholder}
                className={cn(
                    'h-9 w-full rounded-md border border-input bg-background py-2 pr-3 pl-10 text-sm text-foreground transition outline-none focus:border-primary focus:ring-2 focus:ring-ring/20',
                    className,
                )}
            />
        </div>
    );
}
