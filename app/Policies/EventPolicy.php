<?php

namespace App\Policies;

use App\Models\Event;
use App\Models\User;

class EventPolicy
{
    public function before(User $user, string $ability): ?bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        return null;
    }

    public function viewAny(User $user): bool
    {
        return $user->isMentor();
    }

    public function view(User $user, Event $event): bool
    {
        return $user->isMentor() && $event->mentor_id === $user->id;
    }

    public function create(User $user): bool
    {
        return $user->isMentor();
    }

    public function update(User $user, Event $event): bool
    {
        return $user->isMentor() && $event->mentor_id === $user->id;
    }

    public function delete(User $user, Event $event): bool
    {
        return $user->isMentor() && $event->mentor_id === $user->id;
    }

    public function viewRegistrations(User $user, Event $event): bool
    {
        return $user->isMentor() && $event->mentor_id === $user->id;
    }

    public function register(User $user, Event $event): bool
    {
        return $event->registrationIsAvailable();
    }

    public function manageRegistrationQuestions(User $user, Event $event): bool
    {
        return $user->isMentor() && $event->mentor_id === $user->id;
    }
}
