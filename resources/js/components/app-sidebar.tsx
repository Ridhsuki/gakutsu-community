import { Link, usePage } from '@inertiajs/react';
import { Users, LayoutGrid, Home, BookOpen, Cast } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

const footerNavItems: NavItem[] = [
    {
        title: 'Halaman Utama',
        href: '/',
        icon: Home,
    }
];

export function AppSidebar() {
    const { auth } = usePage<any>().props;

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: dashboard(),
            icon: LayoutGrid,
        },
        ...(auth?.user?.role === 'admin'
            ? [
                { title: 'Blogs', href: '/admin/blogs', icon: BookOpen },
                { title: 'Events', href: '/admin/events', icon: Cast },
                { title: 'Users', href: '/admin/users', icon: Users },
            ]
            : []),

        ...(auth?.user?.role === 'mentor'
            ? [
                { title: 'Blogs', href: '/mentor/blogs', icon: BookOpen },
                { title: 'Events', href: '/mentor/events', icon: Cast },
            ]
            : []),
    ];
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
