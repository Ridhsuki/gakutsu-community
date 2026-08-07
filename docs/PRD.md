# Product Requirements Document — Gakutsu Community

## 1. Problem Statement

Learning communities need a centralized platform to organize events, manage registrations, assess participant knowledge through quizzes, and provide score visibility. Without this, coordination happens across fragmented tools (chat groups, spreadsheets, manual tracking) that are difficult to maintain as the community grows.

## 2. Target Users

| User        | Description                                                        |
| ----------- | ------------------------------------------------------------------ |
| **Member**  | Community participant who discovers events, registers, attends, takes quizzes, and views scores. |
| **Mentor**  | Trusted community leader who creates and manages their own events, registration questions, quiz questions, and grades written answers. |
| **Admin**   | Platform administrator who manages all users, events, blogs, quizzes, and registrations across the entire platform. |

## 3. Core User Flows

### Flow 1: Event Discovery and Registration

1. Member visits the public events page or home page.
2. Member views event details (title, description, date, mentor, poster).
3. Member clicks "Register" on an upcoming, published event.
4. Member authenticates (if not already logged in).
5. Member fills out registration form with any custom questions.
6. System validates registration (event available, not already registered, required fields).
7. System creates registration with snapshot of user data and answers.
8. Member sees confirmation and gains access to the meeting link.

### Flow 2: Event Management (Mentor/Admin)

1. Mentor creates an event with title, description, dates, category, poster, meeting details.
2. Mentor optionally adds custom registration questions.
3. Mentor publishes the event (`is_published = true`).
4. Mentor views and manages registrations.
5. Mentor can edit, unpublish, or delete their own events.
6. Admin can manage all events regardless of ownership.

### Flow 3: Quiz Lifecycle

1. Admin or mentor creates quiz questions for an event (multiple choice or short text).
2. For multiple choice: mentor adds options with one correct answer.
3. Event is marked as `completed`.
4. Member accesses the quiz for a completed event they registered for.
5. Member submits answers (one attempt per event).
6. Multiple-choice answers are graded automatically.
7. Short-text answers are flagged for manual grading.
8. Admin or mentor reviews and grades short-text answers with score and optional feedback.
9. Attempt status transitions from `submitted` to `graded` when all manual grading is complete.
10. Member can view their quiz results.

### Flow 4: Blog Management

1. Mentor or admin creates a blog post with title, slug, content (rich text), cover image.
2. Blog post starts as `draft` and can be published.
3. Published blog posts are visible on the public blog listing and detail pages.

## 4. Functional Requirements

Implementation status for each requirement is tracked in [docs/CURRENT_STATE.md](../docs/CURRENT_STATE.md), not here.

### FR-AUTH: Authentication

| ID        | Requirement                                               |
| --------- | --------------------------------------------------------- |
| FR-AUTH-1 | User registration with name, email, password              |
| FR-AUTH-2 | Email/password login                                      |
| FR-AUTH-3 | Password reset via email                                  |
| FR-AUTH-4 | Email verification                                        |
| FR-AUTH-5 | Two-factor authentication (TOTP + recovery codes)         |
| FR-AUTH-6 | Password confirmation for sensitive operations            |
| FR-AUTH-7 | Logout                                                    |

### FR-USER: User Management

| ID        | Requirement                                               |
| --------- | --------------------------------------------------------- |
| FR-USER-1 | Admin can list, create, update, and delete users          |
| FR-USER-2 | Admin can assign roles (admin, mentor, member)            |
| FR-USER-3 | User can edit own profile (name, email)                   |
| FR-USER-4 | User can change own password                              |
| FR-USER-5 | User can delete own account                               |

### FR-EVENT: Event Management

| ID         | Requirement                                              |
| ---------- | -------------------------------------------------------- |
| FR-EVENT-1 | Admin/mentor can create events with required fields      |
| FR-EVENT-2 | Admin/mentor can edit events                             |
| FR-EVENT-3 | Admin/mentor can publish/unpublish events                |
| FR-EVENT-4 | Admin/mentor can delete events                           |
| FR-EVENT-5 | Admin/mentor can manage custom registration questions    |
| FR-EVENT-6 | Admin/mentor can view event registrations                |
| FR-EVENT-7 | Admin/mentor can view registration detail with answers   |
| FR-EVENT-8 | Events have status lifecycle (upcoming/completed/cancelled) |
| FR-EVENT-9 | Events support free and paid access types                |

### FR-REG: Event Registration

| ID        | Requirement                                               |
| --------- | --------------------------------------------------------- |
| FR-REG-1  | Authenticated member can register for upcoming events     |
| FR-REG-2  | Registration validates event availability and uniqueness  |
| FR-REG-3  | Registration captures custom question answers             |
| FR-REG-4  | Registration snapshots user name and email                |
| FR-REG-5  | Meeting link visible only to registered users and staff   |

### FR-QUIZ: Quiz System

| ID         | Requirement                                              |
| ---------- | -------------------------------------------------------- |
| FR-QUIZ-1  | Admin/mentor can create quiz questions (MC + short text) |
| FR-QUIZ-2  | Admin/mentor can manage quiz question options            |
| FR-QUIZ-3  | Admin/mentor can view quiz attempts                      |
| FR-QUIZ-4  | Admin/mentor can grade short-text answers                |
| FR-QUIZ-5  | Multiple-choice answers auto-graded on submission        |
| FR-QUIZ-6  | Attempt scores recalculated after manual grading         |
| FR-QUIZ-7  | Member can access quiz for completed events they attended |
| FR-QUIZ-8  | Member can submit quiz answers                           |
| FR-QUIZ-9  | Member can view quiz results                             |
| FR-QUIZ-10 | One attempt per member per event enforced                |
| FR-QUIZ-11 | Member can view all their quiz scores in a centralized history |

### FR-BLOG: Blog System

| ID         | Requirement                                              |
| ---------- | -------------------------------------------------------- |
| FR-BLOG-1  | Admin/mentor can create blog posts with rich text        |
| FR-BLOG-2  | Admin/mentor can edit blog posts                         |
| FR-BLOG-3  | Admin/mentor can publish/unpublish blog posts            |
| FR-BLOG-4  | Admin/mentor can delete blog posts                       |
| FR-BLOG-5  | Public can browse and read published blog posts          |
| FR-BLOG-6  | Blog editor supports image uploads                       |

### FR-SETTINGS: User Settings

| ID            | Requirement                                            |
| ------------- | ------------------------------------------------------ |
| FR-SETTINGS-1 | Profile editing (name, email)                          |
| FR-SETTINGS-2 | Password change                                        |
| FR-SETTINGS-3 | Account deletion                                       |
| FR-SETTINGS-4 | Two-factor setup and management                        |
| FR-SETTINGS-5 | Appearance (dark/light/system mode)                    |

## 5. Business Rules

| ID    | Rule                                                                         |
| ----- | ---------------------------------------------------------------------------- |
| BR-1  | Only published events are visible to the public.                             |
| BR-2  | Registration is available only for upcoming, published events before the deadline. |
| BR-3  | A user can register for an event only once.                                  |
| BR-4  | Quiz is available only for completed, published events with active questions. |
| BR-5  | A user can submit a quiz only once per event.                                |
| BR-6  | Quiz submission requires prior event registration.                           |
| BR-7  | Multiple-choice answers are graded automatically; short-text answers require manual grading. |
| BR-8  | Attempt status changes to `graded` only when all manual answers are graded.  |
| BR-9  | Mentors manage only their own events, blogs, and related data.               |
| BR-10 | Admins have unrestricted access to all resources.                            |
| BR-11 | **Mentor approval is not required.** Mentors publish events directly. This is intentional. |
| BR-12 | Blog posts start as drafts and must be explicitly published.                 |

## 6. Non-Functional Requirements

| ID     | Requirement                                                              |
| ------ | ------------------------------------------------------------------------ |
| NFR-1  | Production page bodies are client-side rendered (CSR). Initial SEO head metadata is rendered server-side by PHP Blade. Vite SSR bundles are built and smoke-tested in development and CI for hydration and build compatibility; production does not run a persistent Node SSR process. Admin pages are client-side only. |
| NFR-2  | All pages are mobile-responsive.                                         |
| NFR-3  | Dark mode is supported throughout the application.                       |
| NFR-4  | All interactive elements are keyboard-accessible with visible focus states. |
| NFR-5  | Input validation on both client and server for all forms.                |
| NFR-6  | Role-based authorization enforced at middleware and policy levels.        |
| NFR-7  | CSRF protection on all forms.                                            |
| NFR-8  | Rich text content sanitized before client rendering.                     |
| NFR-9  | Image uploads processed and stored consistently.                         |
| NFR-10 | All list views must be paginated; no unbounded queries against the primary tables. |
| NFR-11 | Inertia props must be scoped to what the page renders; avoid passing unused data. |
| NFR-12 | Primary user flows must be free of known N+1 query patterns.             |
| NFR-13 | UI components must be built using existing shadcn/ui primitives rather than custom replacements. |
| NFR-14 | Loading, empty, success, and error states must be consistent across all features. |

## 7. Acceptance Criteria (MVP)

1. A member can register, log in, browse events, register for an event, and see the meeting link.
2. A member can take a quiz for a completed event and view results.
3. Multiple-choice answers are graded automatically on submission.
4. A mentor can grade short-text answers with score and feedback.
5. A member can view all their quiz scores in a centralized history page.
6. Admin and mentor dashboards show managed events, registrations, and quiz attempts.
7. All authorization policies prevent cross-ownership access.
8. All feature tests pass with the test infrastructure operational.

## 8. Explicit Non-Goals

- **Event approval workflow**: Mentors are trusted and publish directly. No approval status, pending state, or approval dashboard will be built.
- **Real-time features**: No live chat, real-time collaboration, or WebSocket-based updates are planned for the current scope.
- **Mobile native app**: The platform is web-only.
- **Microservices or distributed architecture**: The application is a monolithic Laravel application.
- **Complex analytics or reporting dashboards**: Basic score visibility is sufficient.

## 9. Future Scope

| Phase | Feature Area                                                    |
| ----- | --------------------------------------------------------------- |
| P2    | Notifications, member/mentor profiles, event history            |
| P3    | Certificates, paid-event processing, forum/Q&A, gamification    |

Event approval is not included in any future phase.
