<?php

namespace App\Providers;

use App\Contracts\PaymentProviderInterface;
use App\Services\Payment\StripeService;
use Illuminate\Support\ServiceProvider;

class PaymentServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->bind(PaymentProviderInterface::class, StripeService::class);
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
