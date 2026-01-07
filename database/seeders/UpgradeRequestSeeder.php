<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\UpgradeRequest;
use App\Models\User;

class UpgradeRequestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $users = User::inRandomOrder()->take(10)->get();
        $statuses = ['pending', 'accepted', 'rejected'];

        foreach ($users as $index => $user) {
            UpgradeRequest::factory()->create([
                'user_id' => $user->id,
                'status' => $statuses[$index % 3],
            ]);
        }
    }
}
