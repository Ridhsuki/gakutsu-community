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
    filters?: ReactNode;
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
    filters,
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
            <div className="flex w-full flex-col gap-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <SearchInput
                        value={searchValue}
                        onChange={onSearchChange}
                        placeholder={searchPlaceholder}
                        containerClassName={cn(
                            'w-full shrink-0 sm:max-w-sm lg:max-w-md',
                            searchContainerClassName,
                        )}
                    />

                    {controls ? (
                        <div
                            className={cn(
                                'flex w-full shrink-0 flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:justify-end',
                                controlsContainerClassName,
                            )}
                        >
                            {controls}
                        </div>
                    ) : null}
                </div>

                {filters ? (
                    <div className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                        {filters}
                    </div>
                ) : null}
            </div>
        </ResourceToolbar>
    );
}
