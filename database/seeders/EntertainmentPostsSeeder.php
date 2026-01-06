<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Post;
use App\Models\Category;
use App\Models\User;
use Illuminate\Support\Str;

class EntertainmentPostsSeeder extends Seeder
{
    public function run(): void
    {
        $categories = Category::whereIn('slug', ['entertainment', 'arts'])->get();
        $user = User::first();

        if ($categories->isEmpty() || !$user) {
            $this->command->error('Categories or User not found. Run CategorySeeder first.');
            return;
        }

        for ($i = 1; $i <= 15; $i++) {
            $randomCategory = $categories->random();

            $post = new Post([
                'title' => "اوعي الفن  ({$randomCategory->name}) رقم {$i}",
                'body' => 'الفن فن مش عن عن.',
                'image' => null,
                'status' => 'published',
                'category_id' => $randomCategory->id,
                'user_id' => $user->id,
                'ai_verdict' => 'trusted',
            ]);

            $post->slug = Str::slug("mixed-art-ent-{$i}");
            $post->type = 'article';
            $post->views = rand(100, 5000);
            $post->created_at = now()->subHours(rand(1, 48));
            $post->save();
        }
    }
}
