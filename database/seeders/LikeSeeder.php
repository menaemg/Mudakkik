<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Like;
use App\Models\User;
use App\Models\Post;

class LikeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    // edit
    public function run(): void
    {
        $users = User::all();
        $posts = Post::all();

        if ($users->isEmpty() || $posts->isEmpty()) {
            return;
        }

        for ($i = 0; $i < 50; $i++) {
            $user = $users->random();
            $post = $posts->random();

            if (!$post->likes()->where('user_id', $user->id)->exists()) {
                $post->likes()->attach($user->id);
            }
        }
    }
}
