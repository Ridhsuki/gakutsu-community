<?php

namespace App\Actions\Events;

use App\Models\Event;
use Illuminate\Support\Facades\Storage;

class DeleteEventAction
{
    public function handle(Event $event): void
    {
        $posterPath = $event->poster_image_path;

        $event->delete();

        if ($posterPath) {
            Storage::disk('public')->delete($posterPath);
        }
    }
}
