import type { UserSortField } from '@/features/users/types';
export const USERS_INDEX_URL = '/admin/users';
export const USER_ALLOWED_SORT_FIELDS: readonly UserSortField[] = [
    'name',
    'email',
    'role',
    'created_at',
];
