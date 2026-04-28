<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

// Controllers
use App\Http\Controllers\Blog\BlogEditorImageController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\BlogPostController as AdminBlogPostController;
use App\Http\Controllers\Admin\EventController as AdminEventController;
use App\Http\Controllers\Admin\EventRegistrationController as AdminEventRegistrationController;
use App\Http\Controllers\Admin\EventRegistrationQuestionController as AdminEventRegistrationQuestionController;

use App\Http\Controllers\Mentor\BlogPostController as MentorBlogPostController;
use App\Http\Controllers\Mentor\EventController as MentorEventController;
use App\Http\Controllers\Mentor\EventRegistrationController as MentorEventRegistrationController;
use App\Http\Controllers\Mentor\EventRegistrationQuestionController as MentorEventRegistrationQuestionController;

use App\Http\Controllers\Site\HomeController;
use App\Http\Controllers\Site\BlogController as SiteBlogController;
use App\Http\Controllers\Site\EventController as SiteEventController;
use App\Http\Controllers\Event\EventRegistrationController;

// Middleware
use App\Http\Middleware\EnsureUserIsAdmin;
use App\Http\Middleware\EnsureUserIsMentor;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
Route::get('/', [HomeController::class, 'index'])->name('home');

Route::prefix('blogs')->name('blogs.')->group(function () {
    Route::get('/', [SiteBlogController::class, 'index'])->name('index');
    Route::get('{blog:slug}', [SiteBlogController::class, 'show'])->name('show');
});

Route::prefix('events')->name('events.')->group(function () {
    Route::get('/', [SiteEventController::class, 'index'])->name('index');
    Route::get('{event:slug}', [SiteEventController::class, 'show'])->name('show');
});

/*
|--------------------------------------------------------------------------
| Authenticated Routes
|--------------------------------------------------------------------------
*/
/*
|--------------------------------------------------------------------------
| Authenticated Routes
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('/dashboard', fn() => inertia('dashboard'))->name('dashboard');

    Route::post('editor/blog-images', [BlogEditorImageController::class, 'store'])
        ->name('editor.blog-images.store');

    Route::prefix('events')->name('events.')->group(function () {

        Route::get('{event:slug}/register', [SiteEventController::class, 'register'])
            ->name('register');

        Route::post('{event}/registrations', [EventRegistrationController::class, 'store'])
            ->name('registrations.store');
    });
});
/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/
Route::prefix('admin')
    ->name('admin.')
    ->middleware(['auth', 'verified', EnsureUserIsAdmin::class])
    ->group(function () {

        Route::resource('users', UserController::class)->except(['show', 'create', 'edit']);
        Route::resource('blogs', AdminBlogPostController::class)->except(['show', 'create', 'edit']);
        Route::resource('events', AdminEventController::class);

        Route::prefix('events/{event}')->group(function () {

            Route::get('registrations', [AdminEventRegistrationController::class, 'index'])
                ->name('events.registrations.index');

            Route::get('registrations/{registration}', [AdminEventRegistrationController::class, 'show'])
                ->name('events.registrations.show');

            Route::prefix('registration-questions')->group(function () {

                Route::get('/', [AdminEventRegistrationQuestionController::class, 'index'])
                    ->name('events.registration-questions.index');

                Route::post('/', [AdminEventRegistrationQuestionController::class, 'store'])
                    ->name('events.registration-questions.store');

                Route::put('{registrationQuestion}', [AdminEventRegistrationQuestionController::class, 'update'])
                    ->name('events.registration-questions.update');

                Route::delete('{registrationQuestion}', [AdminEventRegistrationQuestionController::class, 'destroy'])
                    ->name('events.registration-questions.destroy');
            });
        });
    });

/*
|--------------------------------------------------------------------------
| Mentor Routes
|--------------------------------------------------------------------------
*/
Route::prefix('mentor')
    ->name('mentor.')
    ->middleware(['auth', 'verified', EnsureUserIsMentor::class])
    ->group(function () {

        Route::resource('blogs', MentorBlogPostController::class)->except(['show', 'create', 'edit']);
        Route::resource('events', MentorEventController::class);

        Route::prefix('events/{event}')->group(function () {

            Route::get('registrations', [MentorEventRegistrationController::class, 'index'])
                ->name('events.registrations.index');

            Route::get('registrations/{registration}', [MentorEventRegistrationController::class, 'show'])
                ->name('events.registrations.show');

            Route::prefix('registration-questions')->group(function () {

                Route::get('/', [MentorEventRegistrationQuestionController::class, 'index'])
                    ->name('events.registration-questions.index');

                Route::post('/', [MentorEventRegistrationQuestionController::class, 'store'])
                    ->name('events.registration-questions.store');

                Route::put('{registrationQuestion}', [MentorEventRegistrationQuestionController::class, 'update'])
                    ->name('events.registration-questions.update');

                Route::delete('{registrationQuestion}', [MentorEventRegistrationQuestionController::class, 'destroy'])
                    ->name('events.registration-questions.destroy');
            });
        });
    });

require __DIR__ . '/settings.php';
