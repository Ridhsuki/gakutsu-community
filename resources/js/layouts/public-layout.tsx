import type { PropsWithChildren, ReactNode } from 'react';
import FlashToasterListener from '@/components/feedback/flash-toaster-listener';
import SiteFooter from '@/components/public/site-footer';
import SiteHeader from '@/components/public/site-header';

export default function PublicLayout({
    children,
    canRegister = true,
    hero = null,
}: PropsWithChildren<{ canRegister?: boolean; hero?: ReactNode }>) {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <FlashToasterListener />
            <SiteHeader canRegister={canRegister} />
            {hero}
            <main>{children}</main>
            <SiteFooter />
        </div>
    );
}
