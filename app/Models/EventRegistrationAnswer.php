<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'event_registration_id',
    'event_registration_question_id',
    'question_label_snapshot',
    'question_type_snapshot',
    'answer_value',
])]
class EventRegistrationAnswer extends Model
{
    public function registration(): BelongsTo
    {
        return $this->belongsTo(EventRegistration::class, 'event_registration_id');
    }

    public function question(): BelongsTo
    {
        return $this->belongsTo(EventRegistrationQuestion::class, 'event_registration_question_id');
    }
}
