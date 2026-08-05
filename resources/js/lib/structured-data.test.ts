import { describe, expect, it } from 'vitest';
import { safeJsonLdStringify, toInertiaHref } from '@/lib/structured-data';

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
