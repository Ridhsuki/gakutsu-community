import { Head, Link, router, usePage } from '@inertiajs/react';
import { Eye, FileCheck2 } from 'lucide-react';
import { useState } from 'react';
import ContextBackButton from '@/components/navigation/context-back-button';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type {
    EventQuizAttemptItem,
    QuizEventSummary,
} from '@/features/quizzes/types';
import { appendFrom } from '@/lib/navigation';

export default function QuizAttemptsPage({
    event,
    attempts,
    filters,
    backHref,
    detailBaseHref,
    headTitle,
}: {
    event: QuizEventSummary;
    attempts: {
        data: EventQuizAttemptItem[];
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: {
        search?: string;
        status?: string;
    };
    backHref: string;
    detailBaseHref: string;
    headTitle: string;
}) {
    const page = usePage();
    const [search, setSearch] = useState(filters.search ?? '');
    const [status, setStatus] = useState(filters.status || 'all');

    const applyFilters = () => {
        router.get(
            detailBaseHref,
            {
                ...(search.trim() ? { search: search.trim() } : {}),
                ...(status !== 'all' ? { status } : {}),
            },
            {
                preserveScroll: true,
                preserveState: true,
                replace: true,
            },
        );
    };

    return (
        <>
            <Head title={headTitle} />

            <div className="flex h-full w-full flex-col space-y-6 p-6">
                <div className="space-y-3">
                    <ContextBackButton fallbackHref={backHref} label="Back" />

                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <FileCheck2 className="h-5 w-5 text-primary" />
                            <h1 className="text-2xl font-semibold tracking-tight">
                                Quiz Attempts · {event.title}
                            </h1>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            View submitted quiz attempts and grading status.
                        </p>
                    </div>
                </div>

                <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                    <div className="mb-4 flex flex-col gap-3 md:flex-row">
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.currentTarget.value)}
                            placeholder="Search by name or email"
                        />

                        <Select value={status} onValueChange={setStatus}>
                            <SelectTrigger className="md:w-[180px]">
                                <SelectValue placeholder="All status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All status</SelectItem>
                                <SelectItem value="submitted">
                                    Submitted
                                </SelectItem>
                                <SelectItem value="graded">Graded</SelectItem>
                            </SelectContent>
                        </Select>

                        <Button type="button" onClick={applyFilters}>
                            Apply
                        </Button>
                    </div>

                    <div className="overflow-x-auto rounded-lg border border-border">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50">
                                <tr className="border-b">
                                    <th className="px-4 py-3 text-left font-medium">
                                        User
                                    </th>
                                    <th className="px-4 py-3 text-left font-medium">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 text-left font-medium">
                                        Score
                                    </th>
                                    <th className="px-4 py-3 text-left font-medium">
                                        Submitted
                                    </th>
                                    <th className="px-4 py-3 text-right font-medium">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {attempts.data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-4 py-8 text-center text-muted-foreground"
                                        >
                                            No attempts found.
                                        </td>
                                    </tr>
                                ) : (
                                    attempts.data.map((attempt) => (
                                        <tr
                                            key={attempt.id}
                                            className="border-b"
                                        >
                                            <td className="px-4 py-3">
                                                <div className="font-medium">
                                                    {attempt.user?.name ?? '-'}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    {attempt.user?.email ?? '-'}
                                                </div>
                                            </td>

                                            <td className="px-4 py-3">
                                                <Badge
                                                    variant={
                                                        attempt.status ===
                                                        'graded'
                                                            ? 'default'
                                                            : 'secondary'
                                                    }
                                                >
                                                    {attempt.status}
                                                </Badge>
                                            </td>

                                            <td className="px-4 py-3">
                                                <div className="font-medium">
                                                    {attempt.total_score} /{' '}
                                                    {attempt.max_score}
                                                </div>
                                            </td>

                                            <td className="px-4 py-3 text-muted-foreground">
                                                {attempt.submitted_at
                                                    ? new Date(
                                                          attempt.submitted_at,
                                                      ).toLocaleString('id-ID')
                                                    : '-'}
                                            </td>

                                            <td className="px-4 py-3 text-right">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    asChild
                                                >
                                                    <Link
                                                        href={appendFrom(
                                                            `${detailBaseHref}/${attempt.id}`,
                                                            page.url,
                                                        )}
                                                    >
                                                        <Eye className="mr-2 h-4 w-4" />
                                                        View
                                                    </Link>
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}
