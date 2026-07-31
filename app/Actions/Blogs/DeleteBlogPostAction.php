<?php

namespace App\Actions\Blogs;

use App\Actions\Media\CleanupBlogContentImagesAction;
use App\Models\BlogPost;
use Illuminate\Support\Facades\Storage;

class DeleteBlogPostAction
{
    public function __construct(
        private readonly CleanupBlogContentImagesAction $cleanupBlogContentImagesAction,
    ) {}

    public function handle(BlogPost $blog): void
    {
        $blogId = $blog->id;
        $content = $blog->content;
        $coverImagePath = $blog->cover_image_path;

        $blog->delete();

        if ($coverImagePath) {
            Storage::disk('public')->delete($coverImagePath);
        }

        $this->cleanupBlogContentImagesAction->cleanupAllFromContent($content, $blogId);
    }
}
