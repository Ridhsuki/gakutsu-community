<?php

use App\Http\Controllers\Admin\BlogPostController as AdminBlogPostController;
use App\Http\Controllers\Admin\EventController as AdminEventController;
// Controllers
use App\Http\Controllers\Admin\EventQuizAttemptController as AdminEventQuizAttemptController;
use App\Http\Controllers\Admin\EventQuizQuestionController as AdminEventQuizQuestionController;
use App\Http\Controllers\Admin\EventRegistrationController as AdminEventRegistrationController;
use App\Http\Controllers\Admin\EventRegistrationQuestionController as AdminEventRegistrationQuestionController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Blog\BlogEditorImageController;
use App\Http\Controllers\Event\EventQuizController;
use App\Http\Controllers\Event\EventRegistrationController;
use App\Http\Controllers\Mentor\BlogPostController as MentorBlogPostController;
use App\Http\Controllers\Mentor\EventController as MentorEventController;
use App\Http\Controllers\Mentor\EventQuizAttemptController as MentorEventQuizAttemptController;
use App\Http\Controllers\Mentor\EventQuizQuestionController as MentorEventQuizQuestionController;
use App\Http\Controllers\Mentor\EventRegistrationController as MentorEventRegistrationController;
use App\Http\Controllers\Mentor\EventRegistrationQuestionController as MentorEventRegistrationQuestionController;
// Middleware
use App\Http\Controllers\Site\BlogController as SiteBlogController;
use App\Http\Controllers\Site\EventController as SiteEventController;
use App\Http\Controllers\Site\HomeController;
use App\Http\Middleware\EnsureUserIsAdmin;
use App\Http\Middleware\EnsureUserIsMentor;
use Illuminate\Support\Facades\Route;

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
Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('/dashboard', fn () => inertia('dashboard'))->name('dashboard');

    Route::post('editor/blog-images', [BlogEditorImageController::class, 'store'])
        ->name('editor.blog-images.store');

    Route::prefix('events')->name('events.')->group(function () {

        Route::get('{event:slug}/register', [SiteEventController::class, 'register'])
            ->name('register');

        Route::post('{event}/registrations', [EventRegistrationController::class, 'store'])
            ->name('registrations.store');

        // Route::get('{event:slug}/quiz', [EventQuizController::class, 'show'])
        //     ->middleware(['auth', 'verified'])
        //     ->name('quiz.show');

        // Route::post('{event}/quiz-attempts', [EventQuizController::class, 'store'])
        //     ->middleware(['auth', 'verified'])
        //     ->name('quiz-attempts.store');

        // Route::get('{event:slug}/quiz-result', [EventQuizController::class, 'result'])
        //     ->middleware(['auth', 'verified'])
        //     ->name('quiz.result');
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

            Route::prefix('quiz-questions')->group(function () {
                Route::get('/', [AdminEventQuizQuestionController::class, 'index'])
                    ->name('events.quiz-questions.index');
                Route::post('/', [AdminEventQuizQuestionController::class, 'store'])
                    ->name('events.quiz-questions.store');
                Route::put('{question}', [AdminEventQuizQuestionController::class, 'update'])
                    ->name('events.quiz-questions.update');
                Route::delete('{question}', [AdminEventQuizQuestionController::class, 'destroy'])
                    ->name('events.quiz-questions.destroy');
            });

            Route::prefix('quiz-attempts')->group(function () {
                Route::get('/', [AdminEventQuizAttemptController::class, 'index'])
                    ->name('events.quiz-attempts.index');
                Route::get('{attempt}', [AdminEventQuizAttemptController::class, 'show'])
                    ->name('events.quiz-attempts.show');
                Route::patch('{attempt}/answers/{answer}', [AdminEventQuizAttemptController::class, 'grade'])
                    ->name('events.quiz-attempts.answers.update');
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

            Route::prefix('quiz-questions')->group(function () {
                Route::get('/', [MentorEventQuizQuestionController::class, 'index'])
                    ->name('events.quiz-questions.index');
                Route::post('/', [MentorEventQuizQuestionController::class, 'store'])
                    ->name('events.quiz-questions.store');
                Route::put('{question}', [MentorEventQuizQuestionController::class, 'update'])
                    ->name('events.quiz-questions.update');
                Route::delete('{question}', [MentorEventQuizQuestionController::class, 'destroy'])
                    ->name('events.quiz-questions.destroy');
            });

            Route::prefix('quiz-attempts')->group(function () {
                Route::get('/', [MentorEventQuizAttemptController::class, 'index'])
                    ->name('events.quiz-attempts.index');
                Route::get('{attempt}', [MentorEventQuizAttemptController::class, 'show'])
                    ->name('events.quiz-attempts.show');
                Route::patch('{attempt}/answers/{answer}', [MentorEventQuizAttemptController::class, 'grade'])
                    ->name('events.quiz-attempts.answers.update');
            });
        });
    });

require __DIR__.'/settings.php';
