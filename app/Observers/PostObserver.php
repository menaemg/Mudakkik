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
        Post::where('is_breaking', true)->oldest()->update(['is_breaking' => false]);
        }
        if ($post->is_breaking) {
            $breakingCount = Post::where('is_breaking', true)->count();
        if ($breakingCount >= 7) {
                Post::where('is_breaking', true)->oldest()->first()?->update(['is_breaking' => false]);
            }
        }
    }

    public function updated(Post $post)
    {
        $post->load('user');

        \Log::info('PostObserver updated called', ['post_id' => $post->id, 'changes' => $post->getChanges()]);


        if ($post->wasChanged('status') && $post->status === 'published') {
            \Log::info('Sending PostPublished notification to author', ['post_id' => $post->id, 'user_id' => $post->user_id]);
            if ($post->user) {
                $post->user->notify(new \App\Notifications\PostPublished($post));
            }
        }

        if ($post->wasChanged('status') && $post->status === 'rejected') {
            \Log::info('Sending PostRejected notification to author', ['post_id' => $post->id, 'user_id' => $post->user_id]);
            if ($post->user) {
                $post->user->notify(new \App\Notifications\PostRejected($post));
            }
        }


        if ($post->wasChanged('ai_verdict') && $post->ai_verdict === 'fake') {
            \Log::info('Sending PostMarkedFake notification to author', ['post_id' => $post->id, 'user_id' => $post->user_id]);
            if ($post->user) {
                $post->user->notify(new \App\Notifications\PostMarkedFake($post));
            }
        }
    }

    public function deleted(Post $post)
    {
        $post->load('user');

        \Log::info('PostObserver deleted called', [
            'post_id' => $post->id,
            'post_user_id' => $post->user_id,
            'auth_user_id' => Auth::check() ? Auth::id() : null,
            'auth_check' => Auth::check(),
            'user_exists' => $post->user ? true : false
        ]);


        if ($post->user) {
            \Log::info('Sending PostDeleted notification to author', ['post_id' => $post->id, 'user_id' => $post->user_id]);
            $post->user->notify(new PostDeleted($post->title));
        }
    }
}
