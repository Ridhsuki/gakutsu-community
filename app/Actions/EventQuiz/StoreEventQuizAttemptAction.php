<?php

namespace App\Actions\EventQuiz;

use App\Enums\EventQuizAttemptStatus;
use App\Enums\EventQuizQuestionType;
use App\Models\Event;
use App\Models\EventQuizAttempt;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class StoreEventQuizAttemptAction
{
    public function handle(Event $event, int $userId, array $answers): EventQuizAttempt
    {
        $registration = $event->registrations()
            ->where('user_id', $userId)
            ->first();

        if (! $registration) {
            throw ValidationException::withMessages([
                'quiz' => 'You must register for the event before taking the quiz.',
            ]);
        }

        if (! $event->quizIsAvailable()) {
            throw ValidationException::withMessages([
                'quiz' => 'Quiz is not available for this event.',
            ]);
        }

        if ($event->quizAttempts()->where('user_id', $userId)->exists()) {
            throw ValidationException::withMessages([
                'quiz' => 'You have already submitted this quiz.',
            ]);
        }

        $questions = $event->quizQuestions()
            ->active()
            ->ordered()
            ->with('options')
            ->get();

        return DB::transaction(function () use ($event, $userId, $registration, $questions, $answers) {
            $attempt = EventQuizAttempt::create([
                'event_id' => $event->id,
                'event_registration_id' => $registration->id,
                'user_id' => $userId,
                'status' => EventQuizAttemptStatus::Submitted,
                'submitted_at' => now(),
            ]);

            foreach ($questions as $question) {
                $submitted = $answers[$question->id] ?? null;

                if ($question->type === EventQuizQuestionType::MultipleChoice) {
                    $option = $question->options->firstWhere('id', (int) $submitted);

                    if (! $option) {
                        throw ValidationException::withMessages([
                            "answers.{$question->id}" => 'Invalid selected option.',
                        ]);
                    }

                    $isCorrect = (bool) $option->is_correct;
                    $awardedScore = $isCorrect ? (int) $question->points : 0;

                    $attempt->answers()->create([
                        'event_quiz_question_id' => $question->id,
                        'event_quiz_option_id' => $option->id,
                        'question_prompt_snapshot' => $question->prompt,
                        'question_type_snapshot' => $question->type->value,
                        'question_points_snapshot' => $question->points,
                        'option_text_snapshot' => $option->option_text,
                        'answer_text' => null,
                        'needs_manual_grading' => false,
                        'is_correct' => $isCorrect,
                        'awarded_score' => $awardedScore,
                    ]);

                    continue;
                }

                $attempt->answers()->create([
                    'event_quiz_question_id' => $question->id,
                    'question_prompt_snapshot' => $question->prompt,
                    'question_type_snapshot' => $question->type->value,
                    'question_points_snapshot' => $question->points,
                    'answer_text' => is_string($submitted) ? trim($submitted) : '',
                    'needs_manual_grading' => true,
                    'is_correct' => null,
                    'awarded_score' => 0,
                ]);
            }

            $attempt->refreshScores();

            return $attempt->fresh(['answers']);
        });
    }
}
