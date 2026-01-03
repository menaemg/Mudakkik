<?php

namespace App\Observers;

use App\Models\Post;
use App\Notifications\PostDeleted;
use Illuminate\Support\Facades\Auth;

class PostObserver
{
    public function saving(Post $post)
    {
        if ($post->is_cover_story) {
            Post::where('id', '!=', $post->id)->where('is_cover_story', true)->update(['is_cover_story' => false]);
        }
        if ($post->is_breaking) {
            $breakingCount = Post::where('is_breaking', true)->count();
            if ($breakingCount >= 8) {
                Post::where('is_breaking', true)->oldest()->first()?->update(['is_breaking' => false]);
            }
        }
    }

    public function updated(Post $post)
    {
        if ($post->isDirty('status') && $post->status === 'published') {
            $post->user->notify(new \App\Notifications\PostPublished($post));
        }
    }

    public function deleted(Post $post)
    {
        if (Auth::check() && Auth::id() !== $post->user_id) {
            $post->user->notify(new PostDeleted($post->title));
        }
    }
}
