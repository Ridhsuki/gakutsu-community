<?php

namespace App\Enums;

enum EventQuizAttemptStatus: string
{
    case Submitted = 'submitted';
    case Graded = 'graded';
}
