<?php

use App\Enums\BlogPostStatus;
use App\Enums\UserRole;
use App\Models\BlogPost;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

test('public blog listing payload contains exact shape and excludes internal/sensitive fields', function () {
    Storage::fake('public');

    Storage::disk('public')->put(
        'covers/test-blog-cover.jpg',
        'test blog cover',
    );

    $author = User::factory()->create(['name' => 'Blog Author', 'role' => UserRole::Mentor]);

    $sentinelContent = '<p>Sentinel HTML Content That Must Not Appear In Listing Payload</p>';

    $blog = BlogPost::factory()->create([
        'author_id' => $author->id,
        'title' => 'Public Listing Test Blog',
        'slug' => 'public-listing-test-blog',
        'status' => BlogPostStatus::Published,
        'content' => $sentinelContent,
        'published_at' => now()->subHour(),
        'cover_image_path' => 'covers/test-blog-cover.jpg',
    ]);

    $response = $this->get('/blogs');

    $response->assertStatus(200);

    $response->assertInertia(fn (Assert $page) => $page
        ->component('blogs/index')
        ->has('posts.data', 1)
        ->where('posts.data.0.title', 'Public Listing Test Blog')
        ->where(
            'posts.data.0.cover_image_url',
            Storage::disk('public')->url('covers/test-blog-cover.jpg'),
        )
    );

    $props = $response->original->getData()['page']['props'];
    $listingItem = $props['posts']['data'][0];

    expect(array_keys($listingItem))->toEqualCanonicalizing([
        'title',
        'slug',
        'excerpt',
        'cover_image_url',
        'published_at',
        'author',
    ]);

    expect(array_keys($listingItem['author']))->toEqualCanonicalizing(['name']);
    expect($listingItem['author']['name'])->toBe('Blog Author');
    expect($listingItem['excerpt'])->toBe('Sentinel HTML Content That Must Not Appear In Listing Payload...');

    $excludedKeys = [
        'id',
        'author_id',
        'status',
        'cover_image_path',
        'content',
        'created_at',
        'updated_at',
    ];

    foreach ($excludedKeys as $key) {
        expect($listingItem)->not()->toHaveKey($key);
        expect($listingItem['author'])->not()->toHaveKey('id');
    }

    $rawContent = $response->getContent();
    expect($rawContent)->not()->toContain('"content":');
});

test('public blog detail payload contains exact shape and excludes internal/sensitive fields', function () {
    Storage::fake('public');

    Storage::disk('public')->put(
        'covers/detail-cover.jpg',
        'detail cover',
    );

    $author = User::factory()->create(['name' => 'Detail Author', 'role' => UserRole::Mentor]);

    $detailContent = '<p>Detail Article Content That Must Be Exposed On Detail Page</p>';
    $relatedContent = '<p>Related Article Content That Must Not Leak</p>';

    $blog = BlogPost::factory()->create([
        'author_id' => $author->id,
        'title' => 'Public Detail Test Blog',
        'slug' => 'public-detail-test-blog',
        'status' => BlogPostStatus::Published,
        'content' => $detailContent,
        'published_at' => now()->subHours(2),
        'cover_image_path' => 'covers/detail-cover.jpg',
    ]);

    $related = BlogPost::factory()->create([
        'author_id' => $author->id,
        'title' => 'Related Test Blog',
        'slug' => 'related-test-blog',
        'status' => BlogPostStatus::Published,
        'content' => $relatedContent,
        'published_at' => now()->subHour(),
    ]);

    $response = $this->get("/blogs/{$blog->slug}");

    $response->assertStatus(200);

    $response->assertInertia(fn (Assert $page) => $page
        ->component('blogs/show')
        ->has('relatedPosts', 1)
        ->where('post.title', 'Public Detail Test Blog')
        ->where('post.content', $detailContent)
    );

    $props = $response->original->getData()['page']['props'];
    $postPayload = $props['post'];
    $relatedPayload = $props['relatedPosts'][0];

    expect(array_keys($postPayload))->toEqualCanonicalizing([
        'title',
        'slug',
        'content',
        'cover_image_url',
        'published_at',
        'author',
    ]);

    expect(array_keys($postPayload['author']))->toEqualCanonicalizing(['name']);
    expect($postPayload['author']['name'])->toBe('Detail Author');

    expect(array_keys($relatedPayload))->toEqualCanonicalizing([
        'title',
        'slug',
        'excerpt',
        'cover_image_url',
        'published_at',
        'author',
    ]);

    $excludedDetailKeys = [
        'id',
        'author_id',
        'status',
        'cover_image_path',
        'created_at',
        'updated_at',
    ];

    foreach ($excludedDetailKeys as $key) {
        expect($postPayload)->not()->toHaveKey($key);
        expect($relatedPayload)->not()->toHaveKey($key);
        expect($postPayload['author'])->not()->toHaveKey('id');
        expect($relatedPayload['author'])->not()->toHaveKey('id');
    }

    expect($relatedPayload)->not()->toHaveKey('content');
});

test('public blog detail preserves publication boundary and SEO structured data', function () {
    config([
        'app.url' => 'https://gakutsu.net',
        'seo.indexing_enabled' => true,
    ]);

    $author = User::factory()->create(['name' => 'SEO Author']);

    $publishedBlog = BlogPost::factory()->create([
        'author_id' => $author->id,
        'title' => 'SEO Published Article',
        'slug' => 'seo-published-article',
        'status' => BlogPostStatus::Published,
        'content' => '<p>SEO content body</p>',
        'published_at' => now()->subDay(),
    ]);

    $draftBlog = BlogPost::factory()->create([
        'author_id' => $author->id,
        'title' => 'Draft Article',
        'slug' => 'draft-article',
        'status' => BlogPostStatus::Draft,
        'content' => '<p>Draft body</p>',
    ]);

    $this->get("/blogs/{$draftBlog->slug}")
        ->assertStatus(404);

    $response = $this->get("/blogs/{$publishedBlog->slug}");

    $response->assertStatus(200);
    $response->assertInertia(fn (Assert $page) => $page
        ->component('blogs/show')
        ->where('seo.title', 'SEO Published Article - Gakutsu')
        ->where('seo.jsonLd.@context', 'https://schema.org')
        ->has('seo.jsonLd.@graph', 2)
    );
});
