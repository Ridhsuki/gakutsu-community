import { Eye } from 'lucide-react';
import { Link, usePage } from '@inertiajs/react';
import EmptyStateRow from '@/components/data-table/empty-state-row';
import { Button } from '@/components/ui/button';
import { appendFrom } from '@/lib/navigation';
import type { EventRegistrationItem } from '@/features/events/types';

interface EventRegistrationTableProps {
    registrations: EventRegistrationItem[];
    detailBaseUrl: string;
}

function formatDate(value: string) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return '-';

    return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}

export default function EventRegistrationTable({
    registrations,
    detailBaseUrl,
}: EventRegistrationTableProps) {
    const page = usePage();

    return (
        <table className="w-full text-sm">
            <thead className="bg-muted/50">
                <tr className="border-b">
                    <th className="px-4 py-3 text-left font-medium">Name</th>
                    <th className="px-4 py-3 text-left font-medium">Email</th>
                    <th className="px-4 py-3 text-left font-medium">Registered At</th>
                    <th className="px-4 py-3 text-left font-medium">Answers</th>
                    <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
            </thead>
            <tbody>
                {registrations.length > 0 ? (
                    registrations.map((registration) => (
                        <tr key={registration.id} className="border-b">
                            <td className="px-4 py-3">{registration.name_snapshot}</td>
                            <td className="px-4 py-3">{registration.email_snapshot}</td>
                            <td className="px-4 py-3">{formatDate(registration.registered_at)}</td>
                            <td className="px-4 py-3">{registration.answers_count ?? 0}</td>
                            <td className="px-4 py-3 text-right">
                                <Button type="button" variant="outline" size="sm" asChild>
                                    <Link
                                        href={appendFrom(`${detailBaseUrl}/${registration.id}`, page.url)}
                                    >
                                        <Eye className="mr-2 h-4 w-4" />
                                        View
                                    </Link>
                                </Button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <EmptyStateRow
                        colSpan={5}
                        title="No registrations found"
                        description="There are no registrations matching the current filters."
                    />
                )}
            </tbody>
        </table>
    );
}
