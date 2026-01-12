<?php

use App\Jobs\AuditReportContent;
use App\Models\Post;
use App\Models\PostReport;
use App\Models\User;
use App\Notifications\PostHiddenByReport;
use App\Notifications\ReportApproved;
use App\Notifications\ReportRejected;
use App\Notifications\ReportPendingReview;
use App\Services\AiAuditService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Queue;

uses(RefreshDatabase::class);

it('dispatches AuditReportContent job when report is created', function () {
    Queue::fake();

    $user = User::factory()->create();
    $author = User::factory()->create();
    $post = Post::factory()->create(['user_id' => $author->id, 'status' => 'published']);

    $this->actingAs($user)
        ->post(route('posts.report.store', $post), [
            'reason' => 'هذا المحتوى يحتوي على معلومات مضللة'
        ]);

    Queue::assertPushed(AuditReportContent::class);
});

it('approves report and notifies users when AI verdict is valid', function () {
    Notification::fake();

    $reporter = User::factory()->create();
    $author = User::factory()->create();
    $post = Post::factory()->create(['user_id' => $author->id, 'status' => 'published']);
    
    $report = PostReport::create([
        'post_id' => $post->id,
        'user_id' => $reporter->id,
        'reason' => 'محتوى مخالف للسياسات',
    ]);

    // Mock the AI service to return 'valid'
    $this->mock(AiAuditService::class, function ($mock) {
        $mock->shouldReceive('auditReport')
            ->once()
            ->andReturn([
                'score' => 90,
                'verdict' => 'valid',
                'summary' => 'البلاغ صحيح، المحتوى يحتوي على مخالفات',
            ]);
    });

    // Run the job
    (new AuditReportContent($report))->handle(app(AiAuditService::class));

    // Refresh models
    $report->refresh();
    $post->refresh();

    // Assert report was approved
    expect($report->status)->toBe('approved');
    expect($report->ai_verdict)->toBe('valid');
    expect($report->ai_score)->toBe(90);
    
    // Assert post was rejected
    expect($post->status)->toBe('rejected');

    // Assert notifications were sent
    Notification::assertSentTo($reporter, ReportApproved::class);
    Notification::assertSentTo($author, PostHiddenByReport::class);
});

it('rejects report when AI verdict is invalid', function () {
    Notification::fake();

    $reporter = User::factory()->create();
    $author = User::factory()->create();
    $post = Post::factory()->create(['user_id' => $author->id, 'status' => 'published']);
    
    $report = PostReport::create([
        'post_id' => $post->id,
        'user_id' => $reporter->id,
        'reason' => 'لا يوجد سبب حقيقي',
    ]);

    // Mock the AI service to return 'invalid'
    $this->mock(AiAuditService::class, function ($mock) {
        $mock->shouldReceive('auditReport')
            ->once()
            ->andReturn([
                'score' => 20,
                'verdict' => 'invalid',
                'summary' => 'البلاغ غير صحيح، المحتوى لا يخالف السياسات',
            ]);
    });

    // Run the job
    (new AuditReportContent($report))->handle(app(AiAuditService::class));

    // Refresh models
    $report->refresh();
    $post->refresh();

    // Assert report was rejected
    expect($report->status)->toBe('rejected');
    expect($report->ai_verdict)->toBe('invalid');
    
    // Assert post was NOT rejected
    expect($post->status)->toBe('published');

    // Assert notification was sent to reporter
    Notification::assertSentTo($reporter, ReportRejected::class);
    
    // Assert post author was NOT notified
    Notification::assertNotSentTo($author, PostHiddenByReport::class);
});

it('keeps report pending and notifies admin when AI verdict is needs_review', function () {
    Notification::fake();

    $reporter = User::factory()->create();
    $admin = User::factory()->create(['role' => 'admin']);
    $author = User::factory()->create();
    $post = Post::factory()->create(['user_id' => $author->id, 'status' => 'published']);
    
    $report = PostReport::create([
        'post_id' => $post->id,
        'user_id' => $reporter->id,
        'reason' => 'محتوى غير واضح',
    ]);

    // Mock the AI service to return 'needs_review'
    $this->mock(AiAuditService::class, function ($mock) {
        $mock->shouldReceive('auditReport')
            ->once()
            ->andReturn([
                'score' => 50,
                'verdict' => 'needs_review',
                'summary' => 'الحالة غير واضحة وتحتاج مراجعة بشرية',
            ]);
    });

    // Run the job
    (new AuditReportContent($report))->handle(app(AiAuditService::class));

    // Refresh models
    $report->refresh();
    $post->refresh();

    // Assert report remains pending
    expect($report->status)->toBe('pending');
    expect($report->ai_verdict)->toBe('needs_review');
    
    // Assert post was NOT rejected
    expect($post->status)->toBe('published');

    // Assert reporter was notified
    Notification::assertSentTo($reporter, ReportPendingReview::class);
});

it('admin can manually approve reports', function () {
    Notification::fake();

    $admin = User::factory()->create(['role' => 'admin']);
    $reporter = User::factory()->create();
    $author = User::factory()->create();
    $post = Post::factory()->create(['user_id' => $author->id, 'status' => 'published']);
    
    $report = PostReport::create([
        'post_id' => $post->id,
        'user_id' => $reporter->id,
        'reason' => 'محتوى مخالف',
        'status' => 'pending',
    ]);

    $this->actingAs($admin)
        ->post(route('admin.reports.approve', $report));

    $report->refresh();
    $post->refresh();

    expect($report->status)->toBe('approved');
    expect($report->reviewed_by)->toBe($admin->id);
    expect($post->status)->toBe('rejected');

    Notification::assertSentTo($reporter, ReportApproved::class);
    Notification::assertSentTo($author, PostHiddenByReport::class);
});

it('admin can manually reject reports', function () {
    Notification::fake();

    $admin = User::factory()->create(['role' => 'admin']);
    $reporter = User::factory()->create();
    $author = User::factory()->create();
    $post = Post::factory()->create(['user_id' => $author->id, 'status' => 'published']);
    
    $report = PostReport::create([
        'post_id' => $post->id,
        'user_id' => $reporter->id,
        'reason' => 'بلاغ كاذب',
        'status' => 'pending',
    ]);

    $this->actingAs($admin)
        ->post(route('admin.reports.reject', $report));

    $report->refresh();
    $post->refresh();

    expect($report->status)->toBe('rejected');
    expect($report->reviewed_by)->toBe($admin->id);
    expect($post->status)->toBe('published');

    Notification::assertSentTo($reporter, ReportRejected::class);
    Notification::assertNotSentTo($author, PostHiddenByReport::class);
});
