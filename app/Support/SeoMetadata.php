<?php

namespace App\Support;

use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SeoMetadata
{
    /**
     * Build normalized SEO metadata document array for a request.
     *
     * @param  array{
     *     title?: ?string,
     *     description?: ?string,
     *     type?: 'website'|'article',
     *     image?: ?string,
     *     imageAlt?: ?string,
     *     jsonLdGraph?: ?array<int, mixed>
     * }  $overrides
     * @return array{
     *     siteName: string,
     *     title: string,
     *     description: ?string,
     *     robots: 'index, follow'|'noindex, follow'|'noindex, nofollow',
     *     canonicalUrl: ?string,
     *     baseUrl: string,
     *     type: 'website'|'article',
     *     image: ?string,
     *     imageAlt: ?string,
     *     twitterCard: 'summary'|'summary_large_image',
     *     jsonLd: ?array{
     *
     *         @context: string,
     *
     *         @graph: array<int, mixed>
     *     }
     * }
     */
    public static function build(Request $request, array $overrides = [], ?array $policyData = null): array
    {
        $policyData ??= app(SeoPolicy::class)->resolve($request);

        $siteName = $policyData['siteName'];
        $robots = $policyData['robots'];
        $canonicalUrl = $policyData['canonicalUrl'];
        $baseUrl = $policyData['baseUrl'] ?? SiteUrl::getBaseUrl() ?? (string) config('app.url', 'https://gakutsu.net');

        // Resolve title
        $rawTitle = isset($overrides['title']) ? trim((string) $overrides['title']) : '';

        if ($rawTitle === '') {
            $routeName = $request->route()?->getName();
            $rawTitle = match ($routeName) {
                'events.index' => 'Events',
                'blogs.index' => 'Blogs',
                'login' => 'Log in',
                'register' => 'Register',
                'password.request', 'password.reset' => 'Reset Password',
                'dashboard' => 'Dashboard',
                default => '',
            };
        }

        if ($rawTitle === '' || $rawTitle === $siteName) {
            $finalTitle = $siteName;
        } elseif (Str::endsWith($rawTitle, " - {$siteName}")) {
            $finalTitle = $rawTitle;
        } else {
            $finalTitle = "{$rawTitle} - {$siteName}";
        }

        // Resolve description
        $description = isset($overrides['description']) ? trim((string) $overrides['description']) : null;
        if ($description === '') {
            $description = null;
        }

        // Resolve type
        $type = isset($overrides['type']) && $overrides['type'] === 'article' ? 'article' : 'website';

        // Resolve image URL
        $rawImage = isset($overrides['image']) ? trim((string) $overrides['image']) : null;
        $absoluteImage = StructuredData::normalizeImageUrl($rawImage, $baseUrl);

        $imageAlt = isset($overrides['imageAlt']) ? trim((string) $overrides['imageAlt']) : null;
        if ($imageAlt === '') {
            $imageAlt = null;
        }

        $twitterCard = $absoluteImage !== null ? 'summary_large_image' : 'summary';

        // Resolve JSON-LD document
        $jsonLd = null;
        $jsonLdGraph = $overrides['jsonLdGraph'] ?? null;
        if ($robots === 'index, follow' && $canonicalUrl !== null && is_array($jsonLdGraph) && ! empty($jsonLdGraph)) {
            $filteredGraph = array_values(array_filter($jsonLdGraph, fn ($node) => is_array($node) && ! empty($node)));
            if (! empty($filteredGraph)) {
                $jsonLd = [
                    '@context' => 'https://schema.org',
                    '@graph' => $filteredGraph,
                ];
            }
        }

        return [
            'siteName' => $siteName,
            'title' => $finalTitle,
            'description' => $description,
            'robots' => $robots,
            'canonicalUrl' => $canonicalUrl,
            'baseUrl' => $baseUrl,
            'type' => $type,
            'image' => $absoluteImage,
            'imageAlt' => $imageAlt,
            'twitterCard' => $twitterCard,
            'jsonLd' => $jsonLd,
        ];
    }

    /**
     * Build default SEO metadata document for shared props.
     *
     * @return array<string, mixed>
     */
    public static function buildDefault(Request $request): array
    {
        return static::build($request);
    }
}
