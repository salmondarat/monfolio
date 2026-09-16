# @monfolio/cms

Payload CMS 3 running on Next.js, backed by PostgreSQL. This app is the admin and API only — the
public site lives in `apps/web` (Astro), and `/` redirects to `/admin`.

See the root [README](../../README.md) and [AGENTS.md](../../AGENTS.md) for commands and conventions.

## Layout

```
src/payload.config.ts   Payload config (collections, globals, adapter, CORS)
src/collections/        Projects, Categories, Services, Testimonials, Posts, FAQs, Media, FormSubmissions, Users
src/globals/            Home page copy, site settings, navigation, announcement bar
src/access/             Access control helpers
src/fields/             Reusable field factories (slug, link, section marker)
src/hooks/              Rebuild webhook fired after content changes
src/seed/               Original site content, used by src/seed.ts
src/payload-types.ts    Generated — do not edit, run `pnpm generate:types`
```

## Local development

```sh
cp .env.example .env    # then set DATABASE_URL and PAYLOAD_SECRET
pnpm dev                # http://localhost:3000/admin
```

Payload pushes schema changes to Postgres automatically in development, so run dev with
`NODE_ENV=development`.

## Migrations

Development relies on schema push. For a deployed database, generate and run migrations:

```sh
pnpm payload migrate:create
pnpm payload migrate
```
