<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Post;
use App\Models\User;
use App\Models\Category;
use App\Models\Tag;

class PostSeeder extends Seeder
{
    public function run(): void
    {
        $categories = Category::all();
        $journalists = User::where('role', 'journalist')->get();
        $tags = Tag::all();

        if ($categories->isEmpty() || $journalists->isEmpty() || $tags->isEmpty()) {
            $this->command->warn('PostSeeder: Missing required seed data (categories, journalists, or tags). Skipping.');
            return;
        }

        Post::factory(25)->create([
            'type' => 'article',
            'status' => 'published',
            'ai_verdict' => 'trusted',
            'user_id' => fn() => $journalists->random()->id,
            'category_id' => fn() => $categories->random()->id,
        ])->each(function ($post) use ($tags) {

            $tagCount = min(rand(2, 4), $tags->count());
            $post->tags()->attach($tags->random($tagCount)->pluck('id'));
        });

        Post::factory(30)->create([
            'type' => 'news',
            'status' => 'published',
            'ai_verdict' => 'trusted',
            'is_breaking' => fn() => rand(0, 1),
            'user_id' => fn() => $journalists->random()->id,
            'category_id' => fn() => $categories->random()->id,
        ])->each(function ($post) use ($tags) {
            $tagCount = min(rand(2, 3), $tags->count());
            $post->tags()->attach($tags->random($tagCount)->pluck('id'));
        });

        Post::factory(5)->create([
            'type' => 'news',
            'status' => 'pending',
            'ai_verdict' => 'checking',
        ]);
    }
}
