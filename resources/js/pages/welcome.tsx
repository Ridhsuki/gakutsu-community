import { Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    CalendarDays,
    GraduationCap,
    ShieldCheck,
    Users,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import BlogPublicCard from '@/components/public/blog-public-card';
import EventPublicCard from '@/components/public/event-public-card';
import Reveal from '@/components/public/reveal';
import SeoHead from '@/components/public/seo-head';
import PublicLayout from '@/layouts/public-layout';
import {
    createOrganizationSchema,
    createWebSiteSchema,
} from '@/lib/structured-data';
import type { SharedPageProps } from '@/types/shared';

type PageProps = {
    canRegister: boolean;
    featuredEvents: Array<any>;
    latestBlogs: Array<any>;
    stats: {
        members: number;
        mentors: number;
        events: number;
        articles: number;
    };
    auth?: {
        user?: {
            id: number;
            name: string;
        } | null;
    };
};

function formatStat(value: number) {
    return new Intl.NumberFormat('id-ID').format(value);
}

const valueProps = [
    {
        icon: ShieldCheck,
        title: 'Topik Relevan',
        desc: 'Konten belajar fokus pada IT dan cyber security yang aplikatif.',
    },
    {
        icon: CalendarDays,
        title: 'Event Berkala',
        desc: 'Webinar dan kegiatan komunitas tampil dinamis langsung dari database.',
    },
    {
        icon: GraduationCap,
        title: 'Mentor Praktisi',
        desc: 'Belajar dari mentor yang aktif di industri dan komunitas.',
    },
    {
        icon: Users,
        title: 'Komunitas Aktif',
        desc: 'Mendorong diskusi, interaksi, dan pembelajaran berkelanjutan.',
    },
];

const WELCOME_ANIMATION_KEY = 'welcome-entry-played';

export default function Welcome(props: PageProps) {
    const [playHeroEntry, setPlayHeroEntry] = useState(false);
    const { props: pageProps } = usePage<SharedPageProps>();
    const sharedSeo = pageProps.seo;
    const canonicalHomeUrl =
        sharedSeo?.canonicalUrl || sharedSeo?.baseUrl || '';
    const siteName = sharedSeo?.siteName || 'Gakutsu';

    const homeDescription =
        'Komunitas belajar IT dan Cyber Security dari Gakutsu dengan webinar, event, dan artikel teknis yang relevan untuk member, mahasiswa, dan profesional.';

    const homeGraph = canonicalHomeUrl
        ? [
              createWebSiteSchema({ canonicalHomeUrl, siteName }),
              createOrganizationSchema({
                  canonicalHomeUrl,
                  siteName,
                  description: homeDescription,
              }),
          ]
        : null;

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const hasPlayed =
            window.sessionStorage.getItem(WELCOME_ANIMATION_KEY) === '1';

        if (!hasPlayed) {
            const frameId = window.requestAnimationFrame(() => {
                setPlayHeroEntry(true);
                window.sessionStorage.setItem(WELCOME_ANIMATION_KEY, '1');
            });

            return () => window.cancelAnimationFrame(frameId);
        }
    }, []);

    return (
        <PublicLayout canRegister={props.canRegister}>
            <SeoHead
                title="Gakutsu"
                description={homeDescription}
                jsonLdGraph={homeGraph}
            />

            <section className="border-b border-border/60 bg-gradient-to-b from-primary/10 via-background to-background">
                <div className="mx-auto max-w-7xl px-4 py-16 lg:py-24">
                    <div className="mx-auto max-w-4xl text-center">
                        <Reveal
                            initialInView={playHeroEntry}
                            delay={0}
                            duration={640}
                            distance={14}
                            blur={8}
                            className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                        >
                            IT & Cybersecurity Learning Community
                        </Reveal>

                        <Reveal
                            initialInView={playHeroEntry}
                            delay={90}
                            duration={760}
                            distance={18}
                            blur={10}
                            className="mt-6"
                        >
                            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                                Learn Cybersecurity and IT together.
                            </h1>
                        </Reveal>

                        <Reveal
                            initialInView={playHeroEntry}
                            delay={180}
                            duration={760}
                            distance={18}
                            blur={10}
                            className="mx-auto mt-5 max-w-2xl"
                        >
                            <p className="text-base leading-7 text-muted-foreground sm:text-lg">
                                We share, discuss, and sometimes host small
                                webinars. Yok Pelajarin is a casual community
                                built for learning and growing together.
                            </p>
                        </Reveal>

                        <Reveal
                            initialInView={playHeroEntry}
                            delay={260}
                            duration={760}
                            distance={20}
                            blur={10}
                            className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
                        >
                            <Link
                                href="/events"
                                className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground"
                            >
                                Lihat Event Terbaru
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>

                            <Link
                                href="/blogs"
                                className="inline-flex h-11 items-center justify-center rounded-xl border border-border px-5 text-sm font-medium"
                            >
                                Jelajahi Blog
                            </Link>
                        </Reveal>
                    </div>

                    <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
                        {[
                            {
                                label: 'Member',
                                value: formatStat(props.stats.members) + '+',
                            },
                            {
                                label: 'Mentor',
                                value: formatStat(props.stats.mentors) + '+',
                            },
                            {
                                label: 'Events',
                                value: formatStat(props.stats.events) + '+',
                            },
                            {
                                label: 'Artikel',
                                value: formatStat(props.stats.articles) + '+',
                            },
                        ].map((item, index) => (
                            <Reveal
                                key={item.label}
                                initialInView={playHeroEntry}
                                delay={340 + index * 70}
                                duration={760}
                                distance={18}
                                blur={10}
                            >
                                <div className="rounded-2xl border border-border bg-card p-4 text-center shadow-sm">
                                    <div className="text-2xl font-semibold">
                                        {item.value}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        {item.label}
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 py-16">
                <Reveal
                    className="mb-8 space-y-2"
                    duration={720}
                    distance={20}
                    blur={10}
                >
                    <p className="text-sm font-medium text-primary">
                        Kenapa Yok Pelajarin
                    </p>
                    <h2 className="text-3xl font-semibold tracking-tight">
                        Platform publik yang lebih rapi dan fokus
                    </h2>
                    <p className="max-w-2xl text-muted-foreground">
                        Surface publik dirancang terpisah dari dashboard agar
                        pengalaman guest dan user lebih ringan, jelas, dan
                        profesional.
                    </p>
                </Reveal>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {valueProps.map(({ icon: Icon, title, desc }, index) => (
                        <Reveal
                            key={title}
                            delay={index * 70}
                            duration={720}
                            distance={18}
                            blur={10}
                        >
                            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                    <Icon className="h-5 w-5" />
                                </div>
                                <h3 className="mb-2 text-lg font-semibold">
                                    {title}
                                </h3>
                                <p className="text-sm leading-6 text-muted-foreground">
                                    {desc}
                                </p>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 py-16">
                <Reveal
                    className="mb-8 flex items-end justify-between gap-4"
                    duration={720}
                >
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-primary">
                            Event & Webinar
                        </p>
                        <h2 className="text-3xl font-semibold tracking-tight">
                            Event terbaru untuk komunitas
                        </h2>
                    </div>
                    <Link
                        href="/events"
                        className="text-sm font-medium text-primary"
                    >
                        Lihat semua event
                    </Link>
                </Reveal>

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {props.featuredEvents.map((event, index) => (
                        <Reveal
                            key={event.id}
                            delay={index * 80}
                            duration={760}
                            distance={22}
                            blur={12}
                        >
                            <EventPublicCard event={event} />
                        </Reveal>
                    ))}
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-4 py-16">
                <Reveal
                    className="mb-8 flex items-end justify-between gap-4"
                    duration={720}
                >
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-primary">
                            Blog Terbaru
                        </p>
                        <h2 className="text-3xl font-semibold tracking-tight">
                            Artikel, insight, dan materi bacaan
                        </h2>
                    </div>
                    <Link
                        href="/blogs"
                        className="text-sm font-medium text-primary"
                    >
                        Semua artikel
                    </Link>
                </Reveal>

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {props.latestBlogs.map((post, index) => (
                        <Reveal
                            key={post.id}
                            delay={index * 80}
                            duration={760}
                            distance={22}
                            blur={12}
                        >
                            <BlogPublicCard
                                post={{
                                    ...post,
                                    excerpt:
                                        String(post.content ?? '')
                                            .replace(/<[^>]*>/g, '')
                                            .slice(0, 140) + '...',
                                }}
                            />
                        </Reveal>
                    ))}
                </div>
            </section>
        </PublicLayout>
    );
}
