import { Users } from 'lucide-react';
import EmptyStateRow from '@/components/data-table/empty-state-row';
import type { EventRegistrationItem } from '@/features/events/types';

interface EventRegistrationTableProps {
    registrations: EventRegistrationItem[];
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
}: EventRegistrationTableProps) {
    return (
        <div className="overflow-x-auto rounded-lg border border-border bg-card">
            <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="bg-muted/50">
                    <tr className="border-b">
                        <th className="px-4 py-3 font-medium">Name</th>
                        <th className="px-4 py-3 font-medium">Email</th>
                        <th className="px-4 py-3 font-medium">Registered At</th>
                    </tr>
                </thead>
                <tbody>
                    {registrations.length > 0 ? (
                        registrations.map((registration) => (
                            <tr key={registration.id} className="border-b border-border">
                                <td className="px-4 py-3">{registration.name_snapshot}</td>
                                <td className="px-4 py-3 text-muted-foreground">{registration.email_snapshot}</td>
                                <td className="px-4 py-3 text-muted-foreground">{formatDate(registration.registered_at)}</td>
                            </tr>
                        ))
                    ) : (
                        <EmptyStateRow
                            colSpan={3}
                            icon={Users}
                            title="No registrations found"
                            description="This event does not have any registrants yet."
                        />
                    )}
                </tbody>
            </table>
        </div>
    );
}
