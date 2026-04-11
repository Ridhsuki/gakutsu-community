<?php

use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;
use App\Http\Controllers\Admin\UserController;
use App\Http\Middleware\EnsureUserIsAdmin;

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
        Route::resource('users', UserController::class)->except(['show','create','edit']);
    });

require __DIR__.'/settings.php';
