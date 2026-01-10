<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use App\Models\User;
use Illuminate\Support\Facades\Gate;
use App\Models\Post;
use App\Observers\PostObserver;
use App\Models\Subscription;
use App\Observers\SubscriptionObserver;
class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);
        Gate::define('admin-access', function (User $user) {
            return $user->role === 'admin';
        });

        Post::observe(PostObserver::class);

        Subscription::observe(SubscriptionObserver::class);
    }
}
