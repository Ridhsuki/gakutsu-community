<?php

use App\Models\BlogPost;
use App\Models\Event;
use App\Models\User;
use App\Support\SeoPolicy;
use Illuminate\Http\Request;
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
            ->where('seo.title', 'Gakutsu')
            ->where('seo.jsonLd.@context', 'https://schema.org')
            ->has('seo.jsonLd.@graph', 2)
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
            ->where('seo.title', 'Understanding Cyber Security - Gakutsu')
            ->where('seo.type', 'article')
            ->where('seo.image', 'https://gakutsu.net/storage/blog-covers/cyber.jpg')
            ->where('seo.jsonLd.@context', 'https://schema.org')
            ->has('seo.jsonLd.@graph', 2)
            ->where('post.title', 'Understanding Cyber Security')
            ->where('post.author.name', 'Alice Mentor')
            ->where('post.published_at', $blog->published_at->toISOString())
            ->missing('post.updated_at')
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
            ->where('seo.jsonLd', null)
        );

    $this->get(route('login'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('auth/login')
            ->where('seo.robots', 'noindex, follow')
            ->where('seo.canonicalUrl', null)
            ->where('seo.jsonLd', null)
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
            ->where('seo.jsonLd', null)
        );

    $this->get(route('blogs.show', $blog))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('seo.robots', 'noindex, nofollow')
            ->where('seo.canonicalUrl', null)
            ->where('seo.jsonLd', null)
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
            ->missing('post.updated_at')
            ->where('seo.jsonLd.@graph.0.datePublished', $blogEqual->published_at->setTimezone('UTC')->toIso8601ZuluString())
            ->where('seo.jsonLd.@graph.0.dateModified', $blogEqual->updated_at->setTimezone('UTC')->toIso8601ZuluString())
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
            ->missing('post.updated_at')
            ->where('seo.jsonLd.@graph.0.datePublished', $blogEarlier->published_at->setTimezone('UTC')->toIso8601ZuluString())
            ->missing('seo.jsonLd.@graph.0.dateModified')
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
            ->where('seo.title', 'Webinar Hacking Basics - Gakutsu')
            ->where('seo.jsonLd.@context', 'https://schema.org')
            ->has('seo.jsonLd.@graph', 1)
            ->where('event.title', 'Webinar Hacking Basics')
        );
});

test('10. SeoPolicy is resolved at most once per request', function () {
    config([
        'app.url' => 'https://gakutsu.net',
        'seo.indexing_enabled' => true,
    ]);

    $resolveCount = 0;
    $policy = new class($resolveCount) extends SeoPolicy
    {
        public function __construct(public int &$count) {}

        public function resolve(Request $request): array
        {
            $this->count++;

            return parent::resolve($request);
        }
    };

    $this->app->instance(SeoPolicy::class, $policy);

    $this->get(route('login'))->assertOk();
    expect($resolveCount)->toBe(1);

    $resolveCount = 0;
    $this->get(route('home'))->assertOk();
    expect($resolveCount)->toBe(1);

    $resolveCount = 0;
    $user = User::factory()->create();
    $blog = BlogPost::factory()->create([
        'status' => 'published',
        'author_id' => $user->id,
    ]);

    $this->get(route('blogs.show', $blog))->assertOk();
    expect($resolveCount)->toBe(1);
});

test('11. public index and registration routes return exact accepted copy and titles', function () {
    config([
        'app.url' => 'https://gakutsu.net',
        'seo.indexing_enabled' => true,
    ]);

    $this->get(route('blogs.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('seo.title', 'Blog - Gakutsu')
            ->where('seo.description', 'Baca artikel terbaru tentang IT, cyber security, pengembangan karier, dan insight komunitas Gakutsu.')
        );

    $this->get(route('events.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('seo.title', 'Events - Gakutsu')
            ->where('seo.description', 'Jelajahi webinar dan event komunitas IT dan Cyber Security dari Gakutsu, termasuk event mendatang dan arsip kegiatan.')
        );

    $user = User::factory()->create();
    $event = Event::factory()->published()->upcoming()->create([
        'title' => 'Webinar Cyber Hacking',
        'created_by' => $user->id,
        'mentor_id' => $user->id,
    ]);

    $this->actingAs($user)->get(route('events.register', $event))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('seo.title', 'Daftar Event - Webinar Cyber Hacking - Gakutsu')
            ->where('seo.description', 'Jawab pertanyaan registrasi dan daftar ke event Webinar Cyber Hacking di Gakutsu.')
        );
});
