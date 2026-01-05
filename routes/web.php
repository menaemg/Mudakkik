<?php

use App\Http\Controllers\Admin\AdminReportController;
use App\Http\Controllers\Admin\AdsRequestController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\Home\FeaturedController;
use App\Http\Controllers\Admin\Home\HeroController;
use App\Http\Controllers\Admin\Home\TickerController;
use App\Http\Controllers\Admin\Home\TopStoriesController;
use App\Http\Controllers\Admin\JoinRequestController;
use App\Http\Controllers\Admin\PaymentController as AdminPaymentController;
use App\Http\Controllers\Admin\PlanController as AdminPlanController;
use App\Http\Controllers\Admin\PostController as AdminPostController;
use App\Http\Controllers\Admin\SubscriptionController as AdminSubscriptionController;
use App\Http\Controllers\Admin\TagController;
use App\Http\Controllers\Admin\TrustedDomainController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\FactCheckController;
use App\Http\Controllers\LikeController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PlanController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\PostReportController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SubscriptionController;
use App\Http\Controllers\UpgradeRequestController;
use App\Http\Controllers\UserAdController;
use App\Http\Controllers\UserPostController;
use App\Http\Controllers\Webhooks\StripeWebhookController;
use App\Http\Controllers\WelcomeController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [WelcomeController::class, 'index'])->name('welcome');
Route::get('/articles/{post:slug}', [PostController::class, 'show'])->name('posts.show');
Route::get('/posts', [PostController::class, 'index'])->name('posts.index');
Route::get('/plans', [PlanController::class, 'index'])->name('plans.index');

Route::get('/check', function () {
    return Inertia::render('VerifyNews');
});
Route::post('/verify-news', [FactCheckController::class, 'verify']);

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

        Route::resource('plans', AdminPlanController::class);

        Route::get('posts/search', [AdminPostController::class, 'search'])->name('posts.search');
        Route::resource('posts', AdminPostController::class);
        Route::patch('posts/{post}/toggle-featured', [AdminPostController::class, 'toggleFeatured'])->name('posts.toggle-featured');

        Route::get('subscriptions', [AdminSubscriptionController::class, 'index'])->name('subscriptions.index');
        Route::get('subscriptions/{subscription}/edit', [AdminSubscriptionController::class, 'edit'])->name('subscriptions.edit');
        Route::put('subscriptions/{subscription}', [AdminSubscriptionController::class, 'update'])->name('subscriptions.update');

        Route::get('/trusted-domains', [TrustedDomainController::class, 'index'])->name('trusted-domains.index');
        Route::post('/trusted-domains', [TrustedDomainController::class, 'store'])->name('trusted-domains.store');
        Route::delete('/trusted-domains/{trustedDomain}', [TrustedDomainController::class, 'destroy'])->name('trusted-domains.destroy');
        Route::patch('/trusted-domains/{trustedDomain}/toggle', [TrustedDomainController::class, 'toggle'])->name('trusted-domains.toggle');

        Route::get('payments', [AdminPaymentController::class, 'index'])->name('payments.index');
        Route::get('payments/{payment}', [AdminPaymentController::class, 'show'])->name('payments.show');

        Route::prefix('requests')->group(function () {
            Route::get('/join', [JoinRequestController::class, 'index'])->name('requests.join');
            Route::patch('/join/{upgradeRequest}', [JoinRequestController::class, 'update'])->name('requests.join.update');
            Route::delete('/join/{upgradeRequest}', [JoinRequestController::class, 'destroy'])->name('requests.join.destroy');

            Route::get('/ads', [AdsRequestController::class, 'index'])->name('requests.ads');
            Route::patch('/ads/{adRequest}', [AdsRequestController::class, 'update'])->name('requests.ads.update');
            Route::delete('/ads/{adRequest}', [AdsRequestController::class, 'destroy'])->name('requests.ads.destroy');
        });

        Route::prefix('home')->name('home.')->group(function () {
            Route::controller(HeroController::class)->group(function () {
                Route::get('/hero', 'index')->name('hero');
                Route::post('/hero/update', 'update')->name('hero.update');
            });

            Route::controller(TickerController::class)->group(function () {
                Route::get('/ticker', 'index')->name('ticker');
                Route::post('/ticker/update', 'update')->name('ticker.update');
            });

            Route::controller(FeaturedController::class)->group(function () {
                Route::get('/featured', 'index')->name('featured');
                Route::post('/featured/update', 'update')->name('featured.update');
            });

            Route::controller(TopStoriesController::class)->group(function () {
                Route::get('/top-stories', 'index')->name('top-stories');
                Route::post('/top-stories/update', 'update')->name('top-stories.update');
            });
        });

        /* Reports */
        Route::get('/reports', [AdminReportController::class, 'index'])
            ->name('reports.index');

        Route::post('/reports/{report}/approve', [AdminReportController::class, 'approve'])
            ->name('reports.approve');

        Route::post('/reports/{report}/reject', [AdminReportController::class, 'reject'])
            ->name('reports.reject');
    });

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', fn () => redirect()->route('profile.edit'))->name('dashboard');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/my-subscription', [SubscriptionController::class, 'show'])->name('subscription.show');
    Route::get('/my-subscription/history', [SubscriptionController::class, 'history'])->name('subscription.history');

    Route::post('/subscribe/{plan:slug}', [PaymentController::class, 'subscribe'])->name('payment.subscribe');
    Route::get('/payment/success', [PaymentController::class, 'success'])->name('payment.success');
    Route::get('/payment/cancel', [PaymentController::class, 'cancel'])->name('payment.cancel');

    Route::get('/my-posts/create', [UserPostController::class, 'create'])->name('posts.create');
    Route::put('/my-posts/{post}', [UserPostController::class, 'update'])->name('posts.update');
    Route::post('/my-posts', [UserPostController::class, 'store'])->name('posts.store');
    Route::delete('/my-posts/{post}', [UserPostController::class, 'destroy'])->name('posts.destroy');

    Route::get('/my-ads', [UserAdController::class, 'index'])->name('ads.index');
    Route::post('/my-ads', [UserAdController::class, 'store'])->name('ads.store');

    Route::post('/upgrade-requests', [UpgradeRequestController::class, 'store'])->name('upgrade-requests.store');

    Route::post('/posts/{post}/like', [LikeController::class, 'toggle'])->name('posts.like');
});

Route::middleware(['auth'])->group(function () {
    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::post('/notifications/mark-all-read', [NotificationController::class, 'markAllRead'])->name('notifications.read');
    Route::delete('/notifications/{notification}', [NotificationController::class, 'destroy'])->name('notifications.destroy');
});

/*
|--------------------------------------------------------------------------
| Post Reports (User)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'throttle:5,1'])->group(function () {
    Route::get('/posts/{post}/report', [PostReportController::class, 'create'])
        ->name('posts.report.form');

    Route::post('/posts/{post}/report', [PostReportController::class, 'store'])
        ->name('posts.report.store');
});

// Stripe Webhook (no CSRF, no auth)
Route::post('/webhooks/stripe', [StripeWebhookController::class, 'handle'])
    ->withoutMiddleware(['web'])
    ->name('webhooks.stripe');

require __DIR__.'/auth.php';
