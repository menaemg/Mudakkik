<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\PostReport;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PostReportController extends Controller
{
    public function create(Post $post)
    {
        return Inertia::render('Posts/Report', [
            'post' => $post
        ]);
    }

    public function store(Request $request, Post $post)
    {
        $request->validate([
            'reason' => 'required|min:5',
        ]);

        PostReport::create([
            'post_id' => $post->id,
            'user_id' => auth()->id(),
            'reason' => $request->reason,
        ]);

        return redirect()
            ->route('posts.show', $post->slug)
            ->with('success', 'Report sent successfully');
    }
}
