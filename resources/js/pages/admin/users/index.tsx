import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, PencilLine, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { destroy } from '@/actions/App/Http/Controllers/Admin/UserController';

export default function Index({ users }: { users: any }) {
    const [userToDelete, setUserToDelete] = useState<any>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const handleDelete = () => {
        if (!userToDelete) return;

        router.delete(destroy.url(userToDelete.id), {
            onSuccess: () => {
                setIsDeleteDialogOpen(false);
                setUserToDelete(null);
            }
        });
    };

    return (
        <>
            <Head title="User Management" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4 lg:p-6">
                <div className="flex items-center justify-between mb-2">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">User Management</h1>
                        <p className="text-sm text-gray-500">Manage community members, mentors, and administrators.</p>
                    </div>
                    <Button asChild className="bg-[#106b42] hover:bg-[#0d5a38] text-white">
                        <Link href="/admin/users/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Tambah User
                        </Link>
                    </Button>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden dark:bg-gray-950 dark:border-gray-800">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200 dark:bg-gray-900 dark:border-gray-800 dark:text-gray-400">
                                <tr>
                                    <th className="px-6 py-4">Name</th>
                                    <th className="px-6 py-4">Email</th>
                                    <th className="px-6 py-4">Role</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                                {users.data.map((user: any) => (
                                    <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">{user.name}</td>
                                        <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{user.email}</td>
                                        <td className="px-6 py-4">
                                            <Badge variant={user.role === 'admin' ? 'default' : user.role === 'mentor' ? 'secondary' : 'outline'}
                                                className={user.role === 'admin' ? 'bg-[#106b42] hover:bg-[#0d5a38] text-white' : ''}>
                                                {user.role}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button asChild variant="ghost" size="icon" className="h-8 w-8 text-[#106b42] hover:text-[#0d5a38] hover:bg-[#106b42]/10">
                                                    <Link href={`/admin/users/${user.id}/edit`}>
                                                        <PencilLine className="h-4 w-4" />
                                                    </Link>
                                                </Button>

                                                <Dialog open={isDeleteDialogOpen && userToDelete?.id === user.id} onOpenChange={(open) => {
                                                    setIsDeleteDialogOpen(open);
                                                    if (open) setUserToDelete(user);
                                                }}>
                                                    <DialogTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950">
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>Delete User</DialogTitle>
                                                            <DialogDescription>
                                                                Are you sure you want to delete <strong>{user.name}</strong>? This action cannot be undone.
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <DialogFooter className="gap-2 sm:gap-0">
                                                            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
                                                            <Button variant="destructive" onClick={handleDelete}>Delete User</Button>
                                                        </DialogFooter>
                                                    </DialogContent>
                                                </Dialog>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {users.data.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                            No users found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}
