<?php

namespace App\Support\Media;

use Illuminate\Support\Str;

class MediaPathGenerator
{
    public function make(string $baseDirectory, string $extension = 'webp'): string
    {
        $baseDirectory = trim($baseDirectory, '/');
        $extension = ltrim($extension, '.');

        return $baseDirectory . '/' . now()->format('Y/m') . '/' . Str::uuid() . '.' . $extension;
    }
}
