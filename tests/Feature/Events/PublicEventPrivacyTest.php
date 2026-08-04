<?php

use App\Enums\EventStatus;
use App\Enums\UserRole;
use App\Models\Event;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

test('1. home Inertia payload does not contain meeting_url in featuredEvents', function () {
    $creator = User::factory()->create(['role' => UserRole::Mentor]);
    Event::factory()->create([
        'created_by' => $creator->id,
        'mentor_id' => $creator->id,
        'is_published' => true,
        'status' => EventStatus::Upcoming,
        'starts_at' => now()->addDay(),
        'meeting_url' => 'https://meet.google.com/private-home-link',
    ]);

    $response = $this->get('/');

    $response->assertStatus(200);
    $response->assertInertia(fn (Assert $page) => $page
        ->component('welcome')
        ->has('featuredEvents', 1)
        ->missing('featuredEvents.0.meeting_url')
    );
    expect($response->getContent())->not()->toContain('https://meet.google.com/private-home-link');
});

test('2. public event listing payload does not contain meeting_url', function () {
    $creator = User::factory()->create(['role' => UserRole::Mentor]);
    Event::factory()->create([
        'created_by' => $creator->id,
        'mentor_id' => $creator->id,
        'is_published' => true,
        'status' => EventStatus::Upcoming,
        'starts_at' => now()->addDay(),
        'meeting_url' => 'https://meet.google.com/private-listing-link',
    ]);

    $response = $this->get('/events');

    $response->assertStatus(200);
    $response->assertInertia(fn (Assert $page) => $page
        ->component('events/index')
        ->has('upcomingEvents.data', 1)
        ->missing('upcomingEvents.data.0.meeting_url')
    );
    expect($response->getContent())->not()->toContain('https://meet.google.com/private-listing-link');
});

test('3 & 7. guest event detail payload and HTML content do not contain meeting_url', function () {
    $creator = User::factory()->create(['role' => UserRole::Mentor]);
    $event = Event::factory()->create([
        'created_by' => $creator->id,
        'mentor_id' => $creator->id,
        'is_published' => true,
        'status' => EventStatus::Upcoming,
        'starts_at' => now()->addDay(),
        'meeting_url' => 'https://meet.google.com/secret-guest-link',
    ]);

    $response = $this->get("/events/{$event->slug}");

    $response->assertStatus(200);
    $response->assertInertia(fn (Assert $page) => $page
        ->component('events/show')
        ->missing('event.meeting_url')
        ->where('meetingUrl', null)
        ->where('canViewMeetingLink', false)
    );
    expect($response->getContent())->not()->toContain('https://meet.google.com/secret-guest-link');
});

test('4. unauthorized authenticated member does not receive meetingUrl', function () {
    $creator = User::factory()->create(['role' => UserRole::Mentor]);
    $user = User::factory()->create(['role' => UserRole::Member]);
    $event = Event::factory()->create([
        'created_by' => $creator->id,
        'mentor_id' => $creator->id,
        'is_published' => true,
        'status' => EventStatus::Upcoming,
        'starts_at' => now()->addDay(),
        'meeting_url' => 'https://meet.google.com/secret-unregistered-link',
    ]);

    $response = $this->actingAs($user)->get("/events/{$event->slug}");

    $response->assertStatus(200);
    $response->assertInertia(fn (Assert $page) => $page
        ->component('events/show')
        ->missing('event.meeting_url')
        ->where('meetingUrl', null)
        ->where('canViewMeetingLink', false)
    );
    expect($response->getContent())->not()->toContain('https://meet.google.com/secret-unregistered-link');
});

test('5. authorized registered member receives meetingUrl in top-level prop', function () {
    $creator = User::factory()->create(['role' => UserRole::Mentor]);
    $user = User::factory()->create(['role' => UserRole::Member]);
    $event = Event::factory()->create([
        'created_by' => $creator->id,
        'mentor_id' => $creator->id,
        'is_published' => true,
        'status' => EventStatus::Upcoming,
        'starts_at' => now()->addDay(),
        'meeting_url' => 'https://meet.google.com/authorized-member-link',
    ]);

    $event->registrations()->create([
        'user_id' => $user->id,
        'name_snapshot' => $user->name,
        'email_snapshot' => $user->email,
        'registered_at' => now(),
    ]);

    $response = $this->actingAs($user)->get("/events/{$event->slug}");

    $response->assertStatus(200);
    $response->assertInertia(fn (Assert $page) => $page
        ->component('events/show')
        ->missing('event.meeting_url')
        ->where('meetingUrl', 'https://meet.google.com/authorized-member-link')
        ->where('canViewMeetingLink', true)
    );
});

test('6. mentor owner and admin behavior matches existing meeting-link policy', function () {
    $mentor = User::factory()->create(['role' => UserRole::Mentor]);
    $admin = User::factory()->create(['role' => UserRole::Admin]);

    $event = Event::factory()->create([
        'created_by' => $mentor->id,
        'mentor_id' => $mentor->id,
        'is_published' => true,
        'status' => EventStatus::Upcoming,
        'starts_at' => now()->addDay(),
        'meeting_url' => 'https://meet.google.com/staff-meeting-link',
    ]);

    // Mentor owner receives meetingUrl
    $this->actingAs($mentor)->get("/events/{$event->slug}")
        ->assertStatus(200)
        ->assertInertia(fn (Assert $page) => $page
            ->component('events/show')
            ->missing('event.meeting_url')
            ->where('meetingUrl', 'https://meet.google.com/staff-meeting-link')
            ->where('canViewMeetingLink', true)
        );

    // Admin receives meetingUrl
    $this->actingAs($admin)->get("/events/{$event->slug}")
        ->assertStatus(200)
        ->assertInertia(fn (Assert $page) => $page
            ->component('events/show')
            ->missing('event.meeting_url')
            ->where('meetingUrl', 'https://meet.google.com/staff-meeting-link')
            ->where('canViewMeetingLink', true)
        );
});

test('8. explicit public event serialization contains all required fields for React page', function () {
    $mentor = User::factory()->create(['name' => 'Mentor Instructor', 'role' => UserRole::Mentor]);
    $event = Event::factory()->create([
        'created_by' => $mentor->id,
        'mentor_id' => $mentor->id,
        'title' => 'Sample Masterclass',
        'slug' => 'sample-masterclass',
        'category' => 'Technology',
        'description' => '<p>Detailed description</p>',
        'status' => EventStatus::Upcoming,
        'access_type' => 'free',
        'is_published' => true,
        'starts_at' => now()->addDays(5),
    ]);

    $response = $this->get("/events/{$event->slug}");

    $response->assertStatus(200);
    $response->assertInertia(fn (Assert $page) => $page
        ->component('events/show')
        ->where('event.id', $event->id)
        ->where('event.title', 'Sample Masterclass')
        ->where('event.slug', 'sample-masterclass')
        ->where('event.category', 'Technology')
        ->where('event.description', '<p>Detailed description</p>')
        ->where('event.status', 'upcoming')
        ->where('event.mentor.name', 'Mentor Instructor')
        ->has('event.poster_image_url')
        ->missing('event.meeting_url')
    );
});

test('9. missing or unpublished events retain correct 404 behavior', function () {
    $creator = User::factory()->create(['role' => UserRole::Mentor]);
    $unpublishedEvent = Event::factory()->create([
        'created_by' => $creator->id,
        'mentor_id' => $creator->id,
        'is_published' => false,
        'status' => EventStatus::Upcoming,
    ]);

    $this->get("/events/{$unpublishedEvent->slug}")
        ->assertStatus(404);

    $this->get('/events/non-existent-slug-12345')
        ->assertStatus(404);
});
