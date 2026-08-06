# SEO Audit and Closeout Record — Gakutsu Community

## 1. Executive Summary

- **Current SEO Maturity:** Medium to High. The platform features PHP-driven semantic SEO authority (`SeoPolicy`, `SeoMetadata`, `StructuredData`), dynamic sitemap generation, structured data, canonical tags, and environment-aware indexing policies.
- **Foundations:** PHP owns semantic SEO authority. `SeoPolicy` determines indexability, `robots`, and canonical policy; `SeoMetadata` produces the normalized metadata document; `resources/views/app.blade.php` renders the initial `<head>` document fallback; `seo-head.tsx` consumes the normalized metadata document during client hydration and Inertia navigation.
- **Production Rendering Architecture:** Production hosting uses client-side body rendering (CSR) with `INERTIA_SSR_ENABLED=false` and no persistent Node SSR process. The Vite SSR bundle is built and smoke-tested in development and CI (`npm run build:ssr` and `node scripts/ssr-smoke-check.mjs`) to validate hydration compatibility and SSR build integrity, but is not used as a persistent production body-rendering process.
- **Structured Data Baseline:** Home page renders `WebSite` and `Organization`. Published blog detail renders `BlogPosting` and `BreadcrumbList`. Published event detail renders `BreadcrumbList` only. `Event` schema remains explicitly deferred.
- **Public Payload Hardening:** Public Inertia page payloads omit raw `meeting_url` fields, internal primary/foreign keys, and unprojected model graphs. `meetingUrl` is provided only to authorized registered users and staff on event detail pages.
- **Operational Status:** Implementation is complete. Live Search Console submission, rich-results validation, and crawl monitoring remain open operational post-deployment tasks.

---

## 2. Evidence and Verification Methodology

- **Source Classes & Components:** `app/Support/SeoPolicy.php`, `app/Support/SeoMetadata.php`, `app/Support/StructuredData.php`, `resources/views/app.blade.php`, `resources/js/components/public/seo-head.tsx`, `app/Http/Controllers/Site/HomeController.php`, `app/Http/Controllers/Site/SitemapController.php`.
- **Automated Verification:**
    - `npm run test:unit` (`StructuredDataTest` unit and `document-title.test.ts` pass).
    - `./vendor/bin/pest --compact` (`SeoPolicyTest`, `SeoFallbackTest`, `StructuredDataTest`, `SitemapAndRobotsTest`, `PublicEventPrivacyTest`, `HomePayloadTest` pass).
    - `npm run types:check` (0 TypeScript errors).
    - `npm run lint:check -- --max-warnings=0` (0 ESLint errors/warnings).
    - `npm run build:ssr` && `node scripts/ssr-smoke-check.mjs` (Vite SSR build and HTML rendering smoke checks pass).

---

## 3. Public Route Inventory & SEO Behavior

| Route Name        | URL Pattern                            | Content Type       | Indexation Policy   | Canonical               | Sitemap | Implemented Structured Data                |
| ----------------- | -------------------------------------- | ------------------ | ------------------- | ----------------------- | ------- | ------------------------------------------ |
| `home`            | `/`                                    | Landing            | `index, follow`     | Self-referencing        | Yes     | `WebSite`, `Organization`                  |
| `events.index`    | `/events`                              | Listing            | `index, follow`     | Self-referencing        | Yes     | None                                       |
| `events.show`     | `/events/{slug}`                       | Event Detail       | `index, follow`     | Self-referencing        | Yes     | `BreadcrumbList` (_Event schema deferred_) |
| `events.register` | `/events/{slug}/register`              | Form               | `noindex, follow`   | None                    | No      | None                                       |
| `blogs.index`     | `/blogs`                               | Listing            | `index, follow`     | Self-referencing        | Yes     | None                                       |
| `blogs.show`      | `/blogs/{slug}`                        | Blog Detail        | `index, follow`     | Self-referencing        | Yes     | `BlogPosting`, `BreadcrumbList`            |
| Auth routes       | `/login`, `/register`, etc.            | Utility            | `noindex, follow`   | None                    | No      | None                                       |
| Private routes    | `/admin/*`, `/mentor/*`, `/settings/*` | Dashboard          | `noindex, nofollow` | None                    | No      | None                                       |
| Query variants    | `?search=`, `?sort=`, `?page=`         | Filtered/Paginated | `noindex, follow`   | Self-referencing / None | No      | None                                       |

---

## 4. Indexation Policy & Control Mechanics

Indexation policies are determined by `SeoPolicy.php`, constructed into a normalized document by `SeoMetadata.php`, rendered in `app.blade.php` for initial fallback, and consumed by `seo-head.tsx` during client navigation:

- **Clean Approved Public Pages:** `<meta name="robots" content="index, follow">` with absolute self-referencing canonical URL.
- **Search / Filter / Sort / Non-Clean States:** `<meta name="robots" content="noindex, follow">` without canonical URL where applicable.
- **Authentication & Utility Pages:** `<meta name="robots" content="noindex, follow">`.
- **Private Admin, Mentor, Settings Pages:** `<meta name="robots" content="noindex, nofollow">` (determined by `SeoPolicy`, rendered via Blade and `seo-head.tsx`; layouts no longer pass semantic SEO override props).
- **Event Registration Forms:** `<meta name="robots" content="noindex, follow">` with no structured data.
- **Global Indexing Switch:** `SEO_INDEXING_ENABLED=true` enables indexing directives; defaults to `false` in development.

---

## 5. Structured Data Implementation Record

| Page Type                                 | Active Schemas                  | Deferred / Omitted Schemas                         | Implementation Details                                                                                                                                           |
| ----------------------------------------- | ------------------------------- | -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Home (`/`)                                | `WebSite`, `Organization`       | `SearchAction`                                     | Resolved in `StructuredData::createWebSiteSchema()` and `createOrganizationSchema()`.                                                                            |
| Published Blog Detail (`/blogs/{slug}`)   | `BlogPosting`, `BreadcrumbList` | None                                               | Resolved in `StructuredData::createBlogPostingSchema()` and `createBreadcrumbListSchema()`. Includes headline, image, author, publication dates.                 |
| Published Event Detail (`/events/{slug}`) | `BreadcrumbList`                | `Event`, `OnlineEvent`, `VirtualLocation`, `Offer` | `BreadcrumbList` generated matching visible UI (`Home > Events > Title`). `Event` schema explicitly deferred pending webinar rich-result eligibility validation. |

JSON-LD is rendered in the initial PHP Blade head fallback and consumed by React during hydration and Inertia navigation. The Vite SSR bundle is built and smoke-tested in development and CI but is not used as a persistent production body-rendering process.

---

## 6. Closed Findings Register (F1 – F8)

| ID     | Category        | Initial Severity | Implementation Status | Resolution Details & Evidence                                                                                                                                                                                                                                             | Operational Next Step                               |
| ------ | --------------- | ---------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| **F1** | Indexing        | P1               | **Resolved**          | Enforced `noindex, follow` on auth and registration routes via `SeoPolicy.php`. Verified in `SeoPolicyTest.php` and `SeoFallbackTest.php`.                                                                                                                                | Live header inspection after deployment.            |
| **F2** | Canonical       | P1               | **Resolved**          | Absolute self-referencing canonical URLs created via `SeoPolicy` and `SeoMetadata`, rendered in `app.blade.php` and consumed by `seo-head.tsx`. Verified in `SeoPolicyTest.php` and `SeoFallbackTest.php`.                                                                | Verify canonicals in Search Console URL Inspection. |
| **F3** | Indexing        | P2               | **Resolved**          | Private route classification determined by `SeoPolicy`; `SeoMetadata` creates `noindex, nofollow` document; rendered by Blade fallback and `seo-head.tsx`. Layouts no longer pass semantic SEO override props. Verified in `SeoPolicyTest.php` and `SeoFallbackTest.php`. | Crawl monitoring.                                   |
| **F4** | Sitemap         | P2               | **Resolved**          | Dynamic XML sitemap implemented in `Site\SitemapController`. Declared in `public/robots.txt`. Verified in `SitemapAndRobotsTest.php`.                                                                                                                                     | Submit `/sitemap.xml` in Search Console.            |
| **F5** | Structured Data | P2               | **Resolved**          | `WebSite`, `Organization`, `BlogPosting`, and `BreadcrumbList` JSON-LD rendered in initial PHP Blade head fallback and consumed by React. `Event` schema explicitly deferred. Verified in `StructuredDataTest` (Unit/Feature) and `SeoFallbackTest.php`.                  | Rich Results Test on production URLs.               |
| **F6** | Performance     | P1               | **Resolved**          | Detail hero images updated to `loading="eager"`. Listing thumbnails retain `loading="lazy"`. Verified in `event-poster-thumbnail.tsx` and `blog-post-cover-thumbnail.tsx`.                                                                                                | Field LCP measurement via PageSpeed Insights.       |
| **F7** | Metadata        | P2               | **Resolved**          | `og:url`, `og:site_name`, `og:image:alt`, `twitter:image:alt` generated in `SeoMetadata.php` and rendered via Blade and `seo-head.tsx`. Verified in `StructuredDataTest.php` and `SeoFallbackTest.php`.                                                                   | Social preview validation.                          |
| **F8** | Branding        | P1               | **Resolved**          | Brand identity set to **Gakutsu** across all title suffixes, site names, and metadata helpers. Verified in `document-title.test.ts`, `StructuredDataTest.php`, and `SeoFallbackTest.php`.                                                                                 | Search result display monitoring.                   |

---

## 7. Open Operational Production Tasks

The following tasks cannot be completed within the code repository and remain open as post-deployment operational steps:

1. Search Console domain ownership verification (`https://gakutsu.net`).
2. XML Sitemap submission (`https://gakutsu.net/sitemap.xml`).
3. Google Rich Results Test validation on live production URLs (`BlogPosting` and `BreadcrumbList`).
4. Live indexing status observation and index coverage monitoring.
5. Live production canonical URL and `robots` directive verification via URL Inspection.
