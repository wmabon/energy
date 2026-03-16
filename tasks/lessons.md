# Energy Log — Lessons Learned

Patterns and corrections captured during development. Review at session start.

## Patterns

### Native Node modules + Next.js Turbopack
- `better-sqlite3` requires native compilation (`node-gyp`). If build tools aren't available, use `@libsql/client` instead — it's a pure JS/WASM alternative that's wire-compatible.
- When switching from sync (better-sqlite3) to async (libsql) drivers, all `.get()` and `.run()` calls become `await`-based. Drizzle's libsql driver returns arrays, not single rows.

### Edge Runtime restrictions
- Next.js middleware runs on Edge Runtime. It cannot import modules that use `process.cwd()`, `fs`, or native Node APIs.
- If auth config imports the database module, middleware can't use `auth()` directly. Use a lightweight cookie check instead.

### Google Fonts in restricted environments
- `next/font/google` fetches fonts at build time. If network is restricted, the build fails.
- Use the `geist` npm package with `next/font/local` or the package's built-in exports as a fallback.

## Rules

1. **Always verify native module compilation** before committing to a native-only package. Check for prebuilt binaries or WASM alternatives.
2. **Keep middleware lightweight** — no database imports, no heavy auth configs. Check cookies or JWT tokens directly.
3. **Use local font packages** over Google Fonts imports for build reliability.
4. **Test `pnpm build` before committing** — catches Edge Runtime conflicts, missing modules, and type errors that `pnpm dev` may not surface.
