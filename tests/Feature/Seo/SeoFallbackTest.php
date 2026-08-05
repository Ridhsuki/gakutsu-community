<?php

use App\Models\BlogPost;
use App\Models\Event;
use App\Models\User;

beforeEach(function () {
    config([
        'app.url' => 'https://gakutsu.net',
        'seo.indexing_enabled' => true,
        'inertia.ssr.enabled' => false,
    ]);
});

test('1. home initial response HTML renders expected fallback title, metadata, and JSON-LD graph', function () {
    $response = $this->get(route('home'));

    $response->assertOk();
    $html = $response->getContent();

    expect($html)->toContain('<title>Gakutsu</title>');
    expect($html)->toContain('<meta data-inertia="robots" name="robots" content="index, follow">');
    expect($html)->toContain('<link data-inertia="canonical" rel="canonical" href="https://gakutsu.net/">');
    expect($html)->toContain('<meta data-inertia="og:title" property="og:title" content="Gakutsu">');
    expect($html)->toContain('<meta data-inertia="og:type" property="og:type" content="website">');
    expect($html)->toContain('<meta data-inertia="og:site_name" property="og:site_name" content="Gakutsu">');
    expect($html)->toContain('<meta data-inertia="og:url" property="og:url" content="https://gakutsu.net/">');
    expect($html)->toContain('<meta data-inertia="twitter:card" name="twitter:card" content="summary">');
    expect($html)->toContain('<meta data-inertia="twitter:title" name="twitter:title" content="Gakutsu">');
    expect($html)->toContain('<script data-inertia="structured-data" type="application/ld+json">');

    // Parse JSON-LD script from response
    preg_match('/<script data-inertia="structured-data" type="application\/ld\+json">(.*?)<\/script>/s', $html, $matches);
    expect($matches)->not->toBeEmpty();

    $jsonLd = json_decode($matches[1], true);
    expect($jsonLd)->toBeArray();
    expect($jsonLd['@context'])->toBe('https://schema.org');
    expect($jsonLd['@graph'])->toHaveLength(2);
    expect($jsonLd['@graph'][0]['@type'])->toBe('WebSite');
    expect($jsonLd['@graph'][1]['@type'])->toBe('Organization');
});

test('2. published blog detail renders complete fallback head including BlogPosting and BreadcrumbList schemas', function () {
    $user = User::factory()->create(['name' => 'Alice Mentor']);
    $blog = BlogPost::factory()->create([
        'status' => 'published',
        'title' => 'Cyber Security Essentials',
        'content' => '<p>Factual article text for cybersecurity learning.</p>',
        'published_at' => now()->subDays(2),
        'updated_at' => now()->subDay(),
        'author_id' => $user->id,
        'cover_image_path' => 'blog-covers/cyber.jpg',
    ]);

    $response = $this->get(route('blogs.show', $blog));

    $response->assertOk();
    $html = $response->getContent();

    expect($html)->toContain('<title>Cyber Security Essentials - Gakutsu</title>');
    expect($html)->toContain('<meta data-inertia="robots" name="robots" content="index, follow">');
    expect($html)->toContain('<link data-inertia="canonical" rel="canonical" href="https://gakutsu.net/blogs/'.$blog->slug.'">');
    expect($html)->toContain('<meta data-inertia="og:title" property="og:title" content="Cyber Security Essentials - Gakutsu">');
    expect($html)->toContain('<meta data-inertia="og:type" property="og:type" content="article">');
    expect($html)->toContain('<meta data-inertia="twitter:card" name="twitter:card" content="summary_large_image">');
    expect($html)->toContain('<meta data-inertia="og:image" property="og:image" content="https://gakutsu.net/storage/blog-covers/cyber.jpg">');
    expect($html)->toContain('<meta data-inertia="twitter:image" name="twitter:image" content="https://gakutsu.net/storage/blog-covers/cyber.jpg">');

    preg_match('/<script data-inertia="structured-data" type="application\/ld\+json">(.*?)<\/script>/s', $html, $matches);
    expect($matches)->not->toBeEmpty();

    $jsonLd = json_decode($matches[1], true);
    expect($jsonLd['@graph'])->toHaveLength(2);
    expect($jsonLd['@graph'][0]['@type'])->toBe('BlogPosting');
    expect($jsonLd['@graph'][1]['@type'])->toBe('BreadcrumbList');
});

test('3. public event detail renders fallback head with BreadcrumbList schema only and no Event schema or meeting_url', function () {
    $user = User::factory()->create(['name' => 'Alice Mentor']);
    $event = Event::factory()->published()->upcoming()->create([
        'title' => 'Webinar Cyber Hacking',
        'created_by' => $user->id,
        'mentor_id' => $user->id,
        'meeting_url' => 'https://zoom.us/j/1234567890',
    ]);

    $response = $this->get(route('events.show', $event));

    $response->assertOk();
    $html = $response->getContent();

    expect($html)->toContain('<title>Webinar Cyber Hacking - Gakutsu</title>');
    expect($html)->toContain('<meta data-inertia="robots" name="robots" content="index, follow">');
    expect($html)->not->toContain('meeting_url');
    expect($html)->not->toContain('https://zoom.us/j/1234567890');

    preg_match('/<script data-inertia="structured-data" type="application\/ld\+json">(.*?)<\/script>/s', $html, $matches);
    expect($matches)->not->toBeEmpty();

    $jsonLd = json_decode($matches[1], true);
    expect($jsonLd['@graph'])->toHaveLength(1);
    expect($jsonLd['@graph'][0]['@type'])->toBe('BreadcrumbList');
    expect(json_encode($jsonLd))->not->toContain('"@type":"Event"');
    expect(json_encode($jsonLd))->not->toContain('OnlineEvent');
});

test('4. clean pagination retains index follow and self-canonical in fallback head', function () {
    $response = $this->get(route('blogs.index', ['page' => 2]));

    $response->assertOk();
    $html = $response->getContent();

    expect($html)->toContain('<title>Blog - Gakutsu</title>');
    expect($html)->toContain('<meta data-inertia="robots" name="robots" content="index, follow">');
    expect($html)->toContain('<link data-inertia="canonical" rel="canonical" href="https://gakutsu.net/blogs?page=2">');
});

test('5. search/filter/sort queries return noindex follow and no canonical or structured data in fallback head', function () {
    $response = $this->get(route('blogs.index', ['search' => 'cyber']));

    $response->assertOk();
    $html = $response->getContent();

    expect($html)->toContain('<meta data-inertia="robots" name="robots" content="noindex, follow">');
    expect($html)->not->toContain('rel="canonical"');
    expect($html)->not->toContain('type="application/ld+json"');
});

test('6. auth and private routes render noindex in fallback head without structured data', function () {
    $response = $this->get(route('login'));

    $response->assertOk();
    $html = $response->getContent();

    expect($html)->toContain('<meta data-inertia="robots" name="robots" content="noindex, follow">');
    expect($html)->not->toContain('rel="canonical"');
    expect($html)->not->toContain('type="application/ld+json"');

    $user = User::factory()->create();
    $privateResponse = $this->actingAs($user)->get(route('dashboard'));

    $privateResponse->assertOk();
    $privateHtml = $privateResponse->getContent();

    expect($privateHtml)->toContain('<meta data-inertia="robots" name="robots" content="noindex, nofollow">');
    expect($privateHtml)->not->toContain('rel="canonical"');
    expect($privateHtml)->not->toContain('type="application/ld+json"');
});

test('7. subdirectory APP_URL correctly scopes canonical and structured data in fallback head', function () {
    config([
        'app.url' => 'https://example.com/gakutsu',
        'seo.indexing_enabled' => true,
    ]);

    $response = $this->get(route('home'));

    $response->assertOk();
    $html = $response->getContent();

    expect($html)->toContain('<link data-inertia="canonical" rel="canonical" href="https://example.com/gakutsu/">');

    preg_match('/<script data-inertia="structured-data" type="application\/ld\+json">(.*?)<\/script>/s', $html, $matches);
    expect($matches)->not->toBeEmpty();

    $jsonLd = json_decode($matches[1], true);
    expect($jsonLd['@graph'][0]['url'])->toBe('https://example.com/gakutsu/');
});

test('8. hostile blog post content is safely encoded in JSON-LD fallback script tag', function () {
    $user = User::factory()->create();
    $blog = BlogPost::factory()->create([
        'status' => 'published',
        'title' => '</script><script>alert("XSS")</script>',
        'content' => '<p>Hostile content & test > 1</p>',
        'author_id' => $user->id,
    ]);

    $response = $this->get(route('blogs.show', $blog));

    $response->assertOk();
    $html = $response->getContent();

    preg_match('/<script data-inertia="structured-data" type="application\/ld\+json">(.*?)<\/script>/s', $html, $matches);
    expect($matches)->not->toBeEmpty();

    $scriptContent = $matches[1];
    expect($scriptContent)->not()->toContain('</script>');
    expect(strtolower($scriptContent))->toContain('\u003c');
    expect(strtolower($scriptContent))->toContain('\u003e');

    $decoded = json_decode($scriptContent, true);
    expect($decoded['@graph'][0]['headline'])->toBe('</script><script>alert("XSS")</script>');
});

test('9. initial response HTML contains no duplicate data-inertia semantic keys', function () {
    $user = User::factory()->create();
    $blog = BlogPost::factory()->create([
        'status' => 'published',
        'author_id' => $user->id,
        'cover_image_path' => 'blog-covers/cyber.jpg',
    ]);

    $response = $this->get(route('blogs.show', $blog));

    $response->assertOk();
    $html = $response->getContent();

    $keys = [
        'description',
        'robots',
        'canonical',
        'og:title',
        'og:description',
        'og:type',
        'og:site_name',
        'og:url',
        'og:image',
        'twitter:card',
        'twitter:title',
        'twitter:description',
        'twitter:image',
        'structured-data',
    ];

    foreach ($keys as $key) {
        $count = substr_count($html, 'data-inertia="'.$key.'"');
        expect($count)->toBeLessThanOrEqual(1);
    }
});
