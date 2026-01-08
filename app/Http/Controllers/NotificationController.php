<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index()
    {
        return response()->json(auth()->user()->notifications()->take(10)->get());
    }

    public function markAllRead(Request $request)
    {
        auth()->user()->unreadNotifications->markAsRead();

        if ($request->header('X-Inertia')) {
            return back();
        }

        return response()->json(['status' => 'success']);
    }
    public function destroy($notificationId)
    {
        $notification = auth()->user()->notifications()->findOrFail($notificationId);
        $notification->delete();

        return response()->json(['message' => 'Notification deleted successfully']);
    }
}
