<?php

namespace App\Http\Controllers\Mentor;

use App\Actions\Events\DeleteEventAction;
use App\Actions\Events\GetEventIndexAction;
use App\Actions\Events\StoreEventAction;
use App\Actions\Events\UpdateEventAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Event\EventIndexRequest;
use App\Http\Requests\Event\StoreEventRequest;
use App\Http\Requests\Event\UpdateEventRequest;
use App\Models\Event;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class EventController extends Controller
{
    use AuthorizesRequests;

    public function index(
        EventIndexRequest $request,
        GetEventIndexAction $getEventIndexAction,
    ): Response {
        $validated = $request->validated();

        $search = $validated['search'] ?? null;
        $sortField = $validated['sort_field'] ?? 'starts_at';
        $sortDirection = $validated['sort_direction'] ?? 'desc';

        return Inertia::render('mentor/events/index', [
            'events' => fn() => $getEventIndexAction->handle(
                search: $search,
                sortField: $sortField,
                sortDirection: $sortDirection,
                mentorId: $request->user()->id,
            ),
            'filters' => [
                'search' => $search,
                'sort_field' => $sortField,
                'sort_direction' => $sortDirection,
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('mentor/events/create');
    }

    public function store(
        StoreEventRequest $request,
        StoreEventAction $storeEventAction,
    ): RedirectResponse {
        $event = $storeEventAction->handle($request);

        return redirect()
            ->route('mentor.events.edit', $event)
            ->with('success', 'Event created successfully.');
    }

    public function show(Event $event): Response
    {
        $this->authorize('view', $event);

        return Inertia::render('mentor/events/show', [
            'event' => $event->load([
                'mentor:id,name',
                'registrationQuestions' => fn($query) => $query->ordered()->limit(5),
                'registrations' => fn($query) => $query->latest('registered_at')->limit(5),
            ])->loadCount([
                        'registrations',
                        'registrationQuestions',
                    ]),
        ]);
    }

    public function edit(Event $event): Response
    {
        $this->authorize('update', $event);

        return Inertia::render('mentor/events/edit', [
            'event' => $event->load([
                'mentor:id,name',
                'registrationQuestions' => fn($query) => $query->ordered(),
            ]),
        ]);
    }

    public function update(
        UpdateEventRequest $request,
        Event $event,
        UpdateEventAction $updateEventAction,
    ): RedirectResponse {
        $event = $updateEventAction->handle($request, $event);

        return redirect()
            ->route('mentor.events.edit', $event)
            ->with('success', 'Event updated successfully.');
    }

    public function destroy(
        Event $event,
        DeleteEventAction $deleteEventAction,
    ): RedirectResponse {
        $this->authorize('delete', $event);

        $deleteEventAction->handle($event);

        return redirect()
            ->route('mentor.events.index')
            ->with('success', 'Event deleted successfully.');
    }
}
