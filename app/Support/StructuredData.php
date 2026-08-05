<?php

namespace App\Support;

use Carbon\Carbon;
use Illuminate\Support\Str;

class StructuredData
{
    /**
     * Constructs a WebSite schema node.
     *
     * @return array<string, mixed>
     */
    public static function createWebSiteSchema(string $canonicalHomeUrl, string $siteName): array
    {
        $cleanHomeUrl = rtrim($canonicalHomeUrl, '/').'/';

        return [
            '@type' => 'WebSite',
            '@id' => "{$cleanHomeUrl}#website",
            'url' => $cleanHomeUrl,
            'name' => $siteName,
            'publisher' => [
                '@id' => "{$cleanHomeUrl}#organization",
            ],
        ];
    }

    /**
     * Constructs an Organization schema node.
     *
     * @return array<string, mixed>
     */
    public static function createOrganizationSchema(string $canonicalHomeUrl, string $siteName, ?string $description = null): array
    {
        $cleanHomeUrl = rtrim($canonicalHomeUrl, '/').'/';
        $node = [
            '@type' => 'Organization',
            '@id' => "{$cleanHomeUrl}#organization",
            'name' => $siteName,
            'url' => $cleanHomeUrl,
        ];

        if ($description !== null && trim($description) !== '') {
            $node['description'] = trim($description);
        }

        return $node;
    }

    /**
     * Constructs a BlogPosting schema node.
     *
     * @return array<string, mixed>
     */
    public static function createBlogPostingSchema(
        string $canonicalUrl,
        string $baseUrl,
        string $siteName,
        string $title,
        ?string $description = null,
        ?string $publishedAt = null,
        ?string $updatedAt = null,
        ?string $authorName = null,
        ?string $coverImageUrl = null
    ): array {
        $cleanHomeUrl = rtrim($baseUrl, '/').'/';
        $publishedIso = static::formatIsoDate($publishedAt);
        $updatedIso = static::formatIsoDate($updatedAt);

        $finalModifiedIso = null;
        if ($publishedIso !== null && $updatedIso !== null) {
            $pubTime = strtotime($publishedIso);
            $modTime = strtotime($updatedIso);
            if ($pubTime !== false && $modTime !== false && $modTime >= $pubTime) {
                $finalModifiedIso = $updatedIso;
            }
        }

        $node = [
            '@type' => 'BlogPosting',
            '@id' => "{$canonicalUrl}#article",
            'mainEntityOfPage' => [
                '@type' => 'WebPage',
                '@id' => $canonicalUrl,
            ],
            'headline' => $title,
        ];

        if ($description !== null && trim($description) !== '') {
            $node['description'] = trim($description);
        }

        if ($publishedIso !== null) {
            $node['datePublished'] = $publishedIso;
        }

        if ($finalModifiedIso !== null) {
            $node['dateModified'] = $finalModifiedIso;
        }

        if ($authorName !== null && trim($authorName) !== '') {
            $node['author'] = [
                '@type' => 'Person',
                'name' => trim($authorName),
            ];
        }

        $node['publisher'] = [
            '@type' => 'Organization',
            '@id' => "{$cleanHomeUrl}#organization",
            'name' => $siteName,
            'url' => $cleanHomeUrl,
        ];

        $imageUrl = static::normalizeImageUrl($coverImageUrl, $baseUrl);
        if ($imageUrl !== null) {
            $node['image'] = [$imageUrl];
        }

        return $node;
    }

    /**
     * Constructs a BreadcrumbList schema node.
     *
     * @param  array<int, array{name: string, url: string}>  $items
     * @return array<string, mixed>|null
     */
    public static function createBreadcrumbListSchema(array $items, string $canonicalCurrentUrl): ?array
    {
        if ($canonicalCurrentUrl === '' || ! Str::startsWith($canonicalCurrentUrl, ['http://', 'https://'])) {
            return null;
        }

        if (filter_var($canonicalCurrentUrl, FILTER_VALIDATE_URL) === false) {
            return null;
        }

        if (empty($items)) {
            return null;
        }

        $itemListElement = [];
        foreach (array_values($items) as $i => $item) {
            if (! is_array($item) || ! isset($item['name'], $item['url'])) {
                return null;
            }

            $name = trim((string) $item['name']);
            $url = trim((string) $item['url']);

            if ($name === '' || $url === '' || ! Str::startsWith($url, ['http://', 'https://'])) {
                return null;
            }

            if (filter_var($url, FILTER_VALIDATE_URL) === false) {
                return null;
            }

            $itemListElement[] = [
                '@type' => 'ListItem',
                'position' => $i + 1,
                'name' => $name,
                'item' => $url,
            ];
        }

        return [
            '@type' => 'BreadcrumbList',
            '@id' => "{$canonicalCurrentUrl}#breadcrumb",
            'itemListElement' => $itemListElement,
        ];
    }

    /**
     * Validates and normalizes an image URL for structured data.
     */
    public static function normalizeImageUrl(?string $url, string $baseUrl): ?string
    {
        if ($url === null || trim($url) === '') {
            return null;
        }

        $trimmed = trim($url);

        if (Str::startsWith($trimmed, '//') || preg_match('/^(data|blob|javascript):/i', $trimmed)) {
            return null;
        }

        if (preg_match('/^https?:\/\//i', $trimmed)) {
            if (filter_var($trimmed, FILTER_VALIDATE_URL) !== false) {
                $parsedUrl = parse_url($trimmed);
                $parsedBase = parse_url($baseUrl);
                if (isset($parsedUrl['host'], $parsedBase['host'])) {
                    if ($parsedUrl['host'] === 'localhost' || $parsedUrl['host'] === '127.0.0.1' || $parsedUrl['host'] === $parsedBase['host']) {
                        $path = $parsedUrl['path'] ?? '';
                        $query = isset($parsedUrl['query']) ? '?'.$parsedUrl['query'] : '';
                        $cleanBase = rtrim($baseUrl, '/');

                        return "{$cleanBase}{$path}{$query}";
                    }
                }

                return $trimmed;
            }

            return null;
        }

        if (Str::startsWith($trimmed, '/')) {
            $cleanBase = rtrim($baseUrl, '/');

            return "{$cleanBase}{$trimmed}";
        }

        return null;
    }

    /**
     * Formats a date string to ISO 8601 string.
     */
    public static function formatIsoDate(?string $dateStr): ?string
    {
        if ($dateStr === null || trim($dateStr) === '') {
            return null;
        }

        try {
            return Carbon::parse($dateStr)->setTimezone('UTC')->toIso8601ZuluString();
        } catch (\Throwable) {
            return null;
        }
    }

    /**
     * Centralized safe JSON encoder for Blade output.
     */
    public static function safeJsonEncode(mixed $data): string
    {
        $json = json_encode(
            $data,
            JSON_HEX_TAG
            | JSON_HEX_AMP
            | JSON_HEX_APOS
            | JSON_HEX_QUOT
            | JSON_UNESCAPED_SLASHES
            | JSON_UNESCAPED_UNICODE
            | JSON_THROW_ON_ERROR
        );

        return str_replace(["\u{2028}", "\u{2029}"], ['\u2028', '\u2029'], $json);
    }
}
