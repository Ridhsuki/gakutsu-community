# Contributing to Gakutsu Community

Thank you for your interest in contributing! This guide will help you get started.

## Ways to Contribute

- **Report bugs** — open a [bug report](https://github.com/GakutsuLabs/gakutsu.net/issues/new?template=bug_report.yml).
- **Suggest features** — open a [feature request](https://github.com/GakutsuLabs/gakutsu.net/issues/new?template=feature_request.yml).
- **Fix bugs or implement features** — submit a pull request.
- **Improve documentation** — typo fixes, clarifications, and new guides are welcome.
- **Ask or answer questions** — join the [Discussions](https://github.com/GakutsuLabs/gakutsu.net/discussions).

Small documentation fixes and obvious corrections may be submitted directly as a pull request without opening an issue first.

## Development Setup

### Prerequisites

- PHP 8.3+
- Composer
- Node.js (compatible with Vite 8)
- SQLite or MySQL
- PHP `ext-gd` extension (required for image processing)

### Installation

```bash
git clone https://github.com/GakutsuLabs/gakutsu.net.git
cd gakutsu.net
composer install
npm ci
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan storage:link
npm run build
```

### Running the Development Server

```bash
composer run dev
```

This starts the Laravel server, queue worker, log viewer, and Vite dev server concurrently.

## Pull Request Workflow

1. **Fork** the repository and create a branch from `main`.
2. **Name your branch** using one of these conventions:
   - `feature/*` — new features
   - `fix/*` — bug fixes
   - `chore/*` — maintenance and tooling
   - `docs/*` — documentation changes
3. **Keep your PR focused** on a single change. Avoid bundling unrelated modifications.
4. **Push** your branch and open a pull request against `main`.

## Code Quality

Contributors should run checks relevant to their changes before submitting a PR. Full CI remains the authoritative validator, but broader changes should run the full applicable set.

### Available Checks

**PHP:**

```bash
composer validate --strict
composer audit --locked
composer lint:check            # PHP Pint style check
./vendor/bin/pest --compact    # Backend tests
```

**Frontend:**

```bash
npm run test:unit              # Vitest unit tests
npm run lint:check -- --max-warnings=0   # ESLint
npm run types:check            # TypeScript type check
npm run format:check           # Prettier formatting check
```

**Build verification:**

```bash
npm run build:ssr              # Client + SSR build
node scripts/ssr-smoke-check.mjs   # SSR smoke check
```

## Guidelines

### Tests and Documentation

- Add or update tests for behavior changes.
- Update documentation when behavior changes.

### Database Migrations

Existing migration files may be edited during development. After the first production release, schema changes must use new migration files (append-only policy).

### Secrets and Credentials

- **Never** commit `.env` files or credentials.
- Remove credentials, tokens, and personal data from screenshots and logs before including them in issues or pull requests.

### Code Style

- Follow existing patterns and conventions. Inspect sibling files before introducing new abstractions.
- Use existing [shadcn/ui components](resources/js/components/ui/) before creating custom primitives.

## Community

For questions, discussions, and support, visit [GitHub Discussions](https://github.com/GakutsuLabs/gakutsu.net/discussions).

Please review our [Code of Conduct](CODE_OF_CONDUCT.md) before participating.
