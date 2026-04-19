import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    EVENT_ACCESS_TYPE_OPTIONS,
    EVENT_MEETING_PROVIDER_OPTIONS,
    EVENT_STATUS_OPTIONS,
} from '@/features/events/constants';
import type { EventMentorOption } from '@/features/events/types';

interface EventFormLike {
    data: {
        title: string;
        mentor_id: string;
        category: string;
        description: string;
        starts_at: string;
        ends_at: string;
        registration_closes_at: string;
        meeting_provider: string;
        meeting_url: string;
        status: string;
        access_type: string;
        is_published: boolean;
        poster_image: File | null;
    };
    setData: (key: string, value: unknown) => void;
    errors: Record<string, string>;
    processing: boolean;
}

interface EventFormFieldsProps {
    form: EventFormLike;
    mentors?: EventMentorOption[];
    canAssignMentor?: boolean;
}

export default function EventFormFields({
    form,
    mentors = [],
    canAssignMentor = false,
}: EventFormFieldsProps) {
    return (
        <div className="grid gap-4">
            <div className="grid gap-2">
                <label className="text-sm font-medium">Title</label>
                <Input
                    value={form.data.title}
                    onChange={(e) => form.setData('title', e.currentTarget.value)}
                />
                <p className="text-xs text-muted-foreground">
                    Slug will be generated automatically from the title.
                </p>
                {form.errors.title ? <p className="text-sm text-red-600">{form.errors.title}</p> : null}
            </div>

            {canAssignMentor ? (
                <div className="grid gap-2">
                    <label className="text-sm font-medium">Mentor</label>
                    <Select
                        value={form.data.mentor_id}
                        onValueChange={(value) => form.setData('mentor_id', value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select mentor" />
                        </SelectTrigger>
                        <SelectContent>
                            {mentors.map((mentor) => (
                                <SelectItem key={mentor.id} value={String(mentor.id)}>
                                    {mentor.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {form.errors.mentor_id ? <p className="text-sm text-red-600">{form.errors.mentor_id}</p> : null}
                </div>
            ) : null}

            <div className="grid gap-2">
                <label className="text-sm font-medium">Category</label>
                <Input
                    value={form.data.category}
                    onChange={(e) => form.setData('category', e.currentTarget.value)}
                />
                {form.errors.category ? <p className="text-sm text-red-600">{form.errors.category}</p> : null}
            </div>

            <div className="grid gap-2">
                <label className="text-sm font-medium">Description</label>
                <textarea
                    value={form.data.description}
                    onChange={(e) => form.setData('description', e.currentTarget.value)}
                    className="min-h-32 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
                {form.errors.description ? <p className="text-sm text-red-600">{form.errors.description}</p> : null}
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="grid gap-2">
                    <label className="text-sm font-medium">Start Date</label>
                    <Input
                        type="datetime-local"
                        value={form.data.starts_at}
                        onChange={(e) => form.setData('starts_at', e.currentTarget.value)}
                    />
                    {form.errors.starts_at ? <p className="text-sm text-red-600">{form.errors.starts_at}</p> : null}
                </div>

                <div className="grid gap-2">
                    <label className="text-sm font-medium">End Date</label>
                    <Input
                        type="datetime-local"
                        value={form.data.ends_at}
                        onChange={(e) => form.setData('ends_at', e.currentTarget.value)}
                    />
                    {form.errors.ends_at ? <p className="text-sm text-red-600">{form.errors.ends_at}</p> : null}
                </div>
            </div>

            <div className="grid gap-2">
                <label className="text-sm font-medium">Registration Closes At</label>
                <Input
                    type="datetime-local"
                    value={form.data.registration_closes_at}
                    onChange={(e) => form.setData('registration_closes_at', e.currentTarget.value)}
                />
                {form.errors.registration_closes_at ? <p className="text-sm text-red-600">{form.errors.registration_closes_at}</p> : null}
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="grid gap-2">
                    <label className="text-sm font-medium">Status</label>
                    <Select
                        value={form.data.status}
                        onValueChange={(value) => form.setData('status', value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            {EVENT_STATUS_OPTIONS.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid gap-2">
                    <label className="text-sm font-medium">Access Type</label>
                    <Select
                        value={form.data.access_type}
                        onValueChange={(value) => form.setData('access_type', value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select access type" />
                        </SelectTrigger>
                        <SelectContent>
                            {EVENT_ACCESS_TYPE_OPTIONS.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid gap-2">
                    <label className="text-sm font-medium">Meeting Provider</label>
                    <Select
                        value={form.data.meeting_provider}
                        onValueChange={(value) => form.setData('meeting_provider', value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select provider" />
                        </SelectTrigger>
                        <SelectContent>
                            {EVENT_MEETING_PROVIDER_OPTIONS.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid gap-2">
                <label className="text-sm font-medium">Meeting URL</label>
                <Input
                    value={form.data.meeting_url}
                    onChange={(e) => form.setData('meeting_url', e.currentTarget.value)}
                />
                {form.errors.meeting_url ? <p className="text-sm text-red-600">{form.errors.meeting_url}</p> : null}
            </div>

            <div className="grid gap-2">
                <label className="text-sm font-medium">Poster</label>
                <Input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp"
                    onChange={(e) => form.setData('poster_image', e.currentTarget.files?.[0] ?? null)}
                />
                {form.errors.poster_image ? <p className="text-sm text-red-600">{form.errors.poster_image}</p> : null}
            </div>

            <div className="grid gap-3">
                <label className="flex items-center gap-2 text-sm font-medium">
                    <Checkbox
                        checked={form.data.is_published}
                        onCheckedChange={(checked) => form.setData('is_published', Boolean(checked))}
                    />
                    Published
                </label>
            </div>
        </div>
    );
}
