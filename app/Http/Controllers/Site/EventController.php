<?php

namespace App\Http\Controllers\Site;

use App\Enums\EventStatus;
use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Support\SeoMetadata;
use App\Support\SeoPolicy;
use App\Support\StructuredData;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class EventController extends Controller
{
    public function index(Request $request): Response
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
            'seo' => SeoMetadata::build($request, [
                'title' => 'Events',
                'description' => 'Jelajahi webinar dan event komunitas IT dan Cyber Security dari Gakutsu, termasuk event mendatang dan arsip kegiatan.',
            ]),
        ]);
    }

    public function show(Request $request, Event $event): Response
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

        $policyData = app(SeoPolicy::class)->resolve($request);
        $canonicalUrl = $policyData['canonicalUrl'];
        $baseUrl = $policyData['baseUrl'] ?? (string) config('app.url', 'https://gakutsu.net');

        $description = Str::limit(strip_tags($event->description ?? ''), 155, '');

        $graph = null;
        if ($canonicalUrl !== null && $baseUrl !== null) {
            $cleanBaseUrl = rtrim($baseUrl, '/');
            $breadcrumbItems = [
                ['name' => 'Home', 'url' => "{$cleanBaseUrl}/"],
                ['name' => 'Events', 'url' => "{$cleanBaseUrl}/events"],
                ['name' => $event->title, 'url' => $canonicalUrl],
            ];

            $breadcrumb = StructuredData::createBreadcrumbListSchema($breadcrumbItems, $canonicalUrl);
            if ($breadcrumb !== null) {
                $graph = [$breadcrumb];
            }
        }

        return Inertia::render('events/show', [
            'event' => $event->load('mentor:id,name')->toPublicArray(),
            'alreadyRegistered' => $alreadyRegistered,
            'canViewMeetingLink' => $canViewMeetingLink,
            'meetingUrl' => $canViewMeetingLink ? $event->meeting_url : null,
            'questionCount' => $event->registrationQuestions()->active()->count(),
            'seo' => SeoMetadata::build($request, [
                'title' => $event->title,
                'description' => $description,
                'image' => $event->poster_image_url,
                'jsonLdGraph' => $graph,
            ], $policyData),
        ]);
    }

    public function register(Request $request, Event $event): Response
    {
        abort_unless($event->registrationIsAvailable(), 404);

        $alreadyRegistered = $event->registrations()
            ->where('user_id', auth()->id())
            ->exists();

        $publicEvent = $event->load('mentor:id,name')->toPublicArray();

        $seo = SeoMetadata::build($request, [
            'title' => "Daftar Event - {$event->title}",
            'description' => "Jawab pertanyaan registrasi dan daftar ke event {$event->title} di Gakutsu.",
        ]);

        if ($alreadyRegistered) {
            return Inertia::render('events/register', [
                'event' => $publicEvent,
                'questions' => [],
                'alreadyRegistered' => true,
                'seo' => $seo,
            ]);
        }

        $questions = $event->registrationQuestions()
            ->active()
            ->ordered()
            ->get();

        return Inertia::render('events/register', [
            'event' => $publicEvent,
            'questions' => $questions,
            'alreadyRegistered' => false,
            'seo' => $seo,
        ]);
    }
}
