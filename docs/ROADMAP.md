# Roadmap — Gakutsu Community

---

## P0: Project Recovery and Stabilization (Completed Exit Criteria)

**Goal:** Establish a reliable development baseline before building new features.

**Closeout Status:** P0 stabilization exit criteria have been met. Remaining factory and feature test coverage tasks have been reclassified into the technical-debt backlog and do not block the current P1 product phase.

### Historical Completed Baseline (P0-1 through P0-7)

- **P0-1: Restore Test Infrastructure** — `RefreshDatabase` trait restored; baseline test suite passes against an isolated MySQL testing database.
- **P0-2: Fix TypeScript Errors** — Generic arguments provided for `PaginatedResponse` and prop types fixed; `npm run types:check` passes with 0 errors.
- **P0-3: Fix Mechanical ESLint Issues** — Imports, braces, and blank lines fixed across all files.
- **P0-4: Review Behavioral ESLint Issues** — `react-hooks/set-state-in-effect` and `exhaustive-deps` reviewed and fixed; `npm run lint:check` passes with 0 errors/warnings.
- **P0-5: Fix PHP Pint Style Issues** — Code style auto-fixed; `composer lint:check` passes with 0 issues across all PHP files.
- **P0-6: Fix Prettier Formatting** — Code formatting checked and aligned; `npm run format:check` passes with 0 issues.
- **P0-7: Investigate Registration Test Failure** — Auth assertion failure resolved; baseline authentication test suite is stable.

---

## Open Technical Debt & Backlog Tracks (Non-Blocking for P1)

### Technical Debt Track

- **P0-8: Add Missing Factories**
    - **Reason:** Model factories for `EventRegistration`, `EventRegistrationQuestion`, `EventQuizQuestion`, `EventQuizOption`, `EventQuizAttempt`, and `EventQuizAnswer` do not exist yet.
    - **Status:** Open technical debt. To be added incrementally alongside P1 and P2 feature tests.
- **P0-9: Add Core Authorization Tests**
    - **Reason:** Explicit Pest feature tests for role policy enforcement across all route groups.
    - **Status:** Open technical debt.

### Test Coverage Backlog Track

- **P0-10: Add Core Feature Tests**
    - **Reason:** Comprehensive CRUD integration tests for events, blogs, and quizzes.
    - **Status:** Deferred test-coverage backlog. Core public SEO head fallback, public event privacy, and home payload projection tests have been added; remaining CRUD tests will be built alongside P1 feature work.

### Operational SEO Track (Post-Deployment)

- **SEO-OP-1: Search Console Domain Ownership Verification**
    - **Status:** Operational task (pending live production deployment).
- **SEO-OP-2: Live XML Sitemap Submission**
    - **Status:** Operational task (`/sitemap.xml` submission in Search Console).
- **SEO-OP-3: Rich Results & Canonical Inspection**
    - **Status:** Operational task (Google Rich Results Test on live URLs for `BlogPosting` and `BreadcrumbList`).
- **SEO-OP-4: Live Indexing & Crawl Observation**
    - **Status:** Operational task.

### Deferred SEO Features

- **SEO-DEF-1: Event JSON-LD Schema**
    - **Reason:** Google rich-result eligibility for virtual/online webinars requires ongoing verification against Search Central guidelines.
    - **Status:** Explicitly deferred. `BreadcrumbList` is active on event detail views; `Event` schema is omitted.

---

## P1: Member Quiz Access and Centralized Scores (Active Phase)

**Goal:** Complete the core learning flow by enabling members to take quizzes and view their scores.

### P1-1: Member Quiz Access and Submission

- **Reason:** Quiz action classes (`StoreEventQuizAttemptAction`, `GradeEventQuizAttemptAction`, `EventQuizAttempt::refreshScores`) exist but have no active member-facing routes. Wiring up routes, building the member quiz page, and establishing test coverage will complete this flow.
- **Dependency:** P0 stabilization exit criteria met.
- **Completion condition:**
    - Member can access quiz for a completed event they registered for.
    - Member can submit answers.
    - MC answers are auto-graded on submission.
    - Short-text answers are flagged for manual grading.
    - One attempt per member per event enforced.
    - Quiz results are visible to the member.
    - Feature tests cover: quiz submission, auto-grading, manual grading, score recalculation, duplicate attempt prevention, authorization.
- **Feature spec required:** Yes — specify member quiz page UI, form validation, result display, and authorization rules.

### P1-2: Centralized Member Score History

- **Reason:** Members need a way to view all their quiz scores across events in one place.
- **Dependency:** P1-1.
- **Completion condition:** A member dashboard page or section shows all quiz attempts with event name, scores, status, and date.
- **Feature spec required:** Yes.

### P1-3: Additional Quiz Regression Coverage

- **Reason:** Gaps in quiz edge-case testing addressed after P1-1 core tests pass.
- **Dependency:** P1-1.
- **Completion condition:** Edge-case test suite for quiz mechanics.
- **Feature spec required:** No.

---

## P2: Community Experience

**Goal:** Enhance the community platform with notifications, profiles, and event history.

### P2-1: Notification System

### P2-2: Member Profile Page

### P2-3: Mentor Profile Page

### P2-4: Member Event History

### P2-5: Mentor Event and Content History

---

## P3: Optional Features

**Goal:** Extend the platform with optional features based on community demand.

### P3-1: Certificates

### P3-2: Paid Event Processing

### P3-3: Forum or Event Q&A

### P3-4: Gamification

---

## Recommended First P1 Feature Specification

**P1-1: Member Quiz Access and Submission**

Primary work: restore and wire up routes; implement member quiz page (React); add authorization checks; write feature tests covering action logic.
