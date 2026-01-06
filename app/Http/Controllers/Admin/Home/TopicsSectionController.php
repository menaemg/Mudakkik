<?php

namespace App\Http\Controllers\Admin\Home;

use App\Http\Controllers\Controller;
use App\Models\HomeSlot;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class TopicsSectionController extends Controller
{
    public function index()
    {
        $settings = HomeSlot::where('section', 'editor_alerts')
            ->with(['post.user', 'post.category'])
            ->get();

        $alertsData = [];
        for($i=1; $i<=2; $i++) {
            $alertsData[] = $this->formatSlot($settings, 'editor_alerts', (string)$i);
        }

        $categories = Category::withCount(['posts' => function($q) {
            $q->where('status', 'published');
        }])->get();

        return Inertia::render('Admin/Home/TopicsSection', [
            'alertsData' => $alertsData,
            'categories' => $categories
        ]);
    }

    private function formatSlot($collection, $section, $slotName)
    {
        $item = $collection->where('section', $section)->where('slot_name', $slotName)->first();
        $post = $item ? $item->post : null;
        return [
            'section' => $section,
            'slot_name' => $slotName,
            'post' => $post,
            'post_id' => $post ? $item->post_id : null
        ];
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
