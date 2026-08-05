import { describe, expect, it } from 'vitest';
import {
    createBlogPostingSchema,
    createBreadcrumbListSchema,
    createOrganizationSchema,
    createWebSiteSchema,
    formatIsoDate,
    normalizeImageUrl,
    safeJsonLdStringify,
    toInertiaHref,
} from '@/lib/structured-data';

describe('safeJsonLdStringify', () => {
    it('1. formats ordinary objects into valid JSON string', () => {
        const input = {
            name: 'Gakutsu',
            active: true,
            count: 42,
            tags: ['security', 'it'],
        };
        const output = safeJsonLdStringify(input);

        expect(typeof output).toBe('string');
        expect(output.startsWith('{')).toBe(true);
        expect(output.endsWith('}')).toBe(true);
        expect(output.startsWith('"')).toBe(false);
    });

    it('2. reconstructs original values via JSON.parse round-trip', () => {
        const input = {
            site: 'Gakutsu Community',
            metrics: { members: 100, articles: 25 },
            active: true,
            nil: null,
        };
        const output = safeJsonLdStringify(input);
        const parsed = JSON.parse(output);

        expect(parsed).toEqual(input);
    });

    it('3. escapes literal < as \\u003c', () => {
        const input = { tag: '<script>' };
        const output = safeJsonLdStringify(input);

        expect(output).toContain('\\u003c');
        expect(output).not.toContain('<');
    });

    it('4. escapes literal > as \\u003e', () => {
        const input = { arrow: 'A > B' };
        const output = safeJsonLdStringify(input);

        expect(output).toContain('\\u003e');
        expect(output).not.toContain('>');
    });

    it('5. escapes literal & as \\u0026', () => {
        const input = { title: 'IT & Cyber Security' };
        const output = safeJsonLdStringify(input);

        expect(output).toContain('\\u0026');
        expect(output).not.toContain('&');
    });

    it('6. escapes actual U+2028 line separator', () => {
        const input = { text: 'line1\u2028line2' };
        const output = safeJsonLdStringify(input);

        expect(output).toContain('\\u2028');
        expect(output).not.toContain('\u2028');
    });

    it('7. escapes actual U+2029 paragraph separator', () => {
        const input = { text: 'para1\u2029para2' };
        const output = safeJsonLdStringify(input);

        expect(output).toContain('\\u2029');
        expect(output).not.toContain('\u2029');
    });

    it('8. preserves valid quotes and backslashes in JSON.parse', () => {
        const input = {
            quote: 'He said "Hello"',
            path: 'C:\\Program Files\\App',
        };
        const output = safeJsonLdStringify(input);
        const parsed = JSON.parse(output);

        expect(parsed).toEqual(input);
    });

    it('9. neutralizes lowercase </script>', () => {
        const input = { snippet: '</script>' };
        const output = safeJsonLdStringify(input);

        expect(output).not.toContain('</script>');
    });

    it('10. neutralizes uppercase </SCRIPT>', () => {
        const input = { snippet: '</SCRIPT>' };
        const output = safeJsonLdStringify(input);

        expect(output).not.toContain('</SCRIPT>');
    });

    it('11. neutralizes mixed-case </ScRiPt>', () => {
        const input = { snippet: '</ScRiPt>' };
        const output = safeJsonLdStringify(input);

        expect(output).not.toContain('</ScRiPt>');
        expect(output.toLowerCase()).not.toContain('</script>');
    });

    it('12. safely serializes hostile values while restoring original content via JSON.parse', () => {
        const hostile = '</script><script>alert(1)</script>';
        const input = { payload: hostile };
        const output = safeJsonLdStringify(input);

        expect(output).not.toContain('</script>');
        expect(output).not.toContain('<script>');

        const parsed = JSON.parse(output);

        expect(parsed.payload).toBe(hostile);
    });

    it('13. does not double-encode output', () => {
        const input = { title: 'Gakutsu' };
        const output = safeJsonLdStringify(input);
        const parsed = JSON.parse(output);

        expect(typeof parsed).toBe('object');
        expect(parsed).toEqual(input);
        expect(typeof parsed.title).toBe('string');
        expect(parsed.title).toBe('Gakutsu');
    });

    it('14. outputs a JSON object representation rather than a quoted JSON string', () => {
        const input = { a: 1 };
        const output = safeJsonLdStringify(input);

        expect(output.startsWith('{')).toBe(true);
        expect(output.endsWith('}')).toBe(true);
        expect(output.startsWith('"')).toBe(false);

        const parsed = JSON.parse(output);

        expect(typeof parsed).toBe('object');
        expect(parsed).not.toBeNull();
    });

    it('15. correctly round-trips Unicode and Indonesian text', () => {
        const input = {
            headline: 'Komunitas Belajar Cyber Security & IT — Gakutsu 🇮🇩',
            description: 'Topik relevan: "Hacking" & pertahanan digital ✨',
        };
        const output = safeJsonLdStringify(input);
        const parsed = JSON.parse(output);

        expect(parsed).toEqual(input);
    });
});

describe('normalizeImageUrl', () => {
    const baseUrl = 'https://gakutsu.net';

    it('1. keeps valid absolute HTTPS URL unchanged', () => {
        const input = 'https://gakutsu.net/storage/blog-covers/cyber.jpg';

        expect(normalizeImageUrl(input, baseUrl)).toBe(input);
    });

    it('2. keeps valid absolute HTTP URL unchanged', () => {
        const input = 'http://example.com/images/poster.png';

        expect(normalizeImageUrl(input, baseUrl)).toBe(input);
    });

    it('3. resolves root-relative path against trusted base URL', () => {
        const path = '/storage/blog-covers/cyber.jpg';

        expect(normalizeImageUrl(path, baseUrl)).toBe(
            'https://gakutsu.net/storage/blog-covers/cyber.jpg',
        );
    });

    it('4. normalizes base URL trailing slashes when resolving root-relative path', () => {
        const path = '/storage/blog-covers/cyber.jpg';

        expect(normalizeImageUrl(path, 'https://gakutsu.net/')).toBe(
            'https://gakutsu.net/storage/blog-covers/cyber.jpg',
        );
        expect(normalizeImageUrl(path, 'https://gakutsu.net///')).toBe(
            'https://gakutsu.net/storage/blog-covers/cyber.jpg',
        );
    });

    it('5. rejects protocol-relative URLs', () => {
        expect(
            normalizeImageUrl('//attacker.example.com/image.png', baseUrl),
        ).toBeNull();
    });

    it('6. rejects data URLs', () => {
        expect(
            normalizeImageUrl(
                'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
                baseUrl,
            ),
        ).toBeNull();
    });

    it('7. rejects blob URLs', () => {
        expect(
            normalizeImageUrl(
                'blob:https://gakutsu.net/550e8400-e29b-41d4-a716-446655440000',
                baseUrl,
            ),
        ).toBeNull();
    });

    it('8. rejects javascript URLs case-insensitively', () => {
        expect(normalizeImageUrl('javascript:alert(1)', baseUrl)).toBeNull();
        expect(normalizeImageUrl('JAVASCRIPT:alert(1)', baseUrl)).toBeNull();
        expect(normalizeImageUrl('JaVaScRiPt:alert(1)', baseUrl)).toBeNull();
    });

    it('9. rejects non-root relative paths', () => {
        expect(
            normalizeImageUrl('storage/covers/cyber.jpg', baseUrl),
        ).toBeNull();
        expect(normalizeImageUrl('./covers/cyber.jpg', baseUrl)).toBeNull();
        expect(normalizeImageUrl('../covers/cyber.jpg', baseUrl)).toBeNull();
    });

    it('10. omits empty, whitespace, null, or undefined URLs', () => {
        expect(normalizeImageUrl(null, baseUrl)).toBeNull();
        expect(normalizeImageUrl(undefined, baseUrl)).toBeNull();
        expect(normalizeImageUrl('', baseUrl)).toBeNull();
        expect(normalizeImageUrl('   ', baseUrl)).toBeNull();
    });

    it('11. handles invalid base URL strings safely without producing malformed image URLs', () => {
        expect(normalizeImageUrl('/images/cover.jpg', 'invalid-base-url')).toBe(
            'invalid-base-url/images/cover.jpg',
        );
        expect(
            normalizeImageUrl('https://invalid-url-string::', baseUrl),
        ).toBeNull();
    });
});

describe('Date Behavior', () => {
    const baseUrl = 'https://gakutsu.net';
    const canonicalUrl = 'https://gakutsu.net/blogs/test-post';

    it('1. formats valid datePublished as ISO 8601', () => {
        const schema = createBlogPostingSchema({
            canonicalUrl,
            baseUrl,
            siteName: 'Gakutsu',
            title: 'Test Post',
            publishedAt: '2026-08-01T10:00:00Z',
        });

        expect(schema.datePublished).toBe('2026-08-01T10:00:00.000Z');
    });

    it('2. emits valid dateModified later than datePublished', () => {
        const schema = createBlogPostingSchema({
            canonicalUrl,
            baseUrl,
            siteName: 'Gakutsu',
            title: 'Test Post',
            publishedAt: '2026-08-01T10:00:00.000Z',
            updatedAt: '2026-08-02T12:30:00.000Z',
        });

        expect(schema.datePublished).toBe('2026-08-01T10:00:00.000Z');
        expect(schema.dateModified).toBe('2026-08-02T12:30:00.000Z');
    });

    it('3. allows equal datePublished and dateModified', () => {
        const timestamp = '2026-08-01T10:00:00.000Z';
        const schema = createBlogPostingSchema({
            canonicalUrl,
            baseUrl,
            siteName: 'Gakutsu',
            title: 'Test Post',
            publishedAt: timestamp,
            updatedAt: timestamp,
        });

        expect(schema.datePublished).toBe(timestamp);
        expect(schema.dateModified).toBe(timestamp);
    });

    it('4. omits dateModified if earlier than datePublished', () => {
        const schema = createBlogPostingSchema({
            canonicalUrl,
            baseUrl,
            siteName: 'Gakutsu',
            title: 'Test Post',
            publishedAt: '2026-08-02T10:00:00.000Z',
            updatedAt: '2026-08-01T10:00:00.000Z',
        });

        expect(schema.datePublished).toBe('2026-08-02T10:00:00.000Z');
        expect(schema.dateModified).toBeUndefined();
    });

    it('5. omits datePublished safely when invalid', () => {
        const schema = createBlogPostingSchema({
            canonicalUrl,
            baseUrl,
            siteName: 'Gakutsu',
            title: 'Test Post',
            publishedAt: 'invalid-published-date',
            updatedAt: '2026-08-02T10:00:00.000Z',
        });

        expect(schema.datePublished).toBeUndefined();
        expect(schema.dateModified).toBeUndefined();
    });

    it('6. omits dateModified when invalid', () => {
        const schema = createBlogPostingSchema({
            canonicalUrl,
            baseUrl,
            siteName: 'Gakutsu',
            title: 'Test Post',
            publishedAt: '2026-08-01T10:00:00.000Z',
            updatedAt: 'invalid-updated-date',
        });

        expect(schema.datePublished).toBe('2026-08-01T10:00:00.000Z');
        expect(schema.dateModified).toBeUndefined();
    });

    it('7. omits date properties when dates are missing', () => {
        const schema = createBlogPostingSchema({
            canonicalUrl,
            baseUrl,
            siteName: 'Gakutsu',
            title: 'Test Post',
            publishedAt: null,
            updatedAt: null,
        });

        expect(schema.datePublished).toBeUndefined();
        expect(schema.dateModified).toBeUndefined();
    });

    it('8. never substitutes current runtime time for missing or invalid dates', () => {
        const schema = createBlogPostingSchema({
            canonicalUrl,
            baseUrl,
            siteName: 'Gakutsu',
            title: 'Test Post',
        });

        expect(schema.datePublished).toBeUndefined();
        expect(schema.dateModified).toBeUndefined();
        expect(Object.keys(schema)).not.toContain('datePublished');
        expect(Object.keys(schema)).not.toContain('dateModified');
    });

    it('9. formatIsoDate returns ISO 8601 string or null for invalid inputs', () => {
        expect(formatIsoDate('2026-08-01T10:00:00.000Z')).toBe(
            '2026-08-01T10:00:00.000Z',
        );
        expect(formatIsoDate('invalid-date')).toBeNull();
        expect(formatIsoDate(null)).toBeNull();
        expect(formatIsoDate(undefined)).toBeNull();
    });
});

describe('Schema Identity Consistency', () => {
    const testCases = [
        {
            name: 'without trailing slash',
            baseUrl: 'https://gakutsu.net',
            expectedHomeUrl: 'https://gakutsu.net/',
            expectedOrgId: 'https://gakutsu.net/#organization',
        },
        {
            name: 'with one trailing slash',
            baseUrl: 'https://gakutsu.net/',
            expectedHomeUrl: 'https://gakutsu.net/',
            expectedOrgId: 'https://gakutsu.net/#organization',
        },
        {
            name: 'with multiple trailing slashes',
            baseUrl: 'https://gakutsu.net///',
            expectedHomeUrl: 'https://gakutsu.net/',
            expectedOrgId: 'https://gakutsu.net/#organization',
        },
        {
            name: 'valid subdirectory origin',
            baseUrl: 'https://gakutsu.net/subpath',
            expectedHomeUrl: 'https://gakutsu.net/subpath/',
            expectedOrgId: 'https://gakutsu.net/subpath/#organization',
        },
    ];

    testCases.forEach(({ name, baseUrl, expectedHomeUrl, expectedOrgId }) => {
        it(`maintains consistent Organization @id across WebSite, Organization, and BlogPosting (${name})`, () => {
            const website = createWebSiteSchema({
                canonicalHomeUrl: baseUrl,
                siteName: 'Gakutsu',
            });

            const organization = createOrganizationSchema({
                canonicalHomeUrl: baseUrl,
                siteName: 'Gakutsu',
            });

            const blog = createBlogPostingSchema({
                canonicalUrl: `${expectedHomeUrl}blogs/test-post`,
                baseUrl,
                siteName: 'Gakutsu',
                title: 'Test Post',
            });

            expect(website['@id']).toBe(`${expectedHomeUrl}#website`);
            expect(website.url).toBe(expectedHomeUrl);
            expect(website.publisher['@id']).toBe(expectedOrgId);

            expect(organization['@id']).toBe(expectedOrgId);
            expect(organization.url).toBe(expectedHomeUrl);

            expect(blog['@id']).toBe(
                `${expectedHomeUrl}blogs/test-post#article`,
            );

            const mainEntity = blog.mainEntityOfPage as Record<string, unknown>;

            expect(mainEntity['@id']).toBe(`${expectedHomeUrl}blogs/test-post`);

            const publisher = blog.publisher as Record<string, unknown>;

            expect(publisher['@id']).toBe(expectedOrgId);
            expect(publisher.url).toBe(expectedHomeUrl);
        });
    });
});

describe('Schema Semantics & Property Guardrails', () => {
    const baseUrl = 'https://gakutsu.net';

    it('1. WebSite schema does not invent SearchAction', () => {
        const website = createWebSiteSchema({
            canonicalHomeUrl: baseUrl,
            siteName: 'Gakutsu',
        });

        expect(website).not.toHaveProperty('potentialAction');
        expect(website).not.toHaveProperty('SearchAction');
        expect(Object.keys(website)).toEqual([
            '@type',
            '@id',
            'url',
            'name',
            'publisher',
        ]);
    });

    it('2. Organization schema does not invent logo or sameAs', () => {
        const organization = createOrganizationSchema({
            canonicalHomeUrl: baseUrl,
            siteName: 'Gakutsu',
            description: 'Learning community',
        });

        expect(organization).not.toHaveProperty('logo');
        expect(organization).not.toHaveProperty('sameAs');
        expect(Object.keys(organization)).toEqual([
            '@type',
            '@id',
            'name',
            'url',
            'description',
        ]);
    });

    it('3. BlogPosting publisher is Gakutsu Organization', () => {
        const blog = createBlogPostingSchema({
            canonicalUrl: 'https://gakutsu.net/blogs/cyber',
            baseUrl,
            siteName: 'Gakutsu',
            title: 'Cyber Article',
        });

        const publisher = blog.publisher as Record<string, unknown>;

        expect(publisher['@type']).toBe('Organization');
        expect(publisher['@id']).toBe('https://gakutsu.net/#organization');
        expect(publisher.name).toBe('Gakutsu');
        expect(publisher.url).toBe('https://gakutsu.net/');
    });

    it('4. BlogPosting image is omitted when invalid', () => {
        const blogInvalidImage = createBlogPostingSchema({
            canonicalUrl: 'https://gakutsu.net/blogs/cyber',
            baseUrl,
            siteName: 'Gakutsu',
            title: 'Cyber Article',
            coverImageUrl: 'javascript:alert(1)',
        });

        expect(blogInvalidImage.image).toBeUndefined();
        expect(blogInvalidImage).not.toHaveProperty('image');
    });

    it('5. BlogPosting author URL is not invented', () => {
        const blog = createBlogPostingSchema({
            canonicalUrl: 'https://gakutsu.net/blogs/cyber',
            baseUrl,
            siteName: 'Gakutsu',
            title: 'Cyber Article',
            authorName: 'Alice Mentor',
        });

        const author = blog.author as Record<string, unknown>;

        expect(author['@type']).toBe('Person');
        expect(author.name).toBe('Alice Mentor');
        expect(author).not.toHaveProperty('url');
        expect(author).not.toHaveProperty('@id');
    });

    it('6. BlogPosting dateModified is factual or omitted', () => {
        const blogWithoutModified = createBlogPostingSchema({
            canonicalUrl: 'https://gakutsu.net/blogs/cyber',
            baseUrl,
            siteName: 'Gakutsu',
            title: 'Cyber Article',
            publishedAt: '2026-08-01T10:00:00.000Z',
        });

        expect(blogWithoutModified.datePublished).toBe(
            '2026-08-01T10:00:00.000Z',
        );
        expect(blogWithoutModified.dateModified).toBeUndefined();
    });

    it('7. no meeting_url property exists in any schema node', () => {
        const website = createWebSiteSchema({
            canonicalHomeUrl: baseUrl,
            siteName: 'Gakutsu',
        });

        const organization = createOrganizationSchema({
            canonicalHomeUrl: baseUrl,
            siteName: 'Gakutsu',
        });

        const blog = createBlogPostingSchema({
            canonicalUrl: 'https://gakutsu.net/blogs/cyber',
            baseUrl,
            siteName: 'Gakutsu',
            title: 'Cyber Article',
            publishedAt: '2026-08-01T10:00:00.000Z',
        });

        const websiteJson = JSON.stringify(website);
        const orgJson = JSON.stringify(organization);
        const blogJson = JSON.stringify(blog);

        expect(websiteJson).not.toContain('meeting_url');
        expect(orgJson).not.toContain('meeting_url');
        expect(blogJson).not.toContain('meeting_url');
    });
});

describe('createBreadcrumbListSchema', () => {
    const canonicalUrl = 'https://gakutsu.net/blogs/cyber-security';

    it('1. returns node with @type BreadcrumbList', () => {
        const items = [
            { name: 'Home', url: 'https://gakutsu.net/' },
            { name: 'Blogs', url: 'https://gakutsu.net/blogs' },
            { name: 'Cyber Security', url: canonicalUrl },
        ];
        const result = createBreadcrumbListSchema(items, canonicalUrl);

        expect(result).not.toBeNull();
        expect(result?.['@type']).toBe('BreadcrumbList');
    });

    it('2. sets @id using canonicalCurrentUrl + #breadcrumb', () => {
        const items = [
            { name: 'Home', url: 'https://gakutsu.net/' },
            { name: 'Events', url: 'https://gakutsu.net/events' },
            { name: 'Webinar', url: 'https://gakutsu.net/events/webinar' },
        ];
        const result = createBreadcrumbListSchema(
            items,
            'https://gakutsu.net/events/webinar',
        );

        expect(result?.['@id']).toBe(
            'https://gakutsu.net/events/webinar#breadcrumb',
        );
    });

    it('3. starts ListItem positions at 1 and keeps them consecutive', () => {
        const items = [
            { name: 'Home', url: 'https://gakutsu.net/' },
            { name: 'Blogs', url: 'https://gakutsu.net/blogs' },
            { name: 'Detail', url: canonicalUrl },
        ];
        const result = createBreadcrumbListSchema(items, canonicalUrl);
        const list = result?.itemListElement as Array<Record<string, unknown>>;

        expect(list).toHaveLength(3);
        expect(list[0].position).toBe(1);
        expect(list[1].position).toBe(2);
        expect(list[2].position).toBe(3);
    });

    it('4. preserves item names and URLs in supplied order', () => {
        const items = [
            { name: 'Home', url: 'https://gakutsu.net/' },
            { name: 'Blogs', url: 'https://gakutsu.net/blogs' },
            { name: 'Title', url: canonicalUrl },
        ];
        const result = createBreadcrumbListSchema(items, canonicalUrl);
        const list = result?.itemListElement as Array<Record<string, unknown>>;

        expect(list[0].name).toBe('Home');
        expect(list[0].item).toBe('https://gakutsu.net/');
        expect(list[1].name).toBe('Blogs');
        expect(list[1].item).toBe('https://gakutsu.net/blogs');
        expect(list[2].name).toBe('Title');
        expect(list[2].item).toBe(canonicalUrl);
    });

    it('5. constructs valid blog breadcrumb structure (Home, Blogs, title)', () => {
        const baseUrl = 'https://gakutsu.net';
        const cleanBase = baseUrl.replace(/\/+$/, '');
        const postTitle = 'Belajar Hacking Basics';
        const postCanonical = `${cleanBase}/blogs/belajar-hacking-basics`;
        const items = [
            { name: 'Home', url: `${cleanBase}/` },
            { name: 'Blogs', url: `${cleanBase}/blogs` },
            { name: postTitle, url: postCanonical },
        ];

        const schema = createBreadcrumbListSchema(items, postCanonical);

        expect(schema).not.toBeNull();
        expect(schema?.['@id']).toBe(`${postCanonical}#breadcrumb`);
        const elements = schema?.itemListElement as Array<
            Record<string, unknown>
        >;

        expect(elements[0].name).toBe('Home');
        expect(elements[1].name).toBe('Blogs');
        expect(elements[2].name).toBe(postTitle);
    });

    it('6. constructs valid event breadcrumb structure (Home, Events, title)', () => {
        const baseUrl = 'https://gakutsu.net';
        const cleanBase = baseUrl.replace(/\/+$/, '');
        const eventTitle = 'Webinar Cyber Security 2026';
        const eventCanonical = `${cleanBase}/events/webinar-cyber-security-2026`;
        const items = [
            { name: 'Home', url: `${cleanBase}/` },
            { name: 'Events', url: `${cleanBase}/events` },
            { name: eventTitle, url: eventCanonical },
        ];

        const schema = createBreadcrumbListSchema(items, eventCanonical);

        expect(schema).not.toBeNull();
        expect(schema?.['@id']).toBe(`${eventCanonical}#breadcrumb`);
        const elements = schema?.itemListElement as Array<
            Record<string, unknown>
        >;

        expect(elements[0].name).toBe('Home');
        expect(elements[1].name).toBe('Events');
        expect(elements[2].name).toBe(eventTitle);
    });

    it('7. preserves APP_URL subdirectory paths without dropping subpath', () => {
        const baseUrl = 'https://example.com/gakutsu';
        const cleanBase = baseUrl.replace(/\/+$/, '');
        const homeUrl = `${cleanBase}/`;
        const blogsUrl = `${cleanBase}/blogs`;
        const itemCanonical = `${cleanBase}/blogs/subpath-test`;

        const items = [
            { name: 'Home', url: homeUrl },
            { name: 'Blogs', url: blogsUrl },
            { name: 'Subpath Test', url: itemCanonical },
        ];

        const schema = createBreadcrumbListSchema(items, itemCanonical);
        const elements = schema?.itemListElement as Array<
            Record<string, unknown>
        >;

        expect(elements[0].item).toBe('https://example.com/gakutsu/');
        expect(elements[1].item).toBe('https://example.com/gakutsu/blogs');
        expect(elements[2].item).toBe(
            'https://example.com/gakutsu/blogs/subpath-test',
        );
    });

    it('8. preserves names with <, >, &, quotes, and Unicode exactly', () => {
        const specialTitle = 'Security <Test> & "Analysis" — 🇮🇩';
        const items = [
            { name: 'Home', url: 'https://gakutsu.net/' },
            { name: specialTitle, url: canonicalUrl },
        ];
        const result = createBreadcrumbListSchema(items, canonicalUrl);
        const list = result?.itemListElement as Array<Record<string, unknown>>;

        expect(list[1].name).toBe(specialTitle);
    });

    it('9. safely round-trips hostile-title breadcrumb through safeJsonLdStringify', () => {
        const hostileTitle = '</script><script>alert(1)</script>';
        const items = [
            { name: 'Home', url: 'https://gakutsu.net/' },
            { name: hostileTitle, url: canonicalUrl },
        ];
        const schema = createBreadcrumbListSchema(items, canonicalUrl);
        const jsonString = safeJsonLdStringify({
            '@context': 'https://schema.org',
            '@graph': [schema],
        });

        expect(jsonString).not.toContain('</script>');
        expect(jsonString).not.toContain('<script>');

        const parsed = JSON.parse(jsonString);
        const list = parsed['@graph'][0].itemListElement;

        expect(list[1].name).toBe(hostileTitle);
    });

    it('10. returns null when canonicalCurrentUrl is missing or invalid', () => {
        const items = [
            { name: 'Home', url: 'https://gakutsu.net/' },
            { name: 'Blogs', url: 'https://gakutsu.net/blogs' },
        ];

        // @ts-expect-error testing missing canonicalCurrentUrl
        expect(createBreadcrumbListSchema(items, undefined)).toBeNull();
        expect(createBreadcrumbListSchema(items, '')).toBeNull();
        expect(createBreadcrumbListSchema(items, 'invalid-url')).toBeNull();
        expect(
            createBreadcrumbListSchema(items, 'javascript:alert(1)'),
        ).toBeNull();
    });

    it('11. returns null when item array is empty or not an array', () => {
        expect(createBreadcrumbListSchema([], canonicalUrl)).toBeNull();
        // @ts-expect-error testing invalid items
        expect(createBreadcrumbListSchema(null, canonicalUrl)).toBeNull();
    });

    it('12. returns null when any item has an empty or whitespace name', () => {
        const itemsWithEmptyName = [
            { name: 'Home', url: 'https://gakutsu.net/' },
            { name: '  ', url: 'https://gakutsu.net/blogs' },
        ];

        expect(
            createBreadcrumbListSchema(itemsWithEmptyName, canonicalUrl),
        ).toBeNull();
    });

    it('13. returns null when any item URL is invalid', () => {
        const itemsWithInvalidUrl = [
            { name: 'Home', url: 'https://gakutsu.net/' },
            { name: 'Blogs', url: '/blogs' },
        ];

        expect(
            createBreadcrumbListSchema(itemsWithInvalidUrl, canonicalUrl),
        ).toBeNull();
    });

    it('14. does not include top-level @context inside BreadcrumbList node', () => {
        const items = [
            { name: 'Home', url: 'https://gakutsu.net/' },
            { name: 'Blogs', url: 'https://gakutsu.net/blogs' },
        ];
        const result = createBreadcrumbListSchema(items, canonicalUrl);

        expect(result).not.toHaveProperty('@context');
    });

    it('15. does not introduce any Event schema in event breadcrumb graph', () => {
        const eventCanonical = 'https://gakutsu.net/events/cyber-webinar';
        const items = [
            { name: 'Home', url: 'https://gakutsu.net/' },
            { name: 'Events', url: 'https://gakutsu.net/events' },
            { name: 'Cyber Webinar', url: eventCanonical },
        ];
        const breadcrumb = createBreadcrumbListSchema(items, eventCanonical);
        const eventGraph = [breadcrumb].filter(
            (node): node is Record<string, unknown> => node !== null,
        );

        const serialized = JSON.stringify(eventGraph);

        expect(serialized).not.toContain('"@type":"Event"');
        expect(serialized).not.toContain('OnlineEvent');
        expect(serialized).not.toContain('meeting_url');
        expect(serialized).not.toContain('meetingUrl');
    });
});

describe('toInertiaHref', () => {
    it('1. extracts pathname from absolute root URL', () => {
        expect(toInertiaHref('https://gakutsu.net/blogs')).toBe('/blogs');
        expect(toInertiaHref('https://gakutsu.net/events')).toBe('/events');
        expect(toInertiaHref('https://gakutsu.net/')).toBe('/');
    });

    it('2. preserves subdirectory deployment subpaths', () => {
        expect(toInertiaHref('https://example.com/gakutsu/blogs')).toBe(
            '/gakutsu/blogs',
        );
        expect(toInertiaHref('https://example.com/gakutsu/events')).toBe(
            '/gakutsu/events',
        );
        expect(toInertiaHref('https://example.com/gakutsu/')).toBe('/gakutsu/');
    });

    it('3. preserves query parameters and hashes', () => {
        expect(
            toInertiaHref('https://gakutsu.net/events?sort=date#upcoming'),
        ).toBe('/events?sort=date#upcoming');
    });

    it('4. returns null for invalid or non-HTTP/HTTPS URLs', () => {
        expect(toInertiaHref('javascript:alert(1)')).toBeNull();
        expect(toInertiaHref('invalid-url')).toBeNull();
        expect(toInertiaHref('')).toBeNull();
        expect(toInertiaHref(null)).toBeNull();
        expect(toInertiaHref(undefined)).toBeNull();
    });
});
