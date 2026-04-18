<?php

namespace App\Http\Requests\Event;

use App\Enums\EventRegistrationQuestionType;
use App\Models\Event;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreEventRegistrationQuestionRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var Event $event */
        $event = $this->route('event');

        return $this->user()?->can('manageRegistrationQuestions', $event) ?? false;
    }

    protected function prepareForValidation(): void
    {
        $optionsText = (string) $this->input('options_text', '');

        $options = collect(preg_split('/\r\n|\r|\n/', $optionsText))
            ->map(fn ($value) => trim((string) $value))
            ->filter()
            ->values()
            ->all();

        $this->merge([
            'is_required' => $this->boolean('is_required'),
            'is_active' => $this->boolean('is_active'),
            'options' => $options,
        ]);
    }

    public function rules(): array
    {
        return [
            'label' => ['required', 'string', 'max:255'],
            'type' => ['required', Rule::enum(EventRegistrationQuestionType::class)],
            'options_text' => ['nullable', 'string'],
            'options' => ['nullable', 'array'],
            'options.*' => ['string', 'max:255'],
            'placeholder' => ['nullable', 'string', 'max:255'],
            'help_text' => ['nullable', 'string', 'max:1000'],
            'is_required' => ['required', 'boolean'],
            'is_active' => ['required', 'boolean'],
            'sort_order' => ['nullable', 'integer', 'min:1'],
        ];
    }

    public function after(): array
    {
        return [
            function ($validator) {
                if ($this->input('type') === EventRegistrationQuestionType::Select->value) {
                    $options = $this->input('options', []);

                    if (! is_array($options) || count($options) === 0) {
                        $validator->errors()->add('options_text', 'Select question must have at least one option.');
                    }
                }
            },
        ];
    }
}
