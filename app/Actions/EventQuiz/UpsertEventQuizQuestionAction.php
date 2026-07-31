<?php

namespace App\Actions\EventQuiz;

use App\Enums\EventQuizQuestionType;
use App\Models\Event;
use App\Models\EventQuizQuestion;
use Illuminate\Support\Facades\DB;

class UpsertEventQuizQuestionAction
{
    public function handle(Event $event, array $data, ?EventQuizQuestion $question = null): EventQuizQuestion
    {
        return DB::transaction(function () use ($event, $data, $question) {
            $question ??= new EventQuizQuestion;

            $question->fill([
                'event_id' => $event->id,
                'type' => $data['type'],
                'prompt' => $data['prompt'],
                'points' => $data['points'],
                'is_active' => $data['is_active'],
                'sort_order' => $data['sort_order'] ?? 0,
                'explanation' => $data['explanation'] ?? null,
            ]);

            $question->event()->associate($event);
            $question->save();

            if ($question->type === EventQuizQuestionType::MultipleChoice) {
                $question->options()->delete();

                foreach ($data['options'] ?? [] as $index => $option) {
                    $question->options()->create([
                        'option_text' => $option['option_text'],
                        'is_correct' => (bool) $option['is_correct'],
                        'sort_order' => $option['sort_order'] ?? $index,
                    ]);
                }
            } else {
                $question->options()->delete();
            }

            return $question->fresh(['options']);
        });
    }
}
