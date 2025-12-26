<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCategoryRequest extends FormRequest
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
    public function rules(): array
    {

        $category = $this->route('category');
        $categoryId = $category ? $category->id : null;

        return [
            'name' => "required|string|min:4|max:100|unique:categories,name,{$categoryId}",
            'slug' => "required|string|max:120|unique:categories,slug,{$categoryId}",
            'description' => 'nullable|string|min:20|max:500',
        ];
    }
    public function messages(): array
    {
        return [
            'name.required' => 'يرجى إدخال اسم الفئة.',
            'name.string' => 'اسم الفئة يجب أن يكون نصاً.',
            'name.max' => 'اسم الفئة لا يجب أن يتجاوز 100 حرف.',
            'name.min' => 'اسم الفئة لا يجب أن يقل عن 4 حروف.',
            'name.unique' => 'هذا القسم موجود بالفعل.',

            'slug.required' => 'الرابط المختصر (Slug) مطلوب.',
            'slug.unique' => 'هذا الرابط مستخدم لقسم آخر، يرجى تغييره.',
            'description.min' => 'الوصف لا يجب أن يقل عن 20 حرف.',

            'description.max' => 'الوصف لا يجب أن يتجاوز 500 حرف.',
        ];
    }
}
