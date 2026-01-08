<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Advertisment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
class AdsRequestController extends Controller
{
    //
public function index(Request $request)
    {
        $requests = Advertisment::latest()
            ->with('user')
            ->with('subscription')
            ->filter($request)
            ->paginate(10)
            ->withQueryString()
            ->through(function ($ad) {
                $imageUrl = null;
                if ($ad->image_url) {
                    if (str_starts_with($ad->image_url, 'http')) {
                        $imageUrl = $ad->image_url;
                    } else {
                        $imageUrl = Storage::url($ad->image_url);
                    }
                }

                return [
                    'id' => $ad->id,
                    'title' => $ad->title,
                    'image_url' => $imageUrl,
                    'target_link' => $ad->target_link,
                    'number_of_days' => $ad->number_of_days,
                    'status' => $ad->status,
                    'position' => $ad->position,
                    'admin_notes' => $ad->admin_notes,
                    'created_at' => $ad->created_at,
                    'requested_start_date' => $ad->start_date,
                    'requested_end_date' => $ad->end_date,
                    'start_date' => $ad->start_date,
                    'end_date' => $ad->end_date,
                    'user' => $ad->user,
                ];
            });

        $pendingCount = Advertisment::where('status', 'pending')->count();
        $acceptedCount = Advertisment::where('status', 'approved')->count();
        $rejectedCount = Advertisment::where('status', 'rejected')->count();
        $totalCount = Advertisment::count();

        $oldPendingCount = Advertisment::where('status', 'pending')
            ->where('created_at', '<', now()->subDays(3))
            ->count();

        return Inertia::render('Admin/Requests/Ads', [
            'requests' => $requests,
            'filters' => $request->only(['search', 'status']),
            'stats' => [
                'total' => $totalCount,
                'pending' => $pendingCount,
                'approved' => $acceptedCount,
                'rejected' => $rejectedCount,
            ],
            'oldPendingCount' => $oldPendingCount,
        ]);
    }

public function update(Request $request, Advertisment $advertisment)
    {
        $data = $request->validate([
            'status' => 'required|in:approved,rejected',
            'admin_notes' => 'nullable|string|max:2000',
        ]);

        try {
            DB::transaction(function () use ($data, $advertisment) {
              // refunding the user in case of rejection
                if ($data['status'] === 'rejected' && $advertisment->status !== 'rejected') {
                    $advertisment->user->refundAdCredit($advertisment->number_of_days);
                }

                $updateData = [
                    'status' => $data['status'],
                    'admin_notes' => $data['admin_notes'] ?? null,
                ];
                // approving the ad from the date of its approval
                if ($data['status'] === 'approved') {
                    $updateData['start_date'] = now();
                    $updateData['end_date'] = now()->addDays($advertisment->number_of_days);
                }

                $advertisment->update($updateData);
            });

            return back()->with('success', 'تم تحديث حالة الطلب بنجاح');

        } catch (\Exception $e) {
            \Log::error('Ad request update failed', [
                'ad_request_id' => $advertisment->id,
                'user_id' => $advertisment->user_id,
                'attempted_status' => $data['status'] ?? null,
                'error' => $e->getMessage(),
            ]);
            return back()->with('error', 'حدث خطأ أثناء التحديث. حاول مرة أخرى لاحقاً.');
        }
    }

    public function destroy(Advertisment $advertisment)
    {
        // Only admins can access this controller, so we just check ownership isn't required
        // Refund credit only for pending ads
        if ($advertisment->status === 'pending') {
             $advertisment->user->refundAdCredit($advertisment->number_of_days);
        }
        $advertisment->delete();

        return back()->with('success', 'تم حذف الطلب بنجاح');
    }
}

