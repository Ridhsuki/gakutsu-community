import type { SyntheticEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import InputError from '@/components/input-error';
import {
    ArrowDown,
    ArrowUp,
    ArrowUpDown,
    Edit,
    Plus,
    Search,
    Trash2,
} from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

type Role = 'admin' | 'mentor' | 'member';
type SortField = 'name' | 'email' | 'role' | 'created_at';
type SortDirection = 'asc' | 'desc';

interface User {
    id: number;
    name: string;
    email: string;
    role: Role;
    created_at?: string;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedUsers {
    data: User[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: PaginationLink[];
}

interface Filters {
    search?: string;
    sort_field?: SortField;
    sort_direction?: SortDirection;
}

interface PageProps {
    users: PaginatedUsers;
    filters: Filters;
}

interface CreateUserForm {
    name: string;
    email: string;
    role: Role;
    password: string;
    password_confirmation: string;
}

interface EditUserForm {
    name: string;
    email: string;
    role: Role;
    password: string;
    password_confirmation: string;
}

const USERS_INDEX_URL = '/admin/users';
const ALLOWED_SORT_FIELDS: readonly SortField[] = ['name', 'email', 'role', 'created_at'];

function buildQuery(search: string, sortField: SortField, sortDirection: SortDirection) {
    const trimmedSearch = search.trim();

    return {
        ...(trimmedSearch ? { search: trimmedSearch } : {}),
        sort_field: sortField,
        sort_direction: sortDirection,
    };
}

function cleanPaginationLabel(label: string) {
    return label
        .replace(/&laquo;/g, '«')
        .replace(/&raquo;/g, '»')
        .replace(/<[^>]*>/g, '')
        .trim();
}

function RoleBadge({ role }: { role: Role }) {
    if (role === 'admin') {
        return (
            <Badge className="bg-red-500 text-white hover:bg-red-600 dark:bg-red-900 dark:text-red-100">
                Admin
            </Badge>
        );
    }

    if (role === 'mentor') {
        return (
            <Badge className="bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-900 dark:text-blue-100">
                Mentor
            </Badge>
        );
    }

    return (
        <Badge className="bg-gray-500 text-white hover:bg-gray-600 dark:bg-gray-800 dark:text-gray-100">
            Member
        </Badge>
    );
}

export default function UserIndex({ users, filters }: PageProps) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [sortField, setSortField] = useState<SortField>(filters.sort_field ?? 'created_at');
    const [sortDirection, setSortDirection] = useState<SortDirection>(filters.sort_direction ?? 'desc');

    const [isReloading, setIsReloading] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const isFirstSearchRender = useRef(true);

    const createForm = useForm<CreateUserForm>({
        name: '',
        email: '',
        role: 'member',
        password: '',
        password_confirmation: '',
    });

    const editForm = useForm<EditUserForm>({
        name: '',
        email: '',
        role: 'member',
        password: '',
        password_confirmation: '',
    });

    const reloadUsers = (
        nextSearch: string,
        nextSortField: SortField,
        nextSortDirection: SortDirection,
    ) => {
        router.get(USERS_INDEX_URL, buildQuery(nextSearch, nextSortField, nextSortDirection), {
            only: ['users', 'filters'],
            preserveState: true,
            preserveScroll: true,
            replace: true,
            onStart: () => setIsReloading(true),
            onFinish: () => setIsReloading(false),
        });
    };

    useEffect(() => {
        if (isFirstSearchRender.current) {
            isFirstSearchRender.current = false;
            return;
        }

        const timeoutId = window.setTimeout(() => {
            reloadUsers(search, sortField, sortDirection);
        }, 350);

        return () => window.clearTimeout(timeoutId);
    }, [search]);

    const handleSort = (field: SortField) => {
        if (!ALLOWED_SORT_FIELDS.includes(field)) return;

        const nextDirection: SortDirection =
            sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';

        setSortField(field);
        setSortDirection(nextDirection);

        reloadUsers(search, field, nextDirection);
    };

    const renderSortIcon = (field: SortField) => {
        if (sortField !== field) {
            return <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />;
        }

        return sortDirection === 'asc' ? (
            <ArrowUp className="ml-2 h-4 w-4 text-[#106b42]" />
        ) : (
            <ArrowDown className="ml-2 h-4 w-4 text-[#106b42]" />
        );
    };

    const closeCreateModal = () => {
        setIsCreateOpen(false);
        createForm.reset();
        createForm.clearErrors();
    };

    const closeEditModal = () => {
        setIsEditOpen(false);
        setSelectedUser(null);
        editForm.reset();
        editForm.clearErrors();
    };

    const closeDeleteModal = () => {
        setIsDeleteOpen(false);
        setSelectedUser(null);
    };

    const openCreateModal = () => {
        createForm.reset();
        createForm.clearErrors();
        setIsCreateOpen(true);
    };

    const openEditModal = (user: User) => {
        setSelectedUser(user);
        editForm.setData({
            name: user.name,
            email: user.email,
            role: user.role,
            password: '',
            password_confirmation: '',
        });
        editForm.clearErrors();
        setIsEditOpen(true);
    };

    const openDeleteModal = (user: User) => {
        setSelectedUser(user);
        setIsDeleteOpen(true);
    };

    const handleCreateSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();

        createForm.post(USERS_INDEX_URL, {
            preserveScroll: true,
            onSuccess: () => {
                closeCreateModal();
            },
        });
    };

    const handleEditSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!selectedUser) return;

        editForm.put(`${USERS_INDEX_URL}/${selectedUser.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                closeEditModal();
            },
        });
    };

    const handleDelete = () => {
        if (!selectedUser) return;

        setIsDeleting(true);

        router.delete(`${USERS_INDEX_URL}/${selectedUser.id}`, {
            preserveScroll: true,
            onSuccess: () => {
                closeDeleteModal();
            },
            onFinish: () => {
                setIsDeleting(false);
            },
        });
    };

    return (
        <>
            <Head title="User Management" />

            <div className="flex h-full w-full flex-col space-y-6 p-6">
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
                        <p className="text-sm text-muted-foreground">
                            Manage community members, mentors, and administrators.
                        </p>
                    </div>

                    <Button
                        type="button"
                        onClick={openCreateModal}
                        className="bg-[#106b42] text-white hover:bg-[#0c5132]"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add User
                    </Button>
                </div>

                <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 text-card-foreground shadow-sm">
                    <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                        <div className="relative w-full max-w-md">
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <input
                                type="search"
                                value={search}
                                onChange={(e) => setSearch(e.currentTarget.value)}
                                placeholder="Search by name or email..."
                                className="w-full rounded-md border border-input bg-background py-2 pl-10 pr-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/20"
                            />
                        </div>

                        <div className="text-sm text-muted-foreground">
                            {isReloading ? 'Refreshing data...' : `Total users: ${users.total}`}
                        </div>
                    </div>

                    <div className="overflow-x-auto rounded-lg border border-border bg-card">
                        <table className="w-full min-w-[720px] text-left text-sm">
                            <thead className="bg-muted/50">
                                <tr className="border-b">
                                    <th className="px-4 py-3 font-medium">
                                        <button
                                            type="button"
                                            onClick={() => handleSort('name')}
                                            className="inline-flex items-center font-medium transition hover:text-[#106b42]"
                                            aria-label="Sort by name"
                                        >
                                            Name
                                            {renderSortIcon('name')}
                                        </button>
                                    </th>

                                    <th className="px-4 py-3 font-medium">
                                        <button
                                            type="button"
                                            onClick={() => handleSort('email')}
                                            className="inline-flex items-center font-medium transition hover:text-[#106b42]"
                                            aria-label="Sort by email"
                                        >
                                            Email
                                            {renderSortIcon('email')}
                                        </button>
                                    </th>

                                    <th className="px-4 py-3 font-medium">
                                        <button
                                            type="button"
                                            onClick={() => handleSort('role')}
                                            className="inline-flex items-center font-medium transition hover:text-[#106b42]"
                                            aria-label="Sort by role"
                                        >
                                            Role
                                            {renderSortIcon('role')}
                                        </button>
                                    </th>

                                    <th className="px-4 py-3 text-right font-medium">Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {users.data.length > 0 ? (
                                    users.data.map((user) => (
                                        <tr
                                            key={user.id}
                                            className="border-b border-border transition hover:bg-accent/50"
                                        >
                                            <td className="px-4 py-3 font-medium">{user.name}</td>
                                            <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                                            <td className="px-4 py-3">
                                                <RoleBadge role={user.role} />
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => openEditModal(user)}
                                                        aria-label={`Edit ${user.name}`}
                                                    >
                                                        <Edit className="h-4 w-4 text-blue-500" />
                                                    </Button>

                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => openDeleteModal(user)}
                                                        aria-label={`Delete ${user.name}`}
                                                    >
                                                        <Trash2 className="h-4 w-4 text-red-500" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                                            No users found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {users.last_page > 1 && (
                        <div className="flex flex-col items-start justify-between gap-3 border-t border-border pt-4 sm:flex-row sm:items-center">
                            <div className="text-sm text-muted-foreground">
                                Showing {users.from ?? 0} to {users.to ?? 0} of {users.total} users
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {users.links.map((link, index) => {
                                    const label = cleanPaginationLabel(link.label);

                                    if (!link.url) {
                                        return (
                                            <span
                                                key={`disabled-${label}-${index}`}
                                                className="rounded-md border border-border px-3 py-1.5 text-sm text-muted-foreground opacity-50"
                                            >
                                                {label}
                                            </span>
                                        );
                                    }

                                    return (
                                        <Link
                                            key={`${label}-${index}`}
                                            href={link.url}
                                            only={['users', 'filters']}
                                            preserveState
                                            preserveScroll
                                            className={`rounded-md border px-3 py-1.5 text-sm transition ${link.active
                                                ? 'border-primary bg-primary text-primary-foreground'
                                                : 'border-border text-muted-foreground hover:bg-accent hover:text-foreground'
                                                }`}
                                        >
                                            {label}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                </div>
            </div>

            <Dialog open={isCreateOpen} onOpenChange={(open) => (open ? setIsCreateOpen(true) : closeCreateModal())}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Add New User</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleCreateSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="create-name" className="mb-1 block text-sm font-medium">
                                Name
                            </label>
                            <input
                                id="create-name"
                                type="text"
                                value={createForm.data.name}
                                onChange={(e) => createForm.setData('name', e.currentTarget.value)}
                                className="w-full rounded-md border px-3 py-2 text-sm outline-none transition focus:border-[#106b42]"
                                autoComplete="name"
                            />
                            <InputError message={createForm.errors.name} />
                        </div>

                        <div>
                            <label htmlFor="create-email" className="mb-1 block text-sm font-medium">
                                Email
                            </label>
                            <input
                                id="create-email"
                                type="email"
                                value={createForm.data.email}
                                onChange={(e) => createForm.setData('email', e.currentTarget.value)}
                                className="w-full rounded-md border px-3 py-2 text-sm outline-none transition focus:border-[#106b42]"
                                autoComplete="email"
                            />
                            <InputError message={createForm.errors.email} />
                        </div>

                        <div>
                            <label htmlFor="create-role" className="mb-1 block text-sm font-medium">
                                Role
                            </label>
                            <Select
                                value={createForm.data.role}
                                onValueChange={(value) => createForm.setData('role', value as Role)}
                            >
                                <SelectTrigger id="create-role" className="w-full">
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="mentor">Mentor</SelectItem>
                                    <SelectItem value="member">Member</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={createForm.errors.role} />
                        </div>

                        <div>
                            <label htmlFor="create-password" className="mb-1 block text-sm font-medium">
                                Password
                            </label>
                            <input
                                id="create-password"
                                type="password"
                                value={createForm.data.password}
                                onChange={(e) => createForm.setData('password', e.currentTarget.value)}
                                className="w-full rounded-md border px-3 py-2 text-sm outline-none transition focus:border-[#106b42]"
                                autoComplete="new-password"
                            />
                            <InputError message={createForm.errors.password} />
                        </div>

                        <div>
                            <label htmlFor="create-password-confirmation" className="mb-1 block text-sm font-medium">
                                Confirm Password
                            </label>
                            <input
                                id="create-password-confirmation"
                                type="password"
                                value={createForm.data.password_confirmation}
                                onChange={(e) =>
                                    createForm.setData('password_confirmation', e.currentTarget.value)
                                }
                                className="w-full rounded-md border px-3 py-2 text-sm outline-none transition focus:border-[#106b42]"
                                autoComplete="new-password"
                            />
                            <InputError message={createForm.errors.password_confirmation} />
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={closeCreateModal}>
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={createForm.processing}
                                className="bg-[#106b42] text-white hover:bg-[#0c5132]"
                            >
                                {createForm.processing ? 'Saving...' : 'Save'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={isEditOpen} onOpenChange={(open) => (open ? setIsEditOpen(true) : closeEditModal())}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit User</DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleEditSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="edit-name" className="mb-1 block text-sm font-medium">
                                Name
                            </label>
                            <input
                                id="edit-name"
                                type="text"
                                value={editForm.data.name}
                                onChange={(e) => editForm.setData('name', e.currentTarget.value)}
                                className="w-full rounded-md border px-3 py-2 text-sm outline-none transition focus:border-[#106b42]"
                                autoComplete="name"
                            />
                            <InputError message={editForm.errors.name} />
                        </div>

                        <div>
                            <label htmlFor="edit-email" className="mb-1 block text-sm font-medium">
                                Email
                            </label>
                            <input
                                id="edit-email"
                                type="email"
                                value={editForm.data.email}
                                onChange={(e) => editForm.setData('email', e.currentTarget.value)}
                                className="w-full rounded-md border px-3 py-2 text-sm outline-none transition focus:border-[#106b42]"
                                autoComplete="email"
                            />
                            <InputError message={editForm.errors.email} />
                        </div>

                        <div>
                            <label htmlFor="edit-role" className="mb-1 block text-sm font-medium">
                                Role
                            </label>
                            <Select
                                value={editForm.data.role}
                                onValueChange={(value) => editForm.setData('role', value as Role)}
                            >
                                <SelectTrigger id="edit-role" className="w-full">
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="mentor">Mentor</SelectItem>
                                    <SelectItem value="member">Member</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={editForm.errors.role} />
                        </div>

                        <div className="border-t pt-3">
                            <p className="mb-2 text-xs text-muted-foreground">
                                Leave password blank if you do not want to change it.
                            </p>

                            <label htmlFor="edit-password" className="mb-1 block text-sm font-medium">
                                New Password
                            </label>
                            <input
                                id="edit-password"
                                type="password"
                                value={editForm.data.password}
                                onChange={(e) => editForm.setData('password', e.currentTarget.value)}
                                className="w-full rounded-md border px-3 py-2 text-sm outline-none transition focus:border-[#106b42]"
                                autoComplete="new-password"
                            />
                            <InputError message={editForm.errors.password} />
                        </div>

                        <div>
                            <label htmlFor="edit-password-confirmation" className="mb-1 block text-sm font-medium">
                                Confirm New Password
                            </label>
                            <input
                                id="edit-password-confirmation"
                                type="password"
                                value={editForm.data.password_confirmation}
                                onChange={(e) =>
                                    editForm.setData('password_confirmation', e.currentTarget.value)
                                }
                                className="w-full rounded-md border px-3 py-2 text-sm outline-none transition focus:border-[#106b42]"
                                autoComplete="new-password"
                            />
                            <InputError message={editForm.errors.password_confirmation} />
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={closeEditModal}>
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={editForm.processing}
                                className="bg-[#106b42] text-white hover:bg-[#0c5132]"
                            >
                                {editForm.processing ? 'Updating...' : 'Update'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={isDeleteOpen} onOpenChange={(open) => (open ? setIsDeleteOpen(true) : closeDeleteModal())}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Delete User</DialogTitle>
                    </DialogHeader>

                    <p className="text-sm text-muted-foreground">
                        Are you sure you want to delete{' '}
                        <span className="font-semibold text-foreground">{selectedUser?.name}</span>? This
                        action cannot be undone.
                    </p>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={closeDeleteModal}>
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            disabled={isDeleting}
                            onClick={handleDelete}
                        >
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
