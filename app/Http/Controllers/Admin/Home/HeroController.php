<?php

namespace App\Http\Controllers\Admin\Home;

use App\Http\Controllers\Controller;
use App\Models\HomeSlot;
use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class HeroController extends Controller
{
    public function index()
    {
        $settings = HomeSlot::section('hero')
            ->with(['post' => function ($q) {
                $q->where('status', 'published')
                  ->where(function($qq) { $qq->where('ai_verdict', '!=', 'fake')->orWhereNull('ai_verdict'); });
            }])
            ->get()
            ->keyBy('slot_name');

        $excludeIds = [];
        $manualMain = $settings->get('main');
        $mainPost = $manualMain?->post;

        if (!$mainPost) {
            $mainPost = Post::where('status', 'published')
                ->whereIn('type', ['article', 'news'])
                ->where(function($q) { $q->where('ai_verdict', '!=', 'fake')->orWhereNull('ai_verdict'); })
                ->with(['user', 'category'])
                ->latest()
                ->first();
        }
        if ($mainPost) $excludeIds[] = $mainPost->id;
        $sideNews = Post::where('status', 'published')
            ->where('type', 'news')
            ->where(function($q) { $q->where('ai_verdict', '!=', 'fake')->orWhereNull('ai_verdict'); })
            ->whereNotIn('id', $excludeIds)
            ->latest()
            ->take(4)
            ->get();

        $excludeIds = array_merge($excludeIds, $sideNews->pluck('id')->toArray());

        $strips = [];
        foreach(['strip_1', 'strip_2'] as $slotName) {
            $manualStrip = $settings->get($slotName);
            $post = $manualStrip?->post;

            if (!$post) {
                $post = Post::where('status', 'published')
                    ->where('type', 'article')
                    ->where(function($q) { $q->where('ai_verdict', '!=', 'fake')->orWhereNull('ai_verdict'); })
                    ->whereNotIn('id', $excludeIds)
                    ->inRandomOrder()
                    ->with('user')
                    ->first();
            }

            if ($post) $excludeIds[] = $post->id;

            $strips[$slotName] = [
                'post' => $post,
                'post_id' => $manualStrip?->post_id
            ];
        }

        $trending = Post::where('status', 'published')
            ->whereNotIn('id', $excludeIds)
            ->orderByDesc('views')
            ->take(5)
            ->get();

        return Inertia::render('Admin/Home/Hero', [
            'heroSettings' => [
                'main' => [
                    'post' => $mainPost,
                    'post_id' => $manualMain?->post_id
                ],
                'strip_1' => $strips['strip_1'],
                'strip_2' => $strips['strip_2'],
            ],
            'autoSideNews'  => $sideNews,
            'trendingStats' => $trending,
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'slot_name' => 'required|string',
            'post_id'   => [
                'nullable',
                Rule::exists('posts', 'id')->where(function ($query) {
                    $query->where('status', 'published')
                          ->where(function($q) {
                              $q->where('ai_verdict', '!=', 'fake')
                                ->orWhereNull('ai_verdict');
                          });
                }),
            ]
        ]);

        HomeSlot::updateOrCreate(
            ['section' => 'hero', 'slot_name' => $request->slot_name],
            ['post_id' => $request->post_id]
        );

        return back()->with('success', 'تم التحديث');
    }
}
