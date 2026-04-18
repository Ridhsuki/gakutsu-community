<?php

namespace App\Http\Controllers\Mentor;

use App\Actions\Events\GetEventRegistrationIndexAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Event\EventRegistrationIndexRequest;
use App\Models\Event;
use Inertia\Inertia;
use Inertia\Response;

class EventRegistrationController extends Controller
{
    public function index(
        EventRegistrationIndexRequest $request,
        Event $event,
        GetEventRegistrationIndexAction $getEventRegistrationIndexAction,
    ): Response {
        $search = $request->validated()['search'] ?? null;

        return Inertia::render('mentor/events/registrations/index', [
            'event' => $event->load('mentor:id,name'),
            'registrations' => fn () => $getEventRegistrationIndexAction->handle($event, $search),
            'filters' => [
                'search' => $search,
            ],
        ]);
    }
}
