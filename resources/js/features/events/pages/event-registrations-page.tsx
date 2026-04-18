import { Head } from '@inertiajs/react';
import IndexToolbar from '@/components/data-table/index-toolbar';
import PaginationBar from '@/components/data-table/pagination-bar';
import EventRegistrationTable from '@/features/events/components/event-registration-table';
import useIndexFilters from '@/hooks/use-index-filters';
import type { EventItem, EventRegistrationItem } from '@/features/events/types';
import type { PaginatedResponse } from '@/types/pagination';

interface EventRegistrationsPageProps {
    event: EventItem;
    registrations: PaginatedResponse<EventRegistrationItem>;
    filters: { search?: string | null };
    endpoint: string;
    headTitle?: string;
}

export default function EventRegistrationsPage({
    event,
    registrations,
    filters,
    endpoint,
    headTitle,
}: EventRegistrationsPageProps) {
    const { search, setSearch, isReloading } = useIndexFilters({
        endpoint,
        initialFilters: {
            search: filters.search ?? '',
            sort_field: undefined,
            sort_direction: undefined,
        },
        allowedSortFields: ['created_at'] as const,
        only: ['registrations', 'filters'],
        debounceMs: 350,
    });

    return (
        <>
            <Head title={headTitle ?? `Registrations - ${event.title}`} />

            <div className="flex h-full w-full flex-col space-y-6 p-6">
                <IndexToolbar
                    title={`Registrations - ${event.title}`}
                    description={`Mentor: ${event.mentor?.name ?? '-'}`}
                    searchValue={search}
                    onSearchChange={setSearch}
                    searchPlaceholder="Search by name or email..."
                    meta={
                        isReloading
                            ? 'Refreshing data...'
                            : `Total registrations: ${registrations.total}`
                    }
                />

                <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 text-card-foreground shadow-sm">
                    <EventRegistrationTable registrations={registrations.data} />

                    <PaginationBar
                        links={registrations.links}
                        from={registrations.from}
                        to={registrations.to}
                        total={registrations.total}
                        lastPage={registrations.last_page}
                        only={['registrations', 'filters']}
                    />
                </div>
            </div>
        </>
    );
}
