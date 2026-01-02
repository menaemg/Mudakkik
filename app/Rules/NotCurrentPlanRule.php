<?php

namespace App\Rules;

use App\Models\Plan;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class NotCurrentPlanRule implements ValidationRule
{
    /**
     * Run the validation rule.
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $plan = Plan::where('slug', $value)->first();

        if (!$plan) {
            return; 
        }

        $user = auth()->user();
        $currentSubscription = $user->currentSubscription();

        if ($currentSubscription && $currentSubscription->plan_id === $plan->id) {
            $fail('أنت مشترك بالفعل في هذه الخطة.');
        }
    }
}
