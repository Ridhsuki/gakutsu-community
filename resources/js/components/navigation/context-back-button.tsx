import { Link, usePage } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { resolveBackHref } from '@/lib/navigation';

export default function ContextBackButton({
    fallbackHref,
    label = 'Back',
    className = 'px-0',
}: {
    fallbackHref: string;
    label?: string;
    className?: string;
}) {
    const page = usePage();
    const href = resolveBackHref(page.url, fallbackHref);

    return (
        <Button type="button" variant="ghost" asChild className={className}>
            <Link href={href}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {label}
            </Link>
        </Button>
    );
}
