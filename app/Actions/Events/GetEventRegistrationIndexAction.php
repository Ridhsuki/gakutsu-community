<?php

namespace App\Actions\Events;

use App\Models\Event;
use App\Models\EventRegistration;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class GetEventRegistrationIndexAction
{
    public function handle(Event $event, ?string $search = null): LengthAwarePaginator
    {
        return EventRegistration::query()
            ->where('event_id', $event->id)
            ->with('user:id,name,email')
            ->withCount('answers')
            ->search($search)
            ->orderByDesc('registered_at')
            ->paginate(10)
            ->withQueryString();
    }
}
