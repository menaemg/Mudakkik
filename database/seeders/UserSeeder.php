<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {

        User::factory()->create([
            'name' => 'Mohamed Ahmed',
            'username' => 'admin',
            'email' => 'admin@admin.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'is_active' => true,
            'is_verified_journalist' => true,
            'credibility_score' => 100,
            'bio' => 'Full Stack Developer & System Admin',
        ]);

        User::factory()->create([
            'name' => 'Super Admin',
            'username' => 'superadmin',
            'email' => 'admin@mudakkik.com',
            'password' => Hash::make('12345678'),
            'role' => 'admin',
            'is_active' => true,
            'is_verified_journalist' => true,
            'credibility_score' => 100,
            'bio' => 'Super Admin',
        ]);

        User::factory()->create([
            'name' => 'Journalist User',
            'username' => 'writer',
            'email' => 'writer@test.com',
            'password' => Hash::make('password'),
            'role' => 'journalist',
            'is_verified_journalist' => true,
            'bio' => 'Senior Tech Journalist',
        ]);

        User::factory()->create([
            'name' => 'Normal User',
            'username' => 'user',
            'email' => 'user@test.com',
            'password' => Hash::make('password'),
            'role' => 'user',
        ]);

        User::factory(20)->create();
    }
}
