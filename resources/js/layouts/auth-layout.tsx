import AuthLayoutTemplate from '@/layouts/auth/auth-simple-layout';
import FlashToasterListener from '@/components/feedback/flash-toaster-listener';

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
            <FlashToasterListener />
            {children}
        </AuthLayoutTemplate>
    );
}
