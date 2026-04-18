<?php

namespace App\Http\Controllers\Event;

use App\Actions\Events\StoreEventRegistrationAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Event\StoreEventRegistrationRequest;
use App\Models\Event;
use Illuminate\Http\RedirectResponse;

class EventRegistrationController extends Controller
{
    public function store(
        StoreEventRegistrationRequest $request,
        Event $event,
        StoreEventRegistrationAction $storeEventRegistrationAction,
    ): RedirectResponse {
        $storeEventRegistrationAction->handle(
            $event,
            $request->user(),
            $request->validated()['answers'] ?? [],
        );

        return redirect()
            ->route('events.show', $event->slug)
            ->with('success', 'You have been registered successfully.');
    }
}
