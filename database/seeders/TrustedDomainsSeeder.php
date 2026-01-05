<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\TrustedDomain;

class TrustedDomainsSeeder extends Seeder
{
    public function run()
    {
        $domains = [
            ['name' => 'بوابة الأهرام', 'domain' => 'ahram.org.eg'],
            ['name' => 'صحيفة اليوم السابع', 'domain' => 'youm7.com'],
            ['name' => 'صحيفة المصري اليوم', 'domain' => 'almasryalyoum.com'],
            ['name' => 'العربية نت', 'domain' => 'alarabiya.net'],
            ['name' => 'سكاي نيوز عربية', 'domain' => 'skynewsarabia.com'],
            ['name' => 'الجزيرة نت', 'domain' => 'aljazeera.net'],
            ['name' => 'صحيفة الوطن المصرية', 'domain' => 'elwatannews.com'],
            ['name' => 'جريدة الشروق', 'domain' => 'shorouknews.com'],

        ];

        foreach ($domains as $data) {
            TrustedDomain::updateOrCreate(
                ['domain' => $data['domain']],
                ['name' => $data['name'], 'is_active' => true]
            );
        }
    }
}