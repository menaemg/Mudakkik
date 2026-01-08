<?php

namespace App\Http\Controllers\Admin\Home;

use App\Http\Controllers\Controller;
use App\Models\HomeSlot;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;
use App\Models\Advertisment;
use App\Services\HomePageService;

class TopicsSectionController extends Controller
{
public function index(HomePageService $homeService)
    {
        $rawAlerts = $homeService->getEditorAlertsManual();

        $alertsData = [];
        for($i=1; $i<=2; $i++) {
            $slotName = (string)$i;
            $item = $rawAlerts->where('slot_name', $slotName)->first();
            $alertsData[] = [
                'section' => 'editor_alerts',
                'slot_name' => $slotName,
                'post' => $item?->post,
                'post_id' => $item?->post_id
            ];
        }

        $categories = Category::withCount(['posts' => fn($q) => $q->where('status', 'published')])->get();
        $upcomingAd = Advertisment::with('user')->where('status', 'active')->where('start_date', '>', now())->orderBy('start_date', 'asc')->first();

        return Inertia::render('Admin/Home/TopicsSection', [
            'alertsData' => $alertsData,
            'categories' => $categories,
            'upcomingAd' => $upcomingAd
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'section'   => 'required|in:editor_alerts',
            'slot_name' => 'required|string',
            'post_id'   => [
                'nullable',
                'exists:posts,id',
                Rule::exists('posts', 'id')->where(function ($query) {
                    $query->where('status', 'published')
                          ->where(function($q) {
                              $q->where('ai_verdict', '!=', 'fake')
                                ->orWhereNull('ai_verdict');
                          });
                }),
            ]
        ], [
            'post_id.exists' => 'عذراً، هذا المقال غير متاح للتنبيهات (يجب أن يكون منشوراً وموثوقاً).'
        ]);

        HomeSlot::updateOrCreate(
            ['section' => $request->section, 'slot_name' => $request->slot_name],
            ['post_id' => $request->post_id]
        );

        return back()->with('success', 'تم تحديث تنبيهات المحرر بنجاح');
    }
}
