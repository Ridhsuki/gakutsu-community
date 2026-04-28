import { Link, usePage } from '@inertiajs/react';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import AppLogo from '@/components/app-logo';
import ThemeToggle from '@/components/public/theme-toggle';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type AuthProps = {
    auth?: {
        user?: {
            id: number;
            name: string;
        } | null;
    };
    ziggy?: {
        location?: string;
    };
};

const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Events', href: '/events' },
    { label: 'Blog', href: '/blogs' },
];

export default function SiteHeader({ canRegister = true }: { canRegister?: boolean }) {
    const { props, url } = usePage<AuthProps>();
    const user = props.auth?.user;
    const [open, setOpen] = useState(false);

    const pathname = url.split('?')[0];

    const isActive = (href: string) => {
        if (href === '/') {
            return pathname === '/';
        }

        return pathname === href || pathname.startsWith(`${href}/`);
    };

    return (
        <header className="sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
                <Link href="/" className="inline-flex items-center">
                    <AppLogo />
                </Link>

                <nav className="hidden items-center gap-6 md:flex">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'text-sm transition-colors',
                                isActive(item.href)
                                    ? 'font-medium text-primary'
                                    : 'text-muted-foreground hover:text-foreground'
                            )}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="hidden items-center gap-2 md:flex">
                    <ThemeToggle />

                    {user ? (
                        <Button asChild>
                            <Link href="/dashboard">Dashboard</Link>
                        </Button>
                    ) : (
                        <>
                            <Button variant="ghost" asChild>
                                <Link href="/login">Masuk</Link>
                            </Button>

                            {canRegister ? (
                                <Button asChild>
                                    <Link href="/register">Daftar</Link>
                                </Button>
                            ) : null}
                        </>
                    )}
                </div>

                <div className="flex items-center gap-2 md:hidden">
                    <ThemeToggle />

                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setOpen((v) => !v)}
                        aria-label="Toggle menu"
                    >
                        {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                    </Button>
                </div>
            </div>

            {open ? (
                <div className="border-t border-border/60 px-4 py-3 md:hidden">
                    <div className="flex flex-col gap-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'rounded-md px-3 py-2 text-sm transition-colors',
                                    isActive(item.href)
                                        ? 'bg-primary/10 font-medium text-primary'
                                        : 'hover:bg-muted'
                                )}
                            >
                                {item.label}
                            </Link>
                        ))}

                        <div className="mt-2 flex gap-2">
                            {user ? (
                                <Button asChild className="w-full">
                                    <Link href="/dashboard">Dashboard</Link>
                                </Button>
                            ) : (
                                <>
                                    <Button variant="outline" asChild className="w-full">
                                        <Link href="/login">Masuk</Link>
                                    </Button>

                                    {canRegister ? (
                                        <Button asChild className="w-full">
                                            <Link href="/register">Daftar</Link>
                                        </Button>
                                    ) : null}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            ) : null}
        </header>
    );
}
