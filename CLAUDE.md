# CLAUDE.md

## Workflow Orchestration

1. **Plan Mode Default**
   - Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)
   - If something goes sideways, STOP and re-plan immediately – don't keep pushing
   - Use plan mode for verification steps, not just building
   - Write detailed specs upfront to reduce ambiguity

2. **Subagent Strategy**
   - Use subagents liberally to keep main context window clean
   - Offload research, exploration, and parallel analysis to subagents
   - For complex problems, throw more compute at it via subagents
   - One task per subagent for focused execution

3. **Self-Improvement Loop**
   - After ANY correction from the user: update `tasks/lessons.md` with the pattern
   - Write rules for yourself that prevent the same mistake
   - Ruthlessly iterate on these lessons until mistake rate drops
   - Review lessons at session start for relevant project

4. **Verification Before Done**
   - Never mark a task complete without proving it works
   - Diff behavior between main and your changes when relevant
   - Ask yourself: "Would a staff engineer approve this?"
   - Run tests, check logs, demonstrate correctness

5. **Demand Elegance (Balanced)**
   - For non-trivial changes: pause and ask "is there a more elegant way?"
   - If a fix feels hacky: "Knowing everything I know now, implement the elegant solution"
   - Skip this for simple, obvious fixes – don't over-engineer
   - Challenge your own work before presenting it

6. **Autonomous Bug Fixing**
   - When given a bug report: just fix it. Don't ask for hand-holding
   - Point at logs, errors, failing tests – then resolve them
   - Zero context switching required from the user
   - Go fix failing CI tests without being told how

## Task Management

1. **Plan First**: Write plan to `tasks/todo.md` with checkable items
2. **Verify Plan**: Check in before starting implementation
3. **Track Progress**: Mark items complete as you go
4. **Explain Changes**: High-level summary at each step
5. **Document Results**: Add review section to `tasks/todo.md`
6. **Capture Lessons**: Update `tasks/lessons.md` after corrections

## Core Principles

- **Simplicity First**: Make every change as simple as possible. Impact minimal code.
- **No Laziness**: Find root causes. No temporary fixes. Senior developer standards.
- **Minimal Impact**: Changes should only touch what's necessary. Avoid introducing bugs.
- **Commit at Feature Boundaries**: After each FR group passes build + tests, commit immediately. Never accumulate more than one feature without committing.

## Project: Energy Log

A calm, private web app for capturing what charges and drains your energy, with support for real-time shifts and pattern recognition over rolling 30-day cycles. Single-user, iPhone-first, deployed as a Vercel-hosted PWA accessible via Safari bookmark or Add to Home Screen.

Full product spec: `energy-log-prd-v2.md`

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 15 (App Router, React Server Components) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS 4 |
| Database | Neon Postgres |
| ORM | Drizzle ORM |
| Auth | NextAuth.js v5 (magic link) |
| Deployment | Vercel |
| Offline | Service worker + IndexedDB local queue |
| Testing | Vitest (unit/component), Playwright (e2e) |
| Package manager | pnpm |

## Architecture Conventions

- **App Router only** — no `pages/` directory. All routes under `src/app/`.
- **Server Components by default** — use `'use client'` only when the component needs browser APIs, event handlers, or React state.
- **Server Actions for mutations** — no separate API route files for CRUD. Use `'use server'` functions in `src/actions/`.
- **Route groups** — use `(auth)` and `(app)` route groups to separate authenticated and unauthenticated layouts.
- **No barrel files** — import directly from the source module, not through `index.ts` re-exports.

## File Structure

```
src/
  app/
    (auth)/            # login, magic-link callback
    (app)/             # authenticated app shell
      today/
      log/             # charge/drain composer
      shift/           # shift-now flow
      patterns/
      practices/
      settings/
    layout.tsx
    globals.css
  components/
    ui/                # generic UI primitives (Button, Card, Chip, etc.)
    [feature]/         # feature-specific components
  lib/
    db/
      schema.ts        # Drizzle schema definitions
      index.ts         # db client
      migrations/
    auth/
    utils/
  actions/             # server actions
  types/               # shared TypeScript types
```

## Coding Standards

- **TypeScript strict** — `strict: true` in tsconfig. No `any` types. Prefer `unknown` + narrowing.
- **Named exports only** — no default exports except for Next.js page/layout files (required by framework).
- **Component pattern** — functional components with props as inline type or extracted type when reused.
- **Styling** — Tailwind utility classes directly on elements. Extract to component when a pattern repeats 3+ times. No CSS modules.
- **State management** — React context for light global state (auth, theme). No Redux or Zustand unless complexity demands it.
- **Server action returns** — `{ success: boolean; error?: string; data?: T }` pattern. No thrown errors across the server/client boundary.
- **Naming** — `kebab-case` for files/folders, `PascalCase` for components, `camelCase` for functions/variables.

## Database Conventions

- Schema defined in Drizzle at `src/lib/db/schema.ts` as single source of truth.
- Table names: plural, snake_case (`entries`, `cycles`, `practices`).
- All tables include `id` (uuid), `created_at`, `updated_at`.
- Foreign keys reference `users.id`.
- Soft delete via `deleted_at` timestamp.
- Migrations managed via `drizzle-kit`.

## Testing Strategy

- **Unit tests** (Vitest): pure logic, server actions, utility functions. Co-locate as `*.test.ts` next to source.
- **Component tests** (Vitest + Testing Library): interactive components with meaningful state logic.
- **E2E tests** (Playwright): critical flows only — auth, log entry, shift now, export data.
- **No test for the sake of coverage** — test behavior, not implementation.
- Run `pnpm test` before every commit.

## Environment & Commands

```bash
pnpm install          # install dependencies
pnpm dev              # local dev server (http://localhost:3000)
pnpm build            # production build
pnpm test             # run vitest
pnpm test:e2e         # run playwright
pnpm db:push          # push schema to database
pnpm db:migrate       # run migrations
pnpm db:studio        # open drizzle studio
```

Required env vars (`.env.local`):
- `DATABASE_URL` — Neon Postgres connection string
- `NEXTAUTH_SECRET` — session signing key
- `NEXTAUTH_URL` — `http://localhost:3000` in dev
- `EMAIL_SERVER` — SMTP connection string for magic links
