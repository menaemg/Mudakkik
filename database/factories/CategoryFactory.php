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
     * Arabic categories for news platform
     */
    private static array $categories = [
        ['name' => 'سياسة', 'description' => 'أخبار السياسة المحلية والدولية وتحليلات سياسية'],
        ['name' => 'اقتصاد', 'description' => 'أخبار الأسواق المالية والتجارة والاستثمار'],
        ['name' => 'رياضة', 'description' => 'آخر أخبار الرياضة المحلية والعالمية'],
        ['name' => 'تقنية', 'description' => 'أحدث التطورات التقنية والابتكارات الرقمية'],
        ['name' => 'صحة', 'description' => 'نصائح صحية وأخبار طبية وتطورات علمية'],
        ['name' => 'ثقافة', 'description' => 'الفنون والآداب والتراث الثقافي'],
        ['name' => 'علوم', 'description' => 'اكتشافات علمية وأبحاث جديدة'],
        ['name' => 'بيئة', 'description' => 'قضايا البيئة والتغير المناخي'],
        ['name' => 'تعليم', 'description' => 'أخبار التعليم والجامعات والمنح الدراسية'],
        ['name' => 'أعمال', 'description' => 'أخبار الشركات وريادة الأعمال'],
    ];

    private static int $index = 0;

    public function definition(): array
    {
        // Use predefined categories in order, then generate random ones
        if (self::$index < count(self::$categories)) {
            $category = self::$categories[self::$index];
            self::$index++;
            return [
                'name' => $category['name'],
                'slug' => Str::slug($category['name']),
                'description' => $category['description'],
            ];
        }

        // Fallback for additional categories
        $name = 'قسم ' . fake()->numberBetween(1, 100);
        return [
            'name' => $name,
            'slug' => Str::slug($name) . '-' . Str::random(4),
            'description' => 'وصف القسم',
        ];
    }
}
