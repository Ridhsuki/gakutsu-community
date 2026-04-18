<?php

namespace App\Http\Controllers\Mentor;

use App\Actions\Events\GetEventRegistrationDetailAction;
use App\Actions\Events\GetEventRegistrationIndexAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Event\EventRegistrationIndexRequest;
use App\Models\Event;
use App\Models\EventRegistration;
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

    public function show(
        Event $event,
        EventRegistration $registration,
        GetEventRegistrationDetailAction $getEventRegistrationDetailAction,
    ): Response {
        $this->authorize('viewRegistrations', $event);
        abort_unless($registration->event_id === $event->id, 404);

        return Inertia::render('mentor/events/registrations/show', [
            'event' => $event->load('mentor:id,name'),
            'registration' => $getEventRegistrationDetailAction->handle($registration),
        ]);
    }
}
