<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Advertisment as AdRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
class AdsRequestController extends Controller
{
    //
public function index(Request $request)
    {
        $requests = AdRequest::latest()
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

        $pendingCount = AdRequest::where('status', 'pending')->count();
        $acceptedCount = AdRequest::where('status', 'approved')->count();
        $rejectedCount = AdRequest::where('status', 'rejected')->count();
        $totalCount = AdRequest::count();

        $oldPendingCount = AdRequest::where('status', 'pending')
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

public function update(Request $request, AdRequest $adRequest)
    {
        $data = $request->validate([
            'status' => 'required|in:approved,rejected',
            'admin_notes' => 'nullable|string|max:2000',
        ]);

        try {
            DB::transaction(function () use ($data, $adRequest) {
              // refunding the user in case of rejection
                if ($data['status'] === 'rejected' && $adRequest->status !== 'rejected') {
                    $adRequest->user->refundAdCredit($adRequest->number_of_days);
                }

                $updateData = [
                    'status' => $data['status'],
                    'admin_notes' => $data['admin_notes'] ?? null,
                ];
                // approving the ad from the date of its approval
                if ($data['status'] === 'approved') {
                    $updateData['start_date'] = now();
                    $updateData['end_date'] = now()->addDays($adRequest->number_of_days);
                }

                $adRequest->update($updateData);
            });

            return back()->with('success', 'تم تحديث حالة الطلب بنجاح');

        } catch (\Exception $e) {
            return back()->with('error', 'حدث خطأ أثناء التحديث: ' . $e->getMessage());
        }
    }

    public function destroy(AdRequest $AdRequest)
    {
        /*Reterving Credit in case of deleting a pending ad */
        if ($AdRequest->status === 'pending') {
             $AdRequest->user->refundAdCredit($AdRequest->number_of_days);
        }


        $this->authorize('delete', $AdRequest);
        $AdRequest->delete();

        return back()->with('success', 'تم حذف الطلب بنجاح');
    }
}

