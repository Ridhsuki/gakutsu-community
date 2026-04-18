<?php

namespace App\Actions\Events;

use App\Actions\Media\ProcessImageUploadAction;
use App\Actions\Support\GenerateUniqueSlugAction;
use App\Enums\MediaImagePreset;
use App\Http\Requests\Event\StoreEventRequest;
use App\Models\Event;
use Illuminate\Support\Facades\DB;

class StoreEventAction
{
    public function __construct(
        private readonly ProcessImageUploadAction $processImageUploadAction,
        private readonly GenerateUniqueSlugAction $generateUniqueSlugAction,
    ) {
    }

    public function handle(StoreEventRequest $request): Event
    {
        return DB::transaction(function () use ($request) {
            $data = $request->validated();

            $data['created_by'] = $request->user()->id;
            $data['mentor_id'] = $request->user()->isAdmin()
                ? (int) $data['mentor_id']
                : $request->user()->id;

            $data['slug'] = $this->generateUniqueSlugAction->handle(
                $data['title'],
                Event::class,
            );

            if ($request->hasFile('poster_image')) {
                $result = $this->processImageUploadAction->handle(
                    $request->file('poster_image'),
                    MediaImagePreset::EventCover,
                );

                $data['poster_image_path'] = $result['path'];
            }

            unset($data['poster_image']);

            return Event::create($data);
        });
    }
}
