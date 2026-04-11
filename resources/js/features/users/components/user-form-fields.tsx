import InputError from '@/components/input-error';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type {
    CreateUserForm,
    EditUserForm,
    UserRole,
} from '@/features/users/types';
import type { UserFormLike } from '@/features/users/form-types';

type UserFormData = CreateUserForm | EditUserForm;

interface UserFormFieldsProps<TForm extends UserFormData> {
    form: UserFormLike<TForm>;
    mode: 'create' | 'edit';
}

export default function UserFormFields<TForm extends UserFormData>({
    form,
    mode,
}: UserFormFieldsProps<TForm>) {
    return (
        <>
            <div>
                <label htmlFor={`${mode}-name`} className="mb-1 block text-sm font-medium">
                    Name
                </label>
                <input
                    id={`${mode}-name`}
                    type="text"
                    value={form.data.name}
                    onChange={(e) => form.setData('name', e.currentTarget.value as TForm['name'])}
                    className="w-full rounded-md border px-3 py-2 text-sm outline-none transition focus:border-[#106b42]"
                    autoComplete="name"
                />
                <InputError message={form.errors.name} />
            </div>

            <div>
                <label htmlFor={`${mode}-email`} className="mb-1 block text-sm font-medium">
                    Email
                </label>
                <input
                    id={`${mode}-email`}
                    type="email"
                    value={form.data.email}
                    onChange={(e) => form.setData('email', e.currentTarget.value as TForm['email'])}
                    className="w-full rounded-md border px-3 py-2 text-sm outline-none transition focus:border-[#106b42]"
                    autoComplete="email"
                />
                <InputError message={form.errors.email} />
            </div>

            <div>
                <label htmlFor={`${mode}-role`} className="mb-1 block text-sm font-medium">
                    Role
                </label>
                <Select
                    value={form.data.role}
                    onValueChange={(value) => form.setData('role', value as UserRole as TForm['role'])}
                >
                    <SelectTrigger id={`${mode}-role`} className="w-full">
                        <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="mentor">Mentor</SelectItem>
                        <SelectItem value="member">Member</SelectItem>
                    </SelectContent>
                </Select>
                <InputError message={form.errors.role} />
            </div>

            {mode === 'edit' ? (
                <div className="border-t pt-3">
                    <p className="mb-2 text-xs text-muted-foreground">
                        Leave password blank if you do not want to change it.
                    </p>

                    <label htmlFor={`${mode}-password`} className="mb-1 block text-sm font-medium">
                        New Password
                    </label>
                    <input
                        id={`${mode}-password`}
                        type="password"
                        value={form.data.password}
                        onChange={(e) =>
                            form.setData('password', e.currentTarget.value as TForm['password'])
                        }
                        className="w-full rounded-md border px-3 py-2 text-sm outline-none transition focus:border-[#106b42]"
                        autoComplete="new-password"
                    />
                    <InputError message={form.errors.password} />
                </div>
            ) : (
                <div>
                    <label htmlFor={`${mode}-password`} className="mb-1 block text-sm font-medium">
                        Password
                    </label>
                    <input
                        id={`${mode}-password`}
                        type="password"
                        value={form.data.password}
                        onChange={(e) =>
                            form.setData('password', e.currentTarget.value as TForm['password'])
                        }
                        className="w-full rounded-md border px-3 py-2 text-sm outline-none transition focus:border-[#106b42]"
                        autoComplete="new-password"
                    />
                    <InputError message={form.errors.password} />
                </div>
            )}

            <div>
                <label htmlFor={`${mode}-password-confirmation`} className="mb-1 block text-sm font-medium">
                    {mode === 'edit' ? 'Confirm New Password' : 'Confirm Password'}
                </label>
                <input
                    id={`${mode}-password-confirmation`}
                    type="password"
                    value={form.data.password_confirmation}
                    onChange={(e) =>
                        form.setData(
                            'password_confirmation',
                            e.currentTarget.value as TForm['password_confirmation'],
                        )
                    }
                    className="w-full rounded-md border px-3 py-2 text-sm outline-none transition focus:border-[#106b42]"
                    autoComplete="new-password"
                />
                <InputError message={form.errors.password_confirmation} />
            </div>
        </>
    );
}
