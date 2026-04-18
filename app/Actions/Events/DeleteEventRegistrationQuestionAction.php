<?php

namespace App\Actions\Events;

use App\Models\EventRegistrationQuestion;

class DeleteEventRegistrationQuestionAction
{
    public function handle(EventRegistrationQuestion $question): void
    {
        $question->delete();
    }
}
