<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StorePostRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() && $this->user()->role === 'admin';
      
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    // app/Http/Requests/StoreUserRequest.php

    public function rules(): array
    {
        $isUpdate = $this->isMethod('put') || $this->isMethod('patch');
        return [
            'title' => 'required|string|max:255',
            'body' => 'required|string',
            'category_id' => 'required|exists:categories,id',
            'image' => [
                $isUpdate ? 'nullable' : 'required',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:2048', 
            ],
            'status' => 'nullable|in:pending,published,rejected',
            'is_featured' => 'nullable|boolean',
            'tag_ids' => 'nullable|array',
            'tag_ids.*' => 'exists:tags,id',
        ];
    }
    public function messages(): array
    {
        return [
            'title.required' => 'عنوان المقال حقل أساسي.',
            'body.required' => 'محتوى المقال لا يمكن أن يكون فارغاً.',
            'category_id.required' => 'يرجى اختيار قسم للمقال.',
            'category_id.exists' => 'القسم المختار غير موجود.',
            'image.required' => 'يجب إرفاق صورة للمقال.',
            'image.image' => 'الملف يجب أن يكون صورة.',
            'image.max' => 'حجم الصورة كبير جداً (الأقصى 2 ميجا).',
            'tag_ids.*.exists' => 'أحد الأوسمة المختارة غير صالح.',
        ];
    }
}
