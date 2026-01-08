<?php

return array_filter([
    App\Providers\AppServiceProvider::class,
    App\Providers\PaymentServiceProvider::class,
    config('app.env') === 'production' ? App\Providers\HorizonServiceProvider::class : null,
]);
