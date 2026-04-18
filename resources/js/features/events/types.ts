export type EventRegistrationQuestionType = 'short_text' | 'long_text' | 'select';
export type EventStatus = 'upcoming' | 'cancelled' | 'completed';
export type EventAccessType = 'free' | 'paid';
export type EventSortField =
    | 'title'
    | 'category'
    | 'status'
    | 'starts_at'
    | 'created_at'
    | 'mentor';

export interface EventMentor {
    id: number;
    name: string;
}

export interface EventItem {
    id: number;
    created_by: number;
    mentor_id: number;
    title: string;
    slug: string;
    category: string;
    status: EventStatus;
    access_type: EventAccessType;
    is_published: boolean;
    is_registration_open: boolean;
    registration_closes_at: string | null;
    meeting_provider: string | null;
    meeting_url: string | null;
    poster_image_path: string | null;
    poster_image_url: string | null;
    starts_at: string;
    ends_at: string | null;
    description: string;
    created_at: string;
    mentor?: EventMentor | null;
}

export interface EventMentorOption {
    id: number;
    name: string;
}

export interface CreateEventForm {
    title: string;
    slug: string;
    mentor_id: string;
    category: string;
    description: string;
    starts_at: string;
    ends_at: string;
    registration_closes_at: string;
    meeting_provider: string;
    meeting_url: string;
    status: EventStatus;
    access_type: EventAccessType;
    is_published: boolean;
    is_registration_open: boolean;
    poster_image: File | null;
}

export interface EditEventForm extends CreateEventForm { }

export interface EventRegistrationItem {
    id: number;
    event_id: number;
    user_id: number;
    name_snapshot: string;
    email_snapshot: string;
    registered_at: string;
}

export interface EventRegistrationQuestionItem {
    id: number;
    event_id: number;
    label: string;
    type: EventRegistrationQuestionType;
    options: string[] | null;
    placeholder: string | null;
    help_text: string | null;
    is_required: boolean;
    is_active: boolean;
    sort_order: number;
    created_at?: string;
}

export interface CreateEventRegistrationQuestionForm {
    label: string;
    type: EventRegistrationQuestionType;
    options_text: string;
    placeholder: string;
    help_text: string;
    is_required: boolean;
    is_active: boolean;
    sort_order: string;
}

export interface EditEventRegistrationQuestionForm
    extends CreateEventRegistrationQuestionForm { }
