<?php

namespace App\Http\Controllers\Admin\Home;

use App\Http\Controllers\Controller;
use App\Models\HomeSlot;
use App\Models\Post;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;
use App\Models\Advertisment;
use App\Services\HomePageService;

class EntertainmentController extends Controller
{
public function index(HomePageService $homeService)
    {
        $liveData = $homeService->getEntertainmentWithSlots();
        $slotNames = ['main', 'vertical_1', 'vertical_2', 'side_1', 'side_2', 'side_3'];
        $slots = [];

        foreach ($slotNames as $name) {
            $post = $liveData->get($name);
            $slots[] = [
                'slot_name' => $name,
                'post'      => $post,
                'post_id'   => $post?->id,
                'is_manual' => !($post->is_auto_filled ?? false),
                'type'      => $name === 'main' ? 'main' : (str_contains($name, 'vertical') ? 'vertical' : 'side')
            ];
        }

        $activeAd = Advertisment::where('position', 'agenda_sidebar')->where('status', 'run')->latest()->first();

        return Inertia::render('Admin/Home/Entertainment', ['slots' => $slots, 'agendaAd' => $activeAd]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'slot_name' => 'required|string',
            'post_id'   => [
                'nullable',
                Rule::exists('posts', 'id')->where(function ($query) {
                    $query->where('status', 'published');
                }),
            ]
        ]);

        HomeSlot::updateOrCreate(
            ['section' => 'entertainment', 'slot_name' => $request->slot_name],
            ['post_id' => $request->post_id]
        );

        return back()->with('success', $request->post_id ? 'تم تثبيت الخبر بنجاح' : 'تمت العودة للوضع التلقائي');
    }
}
