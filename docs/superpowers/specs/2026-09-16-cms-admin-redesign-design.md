# CMS Admin Redesign — Design Doc

Date: 2026-09-16
Status: Approved
Scope: `apps/cms` admin panel customization only. No changes to `apps/web`, no changes to the public content API or view models in `packages/content`.

## Goal

Replace the default Payload admin look and feel with a Monfolio-branded, more capable admin:

1. Monfolio theme (colors + typography) across the whole admin, light and dark.
2. Monfolio branding (logo, favicon, collection grouping).
3. A custom dashboard as the admin landing page (counts, recent form submissions, featured projects).
4. Stronger list views (curated columns, search fields, page size).
5. Live preview using Payload's built-in feature, targeting the Astro site.

Explicitly deferred: drag-and-drop reordering (`orderable: true` — schema change), posts preview (no blog page exists in `apps/web` yet).

## Approach

Payload 3 native admin customization only — no third-party admin packages, no forked admin UI. All custom components are registered through `admin.components` and resolved by the `importMap` already configured in `payload.config.ts`.

## 1. Theme

New file `apps/cms/src/admin/theme.scss`, referenced from `payload.config.ts` via `admin.css`.

- Override Payload CSS variables (`--theme-bg`, `--theme-elevation-000` … `--theme-elevation-1000`, `--theme-success`, `--theme-warning`, `--theme-error`, `--theme-text`, `--theme-border`) for the light theme, and again inside Payload's dark-theme mixin for the dark theme.
- Palette and typography match the web app: Plus Jakarta Sans, Monfolio ink/surface/accent tokens (values taken from `apps/web/src/styles/global.css`).
- No per-component styling; variable overrides propagate to every built-in component.

## 2. Branding

- `apps/cms/src/admin/Logo.tsx` registered as `admin.components.graphics.Logo`. Text-based "Monfolio" wordmark that inherits theme colors.
- `admin.meta.icon` set to the Monfolio favicon.
- Collection `admin.group` values tidied into: `Content` (projects, posts, categories, media), `Marketing` (services, testimonials, faqs, globals), `Utilities` (form-submissions, users).

## 3. Dashboard

Override the built-in `dashboard` view via `admin.components.views: { dashboard: { Component } }`.

Component: `apps/cms/src/admin/Dashboard.tsx` (+ `DashboardCounts.tsx`), styled with Payload theme tokens in `apps/cms/src/admin/dashboard.scss`.

Data (REST, same-origin, authenticated):
- Counts per collection: `GET /api/<slug>?limit=1` → `totalDocs`; for `projects`/`posts` also `?where[_status][equals]=draft` for pending drafts.
- Recent form submissions: `GET /api/form-submissions?limit=5&sort=-createdAt`.
- Featured projects: `GET /api/projects?where[featured][equals]=true&limit=3`.

Layout: card grid, each card links to its collection list. Loading and error states handled (no silent blank page).

## 4. List views

Per collection, in each collection file (no new files):

- Curated `admin.defaultColumns`.
- `admin.listSearchableFields` (e.g. projects: title, description; form-submissions: email, name).
- `admin.pagination.resultsPerPage` where useful (form-submissions: 25).

No schema changes in this phase.

## 5. Live preview

`payload.config.ts`:

```ts
admin: {
  livePreview: {
    url: process.env.WEB_URL,
    breakpoints: [desktop 100%, tablet 768, mobile 390],
    collections: ['projects'],
    globals: ['home-page'],
  },
}
```

- `Projects.ts`: `admin.preview: ({ data }) => `${WEB_URL}/work/${data.slug}``
- `HomePage.ts`: `admin.preview: () => WEB_URL`
- Posts: deferred until a blog page exists in `apps/web`.

Honest limitation (accepted): the site is static; the preview iframe shows published content. Drafts are visible only after publish. Payload auto-refreshes the iframe on save.

## File layout

```
apps/cms/src/admin/theme.scss
apps/cms/src/admin/dashboard.scss
apps/cms/src/admin/Logo.tsx
apps/cms/src/admin/Dashboard.tsx
apps/cms/src/admin/DashboardCounts.tsx
apps/cms/src/payload.config.ts        (admin.css, components, livePreview, meta.icon)
apps/cms/src/collections/*.ts         (grouping, columns, searchable fields, preview)
apps/cms/src/globals/HomePage.ts      (preview)
```

## Environment

No new env vars. `WEB_URL` already exists in `apps/cms/.env` and is used for the preview iframe. Live preview requires the web dev server (`pnpm --filter @monfolio/web dev`) to be running.

## Verification

1. `NODE_ENV=development pnpm --filter @monfolio/cms dev` — admin boots, theme applied, logo visible, `/admin` lands on the custom dashboard.
2. With web dev server running: open a project → Live Preview toggle → iframe renders `/work/<slug>`; breakpoints switch.
3. `pnpm typecheck` passes.
4. `pnpm build` passes (web build against running CMS).
5. `generate:types` produces no diff (admin-only changes).
