<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Tag;

class TagSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tags = [
            // Breaking & Types
            'عاجل', 'تحليل', 'رأي', 'تقرير', 'حصري', 'مباشر',
            
            // Regions
            'السعودية', 'الإمارات', 'مصر', 'الأردن', 'الخليج', 'الشرق_الأوسط',
            
            // Technology
            'الذكاء_الاصطناعي', 'التحول_الرقمي', 'الأمن_السيبراني', 'التقنية_المالية', 'الحوسبة_السحابية',
            
            // Sports
            'كرة_القدم', 'الدوري_السعودي', 'دوري_أبطال_آسيا', 'كأس_العالم', 'أولمبياد',
            
            // Economy
            'البورصة', 'النفط', 'العقارات', 'الاستثمار', 'ريادة_الأعمال',
            
            // Environment
            'المناخ', 'الطاقة_المتجددة', 'البيئة', 'الاستدامة',
            
            // Health
            'صحة_عامة', 'الطب', 'التغذية', 'اللياقة',
        ];

        foreach ($tags as $tagName) {
            Tag::firstOrCreate(['name' => $tagName]);
        }
    }
}
