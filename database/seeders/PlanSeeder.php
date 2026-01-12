<?php

namespace Database\Seeders;

use App\Models\Plan;
use Illuminate\Database\Seeder;

class PlanSeeder extends Seeder
{
    public function run(): void
    {
        $plans = [
            [
                'name' => 'الباقة المجانية',
                'slug' => 'free',
                'price' => 0,
                'billing_interval' => 'monthly',
                'duration_days' => 30,
                'is_free' => true,
                'is_active' => true,
                'sort_order' => 1,
                'features' => [
                    'monthly_ai_credits' => 30,
                    'monthly_ad_credits' => 0,
                    'verification_badge' => false,
                    'priority_support' => false,
                ],
            ],
            [
                'name' => 'الباقة الأساسية',
                'slug' => 'basic',
                'price' => 9.00,
                'billing_interval' => 'monthly',
                'duration_days' => 30,
                'is_free' => false,
                'is_active' => true,
                'sort_order' => 2,
                'features' => [
                    'monthly_ai_credits' => 300,
                    'monthly_ad_credits' => 7,
                    'verification_badge' => 'bronze',
                    'priority_support' => false,
                ],
            ],
            [
                'name' => 'الباقة الاحترافية',
                'slug' => 'professional',
                'price' => 29.00,
                'billing_interval' => 'monthly',
                'duration_days' => 30,
                'is_free' => false,
                'is_active' => true,
                'sort_order' => 3,
                'features' => [
                    'monthly_ai_credits' => 2000,
                    'monthly_ad_credits' => 30,
                    'verification_badge' => 'gold',
                    'priority_support' => true,
                ],
            ],
            [
                'name' => 'احترافي (سنوي)',
                'slug' => 'professional-annual',
                'price' => 299.00,
                'billing_interval' => 'yearly',
                'duration_days' => 365,
                'is_free' => false,
                'is_active' => true,
                'sort_order' => 4,
                'features' => [
                    'monthly_ai_credits' => 24000,
                    'monthly_ad_credits' => 365,
                    'verification_badge' => 'platinum',
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
