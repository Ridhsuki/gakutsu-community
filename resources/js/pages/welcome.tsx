import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard, login, register } from '@/routes';
import AppLogoIcon from '@/components/app-logo-icon';
import BlogCard, { type BlogPost } from '@/components/landing/blog-card';
import WebinarCard, { type WebinarItem } from '@/components/landing/webinar-card';
import { ArrowRight, BookOpen, Users, Zap, GraduationCap, Menu, X } from 'lucide-react';
import { useState } from 'react';

// ─── Dummy Data ──────────────────────────────────────────────────────────────

const WEBINARS: WebinarItem[] = [
    {
        id: 1,
        title: 'Memulai Karier di Dunia Data Science untuk Pemula',
        category: 'Data Science',
        date: 'Sabtu, 19 April 2026',
        time: '09.00 – 11.00',
        instructor: 'Dr. Rina Kusuma',
        instructorRole: 'Lead Data Scientist · Tokopedia',
        isFree: true,
    },
    {
        id: 2,
        title: 'Full‑Stack Web Development dengan React & Laravel 13',
        category: 'Web Development',
        date: 'Minggu, 27 April 2026',
        time: '13.00 – 15.30',
        instructor: 'Budi Santoso',
        instructorRole: 'Senior Engineer · Gojek',
        isLive: false,
    },
    {
        id: 3,
        title: 'UX Research: Dari Riset Pengguna ke Desain Produk',
        category: 'UI/UX Design',
        date: 'Sabtu, 3 Mei 2026',
        time: '10.00 – 12.00',
        instructor: 'Ayu Pratiwi',
        instructorRole: 'Product Designer · Traveloka',
        isFree: true,
    },
    {
        id: 4,
        title: 'Strategi Digital Marketing & SEO untuk UMKM',
        category: 'Digital Marketing',
        date: 'Rabu, 7 Mei 2026',
        time: '19.00 – 21.00',
        instructor: 'Hendra Wijaya',
        instructorRole: 'Growth Hacker · Startup Founder',
    },
];

const BLOG_POSTS: BlogPost[] = [
    {
        id: 1,
        title: '5 Skill Wajib yang Harus Dikuasai Developer di 2026',
        excerpt:
            'Industri teknologi terus berkembang pesat. Dari AI generatif hingga edge computing, artikel ini merangkum skill paling dicari yang akan membuat kariermu semakin relevan dan kompetitif.',
        category: 'Karier',
        readTime: '6 mnt baca',
        author: 'Tim Redaksi',
        publishedAt: '8 April 2026',
        imageBg: 'bg-gradient-to-br from-emerald-100 to-teal-200',
        imageEmoji: '💻',
    },
    {
        id: 2,
        title: 'Panduan Lengkap Membuat Portfolio yang Bikin HRD Melirik',
        excerpt:
            'Portfolio bukan sekadar kumpulan proyek — ia adalah narasi profesionalmu. Pelajari cara menyusun portfolio yang efektif, menarik, dan mampu membuka pintu kesempatan karier impianmu.',
        category: 'Tips & Trik',
        readTime: '8 mnt baca',
        author: 'Sari Wijayanti',
        publishedAt: '5 April 2026',
        imageBg: 'bg-gradient-to-br from-violet-100 to-purple-200',
        imageEmoji: '🎨',
    },
    {
        id: 3,
        title: 'Belajar Machine Learning dari Nol: Roadmap Lengkap 2026',
        excerpt:
            'Tertarik masuk dunia AI tapi bingung mulai dari mana? Roadmap ini memandu kamu langkah demi langkah, mulai dari matematika dasar hingga deployment model ML ke production.',
        category: 'Machine Learning',
        readTime: '10 mnt baca',
        author: 'Fajar Ramadhan',
        publishedAt: '1 April 2026',
        imageBg: 'bg-gradient-to-br from-sky-100 to-blue-200',
        imageEmoji: '🤖',
    },
    {
        id: 4,
        title: 'Membangun Startup: Dari Ide ke MVP dalam 30 Hari',
        excerpt:
            'Banyak ide brilian yang tidak pernah terwujud karena terlalu lama di tahap perencanaan. Pelajari metodologi lean startup untuk memvalidasi ide dan meluncurkan produk pertamamu dengan cepat.',
        category: 'Entrepreneurship',
        readTime: '7 mnt baca',
        author: 'Eko Prasetyo',
        publishedAt: '28 Maret 2026',
        imageBg: 'bg-gradient-to-br from-amber-100 to-orange-200',
        imageEmoji: '🚀',
    },
];

// ─── Stats ────────────────────────────────────────────────────────────────────

const STATS = [
    { value: '12.000+', label: 'Anggota Aktif' },
    { value: '150+', label: 'Webinar Digelar' },
    { value: '80+', label: 'Mentor Berpengalaman' },
    { value: '95%', label: 'Tingkat Kepuasan' },
];

// ─── Features ──────────────────────────────────────────────────────────────────

const FEATURES = [
    {
        icon: BookOpen,
        title: 'Materi Berkualitas',
        desc: 'Konten belajar yang dikurasi oleh para praktisi industri terkemuka.',
    },
    {
        icon: Users,
        title: 'Komunitas Suportif',
        desc: 'Terhubung dengan ribuan pelajar yang saling mendukung dan berbagi.',
    },
    {
        icon: Zap,
        title: 'Belajar Fleksibel',
        desc: 'Akses webinar live maupun rekaman kapan saja, di mana saja.',
    },
    {
        icon: GraduationCap,
        title: 'Mentor Berpengalaman',
        desc: 'Dibimbing langsung oleh praktisi dari perusahaan teknologi terkemuka.',
    },
];

// ─── Sub-components ──────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
    return (
        <div className="inline-flex items-center gap-2 rounded-full border border-[#106b42]/20 bg-[#106b42]/5 px-4 py-1.5 text-sm font-semibold text-[#106b42]">
            <span className="size-1.5 rounded-full bg-[#106b42]" />
            {children}
        </div>
    );
}

function HeroSection({ canRegister, isLoggedIn }: { canRegister: boolean; isLoggedIn: boolean }) {
    return (
        <section className="relative overflow-hidden bg-white">
            {/* Decorative blobs */}
            <div
                aria-hidden
                className="pointer-events-none absolute -top-32 -right-32 size-[40rem] rounded-full bg-[#106b42]/6 blur-3xl"
            />
            <div
                aria-hidden
                className="pointer-events-none absolute -bottom-20 -left-20 size-72 rounded-full bg-[#106b42]/8 blur-2xl"
            />

            <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
                <div className="grid items-center gap-12 lg:grid-cols-2">
                    {/* Left column */}
                    <div className="flex flex-col gap-7">
                        <SectionLabel>Komunitas Belajar #1 Indonesia</SectionLabel>

                        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl leading-[1.1]">
                            Belajar Lebih{' '}
                            <span className="relative whitespace-nowrap text-[#106b42]">
                                <svg
                                    aria-hidden
                                    viewBox="0 0 418 42"
                                    className="absolute left-0 top-full -mt-1 h-[0.4em] w-full fill-[#106b42]/20"
                                    preserveAspectRatio="none"
                                >
                                    <path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z" />
                                </svg>
                                Cerdas
                            </span>{' '}
                            Bersama Komunitas
                        </h1>

                        <p className="max-w-lg text-lg text-gray-600 leading-relaxed">
                            Bergabunglah dengan ribuan pelajar dan profesional dalam komunitas
                            belajar yang aktif. Ikuti webinar inspiratif, baca artikel edukatif,
                            dan capai potensi maksimalmu bersama kami.
                        </p>

                        <div className="flex flex-wrap gap-3">
                            {isLoggedIn ? (
                                <Link
                                    href={dashboard()}
                                    className="inline-flex items-center gap-2 rounded-xl bg-[#106b42] px-6 py-3 text-base font-semibold text-white shadow-lg shadow-[#106b42]/20 transition-all duration-200 hover:bg-[#0d5a38] hover:shadow-[#106b42]/30 active:scale-95"
                                >
                                    Ke Dashboard <ArrowRight className="size-4" />
                                </Link>
                            ) : (
                                <>
                                    {canRegister && (
                                        <Link
                                            href={register()}
                                            className="inline-flex items-center gap-2 rounded-xl bg-[#106b42] px-6 py-3 text-base font-semibold text-white shadow-lg shadow-[#106b42]/20 transition-all duration-200 hover:bg-[#0d5a38] hover:shadow-[#106b42]/30 active:scale-95"
                                        >
                                            Mulai Gratis <ArrowRight className="size-4" />
                                        </Link>
                                    )}
                                    <Link
                                        href={login()}
                                        className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 text-base font-semibold text-gray-700 shadow-sm transition-all duration-200 hover:border-[#106b42]/30 hover:bg-[#106b42]/5 hover:text-[#106b42] active:scale-95"
                                    >
                                        Masuk
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Trust badges */}
                        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-500">
                            <span className="flex items-center gap-1.5">
                                <span className="text-[#106b42]">✓</span> Gratis bergabung
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="text-[#106b42]">✓</span> Tanpa kartu kredit
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="text-[#106b42]">✓</span> Ribuan member aktif
                            </span>
                        </div>
                    </div>

                    {/* Right column — illustrated card */}
                    <div className="relative flex justify-center lg:justify-end">
                        {/* Background glow */}
                        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#106b42]/10 to-[#106b42]/5 blur-xl" />

                        <div className="relative w-full max-w-md rounded-3xl border border-gray-100 bg-white p-8 shadow-2xl">
                            {/* Header mock */}
                            <div className="mb-6 flex items-center gap-3">
                                <div className="flex size-12 items-center justify-center rounded-xl bg-[#106b42] shadow-md">
                                    <AppLogoIcon className="size-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900">Yok Pelajarin</p>
                                    <p className="text-xs text-gray-400">Komunitas Belajar</p>
                                </div>
                            </div>

                            {/* Webinar mock card */}
                            <div className="mb-4 rounded-2xl bg-gradient-to-br from-[#106b42] to-[#1a9b5f] p-5 text-white">
                                <p className="mb-1 text-xs font-medium opacity-80">Webinar Berikutnya</p>
                                <p className="text-base font-bold leading-snug">
                                    Memulai Karier di Dunia Data Science
                                </p>
                                <div className="mt-3 flex items-center gap-2 text-xs opacity-90">
                                    <span className="rounded-full bg-white/20 px-2 py-0.5">Sabtu, 19 Apr</span>
                                    <span className="rounded-full bg-white/20 px-2 py-0.5">09.00 WIB</span>
                                </div>
                            </div>

                            {/* Stats row */}
                            <div className="grid grid-cols-3 divide-x divide-gray-100 rounded-2xl bg-gray-50 p-3 text-center">
                                {[
                                    { val: '12K+', lbl: 'Member' },
                                    { val: '150+', lbl: 'Webinar' },
                                    { val: '80+', lbl: 'Mentor' },
                                ].map((s) => (
                                    <div key={s.lbl} className="px-2">
                                        <p className="text-base font-extrabold text-[#106b42]">{s.val}</p>
                                        <p className="text-[11px] text-gray-500">{s.lbl}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Avatar row */}
                            <div className="mt-4 flex items-center gap-3">
                                <div className="flex -space-x-2">
                                    {['#106b42', '#1a9b5f', '#34d399', '#6ee7b7'].map((c, i) => (
                                        <div
                                            key={i}
                                            style={{ backgroundColor: c }}
                                            className="size-8 rounded-full border-2 border-white text-[10px] font-bold text-white flex items-center justify-center"
                                        >
                                            {['R', 'B', 'A', 'E'][i]}
                                        </div>
                                    ))}
                                </div>
                                <p className="text-xs text-gray-500">
                                    <span className="font-semibold text-gray-700">+2.400</span> bergabung bulan ini
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function StatsSection() {
    return (
        <section className="bg-[#106b42] py-14">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <dl className="grid grid-cols-2 gap-8 lg:grid-cols-4">
                    {STATS.map((stat) => (
                        <div key={stat.label} className="text-center">
                            <dt className="text-3xl font-extrabold text-white sm:text-4xl">{stat.value}</dt>
                            <dd className="mt-1 text-sm font-medium text-white/70">{stat.label}</dd>
                        </div>
                    ))}
                </dl>
            </div>
        </section>
    );
}

function FeaturesSection() {
    return (
        <section className="bg-gray-50 py-20">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <div className="mb-12 text-center">
                    <SectionLabel>Kenapa Yok Pelajarin?</SectionLabel>
                    <h2 className="mt-4 text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Platform belajar yang menyenangkan
                    </h2>
                    <p className="mt-3 text-lg text-gray-500">
                        Dirancang untuk membantu kamu berkembang lebih cepat bersama komunitas yang tepat.
                    </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {FEATURES.map(({ icon: Icon, title, desc }) => (
                        <div
                            key={title}
                            className="group flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-[#106b42]/20"
                        >
                            <div className="flex size-12 items-center justify-center rounded-xl bg-[#106b42]/10 text-[#106b42] transition-colors duration-200 group-hover:bg-[#106b42] group-hover:text-white">
                                <Icon className="size-5" />
                            </div>
                            <h3 className="text-base font-semibold text-gray-900">{title}</h3>
                            <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function WebinarSection() {
    return (
        <section id="webinar" className="bg-white py-20">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div className="flex flex-col gap-3">
                        <SectionLabel>Jadwal Webinar</SectionLabel>
                        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                            Event & Webinar Mendatang
                        </h2>
                        <p className="max-w-lg text-gray-500">
                            Ikuti webinar live bersama para mentor berpengalaman. Belajar langsung, tanya jawab, dan networking dengan sesama peserta.
                        </p>
                    </div>
                    <a
                        href="#"
                        className="shrink-0 inline-flex items-center gap-1.5 text-sm font-semibold text-[#106b42] hover:gap-2.5 transition-all duration-200"
                    >
                        Lihat semua event <ArrowRight className="size-4" />
                    </a>
                </div>

                {/* Cards */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {WEBINARS.map((webinar) => (
                        <WebinarCard key={webinar.id} webinar={webinar} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function BlogSection() {
    return (
        <section id="blog" className="bg-gray-50 py-20">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div className="flex flex-col gap-3">
                        <SectionLabel>Blog & Artikel</SectionLabel>
                        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                            Insights Terbaru untuk Kamu
                        </h2>
                        <p className="max-w-lg text-gray-500">
                            Artikel pilihan dari para mentor dan kontributor komunitas kami — seputar karier, teknologi, dan pengembangan diri.
                        </p>
                    </div>
                    <a
                        href="#"
                        className="shrink-0 inline-flex items-center gap-1.5 text-sm font-semibold text-[#106b42] hover:gap-2.5 transition-all duration-200"
                    >
                        Semua artikel <ArrowRight className="size-4" />
                    </a>
                </div>

                {/* Cards */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {BLOG_POSTS.map((post) => (
                        <BlogCard key={post.id} post={post} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function CtaSection({ canRegister }: { canRegister: boolean }) {
    return (
        <section className="relative overflow-hidden bg-[#106b42] py-20">
            <div
                aria-hidden
                className="pointer-events-none absolute -top-20 right-0 size-80 rounded-full bg-white/5 blur-3xl"
            />
            <div
                aria-hidden
                className="pointer-events-none absolute -bottom-10 left-0 size-60 rounded-full bg-white/5 blur-2xl"
            />

            <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
                <h2 className="text-3xl font-extrabold text-white sm:text-4xl leading-tight">
                    Siap memulai perjalanan belajarmu?
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-lg text-white/75">
                    Bergabunglah dengan lebih dari 12.000 pelajar yang telah merasakan manfaat belajar bersama komunitas Yok Pelajarin.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-4">
                    {canRegister && (
                        <Link
                            href={register()}
                            className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-base font-bold text-[#106b42] shadow-lg transition-all duration-200 hover:bg-gray-50 active:scale-95"
                        >
                            Daftar Gratis Sekarang <ArrowRight className="size-4" />
                        </Link>
                    )}
                    <a
                        href="#webinar"
                        className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-7 py-3.5 text-base font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/20 active:scale-95"
                    >
                        Lihat Jadwal Webinar
                    </a>
                </div>
            </div>
        </section>
    );
}

function Navbar({ canRegister, isLoggedIn }: { canRegister: boolean; isLoggedIn: boolean }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
                {/* Logo */}
                <a href="#" className="flex items-center gap-2.5">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-[#106b42]">
                        <AppLogoIcon className="size-5 text-white" />
                    </div>
                    <span className="text-base font-bold text-gray-900">
                        Yok <span className="text-[#106b42]">Pelajarin</span>
                    </span>
                </a>

                {/* Desktop nav */}
                <nav className="hidden items-center gap-7 text-sm font-medium text-gray-600 md:flex">
                    <a href="#webinar" className="transition-colors hover:text-[#106b42]">Webinar</a>
                    <a href="#blog" className="transition-colors hover:text-[#106b42]">Blog</a>
                    <a href="#" className="transition-colors hover:text-[#106b42]">Tentang</a>
                </nav>

                {/* Desktop CTA */}
                <div className="hidden items-center gap-3 md:flex">
                    {isLoggedIn ? (
                        <Link
                            href={dashboard()}
                            className="rounded-lg bg-[#106b42] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#0d5a38]"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link
                                href={login()}
                                className="text-sm font-semibold text-gray-600 transition-colors hover:text-[#106b42]"
                            >
                                Masuk
                            </Link>
                            {canRegister && (
                                <Link
                                    href={register()}
                                    className="rounded-lg bg-[#106b42] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#0d5a38]"
                                >
                                    Daftar Gratis
                                </Link>
                            )}
                        </>
                    )}
                </div>

                {/* Mobile menu toggle */}
                <button
                    id="mobile-menu-toggle"
                    aria-label="Toggle menu"
                    onClick={() => setIsOpen((v) => !v)}
                    className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 md:hidden"
                >
                    {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
                </button>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="border-t border-gray-100 bg-white px-4 pb-4 pt-2 md:hidden">
                    <nav className="flex flex-col gap-1 text-sm font-medium text-gray-700">
                        <a href="#webinar" onClick={() => setIsOpen(false)} className="rounded-lg px-3 py-2 hover:bg-gray-50 hover:text-[#106b42]">Webinar</a>
                        <a href="#blog" onClick={() => setIsOpen(false)} className="rounded-lg px-3 py-2 hover:bg-gray-50 hover:text-[#106b42]">Blog</a>
                        <a href="#" className="rounded-lg px-3 py-2 hover:bg-gray-50 hover:text-[#106b42]">Tentang</a>
                    </nav>
                    <div className="mt-3 flex flex-col gap-2 border-t border-gray-100 pt-3">
                        {isLoggedIn ? (
                            <Link
                                href={dashboard()}
                                className="rounded-lg bg-[#106b42] px-4 py-2.5 text-center text-sm font-semibold text-white"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    className="rounded-lg border border-gray-200 px-4 py-2.5 text-center text-sm font-semibold text-gray-700"
                                >
                                    Masuk
                                </Link>
                                {canRegister && (
                                    <Link
                                        href={register()}
                                        className="rounded-lg bg-[#106b42] px-4 py-2.5 text-center text-sm font-semibold text-white"
                                    >
                                        Daftar Gratis
                                    </Link>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}

function Footer() {
    return (
        <footer className="border-t border-gray-100 bg-white py-10">
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-[#106b42]">
                            <AppLogoIcon className="size-4 text-white" />
                        </div>
                        <span className="text-sm font-bold text-gray-900">
                            Yok <span className="text-[#106b42]">Pelajarin</span>
                        </span>
                    </div>
                    <p className="text-sm text-gray-400">
                        © {new Date().getFullYear()} Yok Pelajarin. Semua hak dilindungi.
                    </p>
                    <div className="flex gap-5 text-sm text-gray-500">
                        <a href="#" className="hover:text-[#106b42] transition-colors">Privasi</a>
                        <a href="#" className="hover:text-[#106b42] transition-colors">Syarat</a>
                        <a href="#" className="hover:text-[#106b42] transition-colors">Kontak</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Welcome({ canRegister = true }: { canRegister?: boolean }) {
    const { auth } = usePage().props as { auth: { user: unknown } };
    const isLoggedIn = Boolean(auth?.user);

    return (
        <>
            <Head title="Yok Pelajarin — Komunitas Belajar #1 Indonesia">
                <meta
                    name="description"
                    content="Bergabunglah dengan ribuan pelajar dan profesional di komunitas Yok Pelajarin. Ikuti webinar, baca artikel, dan kembangkan dirimu bersama mentor berpengalaman."
                />
                <meta name="keywords" content="komunitas belajar, webinar, kursus online, mentor, indonesia" />
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700,800"
                    rel="stylesheet"
                />
            </Head>

            <div className="min-h-screen bg-white font-sans antialiased">
                <Navbar canRegister={canRegister} isLoggedIn={isLoggedIn} />
                <HeroSection canRegister={canRegister} isLoggedIn={isLoggedIn} />
                <StatsSection />
                <FeaturesSection />
                <WebinarSection />
                <BlogSection />
                <CtaSection canRegister={canRegister} />
                <Footer />
            </div>
        </>
    );
}
