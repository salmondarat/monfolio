# Monfolio

Marketing site for a design & build studio: an Astro frontend fed by a Payload CMS, organised as a
Turborepo monorepo.

```
apps/web          Astro 7 site (static)
apps/cms          Payload CMS 3 + PostgreSQL, admin at /admin
packages/content  typed CMS client and mappers
packages/tsconfig shared TypeScript config
```

## Getting started

You need Node >= 22.12, pnpm, and a PostgreSQL database.

```sh
pnpm install

# 1. Configure the CMS
cp apps/cms/.env.example apps/cms/.env      # then set DATABASE_URL and PAYLOAD_SECRET
createdb monfolio_cms

# 2. Point the site at the CMS
cp apps/web/.env.example apps/web/.env      # PUBLIC_CMS_URL

# 3. Run both apps (cms :3000, web :4321)
pnpm dev
```

Open <http://localhost:3000/admin> and create the first admin user. The CMS creates its tables on
first boot in development.

## Loading the content

The site's original content ships as a seed script:

```sh
pnpm --filter @monfolio/cms seed              # skips if projects already exist
SEED_RESET=1 pnpm --filter @monfolio/cms seed # wipe and reseed
```

## How content reaches the site

`apps/web` is a static build. It fetches from the CMS REST API when `astro build` runs, so **the CMS
must be reachable at build time** via `PUBLIC_CMS_URL`.

Set `REVALIDATE_WEBHOOK_URL` in `apps/cms/.env` to a deploy hook and the CMS will ping it after any
content change, triggering a rebuild. Left empty, the hook is a no-op.

## Commands

| Command | Action |
| :--- | :--- |
| `pnpm dev` | Both dev servers |
| `pnpm build` | Build both apps |
| `pnpm typecheck` | Type-check every package |
| `pnpm --filter @monfolio/cms generate:types` | Regenerate Payload types |
| `pnpm --filter @monfolio/cms seed` | Seed content |

## Notes

- The CMS runs Next.js with `--webpack`; Turbopack cannot resolve `next` through the pnpm 12
  workspace layout used here.
- Uploaded media is written to `apps/cms/media` in development. Production needs an S3-compatible
  storage plugin.
