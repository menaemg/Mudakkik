<?php
namespace App\Http\Controllers\Admin\Home;
use App\Models\Post;
use App\Http\Controllers\Controller;
use App\Models\HomeSlot;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;


class TopStoriesController extends Controller
{
public function index()
{
    $safeQuery = function ($q) {
        $q->where('status', 'published')
          ->where(function ($qq) {
              $qq->where('ai_verdict', '!=', 'fake')
                 ->orWhereNull('ai_verdict');
          });
    };

    $slotsFromDb = HomeSlot::where('section', 'top_stories')
        ->with([
            'post' => function ($q) use ($safeQuery) {
                $q->tap($safeQuery)
                  ->with(['user:id,name,avatar', 'category:id,name,slug']);
            }
        ])
        ->get()
        ->keyBy('slot_name');

    $slotNames = ['large_1', 'large_2', 'small_1', 'small_2', 'small_3', 'small_4'];

    $excludeIds = $slotsFromDb->pluck('post_id')->filter()->toArray();

    $slots = [];

    foreach ($slotNames as $slotName) {

        $slot = $slotsFromDb->get($slotName);
        $post = $slot?->post;

        $isManual = true;

        if (!$post) {
            $post = Post::tap($safeQuery)
                ->whereNotIn('id', $excludeIds)
                ->with(['user:id,name,avatar', 'category:id,name,slug'])
                ->orderByDesc('views')
                ->first();

            $isManual = false;
        }

        if ($post) {
            $excludeIds[] = $post->id;
        }

        $slots[] = [
            'slot_name' => $slotName,
            'post'      => $post,
            'post_id'   => $isManual ? $slot?->post_id : null,
            'is_large'  => str_contains($slotName, 'large'),
            'is_manual' => $isManual,
        ];
    }

    return Inertia::render('Admin/Home/TopStories', [
        'slots' => $slots
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
                              $q->where('ai_verdict', '!=', 'fake')->orWhereNull('ai_verdict');
                          });
                }),
            ]
        ], [
            'post_id.exists' => 'عذراً، هذا المقال غير متاح أو مصنف كمحتوى زائف.'
        ]);

        HomeSlot::updateOrCreate(
            ['section' => 'top_stories', 'slot_name' => $request->slot_name],
            ['post_id' => $request->post_id]
        );

        return back()->with('success', $request->post_id ? 'تم تثبيت الخبر بنجاح' : 'تم إزالة الخبر بنجاح');
    }
}
