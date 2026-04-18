<?php

use App\Http\Controllers\Blog\BlogEditorImageController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;
use App\Http\Controllers\Admin\UserController;
use App\Http\Middleware\EnsureUserIsAdmin;
use App\Http\Middleware\EnsureUserIsMentor;
use App\Http\Controllers\Admin\BlogPostController as AdminBlogPostController;
use App\Http\Controllers\Mentor\BlogPostController as MentorBlogPostController;
use App\Http\Controllers\Admin\EventController as AdminEventController;
use App\Http\Controllers\Admin\EventRegistrationController as AdminEventRegistrationController;
use App\Http\Controllers\Event\EventBrowseController;
use App\Http\Controllers\Event\EventRegistrationController;
use App\Http\Controllers\Mentor\EventController as MentorEventController;
use App\Http\Controllers\Mentor\EventRegistrationController as MentorEventRegistrationController;
use App\Http\Controllers\Admin\EventRegistrationQuestionController as AdminEventRegistrationQuestionController;
use App\Http\Controllers\Mentor\EventRegistrationQuestionController as MentorEventRegistrationQuestionController;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');


Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

Route::middleware(['auth', 'verified'])->post(
    'editor/blog-images',
    [BlogEditorImageController::class, 'store']
)->name('editor.blog-images.store');

Route::middleware(['auth', 'verified', EnsureUserIsAdmin::class])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::resource('users', UserController::class)->except(['show', 'create', 'edit']);
        Route::resource('blogs', AdminBlogPostController::class)->except(['show', 'create', 'edit']);
        Route::resource('events', AdminEventController::class);

        Route::get(
            'events/{event}/registrations',
            [AdminEventRegistrationController::class, 'index']
        )->name('events.registrations.index');

        Route::get(
            'events/{event}/registration-questions',
            [AdminEventRegistrationQuestionController::class, 'index']
        )->name('events.registration-questions.index');

        Route::post(
            'events/{event}/registration-questions',
            [AdminEventRegistrationQuestionController::class, 'store']
        )->name('events.registration-questions.store');

        Route::put(
            'events/{event}/registration-questions/{registrationQuestion}',
            [AdminEventRegistrationQuestionController::class, 'update']
        )->name('events.registration-questions.update');

        Route::delete(
            'events/{event}/registration-questions/{registrationQuestion}',
            [AdminEventRegistrationQuestionController::class, 'destroy']
        )->name('events.registration-questions.destroy');
    });

Route::middleware(['auth', 'verified', EnsureUserIsMentor::class])
    ->prefix('mentor')
    ->name('mentor.')
    ->group(function () {
        Route::resource('blogs', MentorBlogPostController::class)->except(['show', 'create', 'edit']);
        Route::resource('events', MentorEventController::class);

        Route::get(
            'events/{event}/registrations',
            [MentorEventRegistrationController::class, 'index']
        )->name('events.registrations.index');

        Route::get(
            'events/{event}/registration-questions',
            [MentorEventRegistrationQuestionController::class, 'index']
        )->name('events.registration-questions.index');

        Route::post(
            'events/{event}/registration-questions',
            [MentorEventRegistrationQuestionController::class, 'store']
        )->name('events.registration-questions.store');

        Route::put(
            'events/{event}/registration-questions/{registrationQuestion}',
            [MentorEventRegistrationQuestionController::class, 'update']
        )->name('events.registration-questions.update');

        Route::delete(
            'events/{event}/registration-questions/{registrationQuestion}',
            [MentorEventRegistrationQuestionController::class, 'destroy']
        )->name('events.registration-questions.destroy');
    });

Route::get('/events', [EventBrowseController::class, 'index'])->name('events.index');
Route::get('/events/{event:slug}', [EventBrowseController::class, 'show'])->name('events.show');

Route::middleware(['auth', 'verified'])->post(
    '/events/{event}/registrations',
    [EventRegistrationController::class, 'store']
)->name('events.registrations.store');


Route::middleware(['auth', 'verified', EnsureUserIsMentor::class])
    ->prefix('mentor')
    ->name('mentor.')
    ->group(function () {

    });

require __DIR__ . '/settings.php';
