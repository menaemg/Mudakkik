<?php

namespace App\Http\Controllers\Admin\Home;

use App\Http\Controllers\Controller;
use App\Models\HomeSlot;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;
use App\Services\HomePageService;

class BusinessController extends Controller
{
public function index(HomePageService $homeService)
{
      $liveDistribution = $homeService->getBusinessWithSlots();

      $manualSlots = HomeSlot::where('section', 'business')->pluck('post_id', 'slot_name')->toArray();

      $slotNames = ['box_1', 'box_2', 'box_3', 'box_4'];
      $slots = [];

      foreach ($slotNames as $slotName) {
          $activePost = $liveDistribution->get($slotName);

          $slots[] = [
              'slot_name' => $slotName,
              'post'      => $activePost,
              'post_id'   => $activePost?->id,
              'is_manual' => isset($manualSlots[$slotName]),
          ];
      }

      return Inertia::render('Admin/Home/Business', [
          'slots' => $slots
      ]);
  }
    public function update(Request $request)
    {
        $request->validate([
            'slot_name' => 'required|string',
            'post_id'   => [
                'nullable',
                Rule::exists('posts', 'id')->where('status', 'published'),
            ]
        ]);

        if ($request->post_id) {
            HomeSlot::updateOrCreate(
                ['section' => 'business', 'slot_name' => $request->slot_name],
                ['post_id' => $request->post_id]
            );
            $msg = 'تم تثبيت الخبر بنجاح';
        } else {
            HomeSlot::where('section', 'business')
                ->where('slot_name', $request->slot_name)
                ->delete();
            $msg = 'تم إزالة الخبر، الخانة الآن فارغة (أو ستعمل تلقائياً)';
        }

        return back()->with('success', $msg);
    }
}
