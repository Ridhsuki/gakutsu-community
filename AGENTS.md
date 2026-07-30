# AGENTS.md — Gakutsu Project Guidelines for AI Agents

## Essential Reading

Before making any changes, read:

1. [docs/PRD.md](docs/PRD.md) — product requirements and business rules
2. [docs/CURRENT_STATE.md](docs/CURRENT_STATE.md) — current implementation status and known issues
3. [docs/DESIGN.md](docs/DESIGN.md) — architecture and design decisions
4. [docs/ROADMAP.md](docs/ROADMAP.md) — prioritized work phases

Read the relevant feature specification before modifying any feature code.

## Framework Instructions

The `GEMINI.md` file contains Laravel Boost framework-managed guidance. **Do not modify or overwrite it.** Follow its instructions for Laravel, Inertia, React, Tailwind, Pest, Wayfinder, and Pint conventions.

## Project Rules

### Requirements and Code

- Do not modify product requirements to match existing code. If the code contradicts the requirements, flag it.
- Do not add dependencies without justification and approval.
- Do not delete failing tests without approval.
- Do not weaken authorization checks, validation rules, or security protections.

### Patterns and Conventions

- Inspect existing sibling files before creating new abstractions.
- Use existing shadcn/ui components and design patterns before creating custom primitives.
- Reuse shared components in `resources/js/components/` and feature modules in `resources/js/features/`.
- Follow the Action pattern used in `app/Actions/` for domain logic.
- Use Form Requests for validation (`app/Http/Requests/`).
- Use policies for authorization (`app/Policies/`).

### Change Discipline

- Keep changes focused; avoid unrelated modifications in the same task.
- Separate mechanical formatting fixes from behavioral code changes. Never combine them.
- Add or update tests for any behavior change. Tests are part of the definition of done, not a follow-up task.
- Update documentation when behavior changes.

### Quality Checks

Run relevant verification commands after changes:

- `php artisan test --compact --filter=TestName` — affected tests
- `npm run types:check` — TypeScript validation
- `npm run lint:check` — ESLint
- `vendor/bin/pint --dirty --format agent` — PHP style (auto-fix dirty files)

### Reporting

- Run and report command results honestly.
- Never claim completion while required quality checks fail.
- Report any contradictions between documentation and implementation.

## UI and UX Consistency

- **Use shadcn/ui primitives.** Check `resources/js/components/ui/` before building a custom component. Do not replace existing shadcn/ui components.
- **Use the shared table infrastructure.** List pages must use `components/data-table/` components. Do not build isolated table implementations.
- **Consistent states.** Every feature must handle loading, empty, success, and error states using the established patterns:
  - Loading: animated skeleton placeholder (not a blank area).
  - Empty: `ui/empty-state.tsx` component.
  - Success/error feedback: Sonner toast via `FlashToasterListener`.
- **Dark mode.** All new components must work correctly in both light and dark mode.
- **Keyboard accessibility.** All interactive elements must be operable by keyboard. Do not suppress focus indicators.
- **Visible focus states.** Do not use `outline: none` without a visible alternative.
- **Do not introduce isolated redesigns.** New screens must be consistent with the existing layout system (`app-layout`, `auth-layout`, `public-layout`).

## Performance Rules

- **Prevent N+1 queries.** Eager-load with `with()` based on what the page actually renders.
- **Paginate list views.** Use `paginate()` or `simplePaginate()`. Never return unbounded collections.
- **Scope Inertia props.** Return only the data a page uses. Do not pass unused model attributes.
- **No speculative caching or infrastructure.** Do not introduce Redis, queue workers beyond the existing setup, or database read replicas without a demonstrated bottleneck and approval.
- **No unnecessary abstractions.** Do not add service layers, repository patterns, or interfaces over the existing Action pattern without evidence they are needed.

## Confirmed Product Decisions

- **No event approval workflow.** Mentors are trusted and publish directly. This is intentional, not a missing feature.
- **Development migration policy.** Existing migrations may be edited directly during development. This becomes immutable after the first production release.
- **No paid-event processing yet.** The `access_type` enum includes `paid` but payment processing is P3.
