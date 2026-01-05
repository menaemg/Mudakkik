<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    protected static ?string $password;

    /**
     * Arabic names for demo data
     */
    private static array $arabicMaleNames = [
        'أحمد محمد', 'محمد علي', 'خالد عبدالله', 'عمر حسن', 'يوسف إبراهيم',
        'سعد الدين', 'طارق العمري', 'فهد السعيد', 'ناصر الحربي', 'سلطان القحطاني',
        'عبدالرحمن الشمري', 'مشعل الدوسري', 'بندر العتيبي', 'تركي المطيري', 'فيصل الغامدي',
    ];

    private static array $arabicFemaleNames = [
        'فاطمة أحمد', 'نورة محمد', 'سارة علي', 'مريم خالد', 'لينا عمر',
        'هند السالم', 'ريم العبدالله', 'دانة الحسن', 'لمى الفهد', 'غادة الناصر',
        'أسماء الراشد', 'هيفاء العمر', 'منى السعد', 'رنا الخالد', 'ديما الأحمد',
    ];

    private static array $arabicBios = [
        'صحفي متخصص في الشؤون السياسية والاقتصادية',
        'كاتب ومحلل سياسي مهتم بقضايا الشرق الأوسط',
        'مدونة مهتمة بالتقنية والابتكار',
        'صحفية استقصائية حاصلة على جوائز دولية',
        'محرر أخبار في مجال التكنولوجيا والذكاء الاصطناعي',
        'كاتب رأي ومحلل اقتصادي',
        'مراسل ميداني متخصص في الأحداث الدولية',
        'صحفي رياضي ومحلل كروي',
        'كاتبة في الشؤون الاجتماعية والثقافية',
        'محررة أخبار محلية وإقليمية',
    ];

    public function definition(): array
    {
        $isMale = fake()->boolean();
        $names = $isMale ? self::$arabicMaleNames : self::$arabicFemaleNames;
        $name = fake()->randomElement($names);
        $username = 'user_' . fake()->unique()->numberBetween(100, 9999);

        return [
            'name' => $name,
            'username' => $username,
            'email' => fake()->unique()->safeEmail(),
            'role' => fake()->randomElement(['user', 'user', 'user', 'journalist']),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'remember_token' => Str::random(10),
            'avatar' => 'avatars/default-avatar.png',
            'is_active' => fake()->boolean(90),
            'credibility_score' => fake()->numberBetween(60, 100),
            'is_verified_journalist' => fake()->boolean(20),
            'bio' => fake()->randomElement(self::$arabicBios),
        ];
    }

    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }

    public function admin(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'admin',
            'is_verified_journalist' => true,
            'credibility_score' => 100,
        ]);
    }

    public function journalist(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'journalist',
            'is_verified_journalist' => true,
            'credibility_score' => fake()->numberBetween(80, 100),
        ]);
    }
}
