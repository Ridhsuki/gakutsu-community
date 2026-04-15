<?php

namespace App\Actions\Blogs;

use App\Actions\Media\CleanupBlogContentImagesAction;
use App\Actions\Media\ProcessImageUploadAction;
use App\Enums\BlogPostStatus;
use App\Enums\MediaImagePreset;
use App\Http\Requests\Blog\UpdateBlogPostRequest;
use App\Models\BlogPost;
use Illuminate\Support\Facades\Storage;

class UpdateBlogPostAction
{
    public function __construct(
        private readonly ProcessImageUploadAction $processImageUploadAction,
        private readonly CleanupBlogContentImagesAction $cleanupBlogContentImagesAction,
    ) {
    }

    public function handle(UpdateBlogPostRequest $request, BlogPost $blog): BlogPost
    {
        $data = $request->validated();
        $oldContent = $blog->content;

        if ($request->hasFile('cover_image')) {
            if ($blog->cover_image_path) {
                Storage::disk('public')->delete($blog->cover_image_path);
            }

            $result = $this->processImageUploadAction->handle(
                $request->file('cover_image'),
                MediaImagePreset::BlogCover,
            );

            $data['cover_image_path'] = $result['path'];
        }

        unset($data['cover_image']);

        $data['published_at'] = $data['status'] === BlogPostStatus::Published->value
            ? ($blog->published_at ?? now())
            : null;

        $blog->update($data);

        $this->cleanupBlogContentImagesAction->cleanupRemovedFromContent(
            $oldContent,
            $blog->content,
            $blog->id,
        );

        return $blog->refresh();
    }
}
