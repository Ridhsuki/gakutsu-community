<?php

namespace App\Http\Controllers\Mentor;

use App\Enums\BlogPostStatus;
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
            $data['cover_image_path'] = $request->file('cover_image')->store(
                'blog/covers/' . now()->format('Y/m'),
                'public'
            );
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

        if ($request->hasFile('cover_image')) {
            if ($blog->cover_image_path) {
                Storage::disk('public')->delete($blog->cover_image_path);
            }

            $data['cover_image_path'] = $request->file('cover_image')->store(
                'blog/covers/' . now()->format('Y/m'),
                'public'
            );
        }

        unset($data['cover_image']);

        $data['published_at'] = $data['status'] === BlogPostStatus::Published->value
            ? ($blog->published_at ?? now())
            : null;

        $blog->update($data);

        return redirect()
            ->route('mentor.blogs.index')
            ->with('success', 'Blog post updated successfully.');
    }

    public function destroy(BlogPost $blog): RedirectResponse
    {
        $this->authorize('delete', $blog);

        if ($blog->cover_image_path) {
            Storage::disk('public')->delete($blog->cover_image_path);
        }

        $blog->delete();

        return redirect()
            ->route('mentor.blogs.index')
            ->with('success', 'Blog post deleted successfully.');
    }
}
