<?php

namespace App\Http\Requests\Event;

use App\Enums\EventAccessType;
use App\Enums\EventStatus;
use App\Enums\UserRole;
use App\Models\Event;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class UpdateEventRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var \App\Models\Event $event */
        $event = $this->route('event');

        return $this->user()?->can('update', $event) ?? false;
    }

    protected function prepareForValidation(): void
    {
        if ($this->filled('slug')) {
            $this->merge([
                'slug' => Str::slug((string) $this->input('slug')),
            ]);
        }

        $this->merge([
            'is_published' => $this->boolean('is_published'),
            'is_registration_open' => $this->boolean('is_registration_open'),
        ]);
    }

    public function rules(): array
    {
        /** @var \App\Models\Event $event */
        $event = $this->route('event');

        $mentorRules = $this->user()?->isAdmin()
            ? [
                'required',
                'integer',
                Rule::exists('users', 'id')->where(
                    fn($query) => $query->where('role', UserRole::Mentor->value)
                ),
            ]
            : ['nullable'];

        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', 'alpha_dash', Rule::unique('events', 'slug')->ignore($event->id)],
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
            'is_registration_open' => ['required', 'boolean'],
            'poster_image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ];
    }
}
