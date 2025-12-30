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

    return Inertia::render('Plans/Index', [
      'plans' => $plans
    ]);
  }
}
