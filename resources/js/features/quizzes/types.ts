export type EventQuizQuestionType = 'multiple_choice' | 'short_text';
export type EventQuizAttemptStatus = 'submitted' | 'graded';

export interface EventQuizOptionItem {
    id: number;
    option_text: string;
    is_correct: boolean;
    sort_order: number;
}

export interface EventQuizQuestionItem {
    id: number;
    event_id: number;
    type: EventQuizQuestionType;
    prompt: string;
    points: number;
    is_active: boolean;
    sort_order: number;
    explanation?: string | null;
    options: EventQuizOptionItem[];
}

export interface EventQuizAnswerItem {
    id: number;
    question_prompt_snapshot: string;
    question_type_snapshot: EventQuizQuestionType;
    question_points_snapshot: number;
    option_text_snapshot?: string | null;
    answer_text?: string | null;
    needs_manual_grading: boolean;
    is_correct?: boolean | null;
    awarded_score: number;
    feedback?: string | null;
    graded_at?: string | null;
}

export interface EventQuizAttemptItem {
    id: number;
    event_id: number;
    user_id: number;
    status: EventQuizAttemptStatus;
    auto_score: number;
    manual_score: number;
    total_score: number;
    max_score: number;
    submitted_at?: string | null;
    graded_at?: string | null;
    user?: {
        id: number;
        name: string;
        email: string;
    } | null;
    answers?: EventQuizAnswerItem[];
}

export interface QuizEventSummary {
    id: number;
    title: string;
    slug: string;
    category: string;
    mentor?: {
        id: number;
        name: string;
    } | null;
}
