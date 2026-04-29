<?php

namespace App\Policies;

use App\Models\EventQuizAttempt;
use App\Models\User;
use App\Models\Event;

class EventQuizAttemptPolicy
{
    public function viewAny(User $user, Event $event): bool
    {
        return $user->isAdmin() || ($user->isMentor() && $event->mentor_id === $user->id);
    }

    public function view(User $user, EventQuizAttempt $attempt): bool
    {
        return $user->isAdmin()
            || ($user->isMentor() && $attempt->event->mentor_id === $user->id)
            || $attempt->user_id === $user->id;
    }

    public function grade(User $user, EventQuizAttempt $attempt): bool
    {
        return $user->isAdmin()
            || ($user->isMentor() && $attempt->event->mentor_id === $user->id);
    }
}
