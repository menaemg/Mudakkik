<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
    //    return $this->user() && $this->user()->role === 'admin';
    return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    // app/Http/Requests/StoreUserRequest.php

    public function rules(): array
    {
        $user = $this->route('user');
        $userId = $user ? $user->id : null;

        $rules = [
            'name' => 'required|string|max:255',
            'email' => "required|email|unique:users,email,{$userId}",
            'username' => "required|string|unique:users,username,{$userId}",
            'role' => 'required|in:admin,journalist,user',
            'bio' => 'nullable|string',
            'credibility_score' => 'nullable|integer|min:0|max:100',
            'is_verified_journalist' => 'boolean',
        ];

        if (!$userId) {
            $rules['password'] = 'required|string|min:8|confirmed';
        }

        return $rules;
    }
    public function messages(): array
    {
        return [
            'name.required' => 'يرجى إدخال اسم المستخدم بالكامل.',
            'name.max' => 'الاسم يجب ألا يتجاوز 255 حرفاً.',
            'name.min' => 'الاسم يجب ألا يقل عن 3 حروف.',

            'email.required' => 'البريد الإلكتروني مطلوب.',
            'email.email' => 'يرجى إدخال بريد إلكتروني صالح.',
            'email.unique' => 'هذا البريد الإلكتروني مسجل مسبقاً لدينا.',
            'username.required' => 'اسم المستخدم (@username) مطلوب.',
            'username.unique' => 'اسم المستخدم هذا محجوز لشخص آخر.',
            'password.required' => 'كلمة المرور مطلوبة.',
            'password.min' => 'يجب أن تتكون كلمة المرور من 8 أحرف على الأقل.',
            'password.confirmed' => 'كلمة المرور وتأكيدها غير متطابقين.',
            'role.required' => 'يرجى اختيار رتبة المستخدم.',
            'role.in' => 'الرتبة المختارة غير صالحة.',
            'credibility_score.integer' => 'نسبة المصداقية يجب أن تكون رقماً صحيحاً.',
            'credibility_score.min' => 'النسبة لا يمكن أن تقل عن 0.',
            'credibility_score.max' => 'النسبة لا يمكن أن تزيد عن 100.',
        ];
    }
}
