<?php

namespace App\Http\Controllers\Site;

use App\Enums\EventStatus;
use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use App\Models\Event;
use App\Models\User;
use App\Support\SeoMetadata;
use App\Support\SeoPolicy;
use App\Support\StructuredData;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Fortify\Features;

class HomeController extends Controller
{
    public function index(Request $request): Response
    {
        $featuredEvents = Event::query()
            ->select([
                'id',
                'title',
                'slug',
                'category',
                'starts_at',
                'status',
                'poster_image_path',
                'mentor_id',
            ])
            ->with('mentor:id,name')
            ->published()
            ->where('status', EventStatus::Upcoming)
            ->orderBy('starts_at')
            ->limit(3)
            ->get()
            ->map(fn (Event $event): array => [
                'title' => $event->title,
                'slug' => $event->slug,
                'category' => $event->category,
                'starts_at' => $event->starts_at?->toISOString(),
                'status' => $event->status->value,
                'poster_image_url' => $event->poster_image_url,
                'mentor' => $event->relationLoaded('mentor') && $event->mentor ? [
                    'name' => $event->mentor->name,
                ] : null,
            ])
            ->values()
            ->all();

        $latestBlogs = BlogPost::query()
            ->select([
                'id',
                'title',
                'slug',
                'cover_image_path',
                'content',
                'published_at',
                'author_id',
            ])
            ->with('author:id,name')
            ->published()
            ->latest('published_at')
            ->limit(3)
            ->get()
            ->map(fn (BlogPost $post): array => [
                'title' => $post->title,
                'slug' => $post->slug,
                'excerpt' => $this->makeExcerpt((string) $post->content),
                'cover_image_url' => $post->cover_image_url,
                'published_at' => $post->published_at?->toISOString(),
                'author' => $post->relationLoaded('author') && $post->author ? [
                    'name' => $post->author->name,
                ] : null,
            ])
            ->values()
            ->all();

        $stats = [
            'members' => User::query()->where('role', UserRole::Member)->count(),
            'mentors' => User::query()->where('role', 'mentor')->count(),
            'events' => Event::query()->published()->count(),
            'articles' => BlogPost::query()->published()->count(),
        ];

        $policyData = app(SeoPolicy::class)->resolve($request);
        $canonicalHomeUrl = $policyData['canonicalUrl'];
        $homeDescription = 'Komunitas belajar IT dan Cyber Security dari Gakutsu dengan webinar, event, dan artikel teknis yang relevan untuk member, mahasiswa, dan profesional.';

        $homeGraph = null;
        if ($canonicalHomeUrl !== null) {
            $homeGraph = [
                StructuredData::createWebSiteSchema($canonicalHomeUrl, $policyData['siteName']),
                StructuredData::createOrganizationSchema($canonicalHomeUrl, $policyData['siteName'], $homeDescription),
            ];
        }

        return Inertia::render('welcome', [
            'canRegister' => Features::enabled(Features::registration()),
            'featuredEvents' => $featuredEvents,
            'latestBlogs' => $latestBlogs,
            'stats' => $stats,
            'seo' => SeoMetadata::build($request, [
                'title' => 'Gakutsu',
                'description' => $homeDescription,
                'jsonLdGraph' => $homeGraph,
            ], $policyData),
        ]);
    }

    private function makeExcerpt(string $content, int $maxLength = 140): string
    {
        $text = preg_replace('/<[^>]+>/u', ' ', $content) ?? '';
        $text = strip_tags($text);
        $text = html_entity_decode(
            $text,
            ENT_QUOTES | ENT_HTML5,
            'UTF-8',
        );
        $text = preg_replace('/\s+/u', ' ', $text) ?? '';
        $text = trim($text);

        $excerpt = mb_strlen($text, 'UTF-8') > $maxLength
            ? rtrim(mb_substr($text, 0, $maxLength, 'UTF-8'))
            : $text;

        return $excerpt.'...';
    }
}
