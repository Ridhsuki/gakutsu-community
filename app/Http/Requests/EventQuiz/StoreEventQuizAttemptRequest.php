<?php

namespace App\Http\Requests\EventQuiz;

use Illuminate\Foundation\Http\FormRequest;

class StoreEventQuizAttemptRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'answers' => ['required', 'array'],
        ];
    }
}
