/* global process */
import ssrRender from '../bootstrap/ssr/app.js';

const testCases = [
    {
        name: 'blogs/show',
        page: {
            component: 'blogs/show',
            props: {
                post: {
                    id: 101,
                    title: 'SSR Smoke Blog',
                    slug: 'ssr-smoke-blog',
                    content:
                        '<h2>Rich text blog title</h2><p>This is a <strong>sanitized rich text paragraph</strong> inside SSR.</p>',
                    published_at: '2026-08-01T12:00:00.000Z',
                    cover_image_url: null,
                    author: { name: 'Author Name' },
                },
                relatedPosts: [],
                errors: {},
                seo: {
                    siteName: 'Gakutsu',
                    canonicalUrl: 'http://localhost/blogs/ssr-smoke-blog',
                    robots: 'index, follow',
                    baseUrl: 'http://localhost',
                },
            },
            url: '/blogs/ssr-smoke-blog',
            version: '1',
        },
        expectedText: 'Rich text blog title',
    },
    {
        name: 'events/show',
        page: {
            component: 'events/show',
            props: {
                event: {
                    id: 202,
                    title: 'SSR Smoke Event',
                    slug: 'ssr-smoke-event',
                    category: 'Tech',
                    description:
                        '<p>Detailed <em>event description</em> with rich text in SSR.</p>',
                    starts_at: '2026-08-10T09:00:00.000Z',
                    status: 'upcoming',
                    poster_image_url: null,
                    mentor: { name: 'Mentor Name' },
                },
                alreadyRegistered: false,
                canViewMeetingLink: false,
                meetingUrl: null,
                questionCount: 0,
                errors: {},
                seo: {
                    siteName: 'Gakutsu',
                    canonicalUrl: 'http://localhost/events/ssr-smoke-event',
                    robots: 'index, follow',
                    baseUrl: 'http://localhost',
                },
            },
            url: '/events/ssr-smoke-event',
            version: '1',
        },
        expectedText: 'event description',
    },
];

async function runSmokeCheck() {
    let failed = false;

    for (const tc of testCases) {
        console.log(`[SSR Smoke] Testing component: ${tc.name}...`);

        try {
            const result = await ssrRender(tc.page);

            if (!result || !result.body) {
                console.error(
                    `[SSR Smoke] FAILED: ${tc.name} returned null or empty result.`,
                );

                failed = true;

                continue;
            }

            if (!result.body.includes(tc.expectedText)) {
                console.error(
                    `[SSR Smoke] FAILED: ${tc.name} body missing expected text "${tc.expectedText}".`,
                );
                console.error(`Body snippet: ${result.body.slice(0, 300)}`);

                failed = true;

                continue;
            }

            console.log(
                `[SSR Smoke] PASSED: ${tc.name} rendered successfully with expected server HTML.`,
            );
        } catch (error) {
            console.error(`[SSR Smoke] EXCEPTION in ${tc.name}:`, error);

            failed = true;
        }
    }

    if (failed) {
        console.error('[SSR Smoke] Smoke check FAILED.');

        process.exit(1);
    } else {
        console.log('[SSR Smoke] All SSR smoke checks PASSED.');

        process.exit(0);
    }
}

runSmokeCheck();
