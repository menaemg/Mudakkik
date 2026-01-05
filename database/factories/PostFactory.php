<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\User;
use App\Models\Category;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Post>
 */
class PostFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = fake()->sentence(8);

        return [
            'title' => $title,
            'slug' => Str::slug($title) . '-' . Str::random(6),
            'body' => fake()->paragraphs(5, true),
            'image' => fake()->randomElement([
                'https://picsum.photos/800/400?random=' . rand(1, 1000),
                'https://source.unsplash.com/800x400/?news',
                'https://source.unsplash.com/800x400/?article',
                'https://source.unsplash.com/800x400/?technology',
                'https://source.unsplash.com/800x400/?business',
                'https://source.unsplash.com/800x400/?politics',
                'https://source.unsplash.com/800x400/?science',
                'https://source.unsplash.com/800x400/?sports',
                'https://source.unsplash.com/800x400/?health',
                'https://source.unsplash.com/800x400/?education',
                '/assets/images/post.webp',
                null,
                null,
                null,
            ]),

            'user_id' => User::factory(),
            'category_id' => Category::inRandomOrder()->first()?->id ?? Category::factory(),

            'status' => fake()->randomElement(['pending', 'published', 'rejected']),

            'type' => fake()->randomElement(['news', 'article']),

            'ai_verdict' => fake()->randomElement(['trusted', 'trusted', 'checking', 'fake']),

            'views' => fake()->numberBetween(50, 20000),
        ];
    }
}
