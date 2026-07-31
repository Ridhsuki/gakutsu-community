import { Edit, Trash2, Users } from 'lucide-react';
import EmptyStateRow from '@/components/data-table/empty-state-row';
import SortableHeader from '@/components/data-table/sortable-header';
import { Button } from '@/components/ui/button';
import UserRoleBadge from '@/features/users/components/user-role-badge';
import type { User, UserSortField } from '@/features/users/types';
import type { SortDirection } from '@/types/filters';

interface UserTableProps {
    users: User[];
    sortField: UserSortField;
    sortDirection: SortDirection;
    onSort: (field: UserSortField) => void;
    onEdit: (user: User) => void;
    onDelete: (user: User) => void;
}

export default function UserTable({
    users,
    sortField,
    sortDirection,
    onSort,
    onEdit,
    onDelete,
}: UserTableProps) {
    return (
        <div className="overflow-x-auto rounded-lg border border-border bg-card">
            <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="bg-muted/50">
                    <tr className="border-b">
                        <SortableHeader
                            label="Name"
                            field="name"
                            currentField={sortField}
                            currentDirection={sortDirection}
                            onSort={onSort}
                        />

                        <SortableHeader
                            label="Email"
                            field="email"
                            currentField={sortField}
                            currentDirection={sortDirection}
                            onSort={onSort}
                        />

                        <SortableHeader
                            label="Role"
                            field="role"
                            currentField={sortField}
                            currentDirection={sortDirection}
                            onSort={onSort}
                        />

                        <th className="px-4 py-3 text-right font-medium">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {users.length > 0 ? (
                        users.map((user) => (
                            <tr
                                key={user.id}
                                className="border-b border-border transition hover:bg-accent/50"
                            >
                                <td className="px-4 py-3 font-medium">{user.name}</td>
                                <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                                <td className="px-4 py-3">
                                    <UserRoleBadge role={user.role} />
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center justify-end gap-2">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => onEdit(user)}
                                            aria-label={`Edit ${user.name}`}
                                        >
                                            <Edit className="h-4 w-4 text-blue-500" />
                                        </Button>

                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => onDelete(user)}
                                            aria-label={`Delete ${user.name}`}
                                        >
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <EmptyStateRow
                            colSpan={4}
                            icon={Users}
                            title="No users found"
                            description="Try adjusting your search or add a new user to get started."
                        />
                    )}
                </tbody>
            </table>
        </div>
    );
}
