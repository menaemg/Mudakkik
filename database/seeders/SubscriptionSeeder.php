<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Subscription;
use App\Models\User;

class SubscriptionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::whereNotIn('email', [
            'admin@mudakkik.com',
            'journalist@mudakkik.com',
            'user@mudakkik.com'
        ])->inRandomOrder()->take(10)->get();

        foreach ($users as $user) {
            Subscription::factory()->create([
                'user_id' => $user->id
            ]);
          }
    }
}
