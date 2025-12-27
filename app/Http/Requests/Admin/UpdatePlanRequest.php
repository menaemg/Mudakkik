<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePlanRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Authorization handled at route level
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('plans', 'name')->ignore($this->route('plan')),
            ],
            'price' => 'required|numeric|min:0',
            'billing_interval' => 'required|in:monthly,yearly,one_time',
            'duration_days' => 'nullable|integer|min:1',
            'is_free' => 'nullable|boolean',
            'is_active' => 'nullable|boolean',
            'sort_order' => 'nullable|integer|min:0',
            'features' => 'nullable|array',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'اسم الخطة مطلوب',
            'name.max' => 'اسم الخطة يجب ألا يزيد عن 255 حرف',
            'price.required' => 'السعر مطلوب',
            'price.numeric' => 'السعر يجب أن يكون رقماً',
            'price.min' => 'السعر يجب أن يكون 0 أو أكثر',
            'billing_interval.required' => 'فترة الدفع مطلوبة',
            'billing_interval.in' => 'فترة الدفع غير صالحة',
            'duration_days.integer' => 'مدة الاشتراك يجب أن تكون رقماً صحيحاً',
            'duration_days.min' => 'مدة الاشتراك يجب أن تكون يوم واحد على الأقل',
            'sort_order.integer' => 'ترتيب العرض يجب أن يكون رقماً صحيحاً',
            'sort_order.min' => 'ترتيب العرض يجب أن يكون 0 أو أكثر',
        ];
    }

    /**
     * Configure the validator instance.
     */
    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $isFree = filter_var($this->input('is_free'), FILTER_VALIDATE_BOOLEAN);
            $price = (float) $this->input('price');

            // If marked as free, price must be 0
            if ($isFree && $price > 0) {
                $validator->errors()->add('price', 'الخطة المجانية يجب أن يكون سعرها 0');
            }

            // If price is 0, should be marked as free
            if ($price == 0 && !$isFree) {
                $validator->errors()->add('is_free', 'الخطة بسعر 0 يجب أن تكون مجانية');
            }
        });
    }
}
