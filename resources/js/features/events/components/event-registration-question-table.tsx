import { ClipboardList, Edit, Trash2 } from 'lucide-react';
import EmptyStateRow from '@/components/data-table/empty-state-row';
import { Button } from '@/components/ui/button';
import type { EventRegistrationQuestionItem } from '@/features/events/types';

interface Props {
    questions: EventRegistrationQuestionItem[];
    onEdit: (question: EventRegistrationQuestionItem) => void;
    onDelete: (question: EventRegistrationQuestionItem) => void;
}

export default function EventRegistrationQuestionTable({
    questions,
    onEdit,
    onDelete,
}: Props) {
    return (
        <div className="overflow-x-auto rounded-lg border border-border bg-card">
            <table className="w-full min-w-[860px] text-left text-sm">
                <thead className="bg-muted/50">
                    <tr className="border-b">
                        <th className="px-4 py-3 font-medium">Label</th>
                        <th className="px-4 py-3 font-medium">Type</th>
                        <th className="px-4 py-3 font-medium">Required</th>
                        <th className="px-4 py-3 font-medium">Active</th>
                        <th className="px-4 py-3 font-medium">Order</th>
                        <th className="px-4 py-3 text-right font-medium">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {questions.length > 0 ? (
                        questions.map((question) => (
                            <tr
                                key={question.id}
                                className="border-b border-border"
                            >
                                <td className="px-4 py-3">
                                    <div className="font-medium">
                                        {question.label}
                                    </div>
                                    {question.help_text ? (
                                        <div className="text-xs text-muted-foreground">
                                            {question.help_text}
                                        </div>
                                    ) : null}
                                </td>
                                <td className="px-4 py-3 text-muted-foreground">
                                    {question.type}
                                </td>
                                <td className="px-4 py-3 text-muted-foreground">
                                    {question.is_required ? 'Yes' : 'No'}
                                </td>
                                <td className="px-4 py-3 text-muted-foreground">
                                    {question.is_active ? 'Active' : 'Inactive'}
                                </td>
                                <td className="px-4 py-3 text-muted-foreground">
                                    {question.sort_order}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center justify-end gap-2">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => onEdit(question)}
                                        >
                                            <Edit className="h-4 w-4 text-blue-500" />
                                        </Button>

                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => onDelete(question)}
                                        >
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <EmptyStateRow
                            colSpan={6}
                            icon={ClipboardList}
                            title="No registration questions found"
                            description="Create your first registration question for this event."
                        />
                    )}
                </tbody>
            </table>
        </div>
    );
}
