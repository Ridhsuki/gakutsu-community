<?php

namespace App\Policies;

use App\Models\EventQuizQuestion;
use App\Models\User;
use App\Models\Event;

class EventQuizQuestionPolicy
{
    public function viewAny(User $user, Event $event): bool
    {
        return $user->isAdmin() || ($user->isMentor() && $event->mentor_id === $user->id);
    }

    public function create(User $user, Event $event): bool
    {
        return $this->viewAny($user, $event);
    }

    public function update(User $user, EventQuizQuestion $question): bool
    {
        return $user->isAdmin() || ($user->isMentor() && $question->event->mentor_id === $user->id);
    }

    public function delete(User $user, EventQuizQuestion $question): bool
    {
        return $this->update($user, $question);
    }
}
