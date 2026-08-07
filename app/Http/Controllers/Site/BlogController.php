<?php

namespace App\Http\Controllers\Site;

use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use App\Support\SeoMetadata;
use App\Support\SeoPolicy;
use App\Support\StructuredData;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
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
            ->through(fn (BlogPost $post) => $post->toPublicListingArray())
            ->withQueryString();

        return Inertia::render('blogs/index', [
            'posts' => $posts,
            'filters' => [
                'search' => $search,
            ],
            'seo' => SeoMetadata::build($request, [
                'title' => 'Blog',
                'description' => 'Baca artikel terbaru tentang IT, cyber security, pengembangan karier, dan insight komunitas Gakutsu.',
            ]),
        ]);
    }

    public function show(Request $request, BlogPost $blog): Response
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
            ->get()
            ->map(fn (BlogPost $post) => $post->toPublicListingArray());

        $policyData = app(SeoPolicy::class)->resolve($request);
        $canonicalUrl = $policyData['canonicalUrl'];
        $baseUrl = $policyData['baseUrl'] ?? (string) config('app.url', 'https://gakutsu.net');

        $description = Str::limit(strip_tags($blog->content ?? ''), 155, '');

        $graph = null;
        if ($canonicalUrl !== null && $baseUrl !== null) {
            $blogPosting = StructuredData::createBlogPostingSchema(
                canonicalUrl: $canonicalUrl,
                baseUrl: $baseUrl,
                siteName: $policyData['siteName'],
                title: $blog->title,
                description: $description,
                publishedAt: $blog->published_at?->toISOString(),
                updatedAt: $blog->updated_at?->toISOString(),
                authorName: $blog->author?->name,
                coverImageUrl: $blog->cover_image_url
            );

            $cleanBaseUrl = rtrim($baseUrl, '/');
            $breadcrumbItems = [
                ['name' => 'Home', 'url' => "{$cleanBaseUrl}/"],
                ['name' => 'Blogs', 'url' => "{$cleanBaseUrl}/blogs"],
                ['name' => $blog->title, 'url' => $canonicalUrl],
            ];

            $breadcrumb = StructuredData::createBreadcrumbListSchema($breadcrumbItems, $canonicalUrl);

            $graph = array_values(array_filter([$blogPosting, $breadcrumb]));
        }

        return Inertia::render('blogs/show', [
            'post' => $blog->toPublicDetailArray(),
            'relatedPosts' => $relatedPosts,
            'seo' => SeoMetadata::build($request, [
                'title' => $blog->title,
                'description' => $description,
                'type' => 'article',
                'image' => $blog->cover_image_url,
                'jsonLdGraph' => $graph,
            ], $policyData),
        ]);
    }
}
