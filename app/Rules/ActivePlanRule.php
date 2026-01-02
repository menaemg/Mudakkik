<?php

namespace App\Rules;

use App\Models\Plan;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class ActivePlanRule implements ValidationRule
{
    /**
     * Run the validation rule.
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $plan = Plan::where('slug', $value)->first();

        if (!$plan) {
            $fail('الخطة المحددة غير موجودة.');
            return;
        }

        if (!$plan->isActive()) {
            $fail('الخطة المحددة غير متاحة حالياً.');
        }
    }
}
