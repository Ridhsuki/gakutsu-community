import { describe, expect, it } from 'vitest';
import { formatDocumentTitle } from '@/lib/document-title';

describe('formatDocumentTitle', () => {
    const appName = 'Gakutsu';

    it('1. returns appName for empty title string', () => {
        expect(formatDocumentTitle('', appName)).toBe('Gakutsu');
    });

    it('2. returns appName for whitespace-only title string', () => {
        expect(formatDocumentTitle('   ', appName)).toBe('Gakutsu');
    });

    it('3. returns appName unchanged when title equals appName', () => {
        expect(formatDocumentTitle('Gakutsu', appName)).toBe('Gakutsu');
        expect(formatDocumentTitle('  Gakutsu  ', appName)).toBe('Gakutsu');
    });

    it('4. appends suffix once for ordinary titles', () => {
        expect(formatDocumentTitle('Log in', appName)).toBe('Log in - Gakutsu');
        expect(formatDocumentTitle('Dashboard', appName)).toBe(
            'Dashboard - Gakutsu',
        );
        expect(formatDocumentTitle('Events', appName)).toBe('Events - Gakutsu');
    });

    it('5. leaves already suffixed titles unchanged', () => {
        expect(formatDocumentTitle('Blogs - Gakutsu', appName)).toBe(
            'Blogs - Gakutsu',
        );
        expect(formatDocumentTitle('Cyber Security - Gakutsu', appName)).toBe(
            'Cyber Security - Gakutsu',
        );
    });

    it('6. appends suffix when appName occurs elsewhere in title but not as exact suffix', () => {
        expect(formatDocumentTitle('Gakutsu Learning', appName)).toBe(
            'Gakutsu Learning - Gakutsu',
        );
        expect(
            formatDocumentTitle('Welcome to Gakutsu Community', appName),
        ).toBe('Welcome to Gakutsu Community - Gakutsu');
    });

    it('7. ensures suffix is added no more than once upon repeated calls', () => {
        const title = 'Log in';
        const formattedOnce = formatDocumentTitle(title, appName);
        const formattedTwice = formatDocumentTitle(formattedOnce, appName);

        expect(formattedOnce).toBe('Log in - Gakutsu');
        expect(formattedTwice).toBe('Log in - Gakutsu');
    });
});
