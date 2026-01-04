<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Tag>
 */
class TagFactory extends Factory
{
    /**
     * Arabic tags for news articles
     */
    private static array $tags = [
        'عاجل', 'تحليل', 'رأي', 'تقرير', 'حصري',
        'السعودية', 'الإمارات', 'مصر', 'الأردن', 'الخليج',
        'الذكاء_الاصطناعي', 'التحول_الرقمي', 'الاستدامة', 'البلوك_تشين', 'الأمن_السيبراني',
        'كأس_العالم', 'دوري_أبطال_أوروبا', 'الدوري_السعودي', 'أولمبياد', 'كرة_القدم',
        'صحة_عامة', 'كورونا', 'اللقاحات', 'التغذية', 'الطب_الحديث',
        'التعليم_عن_بعد', 'المنح_الدراسية', 'الجامعات', 'البحث_العلمي', 'الابتكار',
        'البورصة', 'النفط', 'العملات', 'الاستثمار', 'التضخم',
        'المناخ', 'الطاقة_المتجددة', 'البيئة', 'التنمية_المستدامة', 'المياه',
    ];

    private static int $index = 0;

    public function definition(): array
    {
        if (self::$index < count(self::$tags)) {
            $tag = self::$tags[self::$index];
            self::$index++;
            return ['name' => $tag];
        }

        return ['name' => 'وسم_' . fake()->unique()->numberBetween(1, 1000)];
    }
}
