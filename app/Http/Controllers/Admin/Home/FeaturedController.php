<?php

namespace App\Http\Controllers\Admin\Home;

use App\Http\Controllers\Controller;
use App\Models\HomeSlot;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class FeaturedController extends Controller
{
    public function index()
    {
        $settings = HomeSlot::whereIn('section', ['featured', 'editors_choice'])
            ->with(['post' => function ($query) {
                $query->where('status', 'published')
                      ->where(function($q) {
                          $q->where('ai_verdict', '!=', 'fake')
                            ->orWhereNull('ai_verdict');
                      })
                      ->with(['user', 'category']);
            }])
            ->get();

        $featuredData = [
            'main' => $this->formatSlot($settings, 'featured', 'main'),
            'subs' => [],
            'editors' => []
        ];

        for($i=1; $i<=4; $i++) {
            $featuredData['subs'][] = $this->formatSlot($settings, 'featured', "sub_{$i}");
        }

        for($i=1; $i<=4; $i++) {
            $featuredData['editors'][] = $this->formatSlot($settings, 'editors_choice', (string)$i);
        }

        return Inertia::render('Admin/Home/Featured', [
            'featuredData' => $featuredData
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
            'section'   => 'required|in:featured,editors_choice',
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
            'post_id.exists' => 'عذراً، هذا المقال غير متاح للعرض (قد يكون غير منشور أو مصنف كمحتوى زائف).'
        ]);

        HomeSlot::updateOrCreate(
            ['section' => $request->section, 'slot_name' => $request->slot_name],
            ['post_id' => $request->post_id]
        );

        return back()->with('success', 'تم التحديث بنجاح');
    }
}
