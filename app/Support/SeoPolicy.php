<?php

namespace App\Support;

use Illuminate\Http\Request;
use Illuminate\Support\Str;

class SeoPolicy
{
    /**
     * Map of indexable public route names to allowed pagination query parameters.
     *
     * @var array<string, array<int, string>>
     */
    protected array $indexableRoutes = [
        'home' => [],
        'events.index' => ['upcoming_page', 'archive_page', 'page'],
        'events.show' => [],
        'blogs.index' => ['page'],
        'blogs.show' => [],
    ];

    /**
     * Known non-indexable public routes (noindex, follow).
     *
     * @var array<int, string>
     */
    protected array $noindexFollowRoutes = [
        'events.register',
        'login',
        'register',
        'password.request',
        'password.reset',
        'password.confirm',
        'two-factor.login',
        'verification.notice',
    ];

    /**
     * Resolve SEO metadata for the current request.
     *
     * @return array{siteName: string, canonicalUrl: ?string, robots: string, baseUrl: ?string}
     */
    public function resolve(Request $request): array
    {
        $siteName = (string) config('app.name', 'Gakutsu');
        $baseUrl = $this->getBaseUrl();

        $routeName = $request->route()?->getName();
        $path = $request->path();

        $robots = $this->resolveRobotsPolicy($request, $routeName, $path);
        $canonicalUrl = null;

        if ($robots === 'index, follow' && $baseUrl !== null) {
            $canonicalUrl = $this->resolveCanonicalUrl($request, $baseUrl, $routeName);
        }

        return [
            'siteName' => $siteName,
            'canonicalUrl' => $canonicalUrl,
            'robots' => $robots,
            'baseUrl' => $baseUrl,
        ];
    }

    /**
     * Get normalized base URL from APP_URL config.
     */
    public function getBaseUrl(): ?string
    {
        $appUrl = (string) config('app.url', '');

        if ($appUrl === '' || ! Str::startsWith($appUrl, ['http://', 'https://'])) {
            return null;
        }

        if (filter_var($appUrl, FILTER_VALIDATE_URL) === false) {
            return null;
        }

        $parsed = parse_url($appUrl);
        if (! isset($parsed['scheme'], $parsed['host'])) {
            return null;
        }

        $scheme = strtolower($parsed['scheme']);
        $host = $parsed['host'];
        $port = isset($parsed['port']) ? ':'.$parsed['port'] : '';
        $path = isset($parsed['path']) ? rtrim($parsed['path'], '/') : '';

        return "{$scheme}://{$host}{$port}{$path}";
    }

    /**
     * Determine robots policy ('index, follow', 'noindex, follow', 'noindex, nofollow').
     */
    public function resolveRobotsPolicy(Request $request, ?string $routeName, string $path): string
    {
        if ($this->isPrivateRoute($request, $routeName, $path)) {
            return 'noindex, nofollow';
        }

        if ($this->isNoindexFollowRoute($routeName, $path)) {
            return 'noindex, follow';
        }

        if ($routeName !== null && isset($this->indexableRoutes[$routeName])) {
            if ($this->hasNonPaginationQueryParameters($request, $routeName)) {
                return 'noindex, follow';
            }

            return 'index, follow';
        }

        if ($request->user() !== null) {
            return 'noindex, nofollow';
        }

        return 'noindex, follow';
    }

    /**
     * Check if route is a private route (admin, mentor, settings, dashboard).
     */
    protected function isPrivateRoute(Request $request, ?string $routeName, string $path): bool
    {
        if ($routeName !== null) {
            if (
                Str::startsWith($routeName, ['admin.', 'mentor.', 'profile.', 'security.', 'appearance.', 'user-password.'])
                || $routeName === 'dashboard'
            ) {
                return true;
            }
        }

        if (
            Str::startsWith($path, ['admin', 'mentor', 'settings', 'dashboard'])
        ) {
            return true;
        }

        return false;
    }

    /**
     * Check if route is a known noindex, follow route.
     */
    protected function isNoindexFollowRoute(?string $routeName, string $path): bool
    {
        if ($routeName !== null && in_array($routeName, $this->noindexFollowRoutes, true)) {
            return true;
        }

        if (in_array($path, ['login', 'register', 'forgot-password', 'reset-password', 'two-factor-challenge'], true)) {
            return true;
        }

        if (Str::is('events/*/register', $path)) {
            return true;
        }

        return false;
    }

    /**
     * Check if request query contains search/filter/sort or malformed/unexpected params.
     */
    protected function hasNonPaginationQueryParameters(Request $request, string $routeName): bool
    {
        $query = $request->query();
        if (empty($query)) {
            return false;
        }

        $allowedPaginationKeys = $this->indexableRoutes[$routeName] ?? [];

        foreach ($query as $key => $value) {
            $keyStr = (string) $key;

            if (! in_array($keyStr, $allowedPaginationKeys, true)) {
                return true;
            }

            if (is_array($value) || ! is_numeric($value) || (int) $value <= 0 || (string) (int) $value !== (string) $value) {
                return true;
            }
        }

        return false;
    }

    /**
     * Resolve absolute canonical URL for indexable public route.
     */
    public function resolveCanonicalUrl(Request $request, string $baseUrl, ?string $routeName): string
    {
        $path = ltrim($request->path(), '/');
        $cleanPathUrl = $path === '' ? "{$baseUrl}/" : "{$baseUrl}/{$path}";

        if ($routeName === null || ! isset($this->indexableRoutes[$routeName])) {
            return $cleanPathUrl;
        }

        $query = $request->query();
        if (empty($query)) {
            return $cleanPathUrl;
        }

        $allowedPaginationKeys = $this->indexableRoutes[$routeName];
        $canonicalParams = [];

        foreach ($query as $key => $value) {
            $keyStr = (string) $key;
            if (in_array($keyStr, $allowedPaginationKeys, true)) {
                $valInt = (int) $value;
                if ($valInt > 1) {
                    $canonicalParams[$keyStr] = $valInt;
                }
            }
        }

        if (empty($canonicalParams)) {
            return $cleanPathUrl;
        }

        ksort($canonicalParams);

        return $cleanPathUrl.'?'.http_build_query($canonicalParams);
    }
}
