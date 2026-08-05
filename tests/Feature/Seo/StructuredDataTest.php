<?php

use App\Models\BlogPost;
use App\Models\Event;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('1. home returns expected shared seo props for structured data composition', function () {
    config([
        'app.url' => 'https://gakutsu.net',
        'seo.indexing_enabled' => true,
    ]);

    $response = $this->get(route('home'));

    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('welcome')
            ->where('seo.robots', 'index, follow')
            ->where('seo.canonicalUrl', 'https://gakutsu.net/')
            ->where('seo.baseUrl', 'https://gakutsu.net')
            ->where('seo.siteName', 'Gakutsu')
        );
});

test('2. blog detail page returns complete post props required for BlogPosting graph', function () {
    config([
        'app.url' => 'https://gakutsu.net',
        'seo.indexing_enabled' => true,
    ]);

    $user = User::factory()->create(['name' => 'Alice Mentor']);
    $blog = BlogPost::factory()->create([
        'status' => 'published',
        'title' => 'Understanding Cyber Security',
        'content' => '<p>Factual article content for Gakutsu community.</p>',
        'published_at' => now()->subDays(2),
        'updated_at' => now()->subDay(),
        'author_id' => $user->id,
        'cover_image_path' => 'blog-covers/cyber.jpg',
    ]);

    $response = $this->get(route('blogs.show', $blog));

    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('blogs/show')
            ->where('seo.robots', 'index, follow')
            ->where('seo.canonicalUrl', 'https://gakutsu.net/blogs/'.$blog->slug)
            ->where('seo.baseUrl', 'https://gakutsu.net')
            ->where('post.title', 'Understanding Cyber Security')
            ->where('post.author.name', 'Alice Mentor')
            ->where('post.published_at', $blog->published_at->toISOString())
            ->where('post.updated_at', $blog->updated_at->toISOString())
            ->where('post.cover_image_url', Storage::disk('public')->url('blog-covers/cyber.jpg'))
        );
});

test('3. blog detail page does not expose meeting_url or private data', function () {
    config([
        'app.url' => 'https://gakutsu.net',
        'seo.indexing_enabled' => true,
    ]);

    $user = User::factory()->create();
    $blog = BlogPost::factory()->create([
        'status' => 'published',
        'author_id' => $user->id,
    ]);

    $response = $this->get(route('blogs.show', $blog));

    $response->assertOk();
    $content = $response->getContent();

    expect($content)->not()->toContain('meeting_url');
});

test('4. unpublished blog post returns 404 and does not expose props or structured data', function () {
    config([
        'app.url' => 'https://gakutsu.net',
        'seo.indexing_enabled' => true,
    ]);

    $user = User::factory()->create();
    $draftBlog = BlogPost::factory()->create([
        'status' => 'draft',
        'author_id' => $user->id,
    ]);

    $this->get(route('blogs.show', $draftBlog))->assertStatus(404);
});

test('5. noindex routes or search queries return null canonical and noindex robots', function () {
    config([
        'app.url' => 'https://gakutsu.net',
        'seo.indexing_enabled' => true,
    ]);

    $this->get(route('blogs.index', ['search' => 'cyber']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('blogs/index')
            ->where('seo.robots', 'noindex, follow')
            ->where('seo.canonicalUrl', null)
        );

    $this->get(route('login'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('auth/login')
            ->where('seo.robots', 'noindex, follow')
            ->where('seo.canonicalUrl', null)
        );
});

test('6. SEO_INDEXING_ENABLED=false returns noindex, nofollow and null canonical for all routes', function () {
    config([
        'app.url' => 'https://gakutsu.net',
        'seo.indexing_enabled' => false,
    ]);

    $user = User::factory()->create();
    $blog = BlogPost::factory()->create([
        'status' => 'published',
        'author_id' => $user->id,
    ]);

    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('seo.robots', 'noindex, nofollow')
            ->where('seo.canonicalUrl', null)
        );

    $this->get(route('blogs.show', $blog))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('seo.robots', 'noindex, nofollow')
            ->where('seo.canonicalUrl', null)
        );
});

test('7. hostile request Host header does not alter APP_URL canonical or base URL', function () {
    config([
        'app.url' => 'https://gakutsu.net',
        'seo.indexing_enabled' => true,
    ]);

    $response = $this->withHeaders([
        'Host' => 'attacker.example.com',
    ])->get(route('home'));

    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('seo.canonicalUrl', 'https://gakutsu.net/')
            ->where('seo.baseUrl', 'https://gakutsu.net')
        );
});

test('8. blog detail page handles timestamp variations for factual dateModified', function () {
    config([
        'app.url' => 'https://gakutsu.net',
        'seo.indexing_enabled' => true,
    ]);

    $user = User::factory()->create();

    // Equal timestamps
    $now = now();
    $blogEqual = BlogPost::factory()->create([
        'status' => 'published',
        'author_id' => $user->id,
        'published_at' => $now,
        'updated_at' => $now,
    ]);

    $this->get(route('blogs.show', $blogEqual))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('post.published_at', $blogEqual->published_at->toISOString())
            ->where('post.updated_at', $blogEqual->updated_at->toISOString())
        );

    // Updated_at earlier than published_at
    $blogEarlier = BlogPost::factory()->create([
        'status' => 'published',
        'author_id' => $user->id,
        'published_at' => $now,
        'updated_at' => $now->copy()->subDay(),
    ]);

    $this->get(route('blogs.show', $blogEarlier))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('post.published_at', $blogEarlier->published_at->toISOString())
            ->where('post.updated_at', $blogEarlier->updated_at->toISOString())
        );
});

test('9. event detail page returns complete event props required for BreadcrumbList graph', function () {
    config([
        'app.url' => 'https://gakutsu.net',
        'seo.indexing_enabled' => true,
    ]);

    $user = User::factory()->create(['name' => 'Alice Mentor']);
    $event = Event::factory()->published()->upcoming()->create([
        'title' => 'Webinar Hacking Basics',
        'created_by' => $user->id,
        'mentor_id' => $user->id,
    ]);

    $response = $this->get(route('events.show', $event));

    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('events/show')
            ->where('seo.robots', 'index, follow')
            ->where('seo.canonicalUrl', 'https://gakutsu.net/events/'.$event->slug)
            ->where('seo.baseUrl', 'https://gakutsu.net')
            ->where('event.title', 'Webinar Hacking Basics')
        );
});
