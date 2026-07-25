import { Head } from '@inertiajs/react';
import IndexToolbar from '@/components/data-table/index-toolbar';
import PaginationBar from '@/components/data-table/pagination-bar';
import ContextBackButton from '@/components/navigation/context-back-button';
import EventRegistrationTable from '@/features/events/components/event-registration-table';
import useIndexFilters from '@/hooks/use-index-filters';
import type { EventItem } from '@/features/events/types';
import type { PaginatedResponse } from '@/types/pagination';

interface EventRegistrationsPageProps {
    event: EventItem;
    registrations: PaginatedResponse;
    filters: { search?: string | null };
    endpoint: string;
    detailBaseUrl: string;
    fallbackHref: string;
    headTitle?: string;
}

export default function EventRegistrationsPage({
    event,
    registrations,
    filters,
    endpoint,
    detailBaseUrl,
    fallbackHref,
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
            <Head title={headTitle ?? `Registrants - ${event.title}`} />

            <div className="flex h-full w-full flex-col space-y-6 p-6">
                <div className="space-y-3">
                    <ContextBackButton fallbackHref={fallbackHref} label="Back" />

                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Registrants · {event.title}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            View and inspect event registrations.
                        </p>
                    </div>
                </div>

                <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                    <IndexToolbar
                        title="Registrants"
                        description="Manage participant registration data."
                        searchValue={search}
                        onSearchChange={setSearch}
                        searchPlaceholder="Search by name or email"
                        meta={
                            isReloading
                                ? 'Refreshing data...'
                                : `Total registrations: ${registrations.total}`
                        }
                    />

                    <div className="mt-4 overflow-x-auto rounded-lg border border-border">
                        <EventRegistrationTable
                            registrations={registrations.data}
                            detailBaseUrl={detailBaseUrl}
                        />
                    </div>

                    <div className="mt-4">
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
            </div>
        </>
    );
}
