<?php

use App\Http\Controllers\Admin\AdsRequestController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\JoinRequestController;
use App\Http\Controllers\Admin\PaymentController as AdminPaymentController;
use App\Http\Controllers\Admin\PlanController;
use App\Http\Controllers\Admin\PostController as AdminPostController;
use App\Http\Controllers\Admin\SubscriptionController;
use App\Http\Controllers\Admin\TagController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\LikeController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Webhooks\StripeWebhookController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'auth' => [
            'user' => Auth::user(),
        ],
    ]);
})->name('welcome');

Route::middleware(['auth', 'verified', 'can:admin-access'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {

        Route::get('/dashboard', function () {
            return Inertia::render('Admin/Dashboard');
        })->name('dashboard');

        Route::resource('users', UserController::class);
        Route::resource('categories', CategoryController::class);
        Route::resource('tags', TagController::class);
        Route::resource('posts', AdminPostController::class);
        Route::patch('posts/{post}/toggle-featured', [AdminPostController::class, 'toggleFeatured'])
            ->name('posts.toggle-featured');
        Route::resource('plans', PlanController::class);
        Route::get('subscriptions', [SubscriptionController::class, 'index'])->name('subscriptions.index');
        Route::get('subscriptions/{subscription}/edit', [SubscriptionController::class, 'edit'])->name('subscriptions.edit');
        Route::put('subscriptions/{subscription}', [SubscriptionController::class, 'update'])->name('subscriptions.update');

        // Payments
        Route::get('payments', [AdminPaymentController::class, 'index'])->name('payments.index');
        Route::get('payments/{payment}', [AdminPaymentController::class, 'show'])->name('payments.show');

        Route::prefix('requests')->group(function () {
            Route::get('/join', [JoinRequestController::class, 'index'])
                ->name('requests.join');
            Route::patch('/join/{upgreadRequest}', [JoinRequestController::class, 'update'])
                ->name('requests.join.update');
            Route::delete('/join/{upgreadRequest}', [JoinRequestController::class, 'destroy'])
                ->name('requests.join.destroy');

            Route::get('/ads', [AdsRequestController::class, 'index'])
                ->name('requests.ads');
            Route::patch('/ads/{AdRequest}', [AdsRequestController::class, 'update'])
                ->name('requests.ads.update');
            Route::delete('/ads/{AdRequest}', [AdsRequestController::class, 'destroy'])
                ->name('requests.ads.destroy');

        });
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

    // Payment routes
    Route::post('/subscribe/{plan:slug}', [PaymentController::class, 'subscribe'])->name('payment.subscribe');
    Route::get('/payment/success', [PaymentController::class, 'success'])->name('payment.success');
    Route::get('/payment/cancel', [PaymentController::class, 'cancel'])->name('payment.cancel');
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

// Stripe Webhook (no CSRF, no auth)
Route::post('/webhooks/stripe', [StripeWebhookController::class, 'handle'])
    ->withoutMiddleware(['web'])
    ->name('webhooks.stripe');

require __DIR__.'/auth.php';
