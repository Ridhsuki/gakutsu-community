<?php

namespace App\Actions\EventQuiz;

use App\Models\EventQuizAnswer;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class GradeEventQuizAttemptAction
{
    public function handle(EventQuizAnswer $answer, int $graderId, int $score, ?string $feedback = null): void
    {
        if (! $answer->needs_manual_grading) {
            throw ValidationException::withMessages([
                'answer' => 'This answer does not require manual grading.',
            ]);
        }

        if ($score > $answer->question_points_snapshot) {
            throw ValidationException::withMessages([
                'awarded_score' => 'Score exceeds maximum points for this question.',
            ]);
        }

        DB::transaction(function () use ($answer, $graderId, $score, $feedback) {
            $answer->forceFill([
                'awarded_score' => $score,
                'feedback' => $feedback,
                'graded_by' => $graderId,
                'graded_at' => now(),
                'is_correct' => $score === $answer->question_points_snapshot,
            ])->save();

            $answer->attempt->refreshScores();
        });
    }
}
