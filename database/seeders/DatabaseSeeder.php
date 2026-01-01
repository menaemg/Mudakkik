<?php

namespace Database\Seeders;

use Illuminate\Support\Facades\Hash;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory(30)->create();

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'username' => 'testusername'
        ]);
        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@mudakkik.com',
            'username' => 'admin',
            'password' => Hash::make('12345678'),
            'role' => 'admin',
        ]);

        $this->call([
            CategorySeeder::class,
            PlanSeeder::class,
            TagSeeder::class,
            UpgreadRequestSeeder::class,
            PostSeeder::class,
            AdvertismentSeeder::class,
            AdRequestSeeder::class,
            SubscriptionSeeder::class,
            PaymentSeeder::class,
            LikeSeeder::class,
            FollowSeeder::class,

        ]);
    }
}
