<?php

namespace App\Http\Controllers;

use App\Models\Advertisment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class UserAdController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $remainingDays = $user->ad_credits;

        $hasActiveSubscription = $user->subscriptions()
            ->where('status', 'active')
            ->where('ends_at', '>', now())
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
            ->where('ends_at', '>', now())
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
                    'end_date' => Carbon::parse($validated['start_date'])->addDays((int) $validated['duration']),
                    'status' => 'pending'
                ]);
            });
        } catch (\Exception $e) {
            Storage::disk('public')->delete($imagePath);
            throw $e;
        }

        return back()->with('success', "تم إرسال الطلب وخصم {$validated['duration']} يوم من رصيدك.");
    }

    public function update(Request $request, Advertisment $advertisment)
    {
        if ($advertisment->user_id !== Auth::id()) {
            abort(403, 'غير مصرح لك بتعديل هذا الإعلان');
        }

        if ($advertisment->status !== 'pending') {
            return back()->withErrors(['general' => 'لا يمكن تعديل الإعلان إلا وهو قيد المراجعة.']);
        }

        $user = Auth::user();

        $validated = $request->validate([
            'title' => 'required|string|max:100',
            'target_url' => 'required|url',
            'image' => 'nullable|image|max:2048',
            'start_date' => 'required|date|after_or_equal:today',
            'duration' => 'required|integer|min:1',
        ]);

        try {
            DB::transaction(function () use ($user, $validated, $request, $advertisment) {

                $oldDuration = $advertisment->number_of_days;
                $newDuration = (int) $validated['duration'];
                $difference = $newDuration - $oldDuration;

                if ($difference > 0) {
                    if ($user->ad_credits < $difference) {
                         throw new \Exception("رصيدك الحالي ({$user->ad_credits}) لا يكفي لإضافة {$difference} أيام إضافية.");
                    }
                    $user->decrement('ad_credits', $difference);

                } elseif ($difference < 0) {

                    $user->increment('ad_credits', abs($difference));
                }

                $imagePath = $advertisment->image_url;
                if ($request->hasFile('image')) {
                    if ($imagePath && Storage::disk('public')->exists($imagePath)) {
                        Storage::disk('public')->delete($imagePath);
                    }
                    $imagePath = $request->file('image')->store('ads_requests', 'public');
                }

                $advertisment->update([
                    'title' => $validated['title'],
                    'target_link' => $validated['target_url'],
                    'start_date' => $validated['start_date'],
                    'end_date' => Carbon::parse($validated['start_date'])->addDays($newDuration),
                    'number_of_days' => $newDuration,
                    'image_url' => $imagePath,
                ]);
            });

            return back()->with('success', 'تم تعديل الإعلان وتسوية الرصيد بنجاح.');

        } catch (\Exception $e) {
            if ($request->hasFile('image') && isset($imagePath)) {
                 Storage::disk('public')->delete($imagePath);
            }
            \Log::error('Ad update failed', [
                'advertisment_id' => $advertisment->id,
                'user_id' => Auth::id(),
                'error' => $e->getMessage(),
            ]);
            return back()->withErrors(['general' => 'حدث خطأ أثناء تعديل الإعلان. حاول مرة أخرى لاحقاً.']);
        }
    }

public function destroy(Advertisment $advertisment)
{
    if ($advertisment->user_id !== Auth::id()) {
        abort(403);
    }

    DB::transaction(function () use ($advertisment) {

        if ($advertisment->status === 'pending') {
            $advertisment->user->increment('ad_credits', $advertisment->number_of_days);
        }

        if ($advertisment->image_url && Storage::disk('public')->exists($advertisment->image_url)) {
            Storage::disk('public')->delete($advertisment->image_url);
        }

        $advertisment->delete();
    });

    if ($advertisment->status === 'pending') {
        return back()->with('success', 'تم حذف الإعلان واسترجاع الرصيد إلى محفظتك.');
    } else {
        return back()->with('success', 'تم حذف الإعلان.');
    }
}
}
