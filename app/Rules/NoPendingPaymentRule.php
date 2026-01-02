<?php

namespace App\Rules;

use App\Models\Payment;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class NoPendingPaymentRule implements ValidationRule
{
    /**
     * Run the validation rule.
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $user = auth()->user();

        // Check if user has any pending payments in the last 30 minutes
        $hasPendingPayment = Payment::where('user_id', $user->id)
            ->where('status', 'pending')
            ->where('created_at', '>', now()->subMinutes(30))
            ->exists();

        if ($hasPendingPayment) {
            $fail('لديك عملية دفع قيد الانتظار. يرجى إكمالها أو الانتظار قليلاً.');
        }
    }
}
