<?php

namespace App\Http\Controllers;

use App\Jobs\AuditReportContent;
use App\Models\Post;
use App\Models\PostReport;
use App\Notifications\ReportSubmitted;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use App\Models\User;
use Inertia\Inertia;

class PostReportController extends Controller
{
    public function create(Post $post)
    {
        // Check if user already reported this post
        $existingReport = PostReport::where('post_id', $post->id)
            ->where('user_id', auth()->id())
            ->exists();

        if ($existingReport) {
            return redirect()
                ->route('posts.show', $post->slug)
                ->with('error', 'لقد قمت بالإبلاغ عن هذا المقال مسبقاً');
        }

        return Inertia::render('Posts/Report', [
            'post' => $post
        ]);
    }

public function store(Request $request, Post $post)
    {
        $request->validate([
            'reason' => 'required|min:5|max:2000',
        ]);

        $existingReport = PostReport::where('post_id', $post->id)
            ->where('user_id', auth()->id())
            ->exists();

        if ($existingReport) {
            return redirect()
                ->route('posts.show', $post->slug)
                ->with('error', 'لقد قمت بالإبلاغ عن هذا المقال مسبقاً');
        }

        $report = PostReport::create([
            'post_id' => $post->id,
            'user_id' => auth()->id(),
            'reason' => $request->reason,
        ]);

        auth()->user()->notify(new ReportSubmitted($report));

        AuditReportContent::dispatch($report);

        Cache::forget('admin.pending_reports_count');

        return redirect()
            ->route('posts.show', $post->slug);
    }
}
