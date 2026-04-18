<?php

namespace App\Actions\Events;

use App\Models\EventRegistration;

class GetEventRegistrationDetailAction
{
    public function handle(EventRegistration $registration): EventRegistration
    {
        return $registration->load([
            'event:id,title,slug,mentor_id',
            'event.mentor:id,name',
            'user:id,name,email',
            'answers' => fn($query) => $query
                ->with('question:id,label,type')
                ->orderBy('id'),
        ])->loadCount('answers');
    }
}
