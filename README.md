# Papertrail

Flyer distribution tracker. Create events and designs, generate flyers, drop them at locations, and track engagement via QR codes.

## What it does

- **Events** — campaigns you're promoting (e.g. a concert, market, open house)
- **Designs** — visual variants of your flyer artwork
- **Flyers** — a pairing of event × design; the thing you print
- **Drops** — a flyer deployed at a specific location, each with a unique QR code
- **Engagements** — QR scans logged when someone picks up a flyer and visits your landing page
- **Visits & Dropoff Attempts** — field team logs who went where, what they left, and whether the location accepted

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

To seed the database with sample data:

```bash
npx dotenv-cli -e .env -- npx tsx prisma/seed.ts
```

## Docs

- [`docs/schema.md`](docs/schema.md) — entity model and data flow
- [`docs/stack.md`](docs/stack.md) — tech stack and deployment

## Stack

Next.js · Prisma · Supabase (Postgres) · Material UI · Vercel
