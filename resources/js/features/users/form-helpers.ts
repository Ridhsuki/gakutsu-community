import type {
    CreateUserForm,
    EditUserForm,
    User,
} from '@/features/users/types';

export function getDefaultCreateUserForm(): CreateUserForm {
    return {
        name: '',
        email: '',
        role: 'member',
        password: '',
        password_confirmation: '',
    };
}

export function getDefaultEditUserForm(): EditUserForm {
    return {
        name: '',
        email: '',
        role: 'member',
        password: '',
        password_confirmation: '',
    };
}

export function mapUserToEditUserForm(user: User): EditUserForm {
    return {
        name: user.name,
        email: user.email,
        role: user.role,
        password: '',
        password_confirmation: '',
    };
}
