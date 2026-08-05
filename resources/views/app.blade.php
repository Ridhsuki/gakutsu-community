<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        {{-- Inline script to detect system dark mode preference and apply it immediately --}}
        <script>
            (function() {
                const appearance = '{{ $appearance ?? "system" }}';

                if (appearance === 'system') {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                    if (prefersDark) {
                        document.documentElement.classList.add('dark');
                    }
                }
            })();
        </script>

        {{-- Inline style to set the HTML background color based on our theme in app.css --}}
        <style>
            html {
                background-color: oklch(1 0 0);
            }

            html.dark {
                background-color: oklch(0.145 0 0);
            }
        </style>

        <link rel="icon" href="/favicon.ico" sizes="any">
        <link rel="icon" href="/favicon.svg" type="image/svg+xml">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png">

        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        <x-inertia::head>
            @if (isset($page['props']['seo']) && is_array($page['props']['seo']))
                @php $seo = $page['props']['seo']; @endphp
                <title>{{ $seo['title'] }}</title>

                @if (!empty($seo['description']))
                    <meta data-inertia="description" name="description" content="{{ $seo['description'] }}">
                @endif

                <meta data-inertia="robots" name="robots" content="{{ $seo['robots'] }}">

                @if (!empty($seo['canonicalUrl']))
                    <link data-inertia="canonical" rel="canonical" href="{{ $seo['canonicalUrl'] }}">
                @endif

                <meta data-inertia="og:title" property="og:title" content="{{ $seo['title'] }}">
                @if (!empty($seo['description']))
                    <meta data-inertia="og:description" property="og:description" content="{{ $seo['description'] }}">
                @endif
                <meta data-inertia="og:type" property="og:type" content="{{ $seo['type'] }}">
                <meta data-inertia="og:site_name" property="og:site_name" content="{{ $seo['siteName'] }}">
                @if (!empty($seo['canonicalUrl']))
                    <meta data-inertia="og:url" property="og:url" content="{{ $seo['canonicalUrl'] }}">
                @endif

                <meta data-inertia="twitter:card" name="twitter:card" content="{{ $seo['twitterCard'] }}">
                <meta data-inertia="twitter:title" name="twitter:title" content="{{ $seo['title'] }}">
                @if (!empty($seo['description']))
                    <meta data-inertia="twitter:description" name="twitter:description" content="{{ $seo['description'] }}">
                @endif

                @if (!empty($seo['image']))
                    <meta data-inertia="og:image" property="og:image" content="{{ $seo['image'] }}">
                    <meta data-inertia="twitter:image" name="twitter:image" content="{{ $seo['image'] }}">
                    @if (!empty($seo['imageAlt']))
                        <meta data-inertia="og:image:alt" property="og:image:alt" content="{{ $seo['imageAlt'] }}">
                        <meta data-inertia="twitter:image:alt" name="twitter:image:alt" content="{{ $seo['imageAlt'] }}">
                    @endif
                @endif

                @if (!empty($seo['jsonLd']))
                    <script data-inertia="structured-data" type="application/ld+json">{!! \App\Support\StructuredData::safeJsonEncode($seo['jsonLd']) !!}</script>
                @endif
            @else
                <title>{{ config('app.name', 'Gakutsu') }}</title>
            @endif
        </x-inertia::head>
    </head>
    <body class="font-sans antialiased">
        <x-inertia::app />
    </body>
</html>
