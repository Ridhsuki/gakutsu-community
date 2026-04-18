<?php

namespace App\Actions\Events;

use App\Http\Requests\Event\UpdateEventRegistrationQuestionRequest;
use App\Models\EventRegistrationQuestion;

class UpdateEventRegistrationQuestionAction
{
    public function handle(
        EventRegistrationQuestion $question,
        UpdateEventRegistrationQuestionRequest $request,
    ): EventRegistrationQuestion {
        $data = $request->validated();

        $question->update([
            'label' => $data['label'],
            'type' => $data['type'],
            'options' => $data['type'] === 'select' ? ($data['options'] ?? []) : null,
            'placeholder' => $data['placeholder'] ?? null,
            'help_text' => $data['help_text'] ?? null,
            'is_required' => $data['is_required'],
            'is_active' => $data['is_active'],
            'sort_order' => $data['sort_order'] ?? $question->sort_order,
        ]);

        return $question->refresh();
    }
}
