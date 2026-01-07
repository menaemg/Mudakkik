<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use App\Models\UpgradeRequest;
use Inertia\Inertia;

class PlanController extends Controller
{
  public function index()
  {
    $plans = Plan::active()
      ->ordered()
      ->get();

    $currentSubscription = null;
    $upgradeRequestStatus = null;
    $userRole = null;

    if (auth()->check()) {
      $user = auth()->user();
      $currentSubscription = $user->currentSubscription()?->load('plan');
      $userRole = $user->role;
      
      // Get upgrade request status
      $upgradeRequest = UpgradeRequest::where('user_id', $user->id)
        ->whereIn('status', ['pending', 'approved'])
        ->latest()
        ->first();
      $upgradeRequestStatus = $upgradeRequest?->status;
    }

    return Inertia::render('Plans/Index', [
      'plans' => $plans,
      'currentSubscription' => $currentSubscription,
      'upgradeRequestStatus' => $upgradeRequestStatus,
      'userRole' => $userRole,
    ]);
  }
}
