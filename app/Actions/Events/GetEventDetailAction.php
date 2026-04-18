<?php

namespace App\Actions\Events;

use App\Models\Event;

class GetEventDetailAction
{
    public function handle(Event $event): Event
    {
        return $event->load([
            'mentor:id,name',
            'registrationQuestions' => fn ($query) => $query->ordered(),
            'registrations' => fn ($query) => $query
                ->latest('registered_at')
                ->withCount('answers')
                ->limit(5),
        ])->loadCount([
            'registrations',
            'registrationQuestions',
        ]);
    }
}
