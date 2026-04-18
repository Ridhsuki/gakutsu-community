<?php

namespace App\Http\Controllers\Event;

use App\Enums\EventStatus;
use App\Http\Controllers\Controller;
use App\Models\Event;
use Inertia\Inertia;
use Inertia\Response;

class EventBrowseController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('events/index', [
            'events' => fn() => Event::query()
                ->select(Event::indexColumns())
                ->with('mentor:id,name')
                ->published()
                ->where('status', EventStatus::Upcoming)
                ->orderBy('starts_at')
                ->paginate(12)
                ->withQueryString(),
        ]);
    }

    public function show(Event $event): Response
    {
        abort_unless($event->is_published, 404);

        return Inertia::render('events/show', [
            'event' => $event->load('mentor:id,name'),
            'registrationQuestions' => $event->registrationQuestions()
                ->active()
                ->ordered()
                ->get(),
            'alreadyRegistered' => auth()->check()
                ? $event->registrations()->where('user_id', auth()->id())->exists()
                : false,
        ]);
    }
}
