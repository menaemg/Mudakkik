<?php

namespace App\Http\Requests;

use App\Rules\ActivePlanRule;
use App\Rules\NoPendingPaymentRule;
use App\Rules\NotCurrentPlanRule;
use App\Rules\PaidPlanRule;
use Illuminate\Foundation\Http\FormRequest;

class SubscribeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'plan' => [
                'required',
                'string',
                'exists:plans,slug',
                new ActivePlanRule(),
                new PaidPlanRule(),
                new NotCurrentPlanRule(),
                new NoPendingPaymentRule(),
            ],
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Get plan from route parameter if not in request body
        if (!$this->has('plan') && $this->route('plan')) {
            $routePlan = $this->route('plan');
            $this->merge([
                'plan' => is_object($routePlan) && isset($routePlan->slug) 
                    ? $routePlan->slug 
                    : $routePlan,
            ]);
        }
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'plan.required' => 'Please select a plan to subscribe to.',
            'plan.exists' => 'The selected plan is invalid.',
        ];
    }
}
