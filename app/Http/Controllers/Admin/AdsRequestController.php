<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Advertisment as AdRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

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
            ->withQueryString();

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

        $adRequest->update([
            'status' => $data['status'],
            'admin_notes' => $data['admin_notes'] ?? null,
            'start_date' => $data['status'] === 'approved' ? now() : null,
            'end_date' => $data['status'] === 'approved' ? now()->addDays($adRequest->number_of_days) : null,
        ]);

        return back()->with('success', 'تم تحديث حالة الطلب بنجاح');
    }

    public function destroy(AdRequest $AdRequest)
    {
        $this->authorize('delete', $AdRequest);
        $AdRequest->delete();

        return back()->with('success', 'تم حذف الطلب بنجاح');
    }
}
