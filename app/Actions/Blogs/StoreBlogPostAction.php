<?php

namespace App\Actions\Blogs;

use App\Actions\Media\ProcessImageUploadAction;
use App\Enums\BlogPostStatus;
use App\Enums\MediaImagePreset;
use App\Http\Requests\Blog\StoreBlogPostRequest;
use App\Models\BlogPost;

class StoreBlogPostAction
{
    public function __construct(
        private readonly ProcessImageUploadAction $processImageUploadAction,
    ) {
    }

    public function handle(StoreBlogPostRequest $request): BlogPost
    {
        $data = $request->validated();

        $data['author_id'] = $request->user()->id;
        $data['published_at'] = $data['status'] === BlogPostStatus::Published->value
            ? now()
            : null;

        if ($request->hasFile('cover_image')) {
            $result = $this->processImageUploadAction->handle(
                $request->file('cover_image'),
                MediaImagePreset::BlogCover,
            );

            $data['cover_image_path'] = $result['path'];
        }

        unset($data['cover_image']);

        return BlogPost::create($data);
    }
}
