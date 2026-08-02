# SEO Audit: Gakutsu Community

## 1. Executive Summary

- **Current SEO Maturity:** Low to Medium. The platform benefits from server-side rendering (SSR) and basic metadata implementation via the `SeoHead` component, but lacks critical crawling, indexing controls, and structured data.
- **Strongest Existing Foundations:** Vite SSR is successfully configured, meaning search engines will see server-rendered HTML. A reusable `SeoHead` component handles basic title, description, Open Graph, and Twitter tags consistently.
- **Largest Technical Risks:** Missing `noindex` directives on private routes (auth, admin, settings, registrations) combined with an open `robots.txt`. Missing canonical tags expose the platform to fragmented canonical signals and split reporting. Hero images are lazy-loaded, threatening LCP performance.
- **Largest Search-Growth Opportunities:** Implementing JSON-LD structured data (Event and Article schema) to become eligible for Google rich results where applicable. Establishing an XML sitemap to support discovery.
- **Overall Readiness Rating:** Public pages are indexable, but controlled production indexing and search-result presentation are not yet fully implemented.
- **Disclaimer:** Ranking, traffic, indexing, or rich results cannot be guaranteed. This audit provides best-practice technical foundations based on official guidelines.

## 2. Evidence and Audit Method

- **Repository Files Inspected:** `routes/web.php:33-43`, `resources/views/app.blade.php`, `resources/js/app.tsx`, `resources/js/components/public/seo-head.tsx:24-68`, `public/robots.txt:1-3`, `vite.config.ts:14`, `resources/js/features/events/components/event-poster-thumbnail.tsx:33`.
- **Commands Executed:** `git status --short`, `git diff`, `git diff --check`, `php artisan route:list --except-vendor`, `npm run types:check`, `npm run build:ssr`.
- **Runtime Pages Inspected:** No. Static code analysis only.
- **Production Domain Available:** Yes. The current demo/production-like origin is `https://gakutsu.net`. The live HTML was not inspected during this static repository audit.
- **Limitations:** A static repository audit cannot verify actual Search Console indexing, CrUX field data performance, or dynamic hydration behaviors under real network conditions. Rich Results testing is not possible without a live URL.
- **Official Documentation Used:** 
  - Google Search Central: Search Essentials (August 2026)
  - Google Search Central: SEO Starter Guide (August 2026)
  - Google Search Central: Canonicalization guidelines (August 2026)
  - Google Search Central: XML Sitemaps (August 2026)
  - Google Search Central: Structured Data (Event, Article, Breadcrumb) (August 2026)
  - web.dev: Core Web Vitals (LCP, INP, CLS) targets (August 2026)

## 3. Public Route Inventory

| Route Name | URL Pattern | React Page | Auth | Content Type | Status | Indexation Policy | Canonical | Sitemap | Structured Data |
|---|---|---|---|---|---|---|---|---|---|
| `home` | `/` | `welcome.tsx` | No | Landing | 200 | Index, Follow | Self-referencing | Yes | WebSite, Organization |
| `events.index` | `/events` | `events/index.tsx` | No | Listing | 200 | Index, Follow | Self-referencing | Yes | CollectionPage, BreadcrumbList |
| `events.show` | `/events/{slug}` | `events/show.tsx` | No | Detail | 200/404 | Index, Follow | Self-referencing | Yes | Event, BreadcrumbList |
| `events.register` | `/events/{slug}/register` | `events/register.tsx` | Yes* | Form | 200/404 | Noindex, Follow | N/A | No | None |
| `blogs.index` | `/blogs` | `blogs/index.tsx` | No | Listing | 200 | Index, Follow | Self-referencing | Yes | CollectionPage, BreadcrumbList |
| `blogs.show` | `/blogs/{slug}` | `blogs/show.tsx` | No | Detail | 200/404 | Index, Follow | Self-referencing | Yes | Article/BlogPosting, BreadcrumbList |
| Auth routes | `/login`, `/register` | `auth/*` | No | Utility | 200 | Noindex, Follow | N/A | No | None |
| Settings | `/settings/*` | `settings/*` | Yes | Private | 200/403 | Noindex, Nofollow | N/A | No | None |
| Admin | `/admin/*` | `admin/*` | Yes | Private | 200/403 | Noindex, Nofollow | N/A | No | None |
| Mentor | `/mentor/*` | `mentor/*` | Yes | Private | 200/403 | Noindex, Nofollow | N/A | No | None |
| Pagination | `?page=` | Listing | No | Listing | 200 | Index, Follow | Self-referencing | No | None |
| Search | `?search=` | Listing | No | Listing | 200 | Noindex, Follow | N/A | No | None |
| Filters/Sort | `?sort=` | Listing | No | Listing | 200 | Noindex, Follow | N/A | No | None |

## 4. Indexation Policy Matrix

- **Index, follow:** `/`, `/events`, `/events/{slug}`, `/blogs`, `/blogs/{slug}`, and paginated collection pages (each paginated page should have a unique URL and self-referencing canonical).
- **Noindex, follow:** `/login`, `/register`, `/forgot-password`, `/reset-password`, event registration forms (`/events/{slug}/register`), search-result URLs, and filter/alternative-sort variants (unless a future keyword and content strategy proves they are valuable landing pages). Empty combinations should return `noindex` or proper `404` based on application behavior.
- **Noindex, nofollow:** All routes under `/admin`, `/mentor`, `/settings`. (Defense-in-depth, as authentication is the primary access control).
- **Redirects:** Should be used for old event/blog slugs if titles change (currently lacking).
- **404:** Non-existent slugs, unpublished events/blogs.

**Control Mechanics:**
- Do not use `robots.txt` to block indexing of private/admin pages. Rely on server-rendered `<meta name="robots" content="noindex, follow">`.
- `robots.txt` controls crawling budget, `noindex` controls indexation.
- Pagination navigation must use crawlable `href` links.

## 5. SSR and HTML Source Audit

- **Meaningful Page Content:** Yes, Inertia SSR is configured (`vite.config.ts:14`).
- **Unique Title:** Yes, managed by `SeoHead` (`resources/js/components/public/seo-head.tsx:22`).
- **Meta Description:** Yes, managed by `SeoHead` (`resources/js/components/public/seo-head.tsx:24-28`).
- **Canonical:** **Missing**. No `<link rel="canonical">` tag exists in `SeoHead` or layouts.
- **Robots Directive:** **Missing**. No `<meta name="robots">` implemented anywhere in `SeoHead`.
- **Language Attribute:** Present (`<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">`).
- **Open Graph / Twitter:** Present via `SeoHead`.
- **JSON-LD:** **Missing**.

Metadata does not depend on client hydration since `SeoHead` is rendered by Inertia SSR.

## 6. Title and Meta Description Matrix

| Page Type | Current Title | Recommended Pattern | Description Pattern |
|---|---|---|---|
| Home | "Yok Pelajarin" | "[Brand] - IT & Cybersecurity Learning Community" | "We share, discuss, and sometimes host small webinars..." (Current static description) |
| Events Index | "Events - Yok Pelajarin" | "Upcoming Events & Webinars - [Brand]" | "Jelajahi webinar dan event komunitas IT dan Cyber Security dari [Brand]..." |
| Event Detail | `[Event Title] - Yok Pelajarin` | `[Event Title] | [Brand] Event` | `[Event Excerpt]...` (Currently uses first 155 chars of stripped content) |
| Blogs Index | Not explicitly set | "Blog & Articles - [Brand]" | "Artikel, insight, dan materi bacaan seputar IT dan Cyber Security..." |
| Blog Detail | `[Blog Title] - Yok Pelajarin` | `[Blog Title] | [Brand] Blog` | `[Blog Excerpt]...` (Currently uses first 155 chars of stripped content) |

**Notes:**
- **Brand Identity Decision:** Resolved. The final public site name is **Gakutsu**. Existing “Yok Pelajarin” metadata strings must be migrated during Phase 1. Visual branding outside metadata remains outside this phase unless required for consistency.
- **Description Truncation:** The application currently truncates descriptions at 155 characters. Note that this is only an application fallback; Google can dynamically rewrite snippets to better match user intent.

## 7. Canonical and URL Strategy

- **Absolute Canonical URLs:** Must be implemented in `SeoHead` for all indexable pages.
- **Risks of Missing Canonicals:** Missing canonical tags expose the platform to fragmented canonical signals, Google selecting a different representative URL, split reporting, unnecessary crawling of URL variants, and inconsistent search-result URLs. 
- **Important Note:** Normal duplicate content is not automatically a spam violation. Canonical annotations are signals, not guarantees.
- **Trailing Slashes:** Recommend enforcing non-trailing slashes via Laravel routing.
- **APP_URL Dependence:** Canonical tags must rely on a well-configured `APP_URL`.

## 8. Sitemap Strategy

A dynamic XML sitemap (e.g., `/sitemap.xml`) is **recommended**.

- A sitemap supports discovery and crawling.
- It does not guarantee crawling, indexing, or ranking.
- It may be less critical for a small, comprehensively linked site.
- It remains recommended here because events and blog posts are dynamic.

**Include:**
- Home (`/`)
- Public Event Listings (`/events`)
- Published Event Details (`/events/{slug}`)
- Public Blog Listings (`/blogs`)
- Published Blog Details (`/blogs/{slug}`)

**Exclude:**
- Auth, Admin, Mentor, Settings routes.
- Event registration forms.
- Unpublished or cancelled events (if 404).
- Any URL with query parameters (`?page=`, `?search=`).

**Specification:**
- Use absolute URLs.
- Include `<lastmod>` derived from `updated_at`.
- Declare the sitemap location in `public/robots.txt:1-3`: `Sitemap: https://domain.com/sitemap.xml`

## 9. robots.txt and Robots Meta Audit

- **Current `robots.txt`:** Wide open (`User-agent: *`, `Disallow:`) in `public/robots.txt:1-3`.
- **Missing Directives:**
  - `Sitemap` declaration.
  - Development/Staging environment protection. Staging should return `User-agent: *`, `Disallow: /`.
- **Robots Meta:** There are no `noindex` tags in the app. Auth pages, registration forms, and admin layouts need `<meta name="robots" content="noindex, follow">` or `noindex, nofollow` respectively.

## 10. Structured Data Opportunity Matrix

JSON-LD schema should be added for the following:

- **Home Page (`welcome.tsx`):** `WebSite` (search action optional), `Organization` (name, url, logo, description).
- **Event Detail (`events/show.tsx`):** `Event` schema.
  - **Assessment:** `startDate` and `endDate`, explicit timezone or UTC offset, `eventStatus`, `eventAttendanceMode`, physical or virtual `location`, `organizer`.
  - Properties like `offers`, `priceCurrency`, and `availability` should only be mapped when supported by actual data.
  - **Important Distinction:** Schema.org semantic validity does not equal Google rich-result eligibility. Google Event rich-result eligibility may not cover online-only events without a physical component. Do not promise Event rich results for webinars until eligibility is verified against current Google requirements.
- **Blog Detail (`blogs/show.tsx`):** `Article` or `BlogPosting` schema.
  - **Assessment:** `headline`, `image`, `datePublished`, `dateModified`, `author`, `publisher`, `mainEntityOfPage`, `canonical URL`.
- **BreadcrumbList:** Applicable to Event Detail and Blog Detail pages to clarify hierarchy (`Home > Events > [Event Title]`).

## 11. Social Sharing Metadata

- **Current State:** `SeoHead` handles basic OG and Twitter tags.
- **Missing/Improvements:**
  - Missing `og:url`.
  - Missing `og:site_name`.
  - Missing `og:image:alt` and `twitter:image:alt`.
  - Ensure image URLs are absolute. A fallback image should be defined.

## 12. Semantic HTML and Accessibility

- **Headings:** Pages generally use proper `<h1>` tags (`welcome.tsx`, `events/index.tsx`, `blogs/show.tsx`).
- **Images:** `EventPosterThumbnail` component uses an `alt` attribute. User-generated content from the Tiptap editor must enforce `alt` text.
- **Accessibility:** `html` tag has `lang` attribute.

## 13. Content and Search Intent

- **Community Discovery:** Home page serves this well but could benefit from a clearer value proposition heading.
- **Content Gaps:** Event descriptions rely on user input. Mentors should include clear target audiences, prerequisites, and learning outcomes (people-first content).

## 14. Internal Linking, Mobile Navigation, and Information Architecture

- **Mobile Navigation Parity:** Explicit audit of mobile navigation reveals parity with desktop navigation in `resources/js/components/public/site-header.tsx:92-154`. It correctly links to Home, Events, Blogs, and authentication entry points (`/login`, `/register`). The links use standard, crawlable `<Link href="...">` tags.
- **Pagination Navigation:** Must use crawlable `href` links for all collection pages.
- **Breadcrumbs:** Missing visual breadcrumbs on detail pages.
- **Related Articles:** Implemented on `blogs/show.tsx` (limits to 3). Good for internal linking.

## 15. Image SEO

- **Event Poster Images:** Displayed using `EventPosterThumbnail`.
- **Performance Risk:** `EventPosterThumbnail` uses `loading="lazy"` unconditionally (`resources/js/features/events/components/event-poster-thumbnail.tsx:33`). For event detail pages, the poster is likely the LCP element. Lazy loading LCP elements severely hurts Core Web Vitals.

## 16. Performance and Core Web Vitals

- **LCP Risk:** Lazy-loading hero images (posters, covers).
- **CLS Risk:** Images missing explicit dimensions may cause layout shifts.
- **Hydration Risk:** SSR is present, but heavy JS bundles could impact INP.
- **Action:** Refactor image components to accept eager loading flags for above-the-fold assets.

## 17. HTTP Status and Error Handling

- **Missing/Unpublished Events:** Controllers use `abort_unless($event->is_published, 404);` resulting in a 404 status.
- **Cancelled Events:** Returned as 200 but explicitly marked cancelled.
- **Unauthorized:** Returns 403 or redirects to login (302).

## 18. Measurement and Validation Plan

**Post-deployment Validation Checklist:**
- Inspect rendered DOM in Google Search Console URL Inspection Tool.
- Verify JSON-LD using Google Rich Results Test.
- Measure LCP, INP, and CLS via PageSpeed Insights (lab) and CrUX (field).
- Submit XML Sitemap in Search Console.
- Check Index Coverage report.

## 19. Findings Register

| ID | Category | Severity | Affected | Evidence | Impact | Recommendation | Effort | Confidence | Dependency | Acceptance Criteria |
|---|---|---|---|---|---|---|---|---|---|---|
| F1 | Indexing | P1 | Public Auth & Utility Pages | `resources/js/components/public/seo-head.tsx` lacks `robots` prop. | Unnecessary indexing of login/register pages. | Enforce `noindex` on auth and registration form pages. | Low | High | None | `<meta name="robots" content="noindex, follow">` is present in DOM. |
| F2 | Canonical | P1 | All Public Pages | `resources/js/components/public/seo-head.tsx` lacks canonical link. | Fragmented canonical signals; split reporting. | Inject absolute self-referencing canonical URLs for public views. | Low | High | `APP_URL` configured | `<link rel="canonical">` renders with absolute URL. |
| F3 | Indexing | P2 | Admin, Mentor, Settings | Same as F1. | Accidental indexation if linked publicly. | Enforce `noindex, nofollow` on private layouts (defense-in-depth). | Low | High | None | `<meta name="robots" content="noindex, nofollow">` is present in DOM. |
| F4 | Sitemap | P2 | Entire Site | `public/robots.txt:1-3` lacks sitemap directive; no sitemap exists. | Slower discovery of new events/blogs. | Generate dynamic XML sitemap and add to `robots.txt`. | Med | High | None | `/sitemap.xml` returns valid XML with 200 HTTP status URLs. |
| F5 | Structured Data | P2 | Events, Blogs | No JSON-LD schema found. | Missed opportunity for eligible rich results. | Inject `Event`, `Article`, `BreadcrumbList`, and `Organization` JSON-LD. | Med | High | None | Rich Results Test passes for Event/Article URLs without critical errors. |
| F6 | Performance | P1 | Detail Pages | `resources/js/features/events/components/event-poster-thumbnail.tsx:33` uses unconditional `loading="lazy"`. | Depressed LCP metrics. | Accept `loading` or `fetchpriority` props to bypass lazy loading for hero images. | Low | High | None | Hero images do not contain `loading="lazy"`. |
| F7 | Metadata | P2 | `SeoHead` | `resources/js/components/public/seo-head.tsx:30-68` misses some OG properties. | Incomplete social cards. | Add `og:url`, `og:site_name`, `og:image:alt` to `SeoHead`. | Low | High | Brand Decision | Social sharing previews validate properly. |
| F8 | Branding | P1 | Project Identity | Docs use “Gakutsu”, while existing metadata still uses “Yok Pelajarin”. | Inconsistent brand signals. | Replace public SEO metadata with the final brand name “Gakutsu”. | Low | High | Business decision resolved | `Gakutsu` is used consistently in title suffixes, `og:site_name`, and shared SEO metadata. |

*(Note: Public pages accidentally blocked or noindexed, and incorrect status codes or soft 404s preventing indexation would be P0. None were identified during this audit).*

## 20. Phased Implementation Roadmap

**Phase 1: seo/indexability-metadata**
- **Scope:** Add canonical URLs, `noindex` directives, and finalize brand name identity.

**Phase 2: seo/performance-images**
- **Scope:** Fix LCP lazy-loading issue on event and blog detail pages.

**Phase 3: seo/sitemap-robots**
- **Scope:** Build XML sitemap generator, update `robots.txt`.

**Phase 4: seo/structured-data**
- **Scope:** Add JSON-LD components to detail pages.
