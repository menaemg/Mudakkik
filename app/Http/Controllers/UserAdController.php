<?php

namespace App\Http\Controllers;

use App\Models\Advertisment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class UserAdController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $remainingDays = $user->ad_credits;

        $hasActiveSubscription = $user->subscriptions()
            ->where('status', 'active')
            ->where('end_date', '>', now())
            ->exists();

        $requests = Advertisment::where('user_id', $user->id)
            ->latest()
            ->paginate(10)
            ->through(function ($ad) {
                return [
                    'id' => $ad->id,
                    'title' => $ad->title,
                    'image_path' => $ad->image_url,
                    'target_url' => $ad->target_link,
                    'requested_start_date' => $ad->start_date,
                    'requested_end_date' => $ad->end_date,
                    'duration' => $ad->number_of_days,
                    'status' => $ad->status,
                ];
            });

        return Inertia::render('Profile/Ads/Index', [
            'adRequests' => $requests,
            'remainingDays' => $remainingDays,
            'hasActiveSubscription' => $hasActiveSubscription
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user();

        $activeSubscription = $user->subscriptions()
            ->where('status', 'active')
            ->where('end_date', '>', now())
            ->latest()
            ->first();

        if (!$activeSubscription) {
            return back()->withErrors(['general' => 'عفواً، يجب أن يكون لديك اشتراك فعال لإنشاء إعلان.']);
        }

        $currentCredits = $user->ad_credits;

        $validated = $request->validate([
            'title' => 'required|string|max:100',
            'target_url' => 'required|url',
            'image' => 'required|image|max:2048',
            'start_date' => 'required|date|after_or_equal:today',
            'duration' => ['required', 'integer', 'min:1', function ($attribute, $value, $fail) use ($currentCredits) {
                if ($value > $currentCredits) {
                    $fail("عفواً، رصيدك الحالي ($currentCredits يوم) لا يكفي لهذه المدة.");
                }
            }],
        ]);


        $imagePath = $request->file('image')->store('ads_requests', 'public');

        try {
            DB::transaction(function () use ($user, $validated, $activeSubscription, $imagePath) {
                $user->decrement('ad_credits', $validated['duration']);

                Advertisment::create([
                    'user_id' => $user->id,
                    'subscription_id' => $activeSubscription->id,
                    'title' => $validated['title'],
                    'image_url' => $imagePath,
                    'target_link' => $validated['target_url'],
                    'number_of_days' => $validated['duration'],
                    'start_date' => $validated['start_date'],

                    'end_date' => \Carbon\Carbon::parse($validated['start_date'])->addDays((int) $validated['duration']),

                    'status' => 'pending'
                ]);
                $admin = \App\Models\User::where('role', 'admin')->first();
                if ($admin) {
                    $admin->notify(new \App\Notifications\AdminActivityNotification([
                        'title' => 'طلب إعلان جديد',
                        'message' => 'لديك طلب إعلان جديد من ' . auth()->user()->name,
                        'link' => route('admin.requests.ads'), 
                    ]));
                }
            });
        } catch (\Exception $e) {
            // Clean up uploaded file if transaction fails
            \Storage::disk('public')->delete($imagePath);
            throw $e;
        }

        return back()->with('success', "تم إرسال الطلب وخصم {$validated['duration']} يوم من رصيدك.");
    }
}
