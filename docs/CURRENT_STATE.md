# Current State — Gakutsu Community

**Baseline commit:** `db94b40`
**Branch:** `chore/project-recovery`
**Tag:** `recovery-baseline-2026-07-30`
**Audit date:** 2026-07-30
**Total commits:** 60

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
| ESLint         | `npm run lint:check`   | **Failed** | 179 errors, 2 warnings across ~45 files    |
| Prettier       | `npm run format:check` | **Failed** | 92 files with formatting issues             |
| TypeScript     | `npm run types:check`  | **Failed** | 7 errors                                    |
| PHP Pint       | `composer lint:check`  | **Failed** | 67 style issues across 152 checked files    |
| Backend tests  | `php artisan test`     | **Failed** | 33 failed, 7 passed                        |
| Frontend build | `npm run build`        | **Passed** | Production client build successful          |
| SSR build      | `npm run build:ssr`    | **Passed** | Client + SSR build successful               |

### 2.1 ESLint Classification

Source: `storage/logs/recovery/01-eslint.log` (local, not tracked by Git)

**Mechanical issues (auto-fixable, ~166 reported):**
- `import/order` — incorrect import ordering (~50+ instances)
- `curly` — missing braces around `if` statements (~30+ instances)
- `@stylistic/padding-line-between-statements` — missing blank lines (~25+ instances)
- `import/consistent-type-specifier-style` — inline vs top-level type imports (~5 instances)
- `@typescript-eslint/no-unused-vars` — unused variables (`Head`, `event`) (~3 instances)
- `@typescript-eslint/no-empty-object-type` — empty interfaces in `features/events/types.ts` (2 instances)

**Behavioral issues requiring manual review:**
- `react-hooks/set-state-in-effect` — setState inside useEffect (4 files):
  - `components/forms/date-time-picker-field.tsx:87` — `setDisplayMonth` in effect
  - `components/public/reveal.tsx:43` — `setIsVisible` in effect (prefers-reduced-motion)
  - `features/blogs/components/blog-editor-link-dialog.tsx:29` — `setUrl` sync from prop
  - `features/blogs/components/blog-post-cover-input.tsx:24` — `setPreviewUrl` from prop
- `react-hooks/exhaustive-deps` — incomplete effect dependency arrays (2 files):
  - `features/events/hooks/use-event-index-filters.ts:113`
  - `hooks/use-index-filters.ts:75`

> **Risk:** The `set-state-in-effect` instances in `reveal.tsx` and `date-time-picker-field.tsx` may cause hydration mismatches with SSR if they depend on browser-only state (`window`, `matchMedia`). The prop-syncing patterns in blog components may cause unnecessary re-renders but are unlikely to be hydration issues.

### 2.2 TypeScript Errors

Source: `storage/logs/recovery/03-typescript.log` (local, not tracked by Git)

| File | Error | Description |
| ---- | ----- | ----------- |
| `features/events/pages/event-detail-page.tsx:177` | TS2322 | `EventPosterThumbnailProps` does not accept `event` prop (expects different shape) |
| `features/events/pages/event-registration-question-management-page.tsx:17` | TS2314 | `PaginatedResponse<T>` requires 1 type argument |
| `features/events/pages/event-registrations-page.tsx:12` | TS2314 | `PaginatedResponse<T>` requires 1 type argument |
| `pages/admin/events/questions/index.tsx:7` | TS2314 | `PaginatedResponse<T>` requires 1 type argument |
| `pages/admin/events/registrations/index.tsx:7` | TS2314 | `PaginatedResponse<T>` requires 1 type argument |
| `pages/mentor/events/questions/index.tsx:7` | TS2314 | `PaginatedResponse<T>` requires 1 type argument |
| `pages/mentor/events/registrations/index.tsx:7` | TS2314 | `PaginatedResponse<T>` requires 1 type argument |

**Classification:** 6 of 7 errors are missing generic type arguments on `PaginatedResponse` — a straightforward fix. 1 error is a prop type mismatch on `EventPosterThumbnail`.

### 2.3 PHP Pint Summary

Source: `storage/logs/recovery/04-pint.log` (local, not tracked by Git)

67 style issues across 152 files. All are code-style (not behavioral):

- `single_line_empty_body` — empty constructor/method bodies (7 files)
- `function_declaration` — function formatting (12 files)
- `braces_position` — brace placement in migrations (6 files)
- `fully_qualified_strict_types` — strict type formatting (10 files)
- `ordered_imports` — import ordering (8 files)
- `not_operator_with_successor_space` — `!` spacing (5 files)
- `single_blank_line_at_eof` — missing trailing newlines (12 test files)
- Other: `nullable_type_declaration`, `concat_space`, `class_attributes_separation`, `no_unused_imports`, `new_with_parentheses`, `trailing_comma_in_multiline`, `single_quote`

### 2.4 Test Infrastructure Finding

**Suspected primary cause:** `RefreshDatabase` trait is **commented out** in [../tests/Pest.php:18](../tests/Pest.php):

```php
pest()->extend(TestCase::class)
 // ->use(RefreshDatabase::class)
    ->in('Feature');
```

Most of the 33 failing tests show the error:
```
SQLSTATE[HY000]: General error: 1 no such table: users
```

This is consistent with the SQLite in-memory schema never being created. The missing `RefreshDatabase` trait is the **suspected primary cause** of these database-related failures, but this is a hypothesis. The full test suite must be re-run after restoring the trait and each remaining failure must be evaluated individually.

**Separate failure (not a database-table error):** `RegistrationTest > new users can register` fails with `assertAuthenticated()` returning false. This is an authentication assertion failure, unrelated to missing tables. Its root cause is unknown and must be investigated independently after the database infrastructure is restored.

**7 passing tests:** Tests that do not require database operations (rendering login/register pages, unauthenticated redirects, Fortify feature checks).

### 2.5 Build Status

- **Client build:** Passes. Vite successfully bundles the application.
- **SSR build:** Passes. Both client and server bundles produced.
- **Warning:** A successful Vite build does not validate TypeScript, ESLint, test correctness, or runtime behavior.

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

[HomeController](../app/Http/Controllers/Site/HomeController.php) uses `\App\Enums\UserRole::Member` inline instead of importing the class. This is a Pint style issue, not a bug.

### 4.5 composer.json Package Name Is Generic

`composer.json` uses `"name": "laravel/react-starter-kit"` instead of a project-specific name.

---

## 5. Stale Branding

The repository GitHub name is `Ridhsuki/yokpelajarin`. The `composer.json` name is `laravel/react-starter-kit`. Neither reflects the current "Gakutsu" branding.

No remaining code references to "YokPelajarin" were found in application source files beyond the repository name.

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
| Test infrastructure broken | High | `RefreshDatabase` commented out; no tests can validate database operations |
| No business-feature tests | High | Zero tests for events, registration, quizzes, blogs, authorization |
| Member quiz flow not wired | Medium | Backend logic exists but routes are commented out |
| 179 ESLint errors | Medium | Mostly auto-fixable but 6 behavioral issues need manual review |
| 7 TypeScript errors | Low | Straightforward fixes (missing generics, prop mismatch) |
| 67 Pint style issues | Low | All mechanical, auto-fixable |
| SSR hydration risk | Medium | `set-state-in-effect` patterns with browser-only APIs could cause hydration mismatches |
| No production database yet | Info | Development migration policy applies; migrations mutable |

---

## 8. Unknowns Requiring Runtime Verification

- Whether the Fortify registration flow correctly logs in the user after registration (test failure at `assertAuthenticated`)
- Whether poster image upload and processing works end-to-end (Intervention Image integration)
- Whether the rich text editor image upload pipeline functions correctly
- SSR rendering of public pages (build passes, but runtime behavior unverified)
- Meeting URL sanitization and XSS protection in the event detail view
- Whether the `EventSeeder` and `DatabaseSeeder` function correctly with the current schema
