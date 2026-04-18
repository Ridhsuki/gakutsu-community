<?php

namespace App\Enums;

enum EventRegistrationQuestionType: string
{
    case ShortText = 'short_text';
    case LongText = 'long_text';
    case Select = 'select';

    public function label(): string
    {
        return match ($this) {
            self::ShortText => 'Short Text',
            self::LongText => 'Long Text',
            self::Select => 'Select',
        };
    }

    /**
     * @return string[]
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
