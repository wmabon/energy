# Energy Log

A calm, private web app for capturing what charges and drains your energy — and for practicing better shifts in real time.

## What it does

- **Quick logging** — capture energy charges and drains in under a minute with guided, tap-friendly prompts
- **30-day cycles** — organize reflection into rolling cycles with three active commitments per cycle
- **Pattern recognition** — surface recurring drains, charges, expectations, and language patterns over time
- **Shift Now** — fast in-the-moment pattern interrupt for reframing state in under 60 seconds

## Tech stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS 4
- Drizzle ORM + Neon Postgres
- NextAuth.js v5 (magic link)
- Deployed on Vercel

## Getting started

### Prerequisites

- Node.js 20+
- pnpm
- A Neon Postgres database

### Setup

```bash
git clone <repo-url>
cd energy
pnpm install
```

Create `.env.local`:

```
DATABASE_URL=your_neon_connection_string
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000
EMAIL_SERVER=smtp://user:pass@smtp.example.com:587
```

### Development

```bash
pnpm dev              # start dev server at http://localhost:3000
pnpm build            # production build
pnpm test             # run unit/component tests
pnpm test:e2e         # run e2e tests
pnpm db:push          # push schema to database
```

## Project structure

See `CLAUDE.md` for detailed file structure, architecture conventions, and coding standards.

## Deployment

Deployed to Vercel. Push to `main` triggers production deploy.

## License

Private. All rights reserved.
