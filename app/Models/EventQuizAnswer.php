<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'event_quiz_attempt_id',
    'event_quiz_question_id',
    'event_quiz_option_id',
    'question_prompt_snapshot',
    'question_type_snapshot',
    'question_points_snapshot',
    'option_text_snapshot',
    'answer_text',
    'needs_manual_grading',
    'is_correct',
    'awarded_score',
    'feedback',
    'graded_by',
    'graded_at',
])]
class EventQuizAnswer extends Model
{
    protected function casts(): array
    {
        return [
            'needs_manual_grading' => 'boolean',
            'is_correct' => 'boolean',
            'graded_at' => 'datetime',
        ];
    }

    public function attempt(): BelongsTo
    {
        return $this->belongsTo(EventQuizAttempt::class, 'event_quiz_attempt_id');
    }

    public function question(): BelongsTo
    {
        return $this->belongsTo(EventQuizQuestion::class, 'event_quiz_question_id');
    }

    public function option(): BelongsTo
    {
        return $this->belongsTo(EventQuizOption::class, 'event_quiz_option_id');
    }

    public function grader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'graded_by');
    }
}
