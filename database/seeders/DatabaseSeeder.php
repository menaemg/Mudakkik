<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            CategorySeeder::class,
            TagSeeder::class,
            PlanSeeder::class,
            PostSeeder::class,
            UpgradeRequestSeeder::class,
            AdvertismentSeeder::class,
            AdRequestSeeder::class,
            SubscriptionSeeder::class,
            PaymentSeeder::class,
            LikeSeeder::class,
            FollowSeeder::class,
            EntertainmentPostsSeeder::class,
            TrustedDomainsSeeder::class,
        ]);
    }
}
