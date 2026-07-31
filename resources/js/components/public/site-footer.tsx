import { Link } from '@inertiajs/react';
import AppLogo from '@/components/app-logo';

export default function SiteFooter() {
    return (
        <footer className="border-t border-border/60 bg-background">
            <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-[1.5fr_1fr_1fr]">
                <div className="space-y-3">
                    <div className="inline-flex items-center">
                        <AppLogo />
                    </div>
                    <p className="max-w-md text-sm text-muted-foreground">
                        A place to learn IT and cybersecurity together. Just
                        sharing, discussing, and learning step by step.
                    </p>
                </div>

                <div>
                    <h3 className="mb-3 text-sm font-semibold">Navigasi</h3>
                    <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                        <Link href="/">Home</Link>
                        <Link href="/events">Events</Link>
                        <Link href="/blogs">Blog</Link>
                    </div>
                </div>

                <div>
                    <h3 className="mb-3 text-sm font-semibold">Akun</h3>
                    <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                        <Link href="/login">Masuk</Link>
                        <Link href="/register">Daftar</Link>
                        <Link href="/dashboard">Dashboard</Link>
                    </div>
                </div>
            </div>

            <div className="border-t border-border/60">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 text-xs text-muted-foreground">
                    <p>
                        © {new Date().getFullYear()} Yok Pelajarin. All rights
                        reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
