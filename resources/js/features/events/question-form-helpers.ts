import type {
    CreateEventRegistrationQuestionForm,
    EditEventRegistrationQuestionForm,
    EventRegistrationQuestionItem,
} from '@/features/events/types';

export function getDefaultCreateEventRegistrationQuestionForm(): CreateEventRegistrationQuestionForm {
    return {
        label: '',
        type: 'short_text',
        options_text: '',
        placeholder: '',
        help_text: '',
        is_required: false,
        is_active: true,
        sort_order: '',
    };
}

export function getDefaultEditEventRegistrationQuestionForm(): EditEventRegistrationQuestionForm {
    return getDefaultCreateEventRegistrationQuestionForm();
}

export function mapQuestionToEditForm(
    question: EventRegistrationQuestionItem,
): EditEventRegistrationQuestionForm {
    return {
        label: question.label,
        type: question.type,
        options_text: Array.isArray(question.options) ? question.options.join('\n') : '',
        placeholder: question.placeholder ?? '',
        help_text: question.help_text ?? '',
        is_required: question.is_required,
        is_active: question.is_active,
        sort_order: String(question.sort_order),
    };
}
