import type { EventSortField } from '@/features/events/types';

export const ADMIN_EVENTS_INDEX_URL = '/admin/events';
export const MENTOR_EVENTS_INDEX_URL = '/mentor/events';

export const EVENT_ALLOWED_SORT_FIELDS: readonly EventSortField[] = [
    'title',
    'category',
    'status',
    'starts_at',
    'created_at',
    'mentor',
];

export const EVENT_SORT_OPTIONS: ReadonlyArray<{
    value: EventSortField;
    label: string;
}> = [
    { value: 'starts_at', label: 'Start date' },
    { value: 'created_at', label: 'Created date' },
    { value: 'title', label: 'Title' },
    { value: 'category', label: 'Category' },
    { value: 'status', label: 'Status' },
    { value: 'mentor', label: 'Mentor' },
];

export const EVENT_STATUS_OPTIONS = [
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'completed', label: 'Completed' },
] as const;

export const EVENT_ACCESS_TYPE_OPTIONS = [
    { value: 'free', label: 'Free' },
    { value: 'paid', label: 'Paid' },
] as const;

export const EVENT_MEETING_PROVIDER_OPTIONS = [
    { value: 'google_meet', label: 'Google Meet' },
    { value: 'microsoft_teams', label: 'Microsoft Teams' },
    { value: 'zoom', label: 'Zoom' },
    { value: 'other', label: 'Other' },
] as const;

export const EVENT_REGISTRATION_QUESTION_TYPE_OPTIONS = [
    { value: 'short_text', label: 'Short Text' },
    { value: 'long_text', label: 'Long Text' },
    { value: 'select', label: 'Select' },
] as const;
