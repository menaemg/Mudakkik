<?php

namespace App\Http\Controllers\Admin\Home;

use App\Http\Controllers\Controller;
use App\Models\HomeSlot;
use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Services\HomePageService;
class TickerController extends Controller
{
public function index(HomePageService $homeService)
    {
        $tickerSlots = $homeService->getTickerWithSlots()->values();

        return Inertia::render('Admin/Home/Ticker', [
            'tickerSlots' => $tickerSlots
        ]);
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
