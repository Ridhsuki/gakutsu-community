<?php

namespace App\Http\Controllers\Site;

use App\Enums\EventStatus;
use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use App\Models\Event;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Fortify\Features;

class HomeController extends Controller
{
    public function index(): Response
    {
        $featuredEvents = Event::query()
            ->select(Event::indexColumns())
            ->with('mentor:id,name')
            ->published()
            ->where('status', EventStatus::Upcoming)
            ->orderBy('starts_at')
            ->limit(3)
            ->get();

        $latestBlogs = BlogPost::query()
            ->select(BlogPost::indexColumns())
            ->with('author:id,name')
            ->published()
            ->latest('published_at')
            ->limit(3)
            ->get();

        $stats = [
            'members' => User::query()->where('role', UserRole::Member)->count(),
            'mentors' => User::query()->where('role', 'mentor')->count(),
            'events' => Event::query()->published()->count(),
            'articles' => BlogPost::query()->published()->count(),
        ];

        return Inertia::render('welcome', [
            'canRegister' => Features::enabled(Features::registration()),
            'featuredEvents' => $featuredEvents,
            'latestBlogs' => $latestBlogs,
            'stats' => $stats,
        ]);
    }
}
