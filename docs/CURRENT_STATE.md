# Current State — Gakutsu Community

**Recovery baseline:** `db94b40`
**Baseline tag:** `recovery-baseline-2026-07-30`
**Current branch:** `main`
**Last updated:** 2026-08-01

---

## 1. Feature Matrix

### Authentication & User Management

| Feature                     | Status      | Evidence |
| --------------------------- | ----------- | -------- |
| Registration                | Implemented | Fortify config enables `Features::registration()`; [RegistrationTest](../tests/Feature/Auth/RegistrationTest.php) exists |
| Login                       | Implemented | Fortify auth; [AuthenticationTest](../tests/Feature/Auth/AuthenticationTest.php) exists |
| Password reset              | Implemented | Fortify `Features::resetPasswords()`; [PasswordResetTest](../tests/Feature/Auth/PasswordResetTest.php) |
| Email verification          | Implemented | Fortify `Features::emailVerification()`; [EmailVerificationTest](../tests/Feature/Auth/EmailVerificationTest.php) |
| Two-factor authentication   | Implemented | Fortify 2FA with confirm; [TwoFactorChallengeTest](../tests/Feature/Auth/TwoFactorChallengeTest.php); [two-factor-setup-modal.tsx](../resources/js/components/two-factor-setup-modal.tsx) |
| Password confirmation       | Implemented | [PasswordConfirmationTest](../tests/Feature/Auth/PasswordConfirmationTest.php) |
| Admin user CRUD             | Implemented | [UserController](../app/Http/Controllers/Admin/UserController.php); route `admin.users.*`; [users/index.tsx](../resources/js/pages/admin/users/index.tsx) |
| Profile settings            | Implemented | [ProfileController](../app/Http/Controllers/Settings/ProfileController.php); [ProfileUpdateTest](../tests/Feature/Settings/ProfileUpdateTest.php) |
| Security settings           | Implemented | [SecurityController](../app/Http/Controllers/Settings/SecurityController.php); [SecurityTest](../tests/Feature/Settings/SecurityTest.php) |
| Appearance settings         | Implemented | Route `appearance.edit` renders `settings/appearance` page |

### Event Management

| Feature                                | Status      | Evidence |
| -------------------------------------- | ----------- | -------- |
| Admin event CRUD                       | Implemented | [Admin\EventController](../app/Http/Controllers/Admin/EventController.php); routes `admin.events.*`; pages in `resources/js/pages/admin/events/` |
| Mentor event CRUD (own events)         | Implemented | [Mentor\EventController](../app/Http/Controllers/Mentor/EventController.php); routes `mentor.events.*`; pages in `resources/js/pages/mentor/events/` |
| Event policy (ownership enforcement)   | Implemented | [EventPolicy](../app/Policies/EventPolicy.php) with `before()` for admin, ownership checks for mentor |
| Event publish/unpublish                | Implemented | `is_published` boolean in migration, controlled via update |
| Event status lifecycle                 | Implemented | `EventStatus` enum: Upcoming, Completed, Cancelled |
| Event access type                      | Partially Implemented | `EventAccessType` enum (Free, Paid) exists; no payment processing |
| Event poster image upload              | Implemented | `poster_image_path` field; [StoreEventAction](../app/Actions/Events/StoreEventAction.php) handles upload |
| Registration question management       | Implemented | [Admin/Mentor EventRegistrationQuestionController](../app/Http/Controllers/Admin/EventRegistrationQuestionController.php); CRUD routes exist |
| Registration management (list/detail)  | Implemented | [Admin/Mentor EventRegistrationController](../app/Http/Controllers/Admin/EventRegistrationController.php) |
| Public event listing                   | Implemented | [Site\EventController::index](../app/Http/Controllers/Site/EventController.php); page `events/index.tsx` |
| Public event detail                    | Implemented | [Site\EventController::show](../app/Http/Controllers/Site/EventController.php); page `events/show.tsx` |
| Meeting link visibility                | Implemented | `canViewMeetingLink` prop computed in `Site\EventController::show()` — restricted to registered users and staff |

### Event Registration

| Feature                                | Status      | Evidence |
| -------------------------------------- | ----------- | -------- |
| Member event registration              | Implemented | [EventRegistrationController::store](../app/Http/Controllers/Event/EventRegistrationController.php); [StoreEventRegistrationAction](../app/Actions/Events/StoreEventRegistrationAction.php) |
| Registration form with custom questions | Implemented | [Site\EventController::register](../app/Http/Controllers/Site/EventController.php); page `events/register.tsx` |
| Duplicate registration prevention      | Implemented | Checked in `StoreEventRegistrationAction` and view layer |
| Registration availability validation   | Implemented | `Event::registrationIsAvailable()` checks published, status, and deadline |

### Quiz System

| Feature                                | Status      | Evidence |
| -------------------------------------- | ----------- | -------- |
| Admin quiz question management         | Implemented | [Admin\EventQuizQuestionController](../app/Http/Controllers/Admin/EventQuizQuestionController.php); [UpsertEventQuizQuestionAction](../app/Actions/EventQuiz/UpsertEventQuizQuestionAction.php); page `admin/events/quiz-questions/` |
| Mentor quiz question management        | Implemented | [Mentor\EventQuizQuestionController](../app/Http/Controllers/Mentor/EventQuizQuestionController.php); mirrored routes |
| Admin quiz attempt listing             | Implemented | [Admin\EventQuizAttemptController::index](../app/Http/Controllers/Admin/EventQuizAttemptController.php); page `admin/events/quiz-attempts/index.tsx` |
| Admin quiz attempt detail              | Implemented | [Admin\EventQuizAttemptController::show](../app/Http/Controllers/Admin/EventQuizAttemptController.php); page `admin/events/quiz-attempts/show.tsx` |
| Manual grading (admin/mentor)          | Implemented | [GradeEventQuizAttemptAction](../app/Actions/EventQuiz/GradeEventQuizAttemptAction.php); grade route `events.quiz-attempts.answers.update` |
| Auto-grading on submission             | Implemented (untested) | [StoreEventQuizAttemptAction](../app/Actions/EventQuiz/StoreEventQuizAttemptAction.php) — action class exists and grades MC answers; no automated test coverage |
| Score recalculation                    | Implemented (untested) | [EventQuizAttempt::refreshScores](../app/Models/EventQuizAttempt.php) — method exists; no automated test coverage |
| Quiz attempt policies                  | Implemented | [EventQuizAttemptPolicy](../app/Policies/EventQuizAttemptPolicy.php); [EventQuizQuestionPolicy](../app/Policies/EventQuizQuestionPolicy.php) |
| **Member quiz access**                 | **Missing** | Routes in `web.php` lines 71-81 are **commented out**; [EventQuizController](../app/Http/Controllers/Event/EventQuizController.php) methods return `abort(404)` |
| **Member quiz submission**             | **Missing** | No active member-facing route for quiz submission |
| **Member quiz result view**            | **Missing** | No active member-facing route for results |
| **Member score history**               | **Missing** | No centralized page for a member to view all their quiz scores |

### Blog System

| Feature                                | Status      | Evidence |
| -------------------------------------- | ----------- | -------- |
| Admin blog CRUD                        | Implemented | [Admin\BlogPostController](../app/Http/Controllers/Admin/BlogPostController.php); page `admin/blogs/index.tsx` |
| Mentor blog CRUD (own posts)           | Implemented | [Mentor\BlogPostController](../app/Http/Controllers/Mentor/BlogPostController.php); page `mentor/blogs/` |
| Blog post policy                       | Implemented | [BlogPostPolicy](../app/Policies/BlogPostPolicy.php) with admin override and mentor ownership |
| Public blog listing                    | Implemented | [Site\BlogController::index](../app/Http/Controllers/Site/BlogController.php); page `blogs/index.tsx` |
| Public blog detail                     | Implemented | [Site\BlogController::show](../app/Http/Controllers/Site/BlogController.php); page `blogs/show.tsx` |
| Rich text editor (Tiptap)              | Implemented | Components in `resources/js/features/blogs/components/blog-post-editor.tsx` |
| Blog editor image upload               | Implemented | [BlogEditorImageController::store](../app/Http/Controllers/Blog/BlogEditorImageController.php); route `editor.blog-images.store` |

### Home Page

| Feature                                | Status      | Evidence |
| -------------------------------------- | ----------- | -------- |
| Landing page with featured events      | Implemented | [HomeController::index](../app/Http/Controllers/Site/HomeController.php); page `welcome.tsx` |
| Latest blog posts on home              | Implemented | `latestBlogs` prop in HomeController |
| Community stats                        | Implemented | Member/mentor/event/article counts |

---

## 2. Verification Baseline

Source: `storage/logs/recovery/SUMMARY.md` and individual log files. These files are local and are not tracked by Git.

| Check          | Command                | Status   | Details                                      |
| -------------- | ---------------------- | -------- | -------------------------------------------- |
| ESLint         | `npm run lint:check`   | **Passed** | 0 errors, 0 warnings. Mechanical issues resolved in P0-3; behavioral issues resolved in P0-4. |
| Prettier       | `npm run format:check` | **Passed** | 0 formatting issues. Resolved in P0-6.       |
| TypeScript     | `npm run types:check`  | **Passed** | 0 errors. Baseline TypeScript errors resolved in P0-2. |
| PHP Pint       | `composer lint:check`  | **Passed** | 0 style issues. Baseline Pint issues resolved in P0-5. |
| Backend tests | `./vendor/bin/pest --compact` | **Passed** | 40 tests passed, 136 assertions. RefreshDatabase runs against the isolated MySQL testing database. |
| Frontend build | `npm run build`        | **Passed** | Production client build successful          |
| SSR build      | `npm run build:ssr`    | **Passed** | Client + SSR build successful               |
| GitHub Actions | `.github/workflows/quality.yml` | **Passed** | Frontend and backend quality gates pass on pull requests and main |

### 2.1 ESLint Classification

**Mechanical issues resolved in P0-3:**
- `import/order` — incorrect import ordering (~50+ instances resolved)
- `curly` — missing braces around `if` statements (~30+ instances resolved)
- `@stylistic/padding-line-between-statements` — missing blank lines (~25+ instances resolved)
- `import/consistent-type-specifier-style` — inline vs top-level type imports (~5 instances resolved)
- `@typescript-eslint/no-unused-vars` — unused variables (`Head`, `event`, `isLoggedIn`, `usePage`) (6 instances resolved)
- `@typescript-eslint/no-empty-object-type` — empty interfaces in `features/events/types.ts` (2 instances resolved via type aliases)

**Behavioral issues resolved in P0-4:**
- `react-hooks/set-state-in-effect` — setState inside useEffect (5 files, 5 errors) resolved.
- `react-hooks/exhaustive-deps` — incomplete effect dependency arrays (2 files, 2 warnings) resolved.

### 2.2 TypeScript Errors

**Status:** Resolved. `npm run types:check` reports 0 errors.

| File | Error | Resolution |
| ---- | ----- | ----------- |
| `features/events/pages/event-detail-page.tsx:177` | TS2322 | Fixed prop usage to pass `src`, `alt`, and `className` to `EventPosterThumbnail` |
| `features/events/pages/event-registration-question-management-page.tsx:17` | TS2314 | Provided `EventRegistrationQuestionItem` generic parameter to `PaginatedResponse` |
| `features/events/pages/event-registrations-page.tsx:12` | TS2314 | Provided `EventRegistrationItem` generic parameter to `PaginatedResponse` |
| `pages/admin/events/questions/index.tsx:7` | TS2314 | Provided `EventRegistrationQuestionItem` generic parameter to `PaginatedResponse` |
| `pages/admin/events/registrations/index.tsx:7` | TS2314 | Provided `EventRegistrationItem` generic parameter to `PaginatedResponse` |
| `pages/mentor/events/questions/index.tsx:7` | TS2314 | Provided `EventRegistrationQuestionItem` generic parameter to `PaginatedResponse` |
| `pages/mentor/events/registrations/index.tsx:7` | TS2314 | Provided `EventRegistrationItem` generic parameter to `PaginatedResponse` |

### 2.3 PHP Pint Summary

**Status:** Resolved. `composer lint:check` reports 0 issues across 152 files.

67 baseline style issues across 59 files were fixed automatically via Pint:

- `single_line_empty_body` — empty constructor/method bodies
- `function_declaration` — function formatting
- `braces_position` — brace placement in migrations
- `fully_qualified_strict_types` — strict type formatting
- `ordered_imports` — import ordering
- `not_operator_with_successor_space` — `!` spacing
- `single_blank_line_at_eof` — missing trailing newlines in test files
- Other: `nullable_type_declaration`, `concat_space`, `class_attributes_separation`, `no_unused_imports`, `new_with_parentheses`, `trailing_comma_in_multiline`, `single_quote`

### 2.4 Test Infrastructure Finding

**Status:** Resolved. The `RefreshDatabase` trait was restored, and all tests were successfully run against a MySQL testing database. All 40 tests now pass.

### 2.5 Build Status

- **Client build:** Passes. Vite successfully bundles the application.
- **SSR build:** Passes. Both client and server bundles produced.
- **Warning:** A successful Vite build does not validate TypeScript, ESLint, test correctness, or runtime behavior.

### 2.6 Automated Quality Gates

The repository now runs two parallel GitHub Actions jobs:

- Frontend Quality: ESLint, TypeScript, Prettier, client build, and SSR build.
- Backend Quality: PHP Pint and Pest using an isolated MySQL testing database.

Wayfinder definitions are generated explicitly with form variants before
frontend static analysis. Backend tests disable Vite manifest resolution
through the shared test base class.

Remote baseline:

- Frontend Quality: Passed
- Backend Quality: Passed
- Pest: 40 tests, 136 assertions

---

## 3. Missing Tests

No tests exist for:

- Event CRUD (admin or mentor)
- Event registration flow
- Event authorization / ownership
- Quiz question management
- Quiz submission / auto-grading
- Manual grading
- Blog CRUD (admin or mentor)
- Blog authorization / ownership
- Registration question management
- Middleware (EnsureUserIsAdmin, EnsureUserIsMentor)
- Public page rendering (home, events, blogs)

All existing tests cover authentication and settings only.

---

## 4. Known Issues

### 4.1 Member Quiz Flow Not Reachable

Routes for member quiz access are commented out in [../routes/web.php](../routes/web.php) (lines 71–81). The [EventQuizController](../app/Http/Controllers/Event/EventQuizController.php) methods all return `abort(404)`. The `StoreEventQuizAttemptAction` class exists with auto-grading logic, but the logic has no automated test coverage and there is no active route to invoke it from the member side.

**Classification:** Missing feature (P1 priority).

### 4.2 Mentor Middleware Does Not Allow Admin Access

[EnsureUserIsMentor](../app/Http/Middleware/EnsureUserIsMentor.php) checks `!$user->isMentor()` only. Admin users accessing `/mentor/*` routes will get 403. This is partially mitigated by admin having separate `/admin/*` routes, but it means admin cannot view the mentor-facing interface.

Compare with [EnsureUserIsAdmin](../app/Http/Middleware/EnsureUserIsAdmin.php) which also only checks for the admin role.

**Classification:** Intentional design (admin and mentor have separate route groups). Not a bug.

### 4.3 No `EventRegistrationPolicy` exists

The registration controllers check authorization in some cases but there is no dedicated `EventRegistrationPolicy` class. Registration question controllers also lack a centralized registration question policy — authorization is handled by the `EventPolicy::manageRegistrationQuestions` method.

**Status:** Suspected gap; requires runtime verification of the specific authorization paths.

**Classification:** Potential authorization gap. Should be verified and documented.

### 4.4 HomeController Uses Inline FQN

[HomeController](../app/Http/Controllers/Site/HomeController.php) uses `\App\Enums\UserRole::Member` inline. This passes the current Pint configuration but is a minor code-consistency opportunity, not a functional defect.

### 4.5 composer.json Package Name Is Generic

`composer.json` uses `"name": "laravel/react-starter-kit"` instead of a project-specific name.

---

## 5. Stale Branding

The repository has been renamed to `Ridhsuki/gakutsu-community`.

The Composer package name remains `laravel/react-starter-kit` and should be
renamed separately when production identity is finalized.

---

## 6. UI Consistency Observations

### Strengths
- Consistent use of shadcn/ui primitives (32 components in `resources/js/components/ui/`)
- Shared data table components (`data-table/`, `pagination-bar`, `sortable-header`, `index-toolbar`, `empty-state-row`)
- Feature-based frontend organization (`features/blogs/`, `features/events/`, `features/quizzes/`, `features/users/`)
- Three layout types (app, auth, public) with flash toaster integration
- Dark mode via `HandleAppearance` middleware and `use-appearance` hook

### Items Requiring Verification
- Public pages (`welcome.tsx`, `events/`, `blogs/`) use different layout than admin/mentor pages — this appears intentional (public vs. sidebar layout)
- No loading skeleton patterns observed in admin list pages (data tables)
- Empty state component exists (`ui/empty-state.tsx`) but usage consistency across features not fully verified
- No offline or error boundary patterns observed

---

## 7. Technical Risks

| Risk | Severity | Notes |
| ---- | -------- | ----- |
| Test infrastructure broken | Resolved | `RefreshDatabase` restored; tests run on MySQL testing DB |
| No business-feature tests | High | Zero tests for events, registration, quizzes, blogs, authorization |
| Member quiz flow not wired | Medium | Backend logic exists but routes are commented out |
| 5 ESLint errors, 2 warnings | Resolved | All behavioral findings resolved in P0-4. `npm run lint:check` passes with 0 issues |
| 7 TypeScript errors | Resolved | `npm run types:check` passes with 0 errors |
| 67 Pint style issues | Resolved | `composer lint:check` passes with 0 issues |
| Prettier style issues | Resolved | `npm run format:check` passes with 0 issues |
| SSR hydration risk | Mitigated | Known browser-dependent lint patterns removed; SSR build passes; manual browser hydration smoke testing pending |
| No production database yet | Info | Development migration policy applies; migrations mutable |

---

## 8. SEO Status

- Repository SEO audit completed (see `docs/SEO_AUDIT.md`).
- Indexability metadata implementation completed locally (Phase 1).
- Brand set to Gakutsu for SEO metadata.
- Phase 2 detail-image optimization completed: hero images on event and blog detail pages use `loading="eager"`, while listing images remain `loading="lazy"`.
- Browser runtime regression resolved.
- Phase 3 sitemap and environment-aware robots implementation completed locally.
- Public rich-text detail SSR verified: Node SSR rendering for blog and event detail pages is fully functional using `isomorphic-dompurify`, resolving the SSR crash.
- Private `meeting_url` removed from unauthorized public page payloads (`HomeController`, `Site\EventController`, and `Event::indexColumns()`).
- Actual meeting-link authorization behavior preserved (`meetingUrl` top-level prop accessible only to authorized registered members and staff).
- Phase 4A structured-data foundation completed locally:
  - `WebSite` and `Organization` structured data implemented on Home (`/`);
  - `BlogPosting` structured data implemented on published public Blog Detail pages (`/blogs/{slug}`);
  - `Event` schema deferred pending a physical venue/location data model and product decision;
  - `BreadcrumbList` schema deferred because matching visible breadcrumb navigation UI is not implemented;
  - Structured data gated on `SEO_INDEXING_ENABLED=true`, `robots: index, follow`, and valid canonical URL;
  - Single script tag per page with safe JSON serialization escaping HTML-sensitive characters (`<`, `>`, `&`, `\u2028`, `\u2029`, `</script`).
- Frontend structured-data unit-test baseline completed:
  - Serialization, image URL normalization, date logic, and schema identity consistency are now covered with automated Vitest unit tests.
- Search indexing remains disabled by default unless `SEO_INDEXING_ENABLED=true`.
- Production post-deployment validation pending:
  - `BlogPosting`: Google Rich Results Test plus URL Inspection;
  - `WebSite` site name: Schema Markup Validator plus URL Inspection (site name markup not supported by Rich Results Test);
  - `Organization`: Schema Markup Validator and Search Console validation;
  - Production deployment, live sitemap validation, and Search Console submission remain pending.
- Measured production Core Web Vitals remain pending.


---

## 9. Unknowns Requiring Runtime Verification

- Whether poster image upload and processing works end-to-end (Intervention Image integration)
- Whether the rich text editor image upload pipeline functions correctly
- SSR rendering of public pages (build passes, but runtime behavior unverified)
- Meeting URL sanitization and XSS protection in the event detail view
- Whether the `EventSeeder` and `DatabaseSeeder` function correctly with the current schema
