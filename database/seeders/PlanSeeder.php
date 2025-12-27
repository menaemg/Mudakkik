<?php

namespace Database\Seeders;

use App\Models\Plan;
use Illuminate\Database\Seeder;

class PlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $plans = [
            [
                'name' => 'مجاني',
                'slug' => 'free',
                'price' => 0,
                'billing_interval' => 'one_time',
                'duration_days' => null,
                'is_free' => true,
                'is_active' => true,
                'sort_order' => 0,
                'features' => [
                    'posts_limit' => 5,
                    'ads_limit' => 0,
                    'priority_support' => false,
                ],
            ],
            [
                'name' => 'أساسي',
                'slug' => 'basic',
                'price' => 29.99,
                'billing_interval' => 'monthly',
                'duration_days' => 30,
                'is_free' => false,
                'is_active' => true,
                'sort_order' => 1,
                'features' => [
                    'posts_limit' => 50,
                    'ads_limit' => 5,
                    'priority_support' => false,
                ],
            ],
            [
                'name' => 'احترافي',
                'slug' => 'pro',
                'price' => 99.99,
                'billing_interval' => 'monthly',
                'duration_days' => 30,
                'is_free' => false,
                'is_active' => true,
                'sort_order' => 2,
                'features' => [
                    'posts_limit' => null, // Unlimited
                    'ads_limit' => null, // Unlimited
                    'priority_support' => true,
                ],
            ],
            [
                'name' => 'سنوي احترافي',
                'slug' => 'pro-yearly',
                'price' => 999.99,
                'billing_interval' => 'yearly',
                'duration_days' => 365,
                'is_free' => false,
                'is_active' => true,
                'sort_order' => 3,
                'features' => [
                    'posts_limit' => null,
                    'ads_limit' => null,
                    'priority_support' => true,
                ],
            ],
        ];

        foreach ($plans as $plan) {
            Plan::updateOrCreate(
                ['slug' => $plan['slug']],
                $plan
            );
        }
    }
}
