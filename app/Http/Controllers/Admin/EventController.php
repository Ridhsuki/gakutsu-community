<?php

namespace App\Http\Controllers\Admin;

use App\Actions\Events\DeleteEventAction;
use App\Actions\Events\GetEventDetailAction;
use App\Actions\Events\GetEventIndexAction;
use App\Actions\Events\StoreEventAction;
use App\Actions\Events\UpdateEventAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Event\EventIndexRequest;
use App\Http\Requests\Event\StoreEventRequest;
use App\Http\Requests\Event\UpdateEventRequest;
use App\Models\Event;
use App\Models\User;
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
        $status = $validated['status'] ?? null;
        $publication = $validated['publication'] ?? null;
        $accessType = $validated['access_type'] ?? null;

        return Inertia::render('admin/events/index', [
            'events' => fn() => $getEventIndexAction->handle(
                search: $search,
                sortField: $sortField,
                sortDirection: $sortDirection,
                status: $status,
                publication: $publication,
                accessType: $accessType,
            ),
            'filters' => [
                'search' => $search,
                'sort_field' => $sortField,
                'sort_direction' => $sortDirection,
                'status' => $status,
                'publication' => $publication,
                'access_type' => $accessType,
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('admin/events/create', [
            'mentors' => fn() => User::query()
                ->select(['id', 'name'])
                ->where('role', 'mentor')
                ->orderBy('name')
                ->get(),
        ]);
    }

    public function store(
        StoreEventRequest $request,
        StoreEventAction $storeEventAction,
    ): RedirectResponse {
        $event = $storeEventAction->handle($request);

        return redirect()
            ->route('admin.events.edit', $event)
            ->with('success', 'Event created successfully.');
    }

    public function show(
        Event $event,
        GetEventDetailAction $getEventDetailAction,
    ): Response {
        return Inertia::render('admin/events/show', [
            'event' => $getEventDetailAction->handle($event),
        ]);
    }

    public function edit(Event $event): Response
    {
        return Inertia::render('admin/events/edit', [
            'event' => $event->load([
                'mentor:id,name',
                'registrationQuestions' => fn($query) => $query->ordered(),
            ]),
            'mentors' => fn() => User::query()
                ->select(['id', 'name'])
                ->where('role', 'mentor')
                ->orderBy('name')
                ->get(),
        ]);
    }

    public function update(
        UpdateEventRequest $request,
        Event $event,
        UpdateEventAction $updateEventAction,
    ): RedirectResponse {
        $event = $updateEventAction->handle($request, $event);

        return redirect()
            ->route('admin.events.edit', $event)
            ->with('success', 'Event updated successfully.');
    }

    public function destroy(
        Event $event,
        DeleteEventAction $deleteEventAction,
    ): RedirectResponse {
        $this->authorize('delete', $event);

        $deleteEventAction->handle($event);

        return redirect()
            ->route('admin.events.index')
            ->with('success', 'Event deleted successfully.');
    }
}
