# Gakutsu Community

Gakutsu is a learning community platform focused on cybersecurity, networking, software development, and related IT topics. The community organizes learning events such as webinars, workshops, and technical discussions.

> **Note:** This project was previously named **YokPelajarin**. The `composer.json` package name still reads `laravel/react-starter-kit` (starter-kit metadata, not yet updated). The old YokPelajarin branding is preserved here only as historical context.

## Development Status

**This application is under active development.**

P0 stabilization exit criteria have been met. Remaining factory and feature test coverage tasks have been reclassified into the technical-debt backlog and do not block the current P1 product phase.

The current active phase is **P1: Member Quiz Access and Centralized Scores**. See [docs/ROADMAP.md](docs/ROADMAP.md) for the full plan.

### Production Rendering Architecture

- The production page body is client-side rendered (CSR) with `INERTIA_SSR_ENABLED=false`. Production hosting does not run a persistent Node SSR process.
- Initial SEO head metadata (`<title>`, `<meta>`, canonical, JSON-LD) is rendered server-side via PHP Blade (`resources/views/app.blade.php`).
- `.env.example` retains `INERTIA_SSR_ENABLED=true` for local development.
- Development and CI environments build and validate the Vite SSR bundle (`npm run build:ssr` and `node scripts/ssr-smoke-check.mjs`) to ensure hydration compatibility and build integrity.

## Technology Stack

Verified from `composer.json` and `package.json`:

| Layer            | Technology                                                                 |
| ---------------- | -------------------------------------------------------------------------- |
| Backend          | Laravel 13, PHP ^8.3 (minimum required by `composer.json`)                 |
| Frontend         | React 19, TypeScript 5.7, Inertia.js v3                                    |
| Styling          | Tailwind CSS v4, shadcn/ui (Radix primitives)                              |
| Rich Text        | Tiptap v3                                                                  |
| Authentication   | Laravel Fortify v1 (registration, password reset, email verification, 2FA) |
| Routing Bridge   | Laravel Wayfinder v0                                                       |
| Image Processing | Intervention Image v4                                                      |
| Testing          | Pest v4, PHPUnit v12                                                       |
| Linting          | ESLint v9, Prettier v3, Laravel Pint v1                                    |
| Build            | Vite v8, with SSR support via `@inertiajs/vite`                            |
| Dev Tools        | Laravel Boost v2, Laravel Pail v1, Laravel Sail v1                         |
| Icons            | Lucide React                                                               |
| Toast Feedback   | Sonner                                                                     |

## Getting Started

### Prerequisites

- PHP 8.3+
- Composer
- Node.js (compatible with Vite 8)
- SQLite or MySQL for local development

### Installation

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan storage:link
npm install
npm run build
```

Or use the setup script:

```bash
composer setup
```

### Development

Start all services (Laravel server, queue, logs, Vite):

```bash
composer run dev
```

Or individually:

```bash
php artisan serve    # Backend
npm run dev          # Vite dev server
```

### Database Seeding

```bash
php artisan db:seed
```

## Quality Commands

| Command                                  | Description                    |
| ---------------------------------------- | ------------------------------ |
| `php artisan test --compact`             | Run backend tests              |
| `npm run lint:check`                     | ESLint check                   |
| `npm run format:check`                   | Prettier check                 |
| `npm run types:check`                    | TypeScript type check          |
| `composer lint:check`                    | PHP Pint style check           |
| `npm run build`                          | Production client build        |
| `npm run build:ssr`                      | Client + SSR build             |
| `composer ci:check`                      | Full CI pipeline (lint + test) |
| `vendor/bin/pint --dirty --format agent` | Fix PHP style (dirty only)     |

## Roles

| Role   | Description                                                                           |
| ------ | ------------------------------------------------------------------------------------- |
| Admin  | Full platform management: users, all events, all blogs, all quizzes                   |
| Mentor | Trusted community member: creates and manages own events, blogs, quizzes              |
| Member | Registers for events; member quiz access and centralized scores are active P1 targets |

## Project Structure

```
app/
├── Actions/          # Domain action classes (Events, EventQuiz, Blogs, Media)
├── Concerns/         # Validation rule traits
├── Enums/            # UserRole, EventStatus, EventAccessType, quiz types
├── Http/
│   ├── Controllers/  # Admin/, Mentor/, Site/, Event/, Blog/, Settings/
│   ├── Middleware/    # EnsureUserIsAdmin, EnsureUserIsMentor, HandleAppearance
│   └── Requests/     # Form request validation
├── Models/           # Eloquent models
├── Policies/         # Authorization policies
├── Providers/        # Service providers
└── Support/          # SEO policy, metadata, structured data, and media path helpers

resources/js/
├── components/       # Shared UI components (shadcn/ui, data-table, navigation)
├── features/         # Feature modules (blogs, events, quizzes, users)
├── hooks/            # Shared React hooks
├── layouts/          # App, Auth, Public layouts
├── pages/            # Inertia page components (admin, mentor, events, blogs)
├── types/            # TypeScript type definitions
└── wayfinder/        # Auto-generated Wayfinder routes

database/
├── factories/        # User, BlogPost, Event factories
├── migrations/       # 13 migration files
└── seeders/          # Database + Event seeders

tests/
├── Feature/          # Auth, Dashboard, Settings, Events, SEO, Site payload tests
└── Unit/             # Support unit tests

docs/                 # Project documentation
```

## Documentation

- [Product Requirements (PRD)](docs/PRD.md)
- [Current State](docs/CURRENT_STATE.md)
- [Architecture & Design](docs/DESIGN.md)
- [Roadmap](docs/ROADMAP.md)

## Agent Instructions

See [AGENTS.md](AGENTS.md) for AI agent coding guidelines.

See [GEMINI.md](GEMINI.md) for Laravel Boost framework-managed instructions (do not edit).
