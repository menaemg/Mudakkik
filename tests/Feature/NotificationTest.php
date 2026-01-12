<?php

use App\Models\Post;
use App\Models\User;
use App\Notifications\PostDeleted;
use App\Notifications\PostPublished;
use App\Notifications\PostRejected;
use App\Notifications\PostMarkedFake;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;

uses(RefreshDatabase::class);

it('sends notification when post is published', function () {
    Notification::fake();

    $user = User::factory()->create();
    $post = Post::factory()->create([
        'user_id' => $user->id,
        'status' => 'pending'
    ]);

    $post->update(['status' => 'published']);
    $user->notify(new PostPublished($post));

    Notification::assertSentTo($user, PostPublished::class);
});

it('sends notification when post is rejected', function () {
    Notification::fake();

    $user = User::factory()->create();
    $post = Post::factory()->create([
        'user_id' => $user->id,
        'status' => 'pending'
    ]);

    $post->update(['status' => 'rejected']);
    $user->notify(new PostRejected($post));

    Notification::assertSentTo($user, PostRejected::class);
});

it('sends notification when post is rejected due to fake content', function () {
    Notification::fake();

    $user = User::factory()->create();
    $post = Post::factory()->create([
        'user_id' => $user->id,
        'ai_verdict' => 'trusted', 
        'status' => 'pending'      
    ]);

    $post->update([
        'ai_verdict' => 'fake',
        'status' => 'rejected',
        'ai_report' => 'محتوى مخالف للسياسة'
    ]);

    $user->notify(new PostRejected($post));

    Notification::assertSentTo($user, PostRejected::class);
});
it('sends notification when post is deleted', function () {
    Notification::fake();

    $user = User::factory()->create();
    $post = Post::factory()->create([
        'user_id' => $user->id,
        'status' => 'published'
    ]);

    $postTitle = $post->title; 

    $post->delete();

    Notification::assertSentTo($user, PostDeleted::class, function ($notification) use ($postTitle) {
        return $notification->postTitle === $postTitle;
    });
});
