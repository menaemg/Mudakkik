<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Super Admin
        User::factory()->create([
            'name' => 'admin',
            'username' => 'admin',
            'email' => 'admin@mudakkik.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'is_active' => true,
            'is_verified_journalist' => true,
            'credibility_score' => 100,
            'bio' => 'مدير منصة مُدقق - منصة التحقق من الأخبار',
        ]);

        // Featured Journalist
        User::factory()->create([
            'name' => 'أحمد الصحفي',
            'username' => 'journalist',
            'email' => 'journalist@mudakkik.com',
            'password' => Hash::make('password'),
            'role' => 'journalist',
            'is_active' => true,
            'is_verified_journalist' => true,
            'credibility_score' => 95,
            'bio' => 'صحفي استقصائي متخصص في الشؤون السياسية والاقتصادية',
        ]);

        // Regular User
        User::factory()->create([
            'name' => 'محمد القارئ',
            'username' => 'user',
            'email' => 'user@mudakkik.com',
            'password' => Hash::make('password'),
            'role' => 'user',
            'is_active' => true,
            'is_verified_journalist' => false,
            'credibility_score' => 70,
            'bio' => 'قارئ نشط ومهتم بالأخبار الموثوقة',
        ]);

        // Create additional journalists
        User::factory(5)->journalist()->create();

        // Create regular users
        User::factory(15)->create();
    }
}
