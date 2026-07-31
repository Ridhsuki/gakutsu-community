import { router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import type { IndexFilters, SortDirection } from '@/types/filters';

interface UseIndexFiltersOptions<TSortField extends string> {
    endpoint: string;
    initialFilters: IndexFilters<TSortField>;
    allowedSortFields: readonly TSortField[];
    only?: string[];
    debounceMs?: number;
}

function buildIndexQuery<TSortField extends string>(
    search: string,
    sortField: TSortField,
    sortDirection: SortDirection,
) {
    const trimmedSearch = search.trim();

    return {
        ...(trimmedSearch ? { search: trimmedSearch } : {}),
        sort_field: sortField,
        sort_direction: sortDirection,
    };
}

export default function useIndexFilters<TSortField extends string>(
    options: UseIndexFiltersOptions<TSortField>,
) {
    const {
        endpoint,
        initialFilters,
        allowedSortFields,
        only = [],
        debounceMs = 350,
    } = options;

    const [search, setSearch] = useState(initialFilters.search ?? '');
    const [sortField, setSortField] = useState<TSortField>(
        initialFilters.sort_field ?? allowedSortFields[0],
    );
    const [sortDirection, setSortDirection] = useState<SortDirection>(
        initialFilters.sort_direction ?? 'desc',
    );
    const [isReloading, setIsReloading] = useState(false);

    const isFirstSearchRender = useRef(true);

    const reload = (
        nextSearch: string,
        nextSortField: TSortField,
        nextSortDirection: SortDirection,
    ) => {
        router.get(endpoint, buildIndexQuery(nextSearch, nextSortField, nextSortDirection), {
            only,
            preserveState: true,
            preserveScroll: true,
            replace: true,
            onStart: () => setIsReloading(true),
            onFinish: () => setIsReloading(false),
        });
    };

    useEffect(() => {
        if (isFirstSearchRender.current) {
            isFirstSearchRender.current = false;

            return;
        }

        const timeoutId = window.setTimeout(() => {
            reload(search, sortField, sortDirection);
        }, debounceMs);

        return () => window.clearTimeout(timeoutId);
    }, [search]);

    const applySort = (
        nextSortField: TSortField,
        nextSortDirection: SortDirection,
    ) => {
        if (!allowedSortFields.includes(nextSortField)) {
return;
}

        setSortField(nextSortField);
        setSortDirection(nextSortDirection);
        reload(search, nextSortField, nextSortDirection);
    };

    const setSortFieldAndReload = (nextSortField: TSortField) => {
        if (!allowedSortFields.includes(nextSortField)) {
return;
}

        setSortField(nextSortField);
        reload(search, nextSortField, sortDirection);
    };

    const setSortDirectionAndReload = (nextSortDirection: SortDirection) => {
        setSortDirection(nextSortDirection);
        reload(search, sortField, nextSortDirection);
    };

    const toggleSortDirection = () => {
        const nextDirection: SortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
        setSortDirection(nextDirection);
        reload(search, sortField, nextDirection);
    };

    const handleSort = (field: TSortField) => {
        if (!allowedSortFields.includes(field)) {
return;
}

        const nextDirection: SortDirection =
            sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';

        setSortField(field);
        setSortDirection(nextDirection);
        reload(search, field, nextDirection);
    };

    return {
        search,
        setSearch,
        sortField,
        setSortField,
        sortDirection,
        setSortDirection,
        isReloading,
        handleSort,
        applySort,
        setSortFieldAndReload,
        setSortDirectionAndReload,
        toggleSortDirection,
        reload,
    };
}
