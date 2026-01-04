<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use Inertia\Inertia;

class PlanController extends Controller
{
  public function index()
  {
    $plans = Plan::active()
      ->ordered()
      ->get();

    $currentSubscription = null;
    if (auth()->check()) {
      $currentSubscription = auth()->user()->currentSubscription()?->load('plan');
    }

    return Inertia::render('Plans/Index', [
      'plans' => $plans,
      'currentSubscription' => $currentSubscription,
    ]);
  }
}
