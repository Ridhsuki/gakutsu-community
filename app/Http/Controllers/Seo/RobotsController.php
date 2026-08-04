<?php

namespace App\Http\Controllers\Seo;

use App\Http\Controllers\Controller;
use App\Support\SiteUrl;
use Illuminate\Http\Response;

class RobotsController extends Controller
{
    public function __invoke(): Response
    {
        $indexingEnabled = (bool) config('seo.indexing_enabled', false);

        if (! $indexingEnabled) {
            $content = implode("\n", [
                'User-agent: *',
                'Disallow: /',
            ])."\n";
        } else {
            $baseUrl = SiteUrl::getBaseUrl() ?? rtrim((string) config('app.url'), '/');
            $sitemapUrl = "{$baseUrl}/sitemap.xml";

            $content = implode("\n", [
                'User-agent: *',
                'Disallow:',
                '',
                "Sitemap: {$sitemapUrl}",
            ])."\n";
        }

        return response($content, 200, [
            'Content-Type' => 'text/plain; charset=UTF-8',
        ]);
    }
}
