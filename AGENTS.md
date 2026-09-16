# Monfolio — agent notes

Turborepo monorepo: an Astro marketing site plus a Payload CMS that feeds it.

## Layout

```
apps/web   Astro 7 site (static output), reads content from the CMS at build time
apps/cms   Payload CMS 3 on Next.js + PostgreSQL, admin UI at /admin
packages/content       typed CMS client + mappers (the only way apps/web talks to the CMS)
packages/tsconfig      shared TypeScript base config
```

## Commands

Run everything from the repo root.

| Command | Action |
| :--- | :--- |
| `pnpm install` | Install the workspace |
| `pnpm dev` | Turbo runs both dev servers (web :4321, cms :3000) |
| `pnpm build` | Turbo builds both apps |
| `pnpm typecheck` | `tsc --noEmit` in cms/content, `astro check` in web |
| `pnpm --filter @monfolio/cms generate:types` | Regenerate `apps/cms/src/payload-types.ts` after changing the Payload config |
| `pnpm --filter @monfolio/cms seed` | Load the original site content into the CMS (needs `SEED_RESET=1` to wipe first) |

For a single app, filter it: `pnpm --filter @monfolio/web dev`.

When starting a dev server from an agent session, run it in background mode and remember to stop it
afterwards — do not leave ports 4321 or 3000 occupied.

## Environment

Turbo does **not** load `.env` files. Each app loads its own:

- `apps/cms/.env` — `DATABASE_URL`, `PAYLOAD_SECRET`, `NEXT_PUBLIC_SERVER_URL`, `WEB_URL`,
  `REVALIDATE_WEBHOOK_URL` (optional; empty disables the rebuild hook)
- `apps/web/.env` — `PUBLIC_CMS_URL` (read at build time)

Both have a `.env.example` next to them.

## Things that will bite you

- **The ambient shell may have `NODE_ENV=production`.** Payload only pushes schema changes to
  Postgres in development, so run CMS dev and the seed with `NODE_ENV=development`.
- **The CMS runs `next dev --webpack` / `next build --webpack` on purpose.** Turbopack cannot resolve
  the `next` package through this pnpm 12 workspace layout (`Could not find the Next.js package`).
  Do not switch the scripts back to Turbopack without verifying that first.
- **`apps/web` builds against a running CMS.** `PUBLIC_CMS_URL` must be reachable at build time, or
  the build fails loudly. There is no fallback content on purpose.
- **Seed scripts must use top-level `await`.** `payload run <file>` awaits the dynamic import and then
  immediately calls `process.exit(0)`, so anything detached into an un-awaited promise never runs.
- **Schema changes need a restart.** Editing `apps/cms/src/payload.config.ts` changes the Drizzle
  schema; Payload pushes it on the next CMS boot.

## Content model

Collections: `projects`, `categories`, `services`, `testimonials`, `posts`, `faqs`, `media`,
`form-submissions`, `users`.
Globals: `home-page`, `site-settings`, `navigation`, `announcement`.

- `projects` and `posts` use drafts; anonymous readers only ever see `_status: published`.
- `categories` carry both a unique `key` and a `filter`. The `filter` value is what the project grid
  filter tabs match; several categories can share one filter (e.g. "Custom commerce" → `custom-build`).
- `heading`-style fields on `home-page` allow inline HTML so the original decorative markup
  (`<em>`, `<br />`, chip spans) survives. Templates render them with `set:html`.
- The public contact form POSTs straight to `/api/form-submissions`, which allows anonymous `create`
  but restricts `read`/`update`/`delete` to authenticated admins.

## Frontend data flow

`apps/web` never touches Payload document shapes directly. `@monfolio/content` fetches over REST and
maps documents to the view models in `packages/content/src/types.ts`. When you add or rename a CMS
field, update the matching mapper in `packages/content/src/collections.ts` or
`packages/content/src/globals.ts` — mapping is where the two shapes are reconciled.

## Documentation

- Astro: https://docs.astro.build
- Payload: https://payloadcms.com/docs
- Turborepo: https://turbo.build/repo/docs
