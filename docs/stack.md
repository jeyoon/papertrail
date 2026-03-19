# Tech Stack & Deployment Plan

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js (App Router, TypeScript) |
| Database | Supabase (hosted Postgres) |
| ORM | Prisma |
| UI | Material UI (MUI v7) |
| QR generation | `qrcode` npm package |
| Deployment | Vercel |

## Architecture

```
GitHub repo
    │
    ▼
Vercel (auto-deploy on push)
    │  Next.js app
    │  ├── /app/(admin)    → Admin UI (events, locations, designs, etc.)
    │  └── /app/t/[id]     → Public tracking endpoint
    │
    ▼
Supabase (hosted Postgres)
    └── Prisma schema defines all tables
```

## Key Design Decisions

- `/t/[id]` is the only public-facing route — logs an Engagement and redirects to the event's `landing_url`
- All other routes are behind Supabase Auth (email magic link)
- Prisma migrations run on deploy via build hook — DB stays in sync automatically
- No secrets in the repo — env vars managed in Vercel dashboard
- Cascade deletes are handled manually in server actions via `prisma.$transaction` (leaf records deleted first)

## Environment Variables

```
DATABASE_URL          # Supabase Postgres connection string (pooled)
DIRECT_URL            # Supabase direct connection (for migrations)
NEXT_PUBLIC_APP_URL   # Public base URL (for QR code generation)
```

## Spinning Up a New Environment

1. Create a new Supabase project → copy connection strings
2. Create a new Vercel project → point at the repo, set env vars
3. Push → done
