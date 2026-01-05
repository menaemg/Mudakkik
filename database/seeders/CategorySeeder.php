<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['name' => 'اقتصاد', 'slug' => 'economy', 'description' => 'أخبار وتحليلات اقتصادية'],
            ['name' => 'تكنولوجيا', 'slug' => 'tech', 'description' => 'أخبار التقنية والتكنولوجيا'],
            ['name' => 'رياضة', 'slug' => 'sports', 'description' => 'أخبار الرياضة والرياضيين'],
            ['name' => 'صحة', 'slug' => 'health', 'description' => 'نصائح طبية وصحية'],
            ['name' => 'ثقافة', 'slug' => 'culture', 'description' => 'أخبار الثقافة والفنون'],
            ['name' => 'علوم', 'slug' => 'science', 'description' => 'اكتشافات علمية وتكنولوجية'],
            ['name' => 'ترفيه', 'slug' => 'entertainment', 'description' => 'أخبار المشاهير والترفيه'],
            ['name' => 'سياسة', 'slug' => 'politics', 'description' => 'الأخبار السياسية'],
        ];

        foreach ($categories as $category) {
            Category::updateOrCreate(['slug' => $category['slug']], $category);
        }
    }
}
