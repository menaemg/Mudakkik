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

    Notification::assertSentTo($user, PostRejected::class);
});

it('sends notification when post is marked as fake', function () {
    Notification::fake();

    $user = User::factory()->create();
    $post = Post::factory()->create([
        'user_id' => $user->id,
        'ai_verdict' => 'trusted'
    ]);

    $post->update(['ai_verdict' => 'fake']);

    Notification::assertSentTo($user, PostMarkedFake::class);
});

it('sends notification when post is deleted', function () {
    Notification::fake();

    $user = User::factory()->create();
    $post = Post::factory()->create([
        'user_id' => $user->id,
        'status' => 'published'
    ]);

    $post->delete();

    Notification::assertSentTo($user, PostDeleted::class);
});
