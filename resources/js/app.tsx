import { createInertiaApp } from '@inertiajs/react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { formatDocumentTitle } from '@/lib/document-title';

const appName = import.meta.env.VITE_APP_NAME || 'Gakutsu';

function isPublicPage(name: string): boolean {
    return (
        name === 'welcome' ||
        name.startsWith('blogs/') ||
        name.startsWith('events/')
    );
}

createInertiaApp({
    title: (title) => formatDocumentTitle(title, appName),

    layout: (name) => {
        if (isPublicPage(name)) {
            return null;
        }

        if (name.startsWith('auth/')) {
            return AuthLayout;
        }

        if (name.startsWith('settings/')) {
            return [AppLayout, SettingsLayout];
        }

        return AppLayout;
    },

    strictMode: true,

    withApp(app) {
        return (
            <TooltipProvider delayDuration={150}>
                <Toaster />
                {app}
            </TooltipProvider>
        );
    },

    progress: {
        color: '#106b42',
    },
});

initializeTheme();
