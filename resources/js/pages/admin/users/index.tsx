import type { SyntheticEvent } from 'react';
import { useState } from 'react';
import { Head, router, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import type { PaginatedResponse } from '@/types/pagination';
import type { IndexFilters } from '@/types/filters';
import PaginationBar from '@/components/data-table/pagination-bar';
import IndexToolbar from '@/components/data-table/index-toolbar';
import useIndexFilters from '@/hooks/use-index-filters';
import { Plus } from 'lucide-react';
import UserTable from '@/features/users/components/user-table';
import UserCreateDialog from '@/features/users/components/user-create-dialog';
import UserEditDialog from '@/features/users/components/user-edit-dialog';
import UserDeleteDialog from '@/features/users/components/user-delete-dialog';
import {
    getDefaultCreateUserForm,
    getDefaultEditUserForm,
    mapUserToEditUserForm,
} from '@/features/users/form-helpers';
import type {
    User,
    UserSortField,
    CreateUserForm,
    EditUserForm,
} from '@/features/users/types';
import {
    USERS_INDEX_URL,
    USER_ALLOWED_SORT_FIELDS,
} from '@/features/users/constants';

interface PageProps {
    users: PaginatedResponse<User>;
    filters: IndexFilters<UserSortField>;
}

export default function UserIndex({ users, filters }: PageProps) {
    const { search, setSearch, sortField, sortDirection, isReloading, handleSort } =
        useIndexFilters<UserSortField>({
            endpoint: USERS_INDEX_URL,
            initialFilters: filters,
            allowedSortFields: USER_ALLOWED_SORT_FIELDS,
            only: ['users', 'filters'],
            debounceMs: 350,
        });

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const createForm = useForm<CreateUserForm>(getDefaultCreateUserForm());
    const editForm = useForm<EditUserForm>(getDefaultEditUserForm());

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
        editForm.setData(mapUserToEditUserForm(user));
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
                <IndexToolbar
                    title="User Management"
                    description="Manage administrator, mentor, and member accounts."
                    searchValue={search}
                    onSearchChange={setSearch}
                    searchPlaceholder="Search by name or email..."
                    actions={
                        <Button
                            type="button"
                            onClick={openCreateModal}
                            className="w-full bg-[#106b42] text-white hover:bg-[#0c5132] sm:w-auto"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Add User
                        </Button>
                    }
                    meta={
                        isReloading ? 'Refreshing data...' : `Total users: ${users.total}`
                    }
                />

                <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 text-card-foreground shadow-sm">
                    <UserTable
                        users={users.data}
                        sortField={sortField}
                        sortDirection={sortDirection}
                        onSort={handleSort}
                        onEdit={openEditModal}
                        onDelete={openDeleteModal}
                    />

                    <PaginationBar
                        links={users.links}
                        from={users.from}
                        to={users.to}
                        total={users.total}
                        lastPage={users.last_page}
                        only={['users', 'filters']}
                    />
                </div>
            </div>

            <UserCreateDialog
                open={isCreateOpen}
                onOpenChange={(open) => (open ? setIsCreateOpen(true) : closeCreateModal())}
                form={createForm}
                onSubmit={handleCreateSubmit}
            />

            <UserEditDialog
                open={isEditOpen}
                onOpenChange={(open) => (open ? setIsEditOpen(true) : closeEditModal())}
                form={editForm}
                onSubmit={handleEditSubmit}
            />

            <UserDeleteDialog
                open={isDeleteOpen}
                onOpenChange={(open) => (open ? setIsDeleteOpen(true) : closeDeleteModal())}
                user={selectedUser}
                isDeleting={isDeleting}
                onConfirm={handleDelete}
            />
        </>
    );
}
