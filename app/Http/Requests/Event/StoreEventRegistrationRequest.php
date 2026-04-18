<?php

namespace App\Http\Requests\Event;

use App\Enums\EventRegistrationQuestionType;
use App\Models\Event;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreEventRegistrationRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var Event $event */
        $event = $this->route('event');

        return $this->user()?->can('register', $event) ?? false;
    }

    public function rules(): array
    {
        /** @var Event $event */
        $event = $this->route('event');

        $event->loadMissing([
            'registrationQuestions' => fn ($query) => $query->active()->ordered(),
        ]);

        $rules = [
            'answers' => ['nullable', 'array'],
        ];

        foreach ($event->registrationQuestions as $question) {
            $field = "answers.{$question->id}";
            $fieldRules = $question->is_required ? ['required'] : ['nullable'];

            switch ($question->type) {
                case EventRegistrationQuestionType::ShortText:
                    $fieldRules[] = 'string';
                    $fieldRules[] = 'max:255';
                    break;

                case EventRegistrationQuestionType::LongText:
                    $fieldRules[] = 'string';
                    $fieldRules[] = 'max:5000';
                    break;

                case EventRegistrationQuestionType::Select:
                    $fieldRules[] = 'string';
                    $fieldRules[] = Rule::in($question->options ?? []);
                    break;
            }

            $rules[$field] = $fieldRules;
        }

        return $rules;
    }
}
