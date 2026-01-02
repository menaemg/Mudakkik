<?php

namespace App\Rules;

use App\Models\Plan;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class PaidPlanRule implements ValidationRule
{
    /**
     * Run the validation rule.
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $plan = Plan::where('slug', $value)->first();

        if (!$plan) {
            return; // Let other rules handle missing plan
        }

        if ($plan->isFree()) {
            $fail('Free plans cannot be purchased through checkout.');
        }
    }
}
