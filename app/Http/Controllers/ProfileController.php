<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        /** @var \App\Models\User $user */
        $user = $request->user();

        $postsCount = $user->posts()->count();
        $followersCount = $user->followers()->count();
        $followingCount = $user->following()->count();
        $totalViews = $user->posts()->sum('views');

        $stats = [
            'role' => $user->role === 'journalist' ? 'صحفي' : ($user->role === 'admin' ? 'مدير' : 'عضو'),
            'plan' => $user->currentPlan() ? $user->currentPlan()->name : 'Free',
            'followers' => $followersCount,
            'following' => $followingCount,
            'views' => $totalViews,
            'posts_count' => $postsCount
        ];

        $myArticles = $user->posts()
            ->latest()
            ->paginate(6, ['*'], 'articles_page');

        $recentPosts = $user->posts()
            ->latest()
            ->take(3)
            ->get();

        $likedPosts = $user->likedPosts()
            ->with('user:id,name')
            ->latest('likes.created_at')
            ->paginate(6, ['*'], 'likes_page');

        $adRequests = $user->adRequests()
            ->latest()
            ->paginate(5, ['*'], 'ads_page');

        $latestUpgradeRequest = \App\Models\UpgradeRequest::where('user_id', $user->id)
        ->latest()
        ->first();

        $subscription = \App\Models\Subscription::where('user_id', $user->id)
        ->where('status', 'active')
        ->latest()
        ->with('plan')
        ->first();

if ($subscription && $subscription->plan) {
            $currentPlan = $subscription->plan;
        } else {
            $currentPlan = (object) [
                'name' => 'الباقة المجانية',
                'slug' => 'free',
                'features' => json_encode([
                    'تصفح الأخبار والمقالات',
                    'التعليق والإعجاب',
                    'تخصيص الملف الشخصي'
                ])
            ];
        }

        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $user instanceof MustVerifyEmail,
            'status' => session('status'),

            'stats' => $stats,

            'recent_posts' => ['data' => $recentPosts],

            'articles' => $myArticles,
            'liked_posts' => $likedPosts,

            'ad_requests' => $adRequests,

            'upgrade_request_status' => $latestUpgradeRequest ? $latestUpgradeRequest->status : null,
            'categories' => \App\Models\Category::select('id', 'name')->get(),
            'subscription' => $subscription,
            'current_plan' => $currentPlan,
        ]);
    }
    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $user = $request->user();
        $data = $request->validated();

        if ($request->hasFile('avatar') && $request->file('avatar')->isValid()) {
            if ($user->avatar) {
                Storage::disk('public')->delete($user->avatar);
            }
        $path = $request->file('avatar')->store('avatars', 'public');
        $user->avatar = $path;
        }

        $user->fill($data);

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        return Redirect::route('profile.edit')->with('success', 'تم تحديث الملف الشخصي بنجاح');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
