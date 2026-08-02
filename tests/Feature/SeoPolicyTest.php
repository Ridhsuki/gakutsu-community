<?php

use App\Models\BlogPost;
use App\Models\Event;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('1. home returns index/follow and clean home canonical', function () {
    config(['app.url' => 'https://gakutsu.net']);

    $response = $this->get(route('home'));

    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('welcome')
            ->where('seo.robots', 'index, follow')
            ->where('seo.canonicalUrl', 'https://gakutsu.net/')
            ->where('seo.siteName', 'Gakutsu')
        );
});

test('2. public detail routes produce an absolute canonical', function () {
    config(['app.url' => 'https://gakutsu.net']);

    $user = User::factory()->create();
    $event = Event::factory()->published()->upcoming()->create([
        'created_by' => $user->id,
        'mentor_id' => $user->id,
    ]);
    $blog = BlogPost::factory()->create([
        'status' => 'published',
        'author_id' => $user->id,
    ]);

    $this->get(route('events.show', $event))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('events/show')
            ->where('seo.robots', 'index, follow')
            ->where('seo.canonicalUrl', 'https://gakutsu.net/events/'.$event->slug)
        );

    $this->get(route('blogs.show', $blog))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('blogs/show')
            ->where('seo.robots', 'index, follow')
            ->where('seo.canonicalUrl', 'https://gakutsu.net/blogs/'.$blog->slug)
        );
});

test('3. pure pagination preserves the page parameter in a self-canonical', function () {
    config(['app.url' => 'https://gakutsu.net']);

    $this->get(route('blogs.index', ['page' => 2]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('blogs/index')
            ->where('seo.robots', 'index, follow')
            ->where('seo.canonicalUrl', 'https://gakutsu.net/blogs?page=2')
        );

    $this->get(route('events.index', ['upcoming_page' => 2]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('events/index')
            ->where('seo.robots', 'index, follow')
            ->where('seo.canonicalUrl', 'https://gakutsu.net/events?upcoming_page=2')
        );
});

test('4. first-page pagination removes the redundant page=1 parameter', function () {
    config(['app.url' => 'https://gakutsu.net']);

    $this->get(route('blogs.index', ['page' => 1]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('blogs/index')
            ->where('seo.robots', 'index, follow')
            ->where('seo.canonicalUrl', 'https://gakutsu.net/blogs')
        );

    $this->get(route('events.index', ['upcoming_page' => 1]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('events/index')
            ->where('seo.robots', 'index, follow')
            ->where('seo.canonicalUrl', 'https://gakutsu.net/events')
        );
});

test('5. search/filter/sort variants return noindex/follow and no conflicting canonical', function () {
    config(['app.url' => 'https://gakutsu.net']);

    $this->get(route('blogs.index', ['search' => 'cyber']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('blogs/index')
            ->where('seo.robots', 'noindex, follow')
            ->where('seo.canonicalUrl', null)
        );

    $this->get(route('events.index', ['sort' => 'date']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('events/index')
            ->where('seo.robots', 'noindex, follow')
            ->where('seo.canonicalUrl', null)
        );
});

test('6. event registration returns noindex/follow', function () {
    config(['app.url' => 'https://gakutsu.net']);

    $user = User::factory()->create();
    $event = Event::factory()->published()->upcoming()->create([
        'created_by' => $user->id,
        'mentor_id' => $user->id,
    ]);

    $this->actingAs($user)
        ->get(route('events.register', $event))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('events/register')
            ->where('seo.robots', 'noindex, follow')
            ->where('seo.canonicalUrl', null)
        );
});

test('7. auth routes return noindex/follow', function () {
    config(['app.url' => 'https://gakutsu.net']);

    $this->get(route('login'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('auth/login')
            ->where('seo.robots', 'noindex, follow')
            ->where('seo.canonicalUrl', null)
        );

    $this->get(route('register'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('auth/register')
            ->where('seo.robots', 'noindex, follow')
            ->where('seo.canonicalUrl', null)
        );
});

test('8. admin, mentor, and settings routes return noindex/nofollow', function () {
    config(['app.url' => 'https://gakutsu.net']);

    $admin = User::factory()->create(['role' => 'admin']);
    $mentor = User::factory()->create(['role' => 'mentor']);

    $this->actingAs($admin)
        ->get(route('admin.events.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/events/index')
            ->where('seo.robots', 'noindex, nofollow')
            ->where('seo.canonicalUrl', null)
        );

    $this->actingAs($mentor)
        ->get(route('mentor.events.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('mentor/events/index')
            ->where('seo.robots', 'noindex, nofollow')
            ->where('seo.canonicalUrl', null)
        );

    $this->actingAs($admin)
        ->get(route('profile.edit'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('settings/profile')
            ->where('seo.robots', 'noindex, nofollow')
            ->where('seo.canonicalUrl', null)
        );

    $this->actingAs($admin)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->where('seo.robots', 'noindex, nofollow')
            ->where('seo.canonicalUrl', null)
        );
});

test('9. canonical origin comes from config(app.url)', function () {
    config(['app.url' => 'https://custom-origin.com']);

    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('seo.canonicalUrl', 'https://custom-origin.com/')
        );

    $this->get(route('blogs.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('seo.canonicalUrl', 'https://custom-origin.com/blogs')
        );
});

test('10. malformed or unexpected query parameters do not become indexable canonicals', function () {
    config(['app.url' => 'https://gakutsu.net']);

    $this->get(route('blogs.index', ['unknown_param' => 123]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('seo.robots', 'noindex, follow')
            ->where('seo.canonicalUrl', null)
        );

    $this->get(route('blogs.index', ['page' => -5]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('seo.robots', 'noindex, follow')
            ->where('seo.canonicalUrl', null)
        );

    $this->get(route('events.index', ['upcoming_page' => 'invalid']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('seo.robots', 'noindex, follow')
            ->where('seo.canonicalUrl', null)
        );

    config(['app.url' => 'invalid-url-without-scheme']);

    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('seo.robots', 'index, follow')
            ->where('seo.canonicalUrl', null)
        );
});
