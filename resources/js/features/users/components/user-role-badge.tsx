import { Badge } from '@/components/ui/badge';
import type { UserRole } from '@/features/users/types';

interface UserRoleBadgeProps {
    role: UserRole;
}

const roleConfig: Record<UserRole | 'member', { label: string; className: string }> = {
    admin: {
        label: 'Admin',
        className: [
            'inline-flex items-center px-2.5 py-0.5',
            'text-[11px] font-medium tracking-wide',
            'rounded-full border',
            'bg-red-500/10 border-red-500/20 text-red-500',
            'backdrop-blur-sm',
            'dark:bg-red-500/10 dark:border-red-400/20 dark:text-red-400',
        ].join(' '),
    },
    mentor: {
        label: 'Mentor',
        className: [
            'inline-flex items-center px-2.5 py-0.5',
            'text-[11px] font-medium tracking-wide',
            'rounded-full border',
            'bg-blue-500/10 border-blue-500/20 text-blue-500',
            'backdrop-blur-sm',
            'dark:bg-blue-500/10 dark:border-blue-400/20 dark:text-blue-400',
        ].join(' '),
    },
    member: {
        label: 'Member',
        className: [
            'inline-flex items-center px-2.5 py-0.5',
            'text-[11px] font-medium tracking-wide',
            'rounded-full border',
            'bg-slate-500/10 border-slate-500/20 text-slate-500',
            'backdrop-blur-sm',
            'dark:bg-slate-400/10 dark:border-slate-400/20 dark:text-slate-400',
        ].join(' '),
    },
};

export default function UserRoleBadge({ role }: UserRoleBadgeProps) {
    const config = roleConfig[role] ?? roleConfig.member;

    return (
        <Badge className={config.className}>
            {config.label}
        </Badge>
    );
}
