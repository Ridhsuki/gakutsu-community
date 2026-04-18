<?php

namespace App\Actions\Events;

use App\Actions\Media\ProcessImageUploadAction;
use App\Enums\MediaImagePreset;
use App\Http\Requests\Event\UpdateEventRequest;
use App\Models\Event;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class UpdateEventAction
{
    public function __construct(
        private readonly ProcessImageUploadAction $processImageUploadAction,
    ) {
    }

    public function handle(UpdateEventRequest $request, Event $event): Event
    {
        return DB::transaction(function () use ($request, $event) {
            $data = $request->validated();

            $data['mentor_id'] = $request->user()->isAdmin()
                ? (int) $data['mentor_id']
                : $request->user()->id;

            if ($request->hasFile('poster_image')) {
                if ($event->poster_image_path) {
                    Storage::disk('public')->delete($event->poster_image_path);
                }

                $result = $this->processImageUploadAction->handle(
                    $request->file('poster_image'),
                    MediaImagePreset::EventCover,
                );

                $data['poster_image_path'] = $result['path'];
            }

            unset($data['poster_image']);

            $event->update($data);

            return $event->refresh();
        });
    }
}
