<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Post;
use App\Models\Tag;

class PostSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tags = Tag::all();
        if ($tags->isEmpty()) {
            Post::factory(20)->create();
            return;
        }
        Post::factory(20)->create()->each(function ($post) use ($tags) {
            $count = min(rand(1, 3), $tags->count());
            $post->tags()->attach(
                $tags->random($count)->pluck('id')
            );
        });
    }
}
