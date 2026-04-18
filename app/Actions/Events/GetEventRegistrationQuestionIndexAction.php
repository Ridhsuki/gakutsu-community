<?php

namespace App\Actions\Events;

use App\Models\Event;
use App\Models\EventRegistrationQuestion;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class GetEventRegistrationQuestionIndexAction
{
    public function handle(Event $event, ?string $search = null): LengthAwarePaginator
    {
        return EventRegistrationQuestion::query()
            ->where('event_id', $event->id)
            ->search($search)
            ->ordered()
            ->paginate(10)
            ->withQueryString();
    }
}
