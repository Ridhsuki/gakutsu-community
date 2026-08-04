<?php

namespace App\Support;

use Illuminate\Support\Str;

class SiteUrl
{
    /**
     * Get normalized base URL from APP_URL config.
     */
    public static function getBaseUrl(): ?string
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
}
