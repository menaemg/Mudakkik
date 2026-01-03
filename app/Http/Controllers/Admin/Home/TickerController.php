<?php

namespace App\Http\Controllers\Admin\Home;

use App\Http\Controllers\Controller;
use App\Models\HomeSlot;
use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TickerController extends Controller
{
    public function index()
    {
        $settings = HomeSlot::section('ticker')->with('post')->get()->keyBy('slot_name');
        $tickerSlots = [];
        $excludeIds = [];

        for ($i = 1; $i <= 5; $i++) {
            $slotName = (string)$i;
            $setting = $settings->get($slotName);

            if ($setting && $setting->post_id) {
                $tickerSlots[] = ['slot' => $slotName, 'type' => 'manual', 'post' => $setting->post];
                $excludeIds[] = $setting->post_id;
            } else {
                $tickerSlots[] = ['slot' => $slotName, 'type' => 'auto', 'post' => null];
            }
        }

        $autoPosts = Post::where('status', 'published')->where('type', 'news')
            ->whereNotIn('id', $excludeIds)->latest()->take(5)->get();

        $autoIndex = 0;
        foreach ($tickerSlots as &$slot) {
            if ($slot['type'] === 'auto' && isset($autoPosts[$autoIndex])) {
                $slot['post'] = $autoPosts[$autoIndex++];
            }
        }

        return Inertia::render('Admin/Home/Ticker', ['tickerSlots' => $tickerSlots]);
    }

    public function update(Request $request)
    {
        $request->validate(['slot_name' => 'required', 'post_id' => 'nullable|exists:posts,id']);
        HomeSlot::updateOrCreate(
            ['section' => 'ticker', 'slot_name' => $request->slot_name],
            ['post_id' => $request->post_id]
        );
        return back()->with('success', 'تم التحديث');
    }
}
