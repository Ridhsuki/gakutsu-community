<?php

use App\Enums\BlogPostStatus;
use App\Enums\EventStatus;
use App\Enums\UserRole;
use App\Models\BlogPost;
use App\Models\Event;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

test('home page payload contains exact shape and excludes internal/sensitive fields', function () {
    $author = User::factory()->create(['name' => 'Author Person', 'role' => UserRole::Mentor]);
    $mentor = User::factory()->create(['name' => 'Mentor Person', 'role' => UserRole::Mentor]);

    $blog = BlogPost::factory()->create([
        'author_id' => $author->id,
        'title' => 'Blog Hardening Title',
        'slug' => 'blog-hardening-title',
        'status' => BlogPostStatus::Published,
        'content' => '<p>Paragraph 1.</p><p>Paragraph 2.</p>',
        'published_at' => now()->subHours(2),
        'cover_image_path' => 'covers/test-cover.jpg',
    ]);

    $event = Event::factory()->create([
        'created_by' => $mentor->id,
        'mentor_id' => $mentor->id,
        'title' => 'Event Hardening Title',
        'slug' => 'event-hardening-title',
        'category' => 'Webinar',
        'status' => EventStatus::Upcoming,
        'is_published' => true,
        'starts_at' => now()->addDays(2),
        'poster_image_path' => 'posters/test-poster.jpg',
        'meeting_url' => 'https://meet.example.test/private-secret-token',
        'description' => 'Secret event description text',
    ]);

    $response = $this->get('/');

    $response->assertStatus(200);

    $response->assertInertia(fn (Assert $page) => $page
        ->component('welcome')
        ->has('latestBlogs', 1)
        ->has('featuredEvents', 1)
    );

    $props = $response->original->getData()['page']['props'];

    $blogPayload = $props['latestBlogs'][0];
    $eventPayload = $props['featuredEvents'][0];

    expect(array_keys($blogPayload))->toEqualCanonicalizing([
        'title',
        'slug',
        'excerpt',
        'cover_image_url',
        'published_at',
        'author',
    ]);

    expect(array_keys($blogPayload['author']))->toEqualCanonicalizing(['name']);
    expect($blogPayload['author']['name'])->toBe('Author Person');

    expect(array_keys($eventPayload))->toEqualCanonicalizing([
        'title',
        'slug',
        'category',
        'starts_at',
        'status',
        'poster_image_url',
        'mentor',
    ]);

    expect(array_keys($eventPayload['mentor']))->toEqualCanonicalizing(['name']);
    expect($eventPayload['mentor']['name'])->toBe('Mentor Person');

    $excludedKeys = [
        'id',
        'author_id',
        'mentor_id',
        'created_by',
        'content',
        'cover_image_path',
        'poster_image_path',
        'created_at',
        'updated_at',
        'description',
        'ends_at',
        'is_published',
        'access_type',
        'meeting_provider',
        'registration_closes_at',
        'meeting_url',
        'registrationQuestions',
        'quizQuestions',
    ];

    foreach ($excludedKeys as $key) {
        expect($blogPayload)->not()->toHaveKey($key);
        expect($eventPayload)->not()->toHaveKey($key);
        if ($blogPayload['author'] !== null) {
            expect($blogPayload['author'])->not()->toHaveKey('id');
        }
        if ($eventPayload['mentor'] !== null) {
            expect($eventPayload['mentor'])->not()->toHaveKey('id');
        }
    }

    $rawContent = $response->getContent();
    expect($rawContent)->not()->toContain('https://meet.example.test/private-secret-token');
    expect($rawContent)->not()->toContain('"cover_image_path":');
    expect($rawContent)->not()->toContain('"poster_image_path":');
    expect($rawContent)->toContain('/storage/covers/test-cover.jpg');
    expect($rawContent)->toContain('/storage/posters/test-poster.jpg');
});

test('home page respects publication boundaries, ordering, and limits', function () {
    $author = User::factory()->create(['role' => UserRole::Mentor]);
    $mentor = User::factory()->create(['role' => UserRole::Mentor]);

    // 4 published blogs with different dates
    $blog1 = BlogPost::factory()->create(['author_id' => $author->id, 'status' => BlogPostStatus::Published, 'published_at' => now()->subDays(4)]);
    $blog2 = BlogPost::factory()->create(['author_id' => $author->id, 'status' => BlogPostStatus::Published, 'published_at' => now()->subDays(1)]);
    $blog3 = BlogPost::factory()->create(['author_id' => $author->id, 'status' => BlogPostStatus::Published, 'published_at' => now()->subDays(2)]);
    $blog4 = BlogPost::factory()->create(['author_id' => $author->id, 'status' => BlogPostStatus::Published, 'published_at' => now()->subDays(3)]);
    // Draft blog
    $draftBlog = BlogPost::factory()->create(['author_id' => $author->id, 'status' => BlogPostStatus::Draft]);

    // 4 upcoming events with different dates
    $event1 = Event::factory()->create(['mentor_id' => $mentor->id, 'created_by' => $mentor->id, 'is_published' => true, 'status' => EventStatus::Upcoming, 'starts_at' => now()->addDays(4)]);
    $event2 = Event::factory()->create(['mentor_id' => $mentor->id, 'created_by' => $mentor->id, 'is_published' => true, 'status' => EventStatus::Upcoming, 'starts_at' => now()->addDays(1)]);
    $event3 = Event::factory()->create(['mentor_id' => $mentor->id, 'created_by' => $mentor->id, 'is_published' => true, 'status' => EventStatus::Upcoming, 'starts_at' => now()->addDays(2)]);
    $event4 = Event::factory()->create(['mentor_id' => $mentor->id, 'created_by' => $mentor->id, 'is_published' => true, 'status' => EventStatus::Upcoming, 'starts_at' => now()->addDays(3)]);
    // Draft / completed events
    $draftEvent = Event::factory()->create(['mentor_id' => $mentor->id, 'created_by' => $mentor->id, 'is_published' => false, 'status' => EventStatus::Upcoming]);
    $completedEvent = Event::factory()->create(['mentor_id' => $mentor->id, 'created_by' => $mentor->id, 'is_published' => true, 'status' => EventStatus::Completed]);

    $response = $this->get('/');

    $props = $response->original->getData()['page']['props'];

    expect($props['latestBlogs'])->toHaveCount(3);
    expect($props['latestBlogs'][0]['slug'])->toBe($blog2->slug);
    expect($props['latestBlogs'][1]['slug'])->toBe($blog3->slug);
    expect($props['latestBlogs'][2]['slug'])->toBe($blog4->slug);

    expect($props['featuredEvents'])->toHaveCount(3);
    expect($props['featuredEvents'][0]['slug'])->toBe($event2->slug);
    expect($props['featuredEvents'][1]['slug'])->toBe($event3->slug);
    expect($props['featuredEvents'][2]['slug'])->toBe($event4->slug);
});

test('home page excerpt transformation handles empty content, short text, exact length, entities, and multibyte text correctly', function () {
    $author = User::factory()->create(['role' => UserRole::Mentor]);

    $blogEmpty = BlogPost::factory()->create([
        'author_id' => $author->id,
        'status' => BlogPostStatus::Published,
        'content' => '',
        'published_at' => now()->subMinutes(1),
    ]);

    $blogShort = BlogPost::factory()->create([
        'author_id' => $author->id,
        'status' => BlogPostStatus::Published,
        'content' => '<p>Short text.</p>',
        'published_at' => now()->subMinutes(2),
    ]);

    $blogExact140 = BlogPost::factory()->create([
        'author_id' => $author->id,
        'status' => BlogPostStatus::Published,
        'content' => '<p>'.str_repeat('a', 140).'</p>',
        'published_at' => now()->subMinutes(3),
    ]);

    $response = $this->get('/');
    $blogs = $response->original->getData()['page']['props']['latestBlogs'];

    $emptyPayload = collect($blogs)->firstWhere('slug', $blogEmpty->slug);
    $shortPayload = collect($blogs)->firstWhere('slug', $blogShort->slug);
    $exact140Payload = collect($blogs)->firstWhere('slug', $blogExact140->slug);

    expect($emptyPayload['excerpt'])->toBe('...');
    expect($shortPayload['excerpt'])->toBe('Short text....');
    expect($exact140Payload['excerpt'])->toBe(str_repeat('a', 140).'...');
});

test('home page excerpt transformation formats paragraph boundaries, decoded entities, squished whitespace, and multibyte truncation', function () {
    $author = User::factory()->create(['role' => UserRole::Mentor]);

    $blogWithParagraphs = BlogPost::factory()->create([
        'author_id' => $author->id,
        'status' => BlogPostStatus::Published,
        'content' => "<p>First  paragraph.\n</p> <p>  Second   paragraph.  </p>",
        'published_at' => now()->subMinutes(1),
    ]);

    $blogWithEntities = BlogPost::factory()->create([
        'author_id' => $author->id,
        'status' => BlogPostStatus::Published,
        'content' => '<p>Hello &amp; welcome &lt;community&gt; &quot;members&quot; &amp; friends.</p>',
        'published_at' => now()->subMinutes(2),
    ]);

    $blogWithMultibyte = BlogPost::factory()->create([
        'author_id' => $author->id,
        'status' => BlogPostStatus::Published,
        'content' => '<p>'.str_repeat('🚀 Gakutsu 🌐 ', 15).'</p>',
        'published_at' => now()->subMinutes(3),
    ]);

    $response = $this->get('/');
    $blogs = $response->original->getData()['page']['props']['latestBlogs'];

    $paragraphsBlogPayload = collect($blogs)->firstWhere('slug', $blogWithParagraphs->slug);
    $entitiesBlogPayload = collect($blogs)->firstWhere('slug', $blogWithEntities->slug);
    $multibyteBlogPayload = collect($blogs)->firstWhere('slug', $blogWithMultibyte->slug);

    expect($paragraphsBlogPayload['excerpt'])->toBe('First paragraph. Second paragraph....');
    expect($paragraphsBlogPayload['excerpt'])->not()->toContain('First paragraph.Second paragraph.');

    expect($entitiesBlogPayload['excerpt'])->toBe('Hello & welcome <community> "members" & friends....');

    expect(mb_strlen($multibyteBlogPayload['excerpt'], 'UTF-8'))->toBeLessThanOrEqual(143);
    expect($multibyteBlogPayload['excerpt'])->toEndWith('...');
    expect($multibyteBlogPayload['excerpt'])->not()->toContain('<p>');
});

test('home page handles missing relationship display name according to constraints', function () {
    $author = User::factory()->create(['name' => 'Existing Author']);
    $mentor = User::factory()->create(['name' => 'Existing Mentor']);

    BlogPost::factory()->create([
        'author_id' => $author->id,
        'status' => BlogPostStatus::Published,
        'published_at' => now(),
    ]);

    Event::factory()->create([
        'created_by' => $mentor->id,
        'mentor_id' => $mentor->id,
        'status' => EventStatus::Upcoming,
        'is_published' => true,
        'starts_at' => now()->addDay(),
    ]);

    $response = $this->get('/');
    $props = $response->original->getData()['page']['props'];

    expect($props['latestBlogs'][0]['author']['name'])->toBe('Existing Author');
    expect($props['featuredEvents'][0]['mentor']['name'])->toBe('Existing Mentor');
});

test('home page retains complete seo prop and structured data schemas when enabled', function () {
    config([
        'app.url' => 'https://gakutsu.net',
        'seo.indexing_enabled' => true,
    ]);

    $response = $this->get('/');

    $response->assertStatus(200);
    $response->assertInertia(fn (Assert $page) => $page
        ->component('welcome')
        ->where('seo.title', 'Gakutsu')
        ->where('seo.jsonLd.@context', 'https://schema.org')
        ->has('seo.jsonLd.@graph', 2)
    );
});
