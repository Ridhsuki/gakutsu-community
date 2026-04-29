<?php

namespace App\Http\Requests\EventQuiz;

use App\Enums\EventQuizQuestionType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class StoreEventQuizQuestionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    protected function prepareForValidation(): void
    {
        $options = collect($this->input('options', []))
            ->map(function ($option, $index) {
                return [
                    'option_text' => $option['option_text'] ?? '',
                    'is_correct' => filter_var($option['is_correct'] ?? false, FILTER_VALIDATE_BOOLEAN),
                    'sort_order' => $option['sort_order'] ?? $index,
                ];
            })
            ->values()
            ->all();

        $this->merge([
            'is_active' => $this->boolean('is_active'),
            'options' => $options,
        ]);
    }

    public function rules(): array
    {
        return [
            'type' => ['required', 'in:multiple_choice,short_text'],
            'prompt' => ['required', 'string'],
            'points' => ['required', 'integer', 'min:1', 'max:100'],
            'is_active' => ['required', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'explanation' => ['nullable', 'string'],
            'options' => ['nullable', 'array'],
            'options.*.option_text' => ['nullable', 'string', 'max:255'],
            'options.*.is_correct' => ['nullable', 'boolean'],
            'options.*.sort_order' => ['nullable', 'integer', 'min:0'],
        ];
    }

    public function after(): array
    {
        return [
            function (Validator $validator) {
                if ($this->input('type') !== EventQuizQuestionType::MultipleChoice->value) {
                    return;
                }

                $options = collect($this->input('options', []))
                    ->filter(fn ($option) => filled($option['option_text'] ?? null))
                    ->values();

                if ($options->count() < 2) {
                    $validator->errors()->add('options', 'Multiple choice question must have at least 2 options.');
                }

                if (! $options->contains(fn ($option) => (bool) ($option['is_correct'] ?? false))) {
                    $validator->errors()->add('options', 'Multiple choice question must have at least 1 correct answer.');
                }
            },
        ];
    }
}
