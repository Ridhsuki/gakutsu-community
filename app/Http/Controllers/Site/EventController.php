<?php

namespace App\Http\Controllers\Site;

use App\Enums\EventStatus;
use App\Http\Controllers\Controller;
use App\Models\Event;
use Inertia\Inertia;
use Inertia\Response;

class EventController extends Controller
{
    public function index(): Response
    {
        $upcomingEvents = Event::query()
            ->select(Event::indexColumns())
            ->with('mentor:id,name')
            ->published()
            ->where('status', EventStatus::Upcoming)
            ->orderBy('starts_at')
            ->paginate(9, pageName: 'upcoming_page')
            ->withQueryString();

        $archivedEvents = Event::query()
            ->select(Event::indexColumns())
            ->with('mentor:id,name')
            ->published()
            ->whereIn('status', [EventStatus::Completed, EventStatus::Cancelled])
            ->latest('starts_at')
            ->paginate(9, pageName: 'archive_page')
            ->withQueryString();

        return Inertia::render('events/index', [
            'upcomingEvents' => $upcomingEvents,
            'archivedEvents' => $archivedEvents,
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
            $alreadyRegistered || $isStaffViewer
        );

        return Inertia::render('events/show', [
            'event' => $event->load('mentor:id,name'),
            'alreadyRegistered' => $alreadyRegistered,
            'canViewMeetingLink' => $canViewMeetingLink,
            'questionCount' => $event->registrationQuestions()->active()->count(),
        ]);
    }

    public function register(Event $event): Response
    {
        abort_unless($event->registrationIsAvailable(), 404);

        $alreadyRegistered = $event->registrations()
            ->where('user_id', auth()->id())
            ->exists();

        if ($alreadyRegistered) {
            return Inertia::render('events/register', [
                'event' => $event->load('mentor:id,name'),
                'questions' => [],
                'alreadyRegistered' => true,
            ]);
        }

        $questions = $event->registrationQuestions()
            ->active()
            ->ordered()
            ->get();

        return Inertia::render('events/register', [
            'event' => $event->load('mentor:id,name'),
            'questions' => $questions,
            'alreadyRegistered' => false,
        ]);
    }
}
