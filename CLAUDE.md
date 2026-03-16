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
| Database | LibSQL (SQLite) locally, Neon Postgres for production |
| ORM | Drizzle ORM (`drizzle-orm/libsql` driver) |
| Auth | NextAuth.js v5 (dev: credentials, prod: magic link) |
| Font | Geist Sans (via `geist` npm package) |
| Deployment | Vercel |
| Offline | Service worker + IndexedDB local queue (not yet implemented) |
| Testing | Vitest (unit/component), Playwright (e2e) (not yet installed) |
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
    (auth)/
      login/           # credentials login (dev), magic-link (prod)
    (app)/             # authenticated app shell (bottom nav + settings gear)
      today/           # daily dashboard with cycle progress
      log/             # charge/drain composer (progressive depth)
      shift/           # shift-now guided flow
      patterns/        # rule-based pattern summaries
      practices/       # 3 commitments per cycle
      settings/        # theme, export, delete, sign out
      timeline/        # chronological entry list
    api/auth/          # NextAuth route handler
    layout.tsx
    globals.css
  components/
    ui/                # Button, Card, Chip, Input, Textarea
    nav/               # bottom-nav
    today/             # today-actions, today-entries, cycle-progress, active-practices
    log/               # log-composer
    shift/             # shift-flow
    patterns/          # patterns-summary
    practices/         # practices-manager
    settings/          # settings-panel
    timeline/          # timeline-view
    theme-provider.tsx # light/dark/system theme context
  lib/
    db/
      schema.ts        # Drizzle schema (sqliteTable)
      index.ts         # libsql client + auto table init
    auth.ts            # NextAuth config
    utils.ts           # cn(), formatDate/Time, getGreeting, etc.
  actions/
    entries.ts         # CRUD for charge/drain entries
    shifts.ts          # CRUD for shift records
    cycles.ts          # cycle management (get or create)
    practices.ts       # practice CRUD + daily logging
    export.ts          # JSON export + delete-all
  types/
    index.ts           # Entry, Shift, Practice, Cycle, ActionResult
    next-auth.d.ts     # session type augmentation
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
- Uses `sqliteTable` from `drizzle-orm/sqlite-core` (libsql driver).
- Table names: plural, snake_case (`entries`, `cycles`, `practices`).
- All tables include `id` (text/uuid), `created_at`, `updated_at`.
- Foreign keys reference `users.id`.
- Soft delete via `deleted_at` timestamp on entries and shifts.
- Tables auto-created via inline SQL in `src/lib/db/index.ts` (migration system TBD).
- To switch to Neon Postgres for production: change driver to `drizzle-orm/neon-http`, update schema to use `pgTable`, and set `DATABASE_URL` env var.

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
pnpm lint             # run eslint
pnpm db:push          # push schema to database via drizzle-kit
pnpm db:studio        # open drizzle studio
```

**Not yet configured** (install deps first):
```bash
pnpm test             # run vitest (needs: pnpm add -D vitest)
pnpm test:e2e         # run playwright (needs: pnpm add -D @playwright/test)
```

Required env vars (`.env.local`):
- `DATABASE_URL` — libsql connection string (defaults to `file:energy.db` for local dev)
- `NEXTAUTH_SECRET` — session signing key (defaults to `dev-secret-change-in-production`)
- `NEXTAUTH_URL` — `http://localhost:3000` in dev

**Not yet needed** (for production):
- `EMAIL_SERVER` — SMTP connection string for magic link auth
