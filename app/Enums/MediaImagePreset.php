<?php

namespace App\Enums;

enum MediaImagePreset: string
{
    case BlogCover = 'blog_cover';
    case BlogContent = 'blog_content';
    case EventCover = 'event_cover';
    case ProfilePhoto = 'profile_photo';
}
