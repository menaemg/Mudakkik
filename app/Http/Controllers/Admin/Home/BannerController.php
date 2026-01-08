<?php

namespace App\Http\Controllers\Admin\Home;

use App\Http\Controllers\Controller;
use App\Models\HomeSlot;
use App\Models\Advertisment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;
use App\Services\HomePageService;

class BannerController extends Controller
{
    public function index(HomePageService $homeService)
    {
        $bannerSlot = HomeSlot::where('section', 'banner')
            ->where('slot_name', 'main_banner')
            ->with('post.category')
            ->first();

        $activeAd = Advertisment::where('position', 'main_banner')
            ->where('status', 'run')
            ->whereDate('start_date', '<=', now())
            ->whereDate('end_date', '>=', now())
            ->latest()
            ->first();

        return Inertia::render('Admin/Home/Banner', [
            'currentSettings' => [
                'type'    => $bannerSlot?->type ?? 'post',
                'post_id' => $bannerSlot?->post_id,
                'post'    => $bannerSlot?->post,
            ],
            'activeAd' => $activeAd
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'type'    => 'required|in:post,ad',
            'post_id' => 'required_if:type,post|nullable|exists:posts,id',
        ]);

        $slot = HomeSlot::firstOrNew([
            'section'   => 'banner',
            'slot_name' => 'main_banner'
        ]);

        $slot->type = $request->type;

        if ($request->type === 'post') {
            $slot->post_id = $request->post_id;
            $slot->custom_data = null;
        } else {
            $slot->post_id = null;
            $slot->custom_data = null;
        }

        $slot->save();

        return back()->with('success', 'تم تحديث إعدادات البانر بنجاح');
    }
}
