# Energy Log — Tasks

## Completed: MVP Build (v0.1.0)

- [x] Initialize Next.js 15 project with App Router, TypeScript, Tailwind CSS 4
- [x] Set up Drizzle ORM + libsql (SQLite) schema (users, cycles, entries, shifts, practices, practice_logs)
- [x] Configure NextAuth.js v5 with dev-mode credentials provider
- [x] Build warm neutral theme with dark mode support (ThemeProvider)
- [x] Today screen (greeting, cycle progress ring, action buttons, entries list, active practices)
- [x] Charge/Drain composer (progressive depth: what happened → source/predictable → expectations/language/what helped)
- [x] Shift Now flow (6-step guided pause with reset options)
- [x] Patterns screen (charge/drain themes, expectations, language patterns, shift success rate)
- [x] Practices screen (define 3 commitments per cycle, daily logging with notes)
- [x] Timeline screen (chronological entries, filter by charge/drain)
- [x] Settings screen (theme toggle, JSON export, delete all data, sign out)
- [x] Bottom navigation + settings gear icon
- [x] PWA manifest for Add to Home Screen
- [x] Production build passes

## Up Next

- [ ] Install Vitest + Testing Library, add unit tests for server actions
- [ ] Install Playwright, add e2e tests for critical flows
- [ ] Switch to proper Drizzle migrations (replace inline SQL init)
- [ ] Service worker + offline queue
- [ ] Production auth (magic link via Resend/SendGrid)
- [ ] Deploy to Vercel with Neon Postgres

## Review Notes

### v0.1.0 — Initial MVP Build
- Switched from better-sqlite3 to @libsql/client due to native compilation issues in build environment
- Used `geist` npm package instead of Google Fonts (network fetch failed during build)
- Middleware uses cookie-based auth check instead of importing auth config (avoids Edge Runtime + SQLite conflict)
- All server actions use async Drizzle queries (libsql driver is async, unlike better-sqlite3)
