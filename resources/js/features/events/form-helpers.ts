import type {
    CreateEventForm,
    EditEventForm,
    EventItem,
} from '@/features/events/types';

function toDatetimeLocalValue(value: string | null): string {
    if (!value) return '';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return '';

    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    const hours = `${date.getHours()}`.padStart(2, '0');
    const minutes = `${date.getMinutes()}`.padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function getDefaultCreateEventForm(): CreateEventForm {
    return {
        title: '',
        slug: '',
        mentor_id: '',
        category: '',
        description: '',
        starts_at: '',
        ends_at: '',
        registration_closes_at: '',
        meeting_provider: '',
        meeting_url: '',
        status: 'upcoming',
        access_type: 'free',
        is_published: false,
        is_registration_open: true,
        poster_image: null,
    };
}

export function getDefaultEditEventForm(): EditEventForm {
    return getDefaultCreateEventForm();
}

export function mapEventToEditEventForm(event: EventItem): EditEventForm {
    return {
        title: event.title,
        slug: event.slug,
        mentor_id: event.mentor_id ? String(event.mentor_id) : '',
        category: event.category,
        description: event.description,
        starts_at: toDatetimeLocalValue(event.starts_at),
        ends_at: toDatetimeLocalValue(event.ends_at),
        registration_closes_at: toDatetimeLocalValue(event.registration_closes_at),
        meeting_provider: event.meeting_provider ?? '',
        meeting_url: event.meeting_url ?? '',
        status: event.status,
        access_type: event.access_type,
        is_published: event.is_published,
        is_registration_open: event.is_registration_open,
        poster_image: null,
    };
}
