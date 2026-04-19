<?php

namespace App\Http\Requests\Event;

use App\Models\Event;
use Illuminate\Foundation\Http\FormRequest;

class EventIndexRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('viewAny', Event::class) ?? false;
    }

    public function rules(): array
    {
        return [
            'search' => ['nullable', 'string', 'max:100'],
            'sort_field' => ['nullable', 'in:title,category,status,starts_at,created_at,mentor'],
            'sort_direction' => ['nullable', 'in:asc,desc'],
            'status' => ['nullable', 'in:upcoming,completed,cancelled'],
            'publication' => ['nullable', 'in:published,draft'],
            'access_type' => ['nullable', 'in:free,paid'],
        ];
    }
}
