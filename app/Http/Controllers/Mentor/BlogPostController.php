<?php

namespace App\Http\Controllers\Mentor;

use App\Actions\Media\CleanupBlogContentImagesAction;
use App\Actions\Media\ProcessImageUploadAction;
use App\Enums\BlogPostStatus;
use App\Enums\MediaImagePreset;
use App\Http\Controllers\Controller;
use App\Http\Requests\Blog\BlogPostIndexRequest;
use App\Http\Requests\Blog\StoreBlogPostRequest;
use App\Http\Requests\Blog\UpdateBlogPostRequest;
use App\Models\BlogPost;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class BlogPostController extends Controller
{
    use AuthorizesRequests;
    public function index(BlogPostIndexRequest $request): Response
    {
        $validated = $request->validated();

        $search = $validated['search'] ?? null;
        $sortField = $validated['sort_field'] ?? 'created_at';
        $sortDirection = $validated['sort_direction'] ?? 'desc';

        return Inertia::render('mentor/blogs/index', [
            'posts' => fn() => BlogPost::query()
                ->select(BlogPost::indexColumns())
                ->with('author:id,name')
                ->ownedBy($request->user()->id)
                ->search($search)
                ->applySort($sortField, $sortDirection)
                ->orderBy('id', 'desc')
                ->paginate(10)
                ->withQueryString(),

            'filters' => [
                'search' => $search,
                'sort_field' => $sortField,
                'sort_direction' => $sortDirection,
            ],
        ]);
    }

    public function store(StoreBlogPostRequest $request): RedirectResponse
    {
        $data = $request->validated();

        $data['author_id'] = $request->user()->id;
        $data['published_at'] = $data['status'] === BlogPostStatus::Published->value ? now() : null;

        if ($request->hasFile('cover_image')) {
            $result = app(ProcessImageUploadAction::class)->handle(
                $request->file('cover_image'),
                MediaImagePreset::BlogCover
            );

            $data['cover_image_path'] = $result['path'];
        }

        unset($data['cover_image']);

        BlogPost::create($data);

        return redirect()
            ->route('mentor.blogs.index')
            ->with('success', 'Blog post created successfully.');
    }

    public function update(UpdateBlogPostRequest $request, BlogPost $blog): RedirectResponse
    {
        $data = $request->validated();
        $oldContent = $blog->content;

        if ($request->hasFile('cover_image')) {
            if ($blog->cover_image_path) {
                Storage::disk('public')->delete($blog->cover_image_path);
            }

            $result = app(ProcessImageUploadAction::class)->handle(
                $request->file('cover_image'),
                MediaImagePreset::BlogCover
            );

            $data['cover_image_path'] = $result['path'];
        }

        unset($data['cover_image']);

        $data['published_at'] = $data['status'] === BlogPostStatus::Published->value
            ? ($blog->published_at ?? now())
            : null;

        $blog->update($data);

        app(CleanupBlogContentImagesAction::class)->cleanupRemovedFromContent(
            $oldContent,
            $blog->content,
            $blog->id
        );

        return redirect()
            ->route('mentor.blogs.index')
            ->with('success', 'Blog post updated successfully.');
    }

    public function destroy(BlogPost $blog): RedirectResponse
    {
        $this->authorize('delete', $blog);

        $blogId = $blog->id;
        $content = $blog->content;
        $coverImagePath = $blog->cover_image_path;

        $blog->delete();

        if ($coverImagePath) {
            Storage::disk('public')->delete($coverImagePath);
        }

        app(CleanupBlogContentImagesAction::class)->cleanupAllFromContent($content, $blogId);

        return redirect()
            ->route('mentor.blogs.index')
            ->with('success', 'Blog post deleted successfully.');
    }
}
