<?php

namespace App\Actions\Events;

use App\Http\Requests\Event\StoreEventRegistrationQuestionRequest;
use App\Models\Event;
use App\Models\EventRegistrationQuestion;

class StoreEventRegistrationQuestionAction
{
    public function handle(
        Event $event,
        StoreEventRegistrationQuestionRequest $request,
    ): EventRegistrationQuestion {
        $data = $request->validated();

        $sortOrder = $data['sort_order'] ?? (
            (int) $event->registrationQuestions()->max('sort_order') + 1
        );

        return EventRegistrationQuestion::create([
            'event_id' => $event->id,
            'label' => $data['label'],
            'type' => $data['type'],
            'options' => $data['type'] === 'select' ? ($data['options'] ?? []) : null,
            'placeholder' => $data['placeholder'] ?? null,
            'help_text' => $data['help_text'] ?? null,
            'is_required' => $data['is_required'],
            'is_active' => $data['is_active'],
            'sort_order' => $sortOrder,
        ]);
    }
}
