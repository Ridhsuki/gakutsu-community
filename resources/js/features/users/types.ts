export type UserRole = 'admin' | 'mentor' | 'member';

export type UserSortField = 'name' | 'email' | 'role' | 'created_at';

export interface User {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    created_at?: string;
}

export interface CreateUserForm {
    name: string;
    email: string;
    role: UserRole;
    password: string;
    password_confirmation: string;
}

export interface EditUserForm {
    name: string;
    email: string;
    role: UserRole;
    password: string;
    password_confirmation: string;
}
