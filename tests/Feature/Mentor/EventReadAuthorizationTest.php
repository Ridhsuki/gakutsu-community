<?php

use App\Enums\EventRegistrationQuestionType;
use App\Enums\UserRole;
use App\Models\Event;
use App\Models\EventRegistration;
use App\Models\EventRegistrationQuestion;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('mentor owner can access own registration index while non-owner mentor receives 403', function () {
    $mentorA = User::factory()->create(['role' => UserRole::Mentor]);
    $mentorB = User::factory()->create(['role' => UserRole::Mentor]);
    $member = User::factory()->create(['role' => UserRole::Member]);

    $eventA = Event::factory()->create([
        'created_by' => $mentorA->id,
        'mentor_id' => $mentorA->id,
    ]);

    EventRegistration::create([
        'event_id' => $eventA->id,
        'user_id' => $member->id,
        'name_snapshot' => $member->name,
        'email_snapshot' => $member->email,
        'registered_at' => now(),
    ]);

    $this->actingAs($mentorA)
        ->get(route('mentor.events.registrations.index', $eventA))
        ->assertStatus(200);

    $this->actingAs($mentorB)
        ->get(route('mentor.events.registrations.index', $eventA))
        ->assertStatus(403);
});

test('mentor owner can access own registration question index while non-owner mentor receives 403', function () {
    $mentorA = User::factory()->create(['role' => UserRole::Mentor]);
    $mentorB = User::factory()->create(['role' => UserRole::Mentor]);

    $eventA = Event::factory()->create([
        'created_by' => $mentorA->id,
        'mentor_id' => $mentorA->id,
    ]);

    EventRegistrationQuestion::create([
        'event_id' => $eventA->id,
        'label' => 'What is your background?',
        'type' => EventRegistrationQuestionType::ShortText,
        'is_required' => true,
        'is_active' => true,
        'sort_order' => 1,
    ]);

    $this->actingAs($mentorA)
        ->get(route('mentor.events.registration-questions.index', $eventA))
        ->assertStatus(200);

    $this->actingAs($mentorB)
        ->get(route('mentor.events.registration-questions.index', $eventA))
        ->assertStatus(403);
});

test('unauthenticated guest is redirected to login for mentor registration and question index routes', function () {
    $mentor = User::factory()->create(['role' => UserRole::Mentor]);
    $event = Event::factory()->create([
        'created_by' => $mentor->id,
        'mentor_id' => $mentor->id,
    ]);

    $this->get(route('mentor.events.registrations.index', $event))
        ->assertRedirect(route('login'));

    $this->get(route('mentor.events.registration-questions.index', $event))
        ->assertRedirect(route('login'));
});

test('member user receives 403 from mentor middleware for mentor registration and question index routes', function () {
    $mentor = User::factory()->create(['role' => UserRole::Mentor]);
    $member = User::factory()->create(['role' => UserRole::Member]);

    $event = Event::factory()->create([
        'created_by' => $mentor->id,
        'mentor_id' => $mentor->id,
    ]);

    $this->actingAs($member)
        ->get(route('mentor.events.registrations.index', $event))
        ->assertStatus(403);

    $this->actingAs($member)
        ->get(route('mentor.events.registration-questions.index', $event))
        ->assertStatus(403);
});
