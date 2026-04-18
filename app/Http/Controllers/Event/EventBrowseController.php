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
            'events' => fn () => Event::query()
                ->select(Event::indexColumns())
                ->with('mentor:id,name')
                ->published()
                ->whereIn('status', [
                    EventStatus::Upcoming,
                    EventStatus::Completed,
                    EventStatus::Cancelled,
                ])
                ->orderByRaw("
                    CASE
                        WHEN status = 'upcoming' THEN 1
                        WHEN status = 'completed' THEN 2
                        WHEN status = 'cancelled' THEN 3
                        ELSE 4
                    END
                ")
                ->orderBy('starts_at')
                ->paginate(12)
                ->withQueryString(),
        ]);
    }

    public function show(Event $event): Response
    {
        abort_unless($event->is_published, 404);

        $isStaffViewer = auth()->check() && (
            auth()->user()->isAdmin() ||
            (auth()->user()->isMentor() && $event->mentor_id === auth()->id())
        );

        if (! $isStaffViewer && $event->status !== EventStatus::Upcoming) {
            abort(404);
        }

        $alreadyRegistered = auth()->check()
            ? $event->registrations()->where('user_id', auth()->id())->exists()
            : false;

        $canViewMeetingLink = auth()->check() && (
            $alreadyRegistered ||
            $isStaffViewer
        );

        return Inertia::render('events/show', [
            'event' => $event->load('mentor:id,name'),
            'registrationQuestions' => $event->registrationQuestions()
                ->active()
                ->ordered()
                ->get(),
            'alreadyRegistered' => $alreadyRegistered,
            'canViewMeetingLink' => $canViewMeetingLink,
        ]);
    }
}
