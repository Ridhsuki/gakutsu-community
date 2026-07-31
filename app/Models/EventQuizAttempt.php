<?php

namespace App\Models;

use App\Enums\EventQuizAttemptStatus;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable([
    'event_id',
    'event_registration_id',
    'user_id',
    'status',
    'auto_score',
    'manual_score',
    'total_score',
    'max_score',
    'submitted_at',
    'graded_at',
])]
class EventQuizAttempt extends Model
{
    protected function casts(): array
    {
        return [
            'status' => EventQuizAttemptStatus::class,
            'submitted_at' => 'datetime',
            'graded_at' => 'datetime',
        ];
    }

    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }

    public function registration(): BelongsTo
    {
        return $this->belongsTo(EventRegistration::class, 'event_registration_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function answers(): HasMany
    {
        return $this->hasMany(EventQuizAnswer::class);
    }

    public function refreshScores(): void
    {
        $auto = (int) $this->answers()
            ->where('needs_manual_grading', false)
            ->sum('awarded_score');

        $manual = (int) $this->answers()
            ->where('needs_manual_grading', true)
            ->sum('awarded_score');

        $max = (int) $this->answers()->sum('question_points_snapshot');

        $allManualGraded = ! $this->answers()
            ->where('needs_manual_grading', true)
            ->whereNull('graded_at')
            ->exists();

        $this->forceFill([
            'auto_score' => $auto,
            'manual_score' => $manual,
            'total_score' => $auto + $manual,
            'max_score' => $max,
            'status' => $allManualGraded
                ? EventQuizAttemptStatus::Graded
                : EventQuizAttemptStatus::Submitted,
            'graded_at' => $allManualGraded ? now() : null,
        ])->save();
    }
}
