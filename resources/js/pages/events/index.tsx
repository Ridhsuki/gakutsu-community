import PaginationBar from '@/components/data-table/pagination-bar';
import EventPublicCard from '@/components/public/event-public-card';
import SeoHead from '@/components/public/seo-head';
import PublicLayout from '@/layouts/public-layout';
import type { PaginatedResponse } from '@/types/pagination';

type EventItem = {
    id: number;
    title: string;
    slug: string;
    category: string;
    starts_at: string;
    status: 'upcoming' | 'completed' | 'cancelled';
    poster_image_url?: string | null;
    mentor?: {
        name: string;
    } | null;
};

export default function EventsIndex({
    upcomingEvents,
    archivedEvents,
}: {
    upcomingEvents: PaginatedResponse<EventItem>;
    archivedEvents: PaginatedResponse<EventItem>;
}) {
    return (
        <PublicLayout>
            <SeoHead
                title="Events"
                description="Jelajahi webinar dan event komunitas IT dan Cyber Security dari Gakutsu, termasuk event mendatang dan arsip kegiatan."
            />

            <div className="mx-auto max-w-7xl px-4 py-12">
                <div className="mb-10 space-y-2">
                    <p className="text-sm font-medium text-primary">Events</p>
                    <h1 className="text-3xl font-semibold tracking-tight">
                        Webinar dan event komunitas
                    </h1>
                    <p className="max-w-2xl text-muted-foreground">
                        Temukan webinar terbaru, lihat dokumentasi event yang
                        sudah selesai, dan masuk ke alur registrasi dengan
                        pengalaman publik yang lebih bersih.
                    </p>
                </div>

                <section className="space-y-6">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-semibold tracking-tight">
                            Upcoming Events
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Event yang masih aktif dan bisa diakses publik untuk
                            melihat detail dan registrasi.
                        </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {upcomingEvents.data.map((event) => (
                            <EventPublicCard key={event.id} event={event} />
                        ))}
                    </div>

                    <PaginationBar
                        links={upcomingEvents.links}
                        from={upcomingEvents.from}
                        to={upcomingEvents.to}
                        total={upcomingEvents.total}
                        lastPage={upcomingEvents.last_page}
                    />
                </section>

                <section className="mt-16 space-y-6">
                    <div className="space-y-2">
                        <h2 className="text-2xl font-semibold tracking-tight">
                            Archive
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Dokumentasi event yang sudah completed atau
                            cancelled.
                        </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {archivedEvents.data.map((event) => (
                            <EventPublicCard
                                key={event.id}
                                event={event}
                                archive
                            />
                        ))}
                    </div>

                    <PaginationBar
                        links={archivedEvents.links}
                        from={archivedEvents.from}
                        to={archivedEvents.to}
                        total={archivedEvents.total}
                        lastPage={archivedEvents.last_page}
                    />
                </section>
            </div>
        </PublicLayout>
    );
}
