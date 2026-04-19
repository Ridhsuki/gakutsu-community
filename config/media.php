<?php

return [
    'presets' => [
        'blog_cover' => [
            'disk' => 'public',
            'directory' => 'media/blog/covers',
            'mode' => 'cover',
            'width' => 1600,
            'height' => 900,
            'quality' => 82,
            'upsize' => false,
        ],

        'blog_content' => [
            'disk' => 'public',
            'directory' => 'media/blog/content',
            'mode' => 'scale_down',
            'width' => 1600,
            'height' => 1600,
            'quality' => 82,
        ],

        'event_cover' => [
            'disk' => 'public',
            'directory' => 'media/events/covers',
            'mode' => 'scale_down',
            'width' => 1600,
            'height' => 1600,
            'quality' => 82,
        ],

        'profile_photo' => [
            'disk' => 'public',
            'directory' => 'media/profile',
            'mode' => 'cover',
            'width' => 512,
            'height' => 512,
            'quality' => 80,
            'upsize' => false,
        ],
    ],
];
