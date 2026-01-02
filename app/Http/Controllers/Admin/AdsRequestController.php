<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdsRequestController extends Controller
{
    //
    public function index(Request $request)
    {
        $requests = AdRequest::latest()
            ->with('user')
            ->filter($request)
            ->paginate(10)
            ->withQueryString();

        $pendingCount = AdRequest::where('status', 'pending')->count();
        $acceptedCount = AdRequest::where('status', 'approved')->count();
        $rejectedCount = AdRequest::where('status', 'rejected')->count();
        $waiting_paymentCount = AdRequest::where('status', 'waiting_payment')->count();
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
                'waiting_payment' => $waiting_paymentCount,
            ],
            'oldPendingCount' => $oldPendingCount,
        ]);
    }

    public function update(Request $request, AdRequest $AdRequest)
    {
        $data = $request->validate([
            'status' => 'required|in:approved,rejected',
            'admin_notes' => 'nullable|string|max:2000',
        ]);

        // Prevent changing already-processed requests
        if (in_array($AdRequest->status, ['approved', 'rejected'])) {
            return back()->with('error', 'لا يمكن تعديل طلب تمت معالجته بالفعل');
        }

        $AdRequest->update(
            [
                'status' => $data['status'],
                'admin_notes' => $data['admin_notes'] ?? null,
            ]
        );

        return back()->with('success', 'تم تحديث حالة الطلب بنجاح');
    }

    public function destroy(AdRequest $AdRequest)
    {
        $this->authorize('delete', $AdRequest);
        $AdRequest->delete();

        return back()->with('success', 'تم حذف الطلب بنجاح');
    }
}
