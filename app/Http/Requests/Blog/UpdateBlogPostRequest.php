<?php

namespace App\Http\Requests\Blog;

use App\Enums\BlogPostStatus;
use App\Models\BlogPost;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class UpdateBlogPostRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var BlogPost|null $blog */
        $blog = $this->route('blog');

        return $blog && ($this->user()?->can('update', $blog) ?? false);
    }

    protected function prepareForValidation(): void
    {
        if ($this->filled('slug')) {
            $this->merge([
                'slug' => Str::slug((string) $this->input('slug')),
            ]);
        }
    }

    public function rules(): array
    {
        /** @var BlogPost $blog */
        $blog = $this->route('blog');

        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => [
                'required',
                'string',
                'max:255',
                'alpha_dash',
                Rule::unique('blog_posts', 'slug')->ignore($blog->id),
            ],
            'status' => ['required', Rule::enum(BlogPostStatus::class)],
            'cover_image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'content' => ['required', 'string'],
        ];
    }
}
