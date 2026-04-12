<?php

namespace App\Http\Requests\Blog;

use App\Models\BlogPost;
use Illuminate\Foundation\Http\FormRequest;

class BlogPostIndexRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('viewAny', BlogPost::class) ?? false;
    }

    public function rules(): array
    {
        return [
            'search' => ['nullable', 'string', 'max:100'],
            'sort_field' => ['nullable', 'in:title,status,published_at,created_at'],
            'sort_direction' => ['nullable', 'in:asc,desc'],
        ];
    }
}
