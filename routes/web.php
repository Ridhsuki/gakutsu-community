<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;
use App\Http\Controllers\Admin\UserController;
use App\Http\Middleware\EnsureUserIsAdmin;
use App\Http\Middleware\EnsureUserIsMentor;
use App\Http\Controllers\Admin\BlogPostController as AdminBlogPostController;
use App\Http\Controllers\Mentor\BlogPostController as MentorBlogPostController;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');


Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

Route::middleware(['auth', 'verified', EnsureUserIsAdmin::class])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::resource('users', UserController::class)->except(['show', 'create', 'edit']);
        Route::resource('blogs', AdminBlogPostController::class)->except(['show', 'create', 'edit']);
    });

Route::middleware(['auth', 'verified', EnsureUserIsMentor::class])
    ->prefix('mentor')
    ->name('mentor.')
    ->group(function () {
        Route::resource('blogs', MentorBlogPostController::class)->except(['show', 'create', 'edit']);
    });

require __DIR__ . '/settings.php';
