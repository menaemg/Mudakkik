<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Follow;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FollowController extends Controller
{
    /**
     * Toggle follow status for a user.
     */
    public function toggle(User $user)
    {
        $currentUser = Auth::user();

        if ($currentUser->id === $user->id) {
            return back()->with('error', 'لا يمكنك متابعة نفسك.');
        }

        $existingFollow = Follow::where('following_user_id', $currentUser->id)
            ->where('followed_user_id', $user->id)
            ->first();

        if ($existingFollow) {
            $existingFollow->delete();
            $message = 'تم إلغاء المتابعة بنجاح.';
        } else {
            Follow::create([
                'following_user_id' => $currentUser->id,
                'followed_user_id' => $user->id,
            ]);
            $message = 'تمت المتابعة بنجاح.';
        }

        return back()->with('success', $message);
    }
}
