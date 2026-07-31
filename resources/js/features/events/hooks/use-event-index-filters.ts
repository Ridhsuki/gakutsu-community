import { router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import type { EventSortField } from '@/features/events/types';
import type { SortDirection } from '@/types/filters';

interface EventIndexInitialFilters {
    search?: string | null;
    sort_field?: EventSortField | null;
    sort_direction?: SortDirection | null;
    status?: string | null;
    publication?: string | null;
    access_type?: string | null;
}

interface UseEventIndexFiltersOptions {
    endpoint: string;
    initialFilters: EventIndexInitialFilters;
    only?: string[];
    debounceMs?: number;
}

function buildQuery(
    search: string,
    sortField: EventSortField,
    sortDirection: SortDirection,
    status: string,
    publication: string,
    accessType: string,
) {
    const trimmedSearch = search.trim();

    return {
        ...(trimmedSearch ? { search: trimmedSearch } : {}),
        sort_field: sortField,
        sort_direction: sortDirection,
        ...(status !== 'all' ? { status } : {}),
        ...(publication !== 'all' ? { publication } : {}),
        ...(accessType !== 'all' ? { access_type: accessType } : {}),
    };
}

export default function useEventIndexFilters({
    endpoint,
    initialFilters,
    only = ['events', 'filters'],
    debounceMs = 350,
}: UseEventIndexFiltersOptions) {
    const [search, setSearch] = useState(initialFilters.search ?? '');
    const [sortField, setSortField] = useState<EventSortField>(
        initialFilters.sort_field ?? 'starts_at',
    );
    const [sortDirection, setSortDirection] = useState<SortDirection>(
        initialFilters.sort_direction ?? 'desc',
    );
    const [statusFilter, setStatusFilter] = useState(
        initialFilters.status ?? 'all',
    );
    const [publicationFilter, setPublicationFilter] = useState(
        initialFilters.publication ?? 'all',
    );
    const [accessTypeFilter, setAccessTypeFilter] = useState(
        initialFilters.access_type ?? 'all',
    );
    const [isReloading, setIsReloading] = useState(false);

    const isFirstSearchRender = useRef(true);

    const reload = (
        nextSearch: string,
        nextSortField: EventSortField,
        nextSortDirection: SortDirection,
        nextStatus: string,
        nextPublication: string,
        nextAccessType: string,
    ) => {
        router.get(
            endpoint,
            buildQuery(
                nextSearch,
                nextSortField,
                nextSortDirection,
                nextStatus,
                nextPublication,
                nextAccessType,
            ),
            {
                only,
                preserveState: true,
                preserveScroll: true,
                replace: true,
                onStart: () => setIsReloading(true),
                onFinish: () => setIsReloading(false),
            },
        );
    };

    useEffect(() => {
        if (isFirstSearchRender.current) {
            isFirstSearchRender.current = false;

            return;
        }

        const timeoutId = window.setTimeout(() => {
            reload(
                search,
                sortField,
                sortDirection,
                statusFilter,
                publicationFilter,
                accessTypeFilter,
            );
        }, debounceMs);

        return () => window.clearTimeout(timeoutId);
    }, [search]);

    const handleSort = (field: EventSortField) => {
        const nextDirection: SortDirection =
            sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';

        setSortField(field);
        setSortDirection(nextDirection);

        reload(
            search,
            field,
            nextDirection,
            statusFilter,
            publicationFilter,
            accessTypeFilter,
        );
    };

    const setSortFieldAndReload = (field: EventSortField) => {
        setSortField(field);

        reload(
            search,
            field,
            sortDirection,
            statusFilter,
            publicationFilter,
            accessTypeFilter,
        );
    };

    const toggleSortDirection = () => {
        const nextDirection: SortDirection =
            sortDirection === 'asc' ? 'desc' : 'asc';
        setSortDirection(nextDirection);

        reload(
            search,
            sortField,
            nextDirection,
            statusFilter,
            publicationFilter,
            accessTypeFilter,
        );
    };

    const setStatusFilterAndReload = (value: string) => {
        setStatusFilter(value);

        reload(
            search,
            sortField,
            sortDirection,
            value,
            publicationFilter,
            accessTypeFilter,
        );
    };

    const setPublicationFilterAndReload = (value: string) => {
        setPublicationFilter(value);

        reload(
            search,
            sortField,
            sortDirection,
            statusFilter,
            value,
            accessTypeFilter,
        );
    };

    const setAccessTypeFilterAndReload = (value: string) => {
        setAccessTypeFilter(value);

        reload(
            search,
            sortField,
            sortDirection,
            statusFilter,
            publicationFilter,
            value,
        );
    };

    const clearFilters = () => {
        setStatusFilter('all');
        setPublicationFilter('all');
        setAccessTypeFilter('all');

        reload(search, sortField, sortDirection, 'all', 'all', 'all');
    };

    return {
        search,
        setSearch,
        sortField,
        sortDirection,
        isReloading,
        handleSort,
        setSortFieldAndReload,
        toggleSortDirection,
        statusFilter,
        publicationFilter,
        accessTypeFilter,
        setStatusFilterAndReload,
        setPublicationFilterAndReload,
        setAccessTypeFilterAndReload,
        clearFilters,
    };
}
