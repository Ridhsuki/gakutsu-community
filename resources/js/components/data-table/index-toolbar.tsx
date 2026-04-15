import type { ReactNode } from 'react';
import ResourceToolbar from '@/components/data-table/resource-toolbar';
import SearchInput from '@/components/data-table/search-input';
import { cn } from '@/lib/utils';

interface IndexToolbarProps {
    title: string;
    description?: string;
    searchValue: string;
    onSearchChange: (value: string) => void;
    searchPlaceholder?: string;
    actions?: ReactNode;
    controls?: ReactNode;
    meta?: ReactNode;
    className?: string;
    searchContainerClassName?: string;
    controlsContainerClassName?: string;
}

export default function IndexToolbar({
    title,
    description,
    searchValue,
    onSearchChange,
    searchPlaceholder = 'Search...',
    actions,
    controls,
    meta,
    className,
    searchContainerClassName,
    controlsContainerClassName,
}: IndexToolbarProps) {
    return (
        <ResourceToolbar
            title={title}
            description={description}
            actions={actions}
            meta={meta}
            className={className}
        >
            <div
                className={cn(
                    'grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start',
                )}
            >
                <SearchInput
                    value={searchValue}
                    onChange={onSearchChange}
                    placeholder={searchPlaceholder}
                    containerClassName={cn('w-full lg:max-w-md', searchContainerClassName)}
                />

                {controls ? (
                    <div
                        className={cn(
                            'flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap lg:w-auto lg:justify-end',
                            controlsContainerClassName,
                        )}
                    >
                        {controls}
                    </div>
                ) : null}
            </div>
        </ResourceToolbar>
    );
}
