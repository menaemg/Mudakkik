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

        if ($user->currentPlan()?->slug === 'free' || !$user->currentPlan()) {
            return back()->withErrors(['plan' => 'عفواً، ميزة الإعلانات متاحة فقط للمشتركين.']);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:100',
            'target_url' => 'required|url',
            'image' => 'required|image|max:2048',
            'start_date' => 'required|date|after:today',
            'duration' => 'required|integer|min:1|max:30',
        ]);

        $cost = $validated['duration'];

        if (!$user->consumeAdCredit($cost)) {
            return back()->withErrors([
                'duration' => "رصيد الإعلانات غير كافي ({$user->ad_credits} أيام متبقية). يرجى تقليل المدة أو ترقية الباقة."
            ]);
        }

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

        return back()->with('success', "تم إرسال الطلب وخصم {$cost} أيام من رصيدك.");
    }
}
