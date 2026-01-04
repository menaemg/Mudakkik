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
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
public function definition(): array
    {
        $name = fake()->name();
        $username = Str::slug($name) . fake()->numberBetween(10, 999);

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
            'credibility_score' => fake()->numberBetween(0, 100),
            'is_verified_journalist' => fake()->boolean(20),
            'bio' => fake()->sentence(10),
        ];
    }
    /**
     * Indicate that the model's email address should be unverified.
     */
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
}
