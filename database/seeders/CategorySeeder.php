<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'سياسة', 'slug' => 'politics', 'description' => 'أخبار السياسة المحلية والدولية وتحليلات سياسية'],
            ['name' => 'اقتصاد', 'slug' => 'economy', 'description' => 'أخبار الأسواق المالية والتجارة والاستثمار'],
            ['name' => 'رياضة', 'slug' => 'sports', 'description' => 'آخر أخبار الرياضة المحلية والعالمية'],
            ['name' => 'تكنولوجيا', 'slug' => 'tech', 'description' => 'أحدث التطورات التقنية والابتكارات الرقمية'],
            ['name' => 'صحة', 'slug' => 'health', 'description' => 'نصائح صحية وأخبار طبية وتطورات علمية'],
            ['name' => 'ثقافة', 'slug' => 'culture', 'description' => 'الثقافة والتراث الثقافي'],
            ['name' => 'فنون', 'slug' => 'arts', 'description' => 'الفنون والادب'],
            ['name' => 'ترفية', 'slug' => 'entertainment', 'description' => 'الترفية والالعاب'],
            ['name' => 'علوم', 'slug' => 'science', 'description' => 'اكتشافات علمية وأبحاث جديدة'],
            ['name' => 'بيئة', 'slug' => 'environment', 'description' => 'قضايا البيئة والتغير المناخي'],
            ['name' => 'تعليم', 'slug' => 'education', 'description' => 'أخبار التعليم والجامعات والمنح الدراسية'],
            ['name' => 'أعمال', 'slug' => 'business', 'description' => 'أخبار الشركات وريادة الأعمال'],
        ];

        foreach ($categories as $category) {
            Category::updateOrCreate(
                ['slug' => $category['slug']],
                $category
            );
        }
    }
}
