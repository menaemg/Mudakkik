<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Plan;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $this->call(PlanSeeder::class);

        $proPlan = Plan::where('slug', 'professional')->first();
        $annualPlan = Plan::where('slug', 'professional-annual')->first();

        $admin = User::factory()->create([
            'name' => 'admin',
            'username' => 'admin',
            'email' => 'admin@mudakkik.com',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
            'role' => 'admin',
            'is_active' => true,
            'is_verified_journalist' => true,
            'credibility_score' => 100,
            'bio' => 'مدير منصة مُدقق',
            'ai_recurring_credits' => 12000,
            'ad_credits' => 365,
            'ai_bonus_credits' => 1000000,
        ]);

        if ($annualPlan) {

            $admin->subscriptions()->create([
                'plan_id' => $annualPlan->id,
                'status' => 'active',
                'start_at' => now(),
                'ends_at' => now()->addYear(),
            ]);
        }

        $journalist = User::factory()->create([
            'name' => 'أحمد الصحفي',
            'username' => 'journalist',
            'email' => 'journalist@mudakkik.com',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
            'role' => 'journalist',
            'is_active' => true,
            'is_verified_journalist' => true,
            'credibility_score' => 95,
            'bio' => 'صحفي استقصائي',
            'ai_recurring_credits' => 1000,
            'ad_credits' => 30,
        ]);

        if ($proPlan) {
            $journalist->subscriptions()->create([
                'plan_id' => $proPlan->id,
                'status' => 'active',
                'start_at' => now(),
                'ends_at' => now()->addMonth(),
            ]);
        }

        User::factory()->create([
            'name' => 'محمد القارئ',
            'username' => 'user',
            'email' => 'user@mudakkik.com',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
            'role' => 'user',
            'is_active' => true,
            'is_verified_journalist' => false,
            'credibility_score' => 70,
            'bio' => 'قارئ نشط',
            'ai_recurring_credits' => 30,
            'ad_credits' => 0,
        ]);

        User::factory(5)->journalist()->create();
        User::factory(15)->create();
    }
}
