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
use App\Models\Subscription;
use App\Models\UpgradeRequest;
use App\Models\Advertisment;

class ProfileController extends Controller
{

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
            'is_journalist' => $user->role === 'journalist',
            'plan' => $user->currentPlan() ? $user->currentPlan()->name : 'Free',
            'followers' => $followersCount,
            'following' => $followingCount,
            'views' => $totalViews,
            'posts_count' => $postsCount,
            'ai_credits' => ($user->ai_recurring_credits ?? 0) + ($user->ai_bonus_credits ?? 0),
            'ad_credits' => $user->ad_credits ?? 0,
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

        $latestUpgradeRequest = UpgradeRequest::where('user_id', $user->id)
        ->latest()
        ->first();

        $subscription = Subscription::where('user_id', $user->id)
        ->where('status', 'active')
        ->latest()
        ->with('plan')
        ->first();

      $subscriptionHistory = Subscription::where('user_id', $user->id)
          ->where('id', '!=', $subscription?->id)
          ->with('plan')
          ->latest()
          ->get();
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

        $recentLikes = $user->likedPosts()
        ->with('user:id,name,avatar,role')
        ->latest('likes.created_at')
        ->take(3)
        ->get();

        $adRequests = Advertisment::where('user_id', $user->id)
        ->latest()
        ->paginate(10, ['*'], 'ads_page')
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

        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $user instanceof MustVerifyEmail,
            'status' => session('status'),

            'stats' => $stats,

            'recent_posts' => ['data' => $recentPosts],
            'recent_likes' => ['data' => $recentLikes],

            'articles' => $myArticles,
            'liked_posts' => $likedPosts,

            'ad_requests' => $adRequests,
            'upgrade_request' => $latestUpgradeRequest,
            'upgrade_request_status' => $latestUpgradeRequest ? $latestUpgradeRequest->status : null,
            'categories' => \App\Models\Category::select('id', 'name')->get(),
            'subscription' => $subscription,
            'subscription_history' => $subscriptionHistory,
            'current_plan' => $currentPlan,
        ]);
    }

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

        unset($data['avatar']);

        $user->fill($data);

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

    $tab = $request->get('tab');
    if ($tab) {
        return Redirect::route('profile.edit', ['tab' => $tab])->with('success', 'تم تحديث الملف الشخصي بنجاح');
    }

    return Redirect::route('profile.edit')->with('success', 'تم تحديث الملف الشخصي بنجاح');
}
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
