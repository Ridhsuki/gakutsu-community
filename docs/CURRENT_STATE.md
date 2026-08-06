# Current State — Gakutsu Community

**Active Phase:** P1: Member Quiz Access and Centralized Scores
**P0 Closeout Status:** P0 stabilization exit criteria have been met. Remaining factory and feature test coverage tasks have been reclassified into the technical-debt backlog and do not block the current P1 product phase.
**Current branch:** `main`
**Last updated:** 2026-08-06

---

## 1. Feature Matrix

### Authentication & User Management

| Feature                   | Status      | Evidence                                                                                                                                                                                  |
| ------------------------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Registration              | Implemented | Fortify config enables `Features::registration()`; [RegistrationTest](../tests/Feature/Auth/RegistrationTest.php) exists                                                                  |
| Login                     | Implemented | Fortify auth; [AuthenticationTest](../tests/Feature/Auth/AuthenticationTest.php) exists                                                                                                   |
| Password reset            | Implemented | Fortify `Features::resetPasswords()`; [PasswordResetTest](../tests/Feature/Auth/PasswordResetTest.php)                                                                                    |
| Email verification        | Implemented | Fortify `Features::emailVerification()`; [EmailVerificationTest](../tests/Feature/Auth/EmailVerificationTest.php)                                                                         |
| Two-factor authentication | Implemented | Fortify 2FA with confirm; [TwoFactorChallengeTest](../tests/Feature/Auth/TwoFactorChallengeTest.php); [two-factor-setup-modal.tsx](../resources/js/components/two-factor-setup-modal.tsx) |
| Password confirmation     | Implemented | [PasswordConfirmationTest](../tests/Feature/Auth/PasswordConfirmationTest.php)                                                                                                            |
| Admin user CRUD           | Implemented | [UserController](../app/Http/Controllers/Admin/UserController.php); route `admin.users.*`; [users/index.tsx](../resources/js/pages/admin/users/index.tsx)                                 |
| Profile settings          | Implemented | [ProfileController](../app/Http/Controllers/Settings/ProfileController.php); [ProfileUpdateTest](../tests/Feature/Settings/ProfileUpdateTest.php)                                         |
| Security settings         | Implemented | [SecurityController](../app/Http/Controllers/Settings/SecurityController.php); [SecurityTest](../tests/Feature/Settings/SecurityTest.php)                                                 |
| Appearance settings       | Implemented | Route `appearance.edit` renders `settings/appearance` page                                                                                                                                |

### Event Management

| Feature                               | Status                | Evidence                                                                                                                                             |
| ------------------------------------- | --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Admin event CRUD                      | Implemented           | [Admin\EventController](../app/Http/Controllers/Admin/EventController.php); routes `admin.events.*`; pages in `resources/js/pages/admin/events/`     |
| Mentor event CRUD (own events)        | Implemented           | [Mentor\EventController](../app/Http/Controllers/Mentor/EventController.php); routes `mentor.events.*`; pages in `resources/js/pages/mentor/events/` |
| Event policy (ownership enforcement)  | Implemented           | [EventPolicy](../app/Policies/EventPolicy.php) with `before()` for admin, ownership checks for mentor                                                |
| Event publish/unpublish               | Implemented           | `is_published` boolean in migration, controlled via update                                                                                           |
| Event status lifecycle                | Implemented           | `EventStatus` enum: Upcoming, Completed, Cancelled                                                                                                   |
| Event access type                     | Partially Implemented | `EventAccessType` enum (Free, Paid) exists; no payment processing                                                                                    |
| Event poster image upload             | Implemented           | `poster_image_path` field; [StoreEventAction](../app/Actions/Events/StoreEventAction.php) handles upload                                             |
| Registration question management      | Implemented           | [Admin/Mentor EventRegistrationQuestionController](../app/Http/Controllers/Admin/EventRegistrationQuestionController.php); CRUD routes exist         |
| Registration management (list/detail) | Implemented           | [Admin/Mentor EventRegistrationController](../app/Http/Controllers/Admin/EventRegistrationController.php)                                            |
| Public event listing                  | Implemented           | [Site\EventController::index](../app/Http/Controllers/Site/EventController.php); page `events/index.tsx`                                             |
| Public event detail                   | Implemented           | [Site\EventController::show](../app/Http/Controllers/Site/EventController.php); page `events/show.tsx`                                               |
| Meeting link visibility               | Implemented           | `canViewMeetingLink` prop computed in `Site\EventController::show()` — restricted to registered users and staff                                      |

### Event Registration

| Feature                                 | Status      | Evidence                                                                                                                                                                                    |
| --------------------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Member event registration               | Implemented | [EventRegistrationController::store](../app/Http/Controllers/Event/EventRegistrationController.php); [StoreEventRegistrationAction](../app/Actions/Events/StoreEventRegistrationAction.php) |
| Registration form with custom questions | Implemented | [Site\EventController::register](../app/Http/Controllers/Site/EventController.php); page `events/register.tsx`                                                                              |
| Duplicate registration prevention       | Implemented | Checked in `StoreEventRegistrationAction` and view layer                                                                                                                                    |
| Registration availability validation    | Implemented | `Event::registrationIsAvailable()` checks published, status, and deadline                                                                                                                   |

### Quiz System

| Feature                         | Status                 | Evidence                                                                                                                                                                                                                             |
| ------------------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Admin quiz question management  | Implemented            | [Admin\EventQuizQuestionController](../app/Http/Controllers/Admin/EventQuizQuestionController.php); [UpsertEventQuizQuestionAction](../app/Actions/EventQuiz/UpsertEventQuizQuestionAction.php); page `admin/events/quiz-questions/` |
| Mentor quiz question management | Implemented            | [Mentor\EventQuizQuestionController](../app/Http/Controllers/Mentor/EventQuizQuestionController.php); mirrored routes                                                                                                                |
| Admin quiz attempt listing      | Implemented            | [Admin\EventQuizAttemptController::index](../app/Http/Controllers/Admin/EventQuizAttemptController.php); page `admin/events/quiz-attempts/index.tsx`                                                                                 |
| Admin quiz attempt detail       | Implemented            | [Admin\EventQuizAttemptController::show](../app/Http/Controllers/Admin/EventQuizAttemptController.php); page `admin/events/quiz-attempts/show.tsx`                                                                                   |
| Manual grading (admin/mentor)   | Implemented            | [GradeEventQuizAttemptAction](../app/Actions/EventQuiz/GradeEventQuizAttemptAction.php); grade route `events.quiz-attempts.answers.update`                                                                                           |
| Auto-grading on submission      | Implemented (untested) | [StoreEventQuizAttemptAction](../app/Actions/EventQuiz/StoreEventQuizAttemptAction.php) — action class exists and grades MC answers; no automated test coverage                                                                      |
| Score recalculation             | Implemented (untested) | [EventQuizAttempt::refreshScores](../app/Models/EventQuizAttempt.php) — method exists; no automated test coverage                                                                                                                    |
| Quiz attempt policies           | Implemented            | [EventQuizAttemptPolicy](../app/Policies/EventQuizAttemptPolicy.php); [EventQuizQuestionPolicy](../app/Policies/EventQuizQuestionPolicy.php)                                                                                         |
| **Member quiz access**          | **Missing**            | Routes in `web.php` lines 71-81 are **commented out**; [EventQuizController](../app/Http/Controllers/Event/EventQuizController.php) methods return `abort(404)`                                                                      |
| **Member quiz submission**      | **Missing**            | No active member-facing route for quiz submission                                                                                                                                                                                    |
| **Member quiz result view**     | **Missing**            | No active member-facing route for results                                                                                                                                                                                            |
| **Member score history**        | **Missing**            | No centralized page for a member to view all their quiz scores                                                                                                                                                                       |

### Blog System

| Feature                      | Status      | Evidence                                                                                                                         |
| ---------------------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Admin blog CRUD              | Implemented | [Admin\BlogPostController](../app/Http/Controllers/Admin/BlogPostController.php); page `admin/blogs/index.tsx`                   |
| Mentor blog CRUD (own posts) | Implemented | [Mentor\BlogPostController](../app/Http/Controllers/Mentor/BlogPostController.php); page `mentor/blogs/`                         |
| Blog post policy             | Implemented | [BlogPostPolicy](../app/Policies/BlogPostPolicy.php) with admin override and mentor ownership                                    |
| Public blog listing          | Implemented | [Site\BlogController::index](../app/Http/Controllers/Site/BlogController.php); page `blogs/index.tsx`                            |
| Public blog detail           | Implemented | [Site\BlogController::show](../app/Http/Controllers/Site/BlogController.php); page `blogs/show.tsx`                              |
| Rich text editor (Tiptap)    | Implemented | Components in `resources/js/features/blogs/components/blog-post-editor.tsx`                                                      |
| Blog editor image upload     | Implemented | [BlogEditorImageController::store](../app/Http/Controllers/Blog/BlogEditorImageController.php); route `editor.blog-images.store` |

### Home Page

| Feature                           | Status      | Evidence                                                                                     |
| --------------------------------- | ----------- | -------------------------------------------------------------------------------------------- |
| Landing page with featured events | Implemented | [HomeController::index](../app/Http/Controllers/Site/HomeController.php); page `welcome.tsx` |
| Latest blog posts on home         | Implemented | `latestBlogs` prop in HomeController                                                         |
| Community stats                   | Implemented | Member/mentor/event/article counts                                                           |

---

## 2. Verification Baseline

The repository enforces strict continuous integration quality gates. All required backend and frontend checks pass:

| Check               | Command                                  | Status     | Details                                                                    |
| ------------------- | ---------------------------------------- | ---------- | -------------------------------------------------------------------------- |
| Composer Validation | `composer validate --strict`             | **Passed** | `composer.json` is strictly valid.                                         |
| Security Audit      | `composer audit --locked`                | **Passed** | 0 security vulnerability advisories found.                                 |
| PHP Code Style      | `composer lint:check`                    | **Passed** | 0 PHP Pint style issues across the codebase.                               |
| Backend Tests       | `./vendor/bin/pest --compact`            | **Passed** | All current Pest backend tests pass against the isolated testing database. |
| Frontend Unit Tests | `npm run test:unit`                      | **Passed** | All current Vitest unit tests pass.                                        |
| ESLint              | `npm run lint:check -- --max-warnings=0` | **Passed** | 0 errors, 0 warnings. Mechanical and behavioral issues resolved.           |
| TypeScript          | `npm run types:check`                    | **Passed** | 0 errors reported by `tsc --noEmit`.                                       |
| Code Formatting     | `npm run format:check`                   | **Passed** | 0 formatting issues reported by Prettier.                                  |
| Client & SSR Build  | `npm run build:ssr`                      | **Passed** | Production client and Vite SSR bundles build successfully.                 |
| SSR Smoke Check     | `node scripts/ssr-smoke-check.mjs`       | **Passed** | Server-rendered HTML rendering smoke check passes.                         |

> **Historical Note:** During initial P0 recovery (`recovery-baseline-2026-07-30`), restoring `RefreshDatabase` brought the suite to a passing state of 40 tests (136 assertions) across 152 PHP files. Subsequent P0/SEO additions expanded coverage (including public SEO head fallback, public event privacy, and home payload projection tests).

### 2.1 Quality Gates & Automated CI

The repository executes parallel GitHub Actions jobs for Frontend Quality (ESLint, TypeScript, Prettier, client build, SSR build) and Backend Quality (PHP Pint, Pest with isolated testing DB).

---

## 3. Backlog and Technical Debt Classification

P0 stabilization exit criteria have been met. Remaining factory and feature test coverage tasks have been reclassified into the technical-debt backlog and do not block the current P1 product phase.

- **P0-1 through P0-7:** Completed and verified (test infrastructure, TypeScript, ESLint mechanical/behavioral, Pint, Prettier, and auth test stabilization).
- **P0-8 (Add Missing Factories) & P0-9 (Add Core Authorization Tests):** Classified as open technical debt.
- **P0-10 (Add Core Feature Tests):** Classified as deferred test-coverage backlog.

Current test coverage includes authentication, settings, public SEO head fallback, public event privacy, and public home page payload projections. Full CRUD feature test coverage for events, blogs, and quizzes will be built alongside feature development in P1 and P2.

---

## 4. Known Issues

### 4.1 Member Quiz Flow Not Reachable

Routes for member quiz access are commented out in `routes/web.php` (lines 71–81). The `EventQuizController` methods return `abort(404)`. The `StoreEventQuizAttemptAction` class exists with auto-grading logic, but there is no active route to invoke it from the member side.

**Classification:** Missing feature (P1 priority — active phase target).

### 4.2 Mentor Middleware Does Not Allow Admin Access

`EnsureUserIsMentor` checks `$user->isMentor()` only. Admin users accessing `/mentor/*` routes receive 403. Admin users manage resources via dedicated `/admin/*` routes.

**Classification:** Intentional design. Not a bug.

### 4.3 No Dedicated `EventRegistrationPolicy`

Authorization for registration questions and registration views is handled via `EventPolicy::manageRegistrationQuestions` and controller checks.

**Classification:** Non-blocking design pattern observation.

### 4.4 Package Name in `composer.json`

`composer.json` uses `"name": "laravel/react-starter-kit"`.

**Classification:** Open-source readiness metadata item.

---

## 5. UI Consistency Observations

- **Primitives:** Consistent use of shadcn/ui components (`resources/js/components/ui/`).
- **Tables:** Shared data table components used for list pages (`components/data-table/`).
- **Layouts:** Explicit layout separation (`app-layout`, `auth-layout`, `public-layout`).
- **Feedback:** Flash toaster integration via `Sonner` and `FlashToasterListener`.
- **Dark Mode:** Enforced across all views via `HandleAppearance` middleware and `use-appearance` hook.

---

## 6. Technical Risks and Mitigations

| Risk                         | Severity       | Mitigation / Status                                                        |
| ---------------------------- | -------------- | -------------------------------------------------------------------------- |
| Test infrastructure          | Resolved       | `RefreshDatabase` active; baseline test suite passes.                      |
| Feature test coverage        | Open Tech Debt | P0-8/9/10 reclassified to backlog; core privacy and payload tests added.   |
| Member quiz flow unreachable | Medium         | Scheduled for P1-1 implementation.                                         |
| Code quality gates           | Resolved       | ESLint, TypeScript, Prettier, and Pint report 0 issues.                    |
| SSR hydration risk           | Mitigated      | Browser-dependent APIs isolated; local/CI SSR build and smoke checks pass. |

---

## 7. SEO Architecture and Implementation Status

### 7.1 Semantic Ownership

PHP owns semantic SEO across the application:

- `app/Support/SeoPolicy.php` determines indexability, `robots` directives, and canonical URLs.
- `app/Support/SeoMetadata.php` generates the complete normalized SEO metadata payload.
- `app/Support/StructuredData.php` generates valid JSON-LD objects.
- Public controllers (`Site\HomeController`, `Site\EventController`, `Site\BlogController`) pass factual page inputs to `SeoMetadata`.
- `resources/views/app.blade.php` renders initial SEO `<head>` tags (`<title>`, `<meta>`, canonical, JSON-LD) server-side via Blade fallback.
- `resources/js/components/public/seo-head.tsx` consumes the normalized metadata during client-side Inertia page navigation and hydration. React does not generate SEO semantics independently.

### 7.2 Structured Data Matrix

| Page                                      | Implemented Schemas             | Explicitly Deferred / Omitted                      |
| ----------------------------------------- | ------------------------------- | -------------------------------------------------- |
| Home (`/`)                                | `WebSite`, `Organization`       | `SearchAction`                                     |
| Published Blog Detail (`/blogs/{slug}`)   | `BlogPosting`, `BreadcrumbList` | None                                               |
| Published Event Detail (`/events/{slug}`) | `BreadcrumbList`                | `Event`, `OnlineEvent`, `VirtualLocation`, `Offer` |
| Public Event Listing (`/events`)          | None                            | `CollectionPage`                                   |
| Public Blog Listing (`/blogs`)            | None                            | `CollectionPage`                                   |

_Note:_ `Event` schema remains explicitly deferred pending verification of Google rich-result eligibility for virtual webinars.

### 7.3 Indexing Policy Matrix

- **Approved clean public pages** (`/`, `/events`, `/blogs`, `/events/{slug}`, `/blogs/{slug}`): `index, follow` with absolute self-referencing canonical tag.
- **Search, filter, sort, and non-clean public query states:** `noindex, follow` without canonical tags where applicable.
- **Authentication and utility routes** (`/login`, `/register`, `/forgot-password`, `/reset-password`): `noindex, follow`.
- **Private, admin, mentor, and settings routes** (`/admin/*`, `/mentor/*`, `/settings/*`, `/dashboard`): `noindex, nofollow`.
- **Event registration forms** (`/events/{slug}/register`): `noindex` and no structured data.

Search indexing is controlled globally by `SEO_INDEXING_ENABLED` in `.env` (defaults to `false` when disabled, `true` in production environment config).

---

## 8. Production Rendering Architecture

- **Hosting Constraint:** Production hosting does not run a persistent Node.js SSR process.
- **Environment Config:** `INERTIA_SSR_ENABLED=false` in production environment configuration. (`.env.example` retains `INERTIA_SSR_ENABLED=true` for local development).
- **Initial SEO Head:** Rendered server-side by PHP in `resources/views/app.blade.php` on initial page requests.
- **Page Body:** Production page body is client-side rendered (CSR) by React upon loading Inertia props. This is not full production body SSR.
- **CI & Local Quality Assurance:** Vite client and SSR builds (`npm run build:ssr`) and SSR smoke checks (`node scripts/ssr-smoke-check.mjs`) remain required in development and CI to enforce hydration safety and build integrity.

---

## 9. Privacy and Public Payload Hardening

Public page payloads (Inertia props serialized for public visitors) are strictly hardened against data leakage:

- **Meeting URL Boundary:** Unauthorized guests do not receive private meeting URLs (`meeting_url`). The `meetingUrl` prop is only provided to authorized registered members and staff on event detail views (`Site\EventController::show`).
- **Raw Field Protection:** Raw `meeting_url` database fields are excluded from public page payloads. Structured data does not serialize meeting details.
- **Home Page Projections:** `Site\HomeController::index` uses explicit data projections rather than serializing full Eloquent model instances.
- **Content Scoping:** Full blog content is omitted from home page cards; only multibyte-safe truncated excerpts are returned.
- **Internal Field Omission:** Numeric primary IDs, foreign key relationship IDs, raw internal storage paths, and meeting provider metadata are omitted from public home page Inertia payloads. Public poster/cover URLs and author/mentor display names remain available.

---

## 10. Operational SEO Work Remaining

The following tasks are operational production steps and remain open pending deployment to live infrastructure:

- Search Console domain owner verification.
- Live XML sitemap submission (`/sitemap.xml`).
- Live search engine indexing observation.
- Google Rich Results Test verification on live URLs (`BlogPosting` and `BreadcrumbList`).
- Live production canonical URL and `robots` header validation.
- Search Console crawl error monitoring.
