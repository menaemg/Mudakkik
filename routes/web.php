<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Admin\PlanController as AdminPlanController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\SubscriptionController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\LikeController;
use App\Http\Controllers\PlanController;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Admin\TagController;

Route::get('/', function () {
  return Inertia::render('Welcome', [
    'canLogin' => Route::has('login'),
    'canRegister' => Route::has('register'),
    'auth' => [
      'user' => Auth::user(),
    ],
  ]);
})->name('welcome');

Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {

  Route::get('/dashboard', function () {
    return Inertia::render('Admin/Dashboard');
  })->name('dashboard');

  
    Route::prefix('requests')->group(function () {
            Route::get('/join', function () {
        return Inertia::render('Admin/Requests/Join');
    })->name('requests.join');

    });

    Route::resource('users', UserController::class);
    Route::resource('categories', CategoryController::class);
    Route::resource('tags', TagController::class);


  Route::resource('plans', AdminPlanController::class);
  Route::get('subscriptions', [SubscriptionController::class, 'index'])->name('subscriptions.index');
  Route::get('subscriptions/{subscription}/edit', [SubscriptionController::class, 'edit'])->name('subscriptions.edit');
  Route::put('subscriptions/{subscription}', [SubscriptionController::class, 'update'])->name('subscriptions.update');
});

Route::get('/dashboard', function () {
  return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
  Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
  Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
  Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

  // User subscription routes
  Route::get('/subscription/plans', [\App\Http\Controllers\SubscriptionController::class, 'index'])->name('subscription.plans');
  Route::get('/subscription', [\App\Http\Controllers\SubscriptionController::class, 'show'])->name('subscription.show');
  Route::get('/subscription/history', [\App\Http\Controllers\SubscriptionController::class, 'history'])->name('subscription.history');
});


// Posts Routes
Route::get('/posts', [PostController::class, 'index'])->name('posts.index');
Route::get('/posts/{post}', [PostController::class, 'show'])->name('posts.show');

// Like Routes
Route::middleware(['auth'])->group(function () {
  Route::post('/posts/{post}/like', [LikeController::class, 'toggle'])->name('posts.like');
});

// Plans Route
Route::get('/plans', [PlanController::class, 'index'])->name('plans.index');

require __DIR__ . '/auth.php';
