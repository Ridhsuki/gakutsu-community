import FlashToasterListener from '@/components/feedback/flash-toaster-listener';
import SeoHead from '@/components/public/seo-head';
import AuthLayoutTemplate from '@/layouts/auth/auth-simple-layout';

export default function AuthLayout({
    title = '',
    description = '',
    children,
}: {
    title?: string;
    description?: string;
    children: React.ReactNode;
}) {
    return (
        <AuthLayoutTemplate title={title} description={description}>
            <SeoHead />
            <FlashToasterListener />
            {children}
        </AuthLayoutTemplate>
    );
}
