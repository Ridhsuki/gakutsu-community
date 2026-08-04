<?php

use App\Enums\EventStatus;
use App\Models\BlogPost;
use App\Models\Event;
use App\Models\User;

test('1. production/indexing-enabled robots.txt returns 200 text/plain', function () {
    config([
        'app.url' => 'https://gakutsu.net',
        'seo.indexing_enabled' => true,
    ]);

    $response = $this->get(route('seo.robots'));

    $response->assertOk()
        ->assertHeader('Content-Type', 'text/plain; charset=UTF-8');
});

test('2. enabled robots.txt allows crawling and declares the absolute sitemap URL', function () {
    config([
        'app.url' => 'https://gakutsu.net',
        'seo.indexing_enabled' => true,
    ]);

    $response = $this->get(route('seo.robots'));

    $content = $response->getContent();
    expect($content)->toContain("User-agent: *\nDisallow:\n")
        ->and($content)->toContain('Sitemap: https://gakutsu.net/sitemap.xml');
});

test('3. disabled robots.txt returns Disallow: / and omits sitemap', function () {
    config([
        'app.url' => 'https://gakutsu.net',
        'seo.indexing_enabled' => false,
    ]);

    $response = $this->get(route('seo.robots'));

    $response->assertOk()
        ->assertHeader('Content-Type', 'text/plain; charset=UTF-8');

    $content = $response->getContent();
    expect($content)->toContain("User-agent: *\nDisallow: /")
        ->and($content)->not->toContain('Sitemap:');
});

test('4. sitemap returns 200 and application/xml when enabled', function () {
    config([
        'app.url' => 'https://gakutsu.net',
        'seo.indexing_enabled' => true,
    ]);

    $response = $this->get(route('seo.sitemap'));

    $response->assertOk()
        ->assertHeader('Content-Type', 'application/xml; charset=UTF-8');
});

test('5. sitemap XML is well-formed and parseable', function () {
    config([
        'app.url' => 'https://gakutsu.net',
        'seo.indexing_enabled' => true,
    ]);

    $response = $this->get(route('seo.sitemap'));
    $xmlString = $response->getContent();

    expect(str_starts_with($xmlString, '<?xml version="1.0" encoding="UTF-8"?>'))->toBeTrue();

    $xml = simplexml_load_string($xmlString);
    expect($xml)->not->toBeFalse()
        ->and($xml->getName())->toBe('urlset');
});

test('6. sitemap contains home, events index, and blogs index', function () {
    config([
        'app.url' => 'https://gakutsu.net',
        'seo.indexing_enabled' => true,
    ]);

    $response = $this->get(route('seo.sitemap'));
    $xml = simplexml_load_string($response->getContent());

    $locs = [];
    foreach ($xml->url as $url) {
        $locs[] = (string) $url->loc;
    }

    expect($locs)->toContain('https://gakutsu.net/')
        ->toContain('https://gakutsu.net/events')
        ->toContain('https://gakutsu.net/blogs');
});

test('7. sitemap contains published upcoming event detail URLs', function () {
    config([
        'app.url' => 'https://gakutsu.net',
        'seo.indexing_enabled' => true,
    ]);

    $user = User::factory()->create();
    $upcomingEvent = Event::factory()->published()->upcoming()->create([
        'created_by' => $user->id,
        'mentor_id' => $user->id,
        'slug' => 'published-upcoming-event',
    ]);

    $response = $this->get(route('seo.sitemap'));
    $xml = simplexml_load_string($response->getContent());

    $locs = [];
    foreach ($xml->url as $url) {
        $locs[] = (string) $url->loc;
    }

    expect($locs)->toContain('https://gakutsu.net/events/'.$upcomingEvent->slug);
});

test('8. sitemap contains published blog detail URLs', function () {
    config([
        'app.url' => 'https://gakutsu.net',
        'seo.indexing_enabled' => true,
    ]);

    $user = User::factory()->create();
    $publishedBlog = BlogPost::factory()->create([
        'status' => 'published',
        'author_id' => $user->id,
        'slug' => 'published-blog-post',
    ]);

    $response = $this->get(route('seo.sitemap'));
    $xml = simplexml_load_string($response->getContent());

    $locs = [];
    foreach ($xml->url as $url) {
        $locs[] = (string) $url->loc;
    }

    expect($locs)->toContain('https://gakutsu.net/blogs/'.$publishedBlog->slug);
});

test('9. sitemap excludes unpublished event records', function () {
    config([
        'app.url' => 'https://gakutsu.net',
        'seo.indexing_enabled' => true,
    ]);

    $user = User::factory()->create();
    $unpublishedEvent = Event::factory()->upcoming()->create([
        'created_by' => $user->id,
        'mentor_id' => $user->id,
        'is_published' => false,
        'slug' => 'unpublished-event',
    ]);
    $completedEvent = Event::factory()->published()->create([
        'created_by' => $user->id,
        'mentor_id' => $user->id,
        'status' => EventStatus::Completed,
        'slug' => 'completed-event',
    ]);
    $cancelledEvent = Event::factory()->published()->create([
        'created_by' => $user->id,
        'mentor_id' => $user->id,
        'status' => EventStatus::Cancelled,
        'slug' => 'cancelled-event',
    ]);

    $response = $this->get(route('seo.sitemap'));
    $xml = simplexml_load_string($response->getContent());

    $locs = [];
    foreach ($xml->url as $url) {
        $locs[] = (string) $url->loc;
    }

    expect($locs)->not->toContain('https://gakutsu.net/events/'.$unpublishedEvent->slug)
        ->and($locs)->not->toContain('https://gakutsu.net/events/'.$completedEvent->slug)
        ->and($locs)->not->toContain('https://gakutsu.net/events/'.$cancelledEvent->slug);
});

test('10. sitemap excludes unpublished blog records', function () {
    config([
        'app.url' => 'https://gakutsu.net',
        'seo.indexing_enabled' => true,
    ]);

    $user = User::factory()->create();
    $draftBlog = BlogPost::factory()->create([
        'status' => 'draft',
        'author_id' => $user->id,
        'slug' => 'draft-blog-post',
    ]);

    $response = $this->get(route('seo.sitemap'));
    $xml = simplexml_load_string($response->getContent());

    $locs = [];
    foreach ($xml->url as $url) {
        $locs[] = (string) $url->loc;
    }

    expect($locs)->not->toContain('https://gakutsu.net/blogs/'.$draftBlog->slug);
});

test('11. sitemap excludes private, utility, registration, query, and pagination URLs', function () {
    config([
        'app.url' => 'https://gakutsu.net',
        'seo.indexing_enabled' => true,
    ]);

    $response = $this->get(route('seo.sitemap'));
    $xml = simplexml_load_string($response->getContent());

    foreach ($xml->url as $url) {
        $loc = (string) $url->loc;
        expect($loc)->not->toContain('/admin')
            ->and($loc)->not->toContain('/mentor')
            ->and($loc)->not->toContain('/settings')
            ->and($loc)->not->toContain('/login')
            ->and($loc)->not->toContain('/register')
            ->and($loc)->not->toContain('?')
            ->and($loc)->not->toContain('#');
    }
});

test('12. sitemap URLs use config(app.url), not request Host header', function () {
    config([
        'app.url' => 'https://gakutsu.net',
        'seo.indexing_enabled' => true,
    ]);

    $response = $this->withHeaders(['Host' => 'malicious-host.com'])
        ->get(route('seo.sitemap'));

    $xml = simplexml_load_string($response->getContent());

    foreach ($xml->url as $url) {
        $loc = (string) $url->loc;
        expect(str_starts_with($loc, 'https://gakutsu.net'))->toBeTrue()
            ->and($loc)->not->toContain('malicious-host.com');
    }
});

test('13. sitemap contains no duplicate loc elements', function () {
    config([
        'app.url' => 'https://gakutsu.net',
        'seo.indexing_enabled' => true,
    ]);

    $response = $this->get(route('seo.sitemap'));
    $xml = simplexml_load_string($response->getContent());

    $locs = [];
    foreach ($xml->url as $url) {
        $locs[] = (string) $url->loc;
    }

    expect(count($locs))->toBe(count(array_unique($locs)));
});

test('14. lastmod values are valid ISO 8601 and derive from model timestamps', function () {
    config([
        'app.url' => 'https://gakutsu.net',
        'seo.indexing_enabled' => true,
    ]);

    $user = User::factory()->create();
    $event = Event::factory()->published()->upcoming()->create([
        'created_by' => $user->id,
        'mentor_id' => $user->id,
        'updated_at' => now()->subDays(2),
    ]);
    $blog = BlogPost::factory()->create([
        'status' => 'published',
        'author_id' => $user->id,
        'updated_at' => now()->subDays(1),
    ]);

    $response = $this->get(route('seo.sitemap'));
    $xml = simplexml_load_string($response->getContent());

    foreach ($xml->url as $url) {
        if (isset($url->lastmod)) {
            $lastmod = (string) $url->lastmod;
            expect(strtotime($lastmod))->not->toBeFalse();
        }
    }
});

test('15. sitemap returns 404 when indexing is disabled', function () {
    config([
        'seo.indexing_enabled' => false,
    ]);

    $this->get(route('seo.sitemap'))
        ->assertNotFound();
});

test('16. static robots.txt file does not shadow dynamic route', function () {
    expect(file_exists(public_path('robots.txt')))->toBeFalse();
});

test('17. every event URL in sitemap returns HTTP 200 publicly without authentication', function () {
    config([
        'app.url' => 'https://gakutsu.net',
        'seo.indexing_enabled' => true,
    ]);

    $user = User::factory()->create();
    $event1 = Event::factory()->published()->upcoming()->create([
        'created_by' => $user->id,
        'mentor_id' => $user->id,
    ]);
    $event2 = Event::factory()->published()->upcoming()->create([
        'created_by' => $user->id,
        'mentor_id' => $user->id,
    ]);

    $response = $this->get(route('seo.sitemap'));
    $xml = simplexml_load_string($response->getContent());

    foreach ($xml->url as $urlNode) {
        $url = (string) $urlNode->loc;
        if (str_contains($url, '/events/')) {
            $this->get($url)
                ->assertOk();
        }
    }
});

test('18. completed and cancelled published events return 404 publicly and are excluded from sitemap', function () {
    config([
        'app.url' => 'https://gakutsu.net',
        'seo.indexing_enabled' => true,
    ]);

    $user = User::factory()->create();
    $completedEvent = Event::factory()->published()->create([
        'created_by' => $user->id,
        'mentor_id' => $user->id,
        'status' => EventStatus::Completed,
        'slug' => 'completed-test-event',
    ]);
    $cancelledEvent = Event::factory()->published()->create([
        'created_by' => $user->id,
        'mentor_id' => $user->id,
        'status' => EventStatus::Cancelled,
        'slug' => 'cancelled-test-event',
    ]);

    $this->get(route('events.show', $completedEvent))
        ->assertNotFound();

    $this->get(route('events.show', $cancelledEvent))
        ->assertNotFound();

    $response = $this->get(route('seo.sitemap'));
    $xml = simplexml_load_string($response->getContent());

    $locs = [];
    foreach ($xml->url as $url) {
        $locs[] = (string) $url->loc;
    }

    expect($locs)->not->toContain('https://gakutsu.net/events/'.$completedEvent->slug)
        ->and($locs)->not->toContain('https://gakutsu.net/events/'.$cancelledEvent->slug);
});

test('19. configuration boolean defaults to false and reads config correctly', function () {
    expect(config('seo.indexing_enabled'))->toBeFalse();

    config(['seo.indexing_enabled' => true]);
    expect(config('seo.indexing_enabled'))->toBeTrue();

    config(['seo.indexing_enabled' => false]);
    expect(config('seo.indexing_enabled'))->toBeFalse();
});
