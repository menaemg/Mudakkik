<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class UserAdController extends Controller
{
    public function index()
    {
        $requests = auth()->user()->adRequests()->latest()->get();

        return Inertia::render('Profile/Ads/Index', [
            'requests' => $requests
        ]);
    }

    public function store(Request $request)
    {
      $user = $request->user();

      if ($user->isOnFreePlan()) {
        return back()->withErrors(['plan' => 'عفواً، يجب ترقية باقتك لتتمكن من إنشاء حملات إعلانية.']);
    }
        $validated = $request->validate([
            'title' => 'required|string|max:100',
            'target_url' => 'required|url',
            'image' => 'required|image|max:2048',
            'start_date' => 'required|date|after:today',
            'duration' => 'required|integer|min:1|max:30',
        ]);

        $imagePath = $request->file('image')->store('ads_requests', 'public');

        $endDate = \Carbon\Carbon::parse($validated['start_date'])->addDays($validated['duration']);

        $request->user()->adRequests()->create([
            'title' => $validated['title'],
            'target_url' => $validated['target_url'],
            'image_path' => $imagePath,
            'requested_start_date' => $validated['start_date'],
            'requested_end_date' => $endDate,
            'status' => 'pending'
        ]);

        return back()->with('success', 'تم إرسال طلب الإعلان للمراجعة.');
    }
}
