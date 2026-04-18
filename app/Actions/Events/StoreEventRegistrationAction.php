<?php

namespace App\Actions\Events;

use App\Models\Event;
use App\Models\EventRegistration;
use App\Models\EventRegistrationAnswer;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class StoreEventRegistrationAction
{
    public function handle(Event $event, User $user, array $answers = []): EventRegistration
    {
        if (! $event->registrationIsAvailable()) {
            throw ValidationException::withMessages([
                'event' => 'Registration is not available for this event.',
            ]);
        }

        $alreadyRegistered = EventRegistration::query()
            ->where('event_id', $event->id)
            ->where('user_id', $user->id)
            ->exists();

        if ($alreadyRegistered) {
            throw ValidationException::withMessages([
                'event' => 'You have already registered for this event.',
            ]);
        }

        $event->loadMissing([
            'registrationQuestions' => fn ($query) => $query->active()->ordered(),
        ]);

        return DB::transaction(function () use ($event, $user, $answers) {
            $registration = EventRegistration::create([
                'event_id' => $event->id,
                'user_id' => $user->id,
                'name_snapshot' => $user->name,
                'email_snapshot' => $user->email,
                'registered_at' => now(),
            ]);

            foreach ($event->registrationQuestions as $question) {
                $answerValue = $answers[$question->id] ?? null;

                if ($answerValue === null || $answerValue === '') {
                    continue;
                }

                EventRegistrationAnswer::create([
                    'event_registration_id' => $registration->id,
                    'event_registration_question_id' => $question->id,
                    'question_label_snapshot' => $question->label,
                    'question_type_snapshot' => $question->type->value,
                    'answer_value' => (string) $answerValue,
                ]);
            }

            return $registration;
        });
    }
}
