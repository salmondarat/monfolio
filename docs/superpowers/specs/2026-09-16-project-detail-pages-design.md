# Project Detail Pages — Design

Date: 2026-09-16
Status: Approved (brainstorming session)

## Goal

Every project gets its own detail page at `/work/project/<slug>`, styled after
Behance/Dribbble case-study pages, reachable from the project cards in the grid.
Template style varies by the owning category's existing `page.layout` value.

## Decisions (from brainstorming)

1. **URL**: `/work/project/<slug>` — separate namespace from `/work/<category-slug>`
   (which stays the category page). No slug-conflict risk.
2. **Template selection**: reuse the category's existing `page.layout` field
   (`grid` | `showcase` | `editorial`). No new CMS field for template choice.
3. **CMS content**: one new `gallery` field (`upload`, `hasMany`, → `media`).
   No block-based case-study builder.
4. **Card linking**: the whole card becomes an `<a>`; the category pill inside
   becomes a `<span>` (nested anchors are invalid HTML).

## Template mapping

| `page.layout` | Categories | Detail template |
| --- | --- | --- |
| `showcase` | Custom build, Custom commerce | `CaseStudyLayout` — Behance-style: big hero, full-bleed alternating gallery, quote, storytelling |
| `grid` | Design system, Growth site, Launch site, Studio site | `GalleryLayout` — Dribbble-style: big cover, masonry gallery, minimal copy |
| `editorial` | Migration, Campaign system | `EditorialDetailLayout` — sticky meta sidebar (year, deliverables, metrics), scrolling gallery + narrative |

Unknown layout values fall back to `GalleryLayout`.

## Changes

### apps/cms

- `src/collections/Projects.ts`: add `gallery` field —
  `type: 'upload'`, `hasMany: true`, `relationTo: 'media'`, description
  "Case study images, rendered in order on the detail page."
- Update the `preview` comment/URL to `/work/project/<slug>`.
- Regenerate `src/payload-types.ts` via `pnpm --filter @monfolio/cms generate:types`.
- `src/seed/data.ts`: add 2–4 gallery images per seeded project (Unsplash,
  thematically consistent with each project's card image).

### packages/content

- `src/types.ts`: extend `Project` with `gallery: { url: string; alt: string }[]`.
- `src/collections.ts`:
  - `RawProject` gains `gallery?: unknown`.
  - `mapProject` maps gallery via `mediaUrl(item, 'wide')` + `mediaAlt(item)`;
    empty gallery maps to `[]` (templates handle the fallback).
  - New `getProjectBySlug(slug): Promise<Project | undefined>` — REST
    `where[slug][equals]`, `publishedOnly`, `depth: 1`, `limit: 1`.
- Export `getProjectBySlug` from the package index.

### apps/web

- New route `src/pages/work/project/[slug].astro`:
  - `getStaticPaths` from `getProjects()` (published only — static build).
  - Resolve the project's category (via `getCategories()`) to read
    `page.layout`; pick the layout component (same pattern as
    `work/[slug].astro`).
  - Fetch `getSiteSettings`, `getNavigation`, `getAnnouncement` for `SiteShell`.
  - SEO title/description from project title + description.
- New components in `src/components/project/`:
  - `CaseStudyLayout.astro` — hero (title, meta chips: category / year,
    cover full-width), overview + metrics, full-bleed alternating gallery,
    large quote, deliverables, next-project CTA.
  - `GalleryLayout.astro` — big cover, masonry gallery, minimal copy,
    next-project CTA.
  - `EditorialDetailLayout.astro` — sticky meta column (year, deliverables,
    metrics), scrolling gallery + description, quote, next-project CTA.
- Shared detail pieces (hero meta chips, gallery renderer, next-project
  footer) live inside the three layouts or small shared partials — no new
  global abstractions beyond what the layouts need.
- Styling: existing tokens only (`--color-surface-lift`, `--color-accent`
  #f15533, `--font-display` Plus Jakarta Sans, `--ease-studio`), dark/light
  theme aware, scoped `<style>` per component.

### ProjectCard

- `src/components/ProjectCard.astro`: wrap the card in
  `<a href="/work/project/${project.slug}">`; the category pill becomes a
  `<span class="project-cat-pill">` (same styling, no link). Hover states
  keep working via the anchor.

### Next-project link

- Each detail page footer links to the next project by `order`
  (wrap-around to the first project after the last).

## Fallbacks & error handling

- Project with empty gallery → render the card image as the single visual.
- Unknown `page.layout` → `GalleryLayout`.
- Unknown slug → Astro's built-in 404 (static paths only include published
  projects).

## Verification

1. `pnpm typecheck` (all three packages).
2. `pnpm build` with the CMS running (`NODE_ENV=development` for the CMS dev
   server; `PUBLIC_CMS_URL` must be reachable).
3. Visual check of all three templates on the dev server (:4321), dark and
   light theme.
4. Stop dev servers afterwards (ports 4321 and 3000 must be free).
