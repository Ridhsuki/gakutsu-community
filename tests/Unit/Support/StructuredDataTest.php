<?php

use App\Support\StructuredData;

test('1. createWebSiteSchema returns valid WebSite node with stable IDs', function () {
    $baseUrl = 'https://gakutsu.net';
    $siteName = 'Gakutsu';

    $schema = StructuredData::createWebSiteSchema($baseUrl, $siteName);

    expect($schema)->toBe([
        '@type' => 'WebSite',
        '@id' => 'https://gakutsu.net/#website',
        'url' => 'https://gakutsu.net/',
        'name' => 'Gakutsu',
        'publisher' => [
            '@id' => 'https://gakutsu.net/#organization',
        ],
    ]);
});

test('2. createOrganizationSchema returns valid Organization node', function () {
    $baseUrl = 'https://gakutsu.net';
    $siteName = 'Gakutsu';
    $desc = 'IT and Cybersecurity Community';

    $schema = StructuredData::createOrganizationSchema($baseUrl, $siteName, $desc);

    expect($schema)->toBe([
        '@type' => 'Organization',
        '@id' => 'https://gakutsu.net/#organization',
        'name' => 'Gakutsu',
        'url' => 'https://gakutsu.net/',
        'description' => 'IT and Cybersecurity Community',
    ]);
});

test('3. createBlogPostingSchema returns valid BlogPosting node with factual dates and images', function () {
    $canonicalUrl = 'https://gakutsu.net/blogs/cyber-security';
    $baseUrl = 'https://gakutsu.net';
    $siteName = 'Gakutsu';
    $title = 'Cyber Security Article';
    $desc = 'An article about cyber security.';
    $publishedAt = '2026-08-01T12:00:00Z';
    $updatedAt = '2026-08-02T14:00:00Z';
    $authorName = 'Alice Mentor';
    $coverImageUrl = '/storage/blog-covers/cyber.jpg';

    $schema = StructuredData::createBlogPostingSchema(
        canonicalUrl: $canonicalUrl,
        baseUrl: $baseUrl,
        siteName: $siteName,
        title: $title,
        description: $desc,
        publishedAt: $publishedAt,
        updatedAt: $updatedAt,
        authorName: $authorName,
        coverImageUrl: $coverImageUrl
    );

    expect($schema)->toBe([
        '@type' => 'BlogPosting',
        '@id' => 'https://gakutsu.net/blogs/cyber-security#article',
        'mainEntityOfPage' => [
            '@type' => 'WebPage',
            '@id' => 'https://gakutsu.net/blogs/cyber-security',
        ],
        'headline' => 'Cyber Security Article',
        'description' => 'An article about cyber security.',
        'datePublished' => '2026-08-01T12:00:00Z',
        'dateModified' => '2026-08-02T14:00:00Z',
        'author' => [
            '@type' => 'Person',
            'name' => 'Alice Mentor',
        ],
        'publisher' => [
            '@type' => 'Organization',
            '@id' => 'https://gakutsu.net/#organization',
            'name' => 'Gakutsu',
            'url' => 'https://gakutsu.net/',
        ],
        'image' => [
            'https://gakutsu.net/storage/blog-covers/cyber.jpg',
        ],
    ]);
});

test('4. createBreadcrumbListSchema returns valid BreadcrumbList node', function () {
    $canonicalUrl = 'https://gakutsu.net/blogs/cyber-security';
    $items = [
        ['name' => 'Home', 'url' => 'https://gakutsu.net/'],
        ['name' => 'Blogs', 'url' => 'https://gakutsu.net/blogs'],
        ['name' => 'Cyber Security Article', 'url' => $canonicalUrl],
    ];

    $schema = StructuredData::createBreadcrumbListSchema($items, $canonicalUrl);

    expect($schema)->toBe([
        '@type' => 'BreadcrumbList',
        '@id' => 'https://gakutsu.net/blogs/cyber-security#breadcrumb',
        'itemListElement' => [
            [
                '@type' => 'ListItem',
                'position' => 1,
                'name' => 'Home',
                'item' => 'https://gakutsu.net/',
            ],
            [
                '@type' => 'ListItem',
                'position' => 2,
                'name' => 'Blogs',
                'item' => 'https://gakutsu.net/blogs',
            ],
            [
                '@type' => 'ListItem',
                'position' => 3,
                'name' => 'Cyber Security Article',
                'item' => 'https://gakutsu.net/blogs/cyber-security',
            ],
        ],
    ]);
});

test('5. createBreadcrumbListSchema returns null for invalid canonical URL or empty items', function () {
    expect(StructuredData::createBreadcrumbListSchema([], 'https://gakutsu.net/blogs'))->toBeNull();
    expect(StructuredData::createBreadcrumbListSchema([['name' => 'Home', 'url' => 'https://gakutsu.net/']], 'invalid-url'))->toBeNull();
});

test('6. normalizeImageUrl handles subdirectory base URLs and invalid image URLs', function () {
    $baseUrl = 'https://example.com/subpath';

    expect(StructuredData::normalizeImageUrl('/images/cover.jpg', $baseUrl))
        ->toBe('https://example.com/subpath/images/cover.jpg');

    expect(StructuredData::normalizeImageUrl('javascript:alert(1)', $baseUrl))->toBeNull();
    expect(StructuredData::normalizeImageUrl('//attacker.com/img.png', $baseUrl))->toBeNull();
    expect(StructuredData::normalizeImageUrl('data:image/png;base64,123', $baseUrl))->toBeNull();
    expect(StructuredData::normalizeImageUrl('https://cdn.example.com/img.jpg', $baseUrl))
        ->toBe('https://cdn.example.com/img.jpg');
});

test('7. safeJsonEncode neutralizes hostile script tags and escapes HTML sensitive characters', function () {
    $data = [
        'payload' => '</script><script>alert("XSS & test > 1")</script>',
        'unicode' => 'Tést & Strïng 🇮🇩',
        'lineSep' => "line1\u{2028}line2",
        'paraSep' => "para1\u{2029}para2",
    ];

    $encoded = StructuredData::safeJsonEncode($data);

    expect($encoded)->not()->toContain('</script>');
    expect($encoded)->not()->toContain('<script>');
    expect(strtolower($encoded))->toContain('\u003c');
    expect(strtolower($encoded))->toContain('\u003e');
    expect(strtolower($encoded))->toContain('\u0026');
    expect($encoded)->toContain('\u2028');
    expect($encoded)->toContain('\u2029');

    $decoded = json_decode($encoded, true);

    expect($decoded['payload'])->toBe('</script><script>alert("XSS & test > 1")</script>');
    expect($decoded['unicode'])->toBe('Tést & Strïng 🇮🇩');
    expect($decoded['lineSep'])->toBe("line1\u{2028}line2");
    expect($decoded['paraSep'])->toBe("para1\u{2029}para2");
});
