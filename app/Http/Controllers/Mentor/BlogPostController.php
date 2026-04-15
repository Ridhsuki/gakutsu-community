<?php

namespace App\Http\Controllers\Mentor;

use App\Actions\Blogs\DeleteBlogPostAction;
use App\Actions\Blogs\GetBlogPostIndexAction;
use App\Actions\Blogs\StoreBlogPostAction;
use App\Actions\Blogs\UpdateBlogPostAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Blog\BlogPostIndexRequest;
use App\Http\Requests\Blog\StoreBlogPostRequest;
use App\Http\Requests\Blog\UpdateBlogPostRequest;
use App\Models\BlogPost;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class BlogPostController extends Controller
{
    use AuthorizesRequests;

    public function index(
        BlogPostIndexRequest $request,
        GetBlogPostIndexAction $getBlogPostIndexAction,
    ): Response {
        $validated = $request->validated();

        $search = $validated['search'] ?? null;
        $sortField = $validated['sort_field'] ?? 'created_at';
        $sortDirection = $validated['sort_direction'] ?? 'desc';

        return Inertia::render('mentor/blogs/index', [
            'posts' => fn() => $getBlogPostIndexAction->handle(
                search: $search,
                sortField: $sortField,
                sortDirection: $sortDirection,
                authorId: $request->user()->id,
            ),
            'filters' => [
                'search' => $search,
                'sort_field' => $sortField,
                'sort_direction' => $sortDirection,
            ],
        ]);
    }

    public function store(
        StoreBlogPostRequest $request,
        StoreBlogPostAction $storeBlogPostAction,
    ): RedirectResponse {
        $storeBlogPostAction->handle($request);

        return redirect()
            ->route('mentor.blogs.index')
            ->with('success', 'Blog post created successfully.');
    }

    public function update(
        UpdateBlogPostRequest $request,
        BlogPost $blog,
        UpdateBlogPostAction $updateBlogPostAction,
    ): RedirectResponse {
        $updateBlogPostAction->handle($request, $blog);

        return redirect()
            ->route('mentor.blogs.index')
            ->with('success', 'Blog post updated successfully.');
    }

    public function destroy(
        BlogPost $blog,
        DeleteBlogPostAction $deleteBlogPostAction,
    ): RedirectResponse {
        $this->authorize('delete', $blog);

        $deleteBlogPostAction->handle($blog);

        return redirect()
            ->route('mentor.blogs.index')
            ->with('success', 'Blog post deleted successfully.');
    }
}
