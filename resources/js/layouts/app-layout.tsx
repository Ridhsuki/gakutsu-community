import FlashToasterListener from '@/components/feedback/flash-toaster-listener';
import SeoHead from '@/components/public/seo-head';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import type { BreadcrumbItem } from '@/types';

export default function AppLayout({
    breadcrumbs = [],
    children,
}: {
    breadcrumbs?: BreadcrumbItem[];
    children: React.ReactNode;
}) {
    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs}>
            <SeoHead />
            <FlashToasterListener />
            {children}
        </AppLayoutTemplate>
    );
}
