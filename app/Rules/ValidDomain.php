<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class ValidDomain implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $value = trim(strtolower((string) $value));


        if (str_contains($value, '://') || str_contains($value, '/')) {
            $fail('يرجى إدخال الدومين فقط (مثال: example.com) بدون http أو مسارات.');
            return;
        }


        $asciiDomain = $value;
        if (function_exists('idn_to_ascii')) {
            $asciiDomain = idn_to_ascii(
                $value, 
                IDNA_DEFAULT, 
                INTL_IDNA_VARIANT_UTS46
            );

            if ($asciiDomain === false) {
                $fail('صيغة الدومين غير صالحة.');
                return;
            }
        }

        if (
            !filter_var('http://' . $asciiDomain, FILTER_VALIDATE_URL) ||
            filter_var($asciiDomain, FILTER_VALIDATE_IP) ||
            !str_contains($asciiDomain, '.')
        ) {
            $fail('يرجى إدخال دومين صالح.');
        }
    }
}
