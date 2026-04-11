<?php

namespace App\Enums;

enum UserRole: string
{
    case Admin = 'admin';
    case Mentor = 'mentor';
    case Member = 'member';

    /**
     * Get a human-readable label for the role.
     */
    public function label(): string
    {
        return match ($this) {
            UserRole::Admin => 'Administrator',
            UserRole::Mentor => 'Mentor',
            UserRole::Member => 'Member',
        };
    }

    /**
     * Return all role values as an array.
     *
     * @return string[]
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
