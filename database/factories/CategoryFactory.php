<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Category>
 */
class CategoryFactory extends Factory
{
    /**
     * Arabic categories for news platform with English slugs
     */
    private static array $categories = [
        ['name' => 'سياسة', 'slug' => 'politics', 'description' => 'أخبار السياسة المحلية والدولية وتحليلات سياسية'],
        ['name' => 'اقتصاد', 'slug' => 'economy', 'description' => 'أخبار الأسواق المالية والتجارة والاستثمار'],
        ['name' => 'رياضة', 'slug' => 'sports', 'description' => 'آخر أخبار الرياضة المحلية والعالمية'],
        ['name' => 'تقنية', 'slug' => 'technology', 'description' => 'أحدث التطورات التقنية والابتكارات الرقمية'],
        ['name' => 'صحة', 'slug' => 'health', 'description' => 'نصائح صحية وأخبار طبية وتطورات علمية'],
        ['name' => 'ثقافة', 'slug' => 'culture', 'description' => 'الفنون والآداب والتراث الثقافي'],
        ['name' => 'علوم', 'slug' => 'science', 'description' => 'اكتشافات علمية وأبحاث جديدة'],
        ['name' => 'بيئة', 'slug' => 'environment', 'description' => 'قضايا البيئة والتغير المناخي'],
        ['name' => 'تعليم', 'slug' => 'education', 'description' => 'أخبار التعليم والجامعات والمنح الدراسية'],
        ['name' => 'أعمال', 'slug' => 'business', 'description' => 'أخبار الشركات وريادة الأعمال'],
    ];

    public function definition(): array
    {
        // Use random selection for better test isolation
        $category = fake()->randomElement(self::$categories);
        
        return [
            'name' => $category['name'],
            'slug' => $category['slug'] . '-' . Str::random(4),
            'description' => $category['description'],
        ];
    }
}
