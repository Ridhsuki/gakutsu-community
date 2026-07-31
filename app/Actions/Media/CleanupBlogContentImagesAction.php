<?php

namespace App\Actions\Media;

use App\Models\BlogPost;
use Illuminate\Filesystem\FilesystemAdapter;
use Illuminate\Support\Facades\Storage;

class CleanupBlogContentImagesAction
{
    /**
     * @return array<int, string>
     */
    public function extractPathsFromHtml(?string $html): array
    {
        if (! is_string($html) || trim($html) === '') {
            return [];
        }

        preg_match_all('/<img[^>]+src=["\']([^"\']+)["\']/i', $html, $matches);

        $srcs = $matches[1] ?? [];
        $paths = [];

        foreach ($srcs as $src) {
            $path = $this->normalizeStoragePath($src);

            if ($path !== null) {
                $paths[] = $path;
            }
        }

        return array_values(array_unique($paths));
    }

    public function cleanupRemovedFromContent(
        ?string $oldHtml,
        ?string $newHtml,
        ?int $ignoreBlogId = null
    ): void {
        $oldPaths = $this->extractPathsFromHtml($oldHtml);
        $newPaths = $this->extractPathsFromHtml($newHtml);

        $removedPaths = array_diff($oldPaths, $newPaths);

        foreach ($removedPaths as $path) {
            $this->deleteIfUnusedElsewhere($path, $ignoreBlogId);
        }
    }

    public function cleanupAllFromContent(?string $html, ?int $ignoreBlogId = null): void
    {
        $paths = $this->extractPathsFromHtml($html);

        foreach ($paths as $path) {
            $this->deleteIfUnusedElsewhere($path, $ignoreBlogId);
        }
    }

    private function normalizeStoragePath(string $src): ?string
    {
        $parsedPath = parse_url($src, PHP_URL_PATH);

        if (! is_string($parsedPath)) {
            return null;
        }

        if (! str_starts_with($parsedPath, '/storage/media/blog/content/')) {
            return null;
        }

        return ltrim(str_replace('/storage/', '', $parsedPath), '/');
    }

    private function deleteIfUnusedElsewhere(string $path, ?int $ignoreBlogId = null): void
    {
        /** @var FilesystemAdapter $publicDisk */
        $publicDisk = Storage::disk('public');

        $publicUrl = $publicDisk->url($path);

        $query = BlogPost::query()
            ->where('content', 'like', '%'.$publicUrl.'%');

        if ($ignoreBlogId !== null) {
            $query->whereKeyNot($ignoreBlogId);
        }

        $isStillUsed = $query->exists();

        if ($isStillUsed) {
            return;
        }

        $publicDisk->delete($path);
    }
}
