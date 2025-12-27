<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSubscriptionRequest extends FormRequest
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
            'status' => 'required|in:active,cancelled,expired,past_due',
            'plan_id' => 'required|exists:plans,id',
            'ends_at' => 'nullable|date',
            'auto_renew' => 'nullable|boolean',
            'admin_notes' => 'nullable|string|max:1000',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'status.required' => 'حالة الاشتراك مطلوبة',
            'status.in' => 'حالة الاشتراك غير صالحة',
            'plan_id.required' => 'الخطة مطلوبة',
            'plan_id.exists' => 'الخطة المحددة غير موجودة',
            'ends_at.date' => 'تاريخ الانتهاء غير صالح',
            'admin_notes.max' => 'ملاحظات الإدارة يجب ألا تزيد عن 1000 حرف',
        ];
    }
}
