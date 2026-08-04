<?php

namespace App\Http\Controllers\Seo;

use App\Enums\EventStatus;
use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use App\Models\Event;
use App\Support\SiteUrl;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function __invoke(): Response
    {
        abort_unless((bool) config('seo.indexing_enabled', false), 404);

        $baseUrl = SiteUrl::getBaseUrl() ?? rtrim((string) config('app.url'), '/');

        $events = Event::query()
            ->published()
            ->where('status', EventStatus::Upcoming)
            ->select(['slug', 'updated_at'])
            ->orderBy('slug')
            ->get();

        $blogs = BlogPost::query()
            ->published()
            ->select(['slug', 'updated_at'])
            ->orderBy('slug')
            ->get();

        $latestEventUpdated = $events->max('updated_at');
        $latestBlogUpdated = $blogs->max('updated_at');

        $homeLastmod = null;
        if ($latestEventUpdated !== null && $latestBlogUpdated !== null) {
            $homeLastmod = $latestEventUpdated->greaterThan($latestBlogUpdated)
                ? $latestEventUpdated
                : $latestBlogUpdated;
        } else {
            $homeLastmod = $latestEventUpdated ?? $latestBlogUpdated;
        }

        $urls = [];

        // 1. Home
        $urls[] = [
            'loc' => "{$baseUrl}/",
            'lastmod' => $homeLastmod?->toIso8601String(),
        ];

        // 2. Events index
        $urls[] = [
            'loc' => "{$baseUrl}/events",
            'lastmod' => $latestEventUpdated?->toIso8601String(),
        ];

        // 3. Blogs index
        $urls[] = [
            'loc' => "{$baseUrl}/blogs",
            'lastmod' => $latestBlogUpdated?->toIso8601String(),
        ];

        // 4. Event detail pages
        foreach ($events as $event) {
            $urls[] = [
                'loc' => "{$baseUrl}/events/{$event->slug}",
                'lastmod' => $event->updated_at?->toIso8601String(),
            ];
        }

        // 5. Blog detail pages
        foreach ($blogs as $blog) {
            $urls[] = [
                'loc' => "{$baseUrl}/blogs/{$blog->slug}",
                'lastmod' => $blog->updated_at?->toIso8601String(),
            ];
        }

        $xmlLines = [];
        $xmlLines[] = '<?xml version="1.0" encoding="UTF-8"?>';
        $xmlLines[] = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

        foreach ($urls as $url) {
            $escapedLoc = htmlspecialchars($url['loc'], ENT_XML1 | ENT_COMPAT, 'UTF-8');
            $xmlLines[] = '  <url>';
            $xmlLines[] = "    <loc>{$escapedLoc}</loc>";
            if (! empty($url['lastmod'])) {
                $escapedLastmod = htmlspecialchars($url['lastmod'], ENT_XML1 | ENT_COMPAT, 'UTF-8');
                $xmlLines[] = "    <lastmod>{$escapedLastmod}</lastmod>";
            }
            $xmlLines[] = '  </url>';
        }

        $xmlLines[] = '</urlset>';

        $xmlContent = implode("\n", $xmlLines)."\n";

        return response($xmlContent, 200, [
            'Content-Type' => 'application/xml; charset=UTF-8',
        ]);
    }
}
