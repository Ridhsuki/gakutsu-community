<?php

namespace App\Http\Requests\Event;

use App\Models\Event;
use Illuminate\Foundation\Http\FormRequest;

class StoreEventRegistrationRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var \App\Models\Event $event */
        $event = $this->route('event');

        return $this->user()?->can('register', $event) ?? false;
    }

    public function rules(): array
    {
        return [];
    }
}
