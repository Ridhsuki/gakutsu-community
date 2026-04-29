<?php

namespace App\Http\Requests\EventQuiz;

use Illuminate\Foundation\Http\FormRequest;

class GradeEventQuizAnswerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'awarded_score' => ['required', 'integer', 'min:0'],
            'feedback' => ['nullable', 'string'],
        ];
    }
}
