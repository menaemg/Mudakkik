<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Post;
use App\Models\Category;
use App\Models\Plan;
use App\Models\AdRequest;
use App\Models\Subscription;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $categories = Category::factory(5)->create();
        $basicPlan = Plan::create([
            'name' => 'الباقة الأساسية',
            'price' => 0,
            'features' => 'مشاهدة الأخبار، تعليقات محدودة',
        ]);

        $proPlan = Plan::create([
            'name' => 'باقة الصحفي المحترف',
            'price' => 200,
            'features' => 'توثيق الحساب، نشر مقالات، بدون إعلانات',
        ]);

        User::create([
            'name' => 'آية حامد',
            'username' => 'aya_admin',
            'email' => 'admin@mudakkik.com',
            'password' => bcrypt('12345678'),
            'role' => 'admin',
        ]);

        User::factory(10)->create()->each(function ($user) use ($categories) {
            Post::factory(3)->create([
                'user_id' => $user->id,
                'category_id' => $categories->random()->id,
            ]);
            Subscription::create([
                'user_id' => $user->id,
                'plan_id' => rand(0, 1) ? Plan::all()->random()->id : Plan::all()->random()->id,
                'start_at' => now(),
                'ends_at' => now()->addMonth(),
            ]);
            AdRequest::factory(1)->create([
                'user_id' => $user->id,
            ]);
        });
    }
}
