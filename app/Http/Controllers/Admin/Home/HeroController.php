<?php

namespace App\Http\Controllers\Admin\Home;

use App\Http\Controllers\Controller;
use App\Models\HomeSlot;
use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Services\HomePageService;

class HeroController extends Controller
{
    public function index(HomePageService $homeService)
    {
        $data = $homeService->getHeroWithSlots();
        $trending = Post::publishedTrusted()->orderByDesc('views')->take(5)->get();

        return Inertia::render('Admin/Home/Hero', [
            'heroSettings' => [
                'main' => [
                    'post' => $data['main'],
                    'post_id' => ($data['main'] && !$data['main']->is_auto_filled) ? $data['main']->id : null
                ],
                'strip_1' => [
                    'post' => $data['strip'][0] ?? null,
                    'post_id' => (isset($data['strip'][0]) && !$data['strip'][0]->is_auto_filled) ? $data['strip'][0]->id : null
                ],
                'strip_2' => [
                    'post' => $data['strip'][1] ?? null,
                    'post_id' => (isset($data['strip'][1]) && !$data['strip'][1]->is_auto_filled) ? $data['strip'][1]->id : null
                ],
            ],
            'autoSideNews'  => $data['side'],
            'trendingStats' => $trending,
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'slot_name' => 'required|string',
            'post_id'   => 'nullable|exists:posts,id'
        ]);

        HomeSlot::updateOrCreate(
            ['section' => 'hero', 'slot_name' => $request->slot_name],
            ['post_id' => $request->post_id, 'type' => 'post']
        );

        return back()->with('success', 'تم تحديث القسم بنجاح');
    }
}
