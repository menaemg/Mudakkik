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
        $rawSlots = HomeSlot::whereIn('section', ['featured', 'editors_choice'])->with('post')->get();
        $getSlot = fn($sec, $name) => $rawSlots->where('section', $sec)->where('slot_name', $name)->first();

        $featuredData = ['main' => null, 'subs' => [], 'editors' => []];

        $item = $getSlot('featured', 'main');
        $featuredData['main'] = ['section'=>'featured', 'slot_name'=>'main', 'post'=>$item?->post, 'post_id'=>$item?->post_id];

        for($i=1; $i<=4; $i++) {
            $item = $getSlot('featured', "sub_{$i}");
            $featuredData['subs'][] = ['section'=>'featured', 'slot_name'=>"sub_{$i}", 'post'=>$item?->post, 'post_id'=>$item?->post_id];
        }

        for($i=1; $i<=4; $i++) {
             $item = $getSlot('editors_choice', (string)$i);
             $featuredData['editors'][] = ['section'=>'editors_choice', 'slot_name'=>(string)$i, 'post'=>$item?->post, 'post_id'=>$item?->post_id];
        }

        return Inertia::render('Admin/Home/Featured', ['featuredData' => $featuredData]);
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
