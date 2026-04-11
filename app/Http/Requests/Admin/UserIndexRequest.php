<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UserIndexRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->isAdmin();
    }

    public function rules(): array
    {
        return [
            'search' => ['nullable', 'string', 'max:100'],
            'sort_field' => ['nullable', 'in:name,email,role,created_at'],
            'sort_direction' => ['nullable', 'in:asc,desc'],
        ];
    }
}
