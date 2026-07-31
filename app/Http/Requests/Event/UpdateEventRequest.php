<?php

namespace App\Http\Requests\Event;

use App\Enums\EventAccessType;
use App\Enums\EventStatus;
use App\Enums\UserRole;
use App\Models\Event;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateEventRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var Event $event */
        $event = $this->route('event');

        return $this->user()?->can('update', $event) ?? false;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'is_published' => $this->boolean('is_published'),
        ]);
    }

    public function rules(): array
    {
        $mentorRules = $this->user()?->isAdmin()
            ? [
                'required',
                'integer',
                Rule::exists('users', 'id')->where(
                    fn ($query) => $query->where('role', UserRole::Mentor->value)
                ),
            ]
            : ['nullable'];

        return [
            'title' => ['required', 'string', 'max:255'],
            'mentor_id' => $mentorRules,
            'category' => ['required', 'string', 'max:100'],
            'description' => ['required', 'string'],
            'starts_at' => ['required', 'date'],
            'ends_at' => ['nullable', 'date', 'after:starts_at'],
            'registration_closes_at' => ['nullable', 'date', 'before_or_equal:starts_at'],
            'meeting_provider' => ['nullable', 'in:google_meet,microsoft_teams,zoom,other'],
            'meeting_url' => ['nullable', 'url', 'max:2048'],
            'status' => ['required', Rule::enum(EventStatus::class)],
            'access_type' => ['required', Rule::enum(EventAccessType::class)],
            'is_published' => ['required', 'boolean'],
            'poster_image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ];
    }
}
