<?php

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BlogController extends Controller
{
    public function index(Request $request): Response
    {
        $search = trim((string) $request->string('search'));

        $posts = BlogPost::query()
            ->select(BlogPost::indexColumns())
            ->with('author:id,name')
            ->published()
            ->when($search !== '', fn ($query) => $query->search($search))
            ->latest('published_at')
            ->paginate(9)
            ->withQueryString();

        return Inertia::render('blogs/index', [
            'posts' => $posts,
            'filters' => [
                'search' => $search,
            ],
        ]);
    }

    public function show(BlogPost $blog): Response
    {
        abort_unless($blog->isPublished(), 404);

        $blog->load('author:id,name');

        $relatedPosts = BlogPost::query()
            ->select(BlogPost::indexColumns())
            ->with('author:id,name')
            ->published()
            ->whereKeyNot($blog->id)
            ->latest('published_at')
            ->limit(3)
            ->get();

        return Inertia::render('blogs/show', [
            'post' => $blog,
            'relatedPosts' => $relatedPosts,
        ]);
    }
}
