# Roadmap — Gakutsu Community

---

## P0: Project Recovery and Stabilization

**Goal:** Establish a reliable development baseline before building new features.

### P0-1: Restore Test Infrastructure

- **Reason:** The `RefreshDatabase` trait is commented out in `tests/Pest.php`. This is the suspected primary cause of the majority of test failures, which show missing database tables. However, this is a hypothesis — once the trait is restored the test suite must be re-run and every remaining failure classified individually.
- **Dependency:** None.
- **Completion condition:** `RefreshDatabase` restored; all tests re-run; each failing test identified as either an infrastructure artifact or an independent application defect; the 7 previously-passing tests still pass; the `RegistrationTest > new users can register` authentication assertion failure investigated and either fixed or documented.
- **Feature spec required:** No.

### P0-2: Fix TypeScript Errors

- **Reason:** 7 TypeScript errors prevent type safety validation. 6 are missing generic arguments on `PaginatedResponse`, 1 is a prop type mismatch.
- **Dependency:** None.
- **Completion condition:** `npm run types:check` passes with 0 errors.
- **Feature spec required:** No.

### P0-3: Fix Mechanical ESLint Issues

- **Reason:** 166 of 179 ESLint errors are auto-fixable mechanical issues (import ordering, braces, blank lines). Fixing these reduces noise for behavioral review.
- **Dependency:** None.
- **Completion condition:** Only behavioral issues (`set-state-in-effect`, `exhaustive-deps`) remain after fix. Total error count drops to ~13 or fewer.
- **Feature spec required:** No. But must separate this from any behavioral changes.

### P0-4: Review Behavioral ESLint Issues

- **Reason:** 6 `react-hooks/set-state-in-effect` and 2 `exhaustive-deps` issues may cause performance problems or SSR hydration mismatches.
- **Dependency:** P0-3 (clean noise first).
- **Completion condition:** Each instance reviewed and either fixed, suppressed with documented justification, or tracked as a follow-up.
- **Feature spec required:** No.

### P0-5: Fix PHP Pint Style Issues

- **Reason:** 67 code-style issues. All mechanical (braces, imports, spacing, EOF newlines).
- **Dependency:** None.
- **Completion condition:** `composer lint:check` passes with 0 issues.
- **Feature spec required:** No.

### P0-6: Fix Prettier Formatting

- **Reason:** 92 files with formatting issues.
- **Dependency:** P0-3 (ESLint mechanical fixes first, to avoid conflicts).
- **Completion condition:** `npm run format:check` passes with 0 issues.
- **Feature spec required:** No.

### P0-7: Investigate Registration Test Failure

- **Reason:** `RegistrationTest > new users can register` fails with `assertAuthenticated()` returning false, which is a different failure mode from the missing-table errors. May indicate a Fortify configuration issue.
- **Dependency:** P0-1 (test infrastructure restored).
- **Completion condition:** Root cause identified and either fixed or documented as a known issue.
- **Feature spec required:** No.

### P0-8: Add Missing Factories

- **Reason:** No factories exist for `EventRegistration`, `EventRegistrationQuestion`, `EventQuizQuestion`, `EventQuizOption`, `EventQuizAttempt`, `EventQuizAnswer`. These are needed by the concrete feature tests planned in P0-9 and P0-10.
- **Dependency:** P0-1.
- **Completion condition:** Factories created for models that have confirmed planned tests in P0-9 and P0-10. Do not create factories speculatively.
- **Feature spec required:** No.

### P0-9: Add Core Authorization Tests

- **Reason:** No tests verify that policies and middleware enforce correct access control.
- **Dependency:** P0-1, P0-8.
- **Completion condition:** Tests exist for: admin can access admin routes, mentor can only access own events/blogs, member cannot access admin/mentor routes, ownership enforcement on events and blogs.
- **Feature spec required:** No.

### P0-10: Add Core Feature Tests

- **Reason:** No tests exist for any business feature (event CRUD, registration, blog CRUD).
- **Dependency:** P0-1, P0-8.
- **Completion condition:** Feature tests exist for: event create/update/delete (admin and mentor), event registration, blog create/update/delete, public page rendering.
- **Feature spec required:** No.

---

## P1: Member Quiz Access and Centralized Scores

**Goal:** Complete the core learning flow by enabling members to take quizzes and view their scores.

### P1-1: Member Quiz Access and Submission

- **Reason:** Quiz action classes (`StoreEventQuizAttemptAction`, `GradeEventQuizAttemptAction`, `EventQuizAttempt::refreshScores`) exist but have no automated test coverage. The member-facing routes are commented out and the controller returns 404. Completing this feature means wiring up routes, building the member quiz page, and establishing automated test coverage for the quiz logic.
- **Dependency:** P0 completed (test infrastructure restored, authorization tests passing).
- **Completion condition:**
  - Member can access quiz for a completed event they registered for.
  - Member can submit answers.
  - MC answers are auto-graded on submission.
  - Short-text answers are flagged for manual grading.
  - One attempt per member per event enforced.
  - Quiz results are visible to the member.
  - Feature tests cover: quiz submission, auto-grading, manual grading, score recalculation, duplicate attempt prevention, authorization (member can only take quiz for events they registered for).
- **Feature spec required:** Yes — must specify the member quiz page UI, form validation, result display, and authorization rules.

### P1-2: Centralized Member Score History

- **Reason:** Members need a way to view all their quiz scores across events in one place.
- **Dependency:** P1-1.
- **Completion condition:** A member dashboard page or section shows all quiz attempts with event name, scores, status, and date. Feature tests cover the page rendering and authorization.
- **Feature spec required:** Yes.

### P1-3: Additional Quiz Regression Coverage

- **Reason:** After P1-1 tests pass, additional edge-case and regression tests may be added to improve coverage.
- **Dependency:** P1-1 (core quiz tests already pass).
- **Completion condition:** Any identified gaps in quiz test coverage addressed with focused tests.
- **Feature spec required:** No.

---

## P2: Community Experience

**Goal:** Enhance the community platform with notifications, profiles, and event history.

### P2-1: Notification System

- **Reason:** Members need to be notified of event updates, registration confirmations, quiz results.
- **Dependency:** P1 completed.
- **Completion condition:** Queue-ready notification architecture; email and in-app notifications for key events.
- **Feature spec required:** Yes.

### P2-2: Member Profile Page

- **Reason:** Members need a public or semi-public profile showing their community participation.
- **Dependency:** P1-2 (score history).
- **Completion condition:** Profile page showing member info, event history, quiz scores.
- **Feature spec required:** Yes.

### P2-3: Mentor Profile Page

- **Reason:** Mentors need a public profile showing their events and content.
- **Dependency:** None specific.
- **Completion condition:** Public mentor profile with bio, events, and blog posts.
- **Feature spec required:** Yes.

### P2-4: Member Event History

- **Reason:** Members should see past events they attended.
- **Dependency:** P1-2.
- **Completion condition:** Member dashboard section showing past registrations and event details.
- **Feature spec required:** No (can be part of P2-2).

### P2-5: Mentor Event and Content History

- **Reason:** Mentors need a comprehensive view of their contribution history.
- **Dependency:** None specific.
- **Completion condition:** Mentor dashboard showing all past events, registrations counts, quiz statistics.
- **Feature spec required:** No (can be part of P2-3).

---

## P3: Optional Features

**Goal:** Extend the platform with optional features based on community demand.

### P3-1: Certificates

- **Reason:** Members may want certificates for completed events or quizzes.
- **Dependency:** P1 completed.
- **Completion condition:** PDF certificate generation for eligible members.
- **Feature spec required:** Yes.

### P3-2: Paid Event Processing

- **Reason:** The `EventAccessType::Paid` enum exists but no payment processing is implemented.
- **Dependency:** P1 completed.
- **Completion condition:** Payment gateway integration for paid events; access control based on payment status.
- **Feature spec required:** Yes.

### P3-3: Forum or Event Q&A

- **Reason:** Community discussion features may enhance engagement.
- **Dependency:** P2 completed.
- **Completion condition:** Discussion threads or Q&A per event.
- **Feature spec required:** Yes.

### P3-4: Gamification

- **Reason:** Points, badges, or leaderboards may increase engagement.
- **Dependency:** P1-2, P2-2.
- **Completion condition:** Points system based on quiz scores and participation.
- **Feature spec required:** Yes.

---

## Recommended P0 Issue Sequence

Execute in this order to minimize conflicts:

1. **P0-1** Restore `RefreshDatabase` — unblocks all test work
2. **P0-5** Fix PHP Pint — mechanical PHP changes in isolation
3. **P0-2** Fix TypeScript errors — small targeted fixes
4. **P0-3** Fix mechanical ESLint — batch auto-fix
5. **P0-6** Fix Prettier — after ESLint to avoid reformatting conflicts
6. **P0-4** Review behavioral ESLint — manual review with clean baseline
7. **P0-7** Investigate registration test failure — after infrastructure is restored
8. **P0-8** Add missing factories — enables test writing
9. **P0-9** Add authorization tests — critical safety net
10. **P0-10** Add feature tests — validates business logic

## Recommended First P1 Feature Specification

**P1-1: Member Quiz Access and Submission**

This is the highest-value P1 item because:
- The quiz action classes (`StoreEventQuizAttemptAction`, `GradeEventQuizAttemptAction`, `EventQuizAttempt::refreshScores`) exist and contain auto-grading and score-recalculation logic, but **no automated tests cover this logic**.
- The member-facing routes are commented out and the controller stubs return 404.
- Primary work: restore and wire up routes; implement the member quiz page (React); add authorization checks; write feature tests that cover the action logic for the first time.

The feature specification should define:
- Member quiz page layout and UX
- What happens if the user isn't registered for the event
- What happens if the user has already submitted
- How results are displayed after submission
- Authorization rules and error states
