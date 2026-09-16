# Project Detail Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Every published project gets a Behance/Dribbble-style detail page at `/work/project/<slug>`, linked from the project grid cards, with template style chosen by the owning category's `page.layout`.

**Architecture:** New `gallery` upload field on the Payload `projects` collection; `@monfolio/content` maps it and exposes `getProjectBySlug`; a new Astro route `work/project/[slug].astro` picks one of three layout components (`CaseStudyLayout` / `GalleryLayout` / `EditorialDetailLayout`) based on the project's category `page.layout`. Project cards wrap in an anchor to the detail page.

**Tech Stack:** Payload CMS 3 (Next.js + Postgres), Astro 7 static output, TypeScript, `@monfolio/content` REST bridge, existing CSS tokens in `apps/web/src/styles/global.css`.

**Spec:** `docs/superpowers/specs/2026-09-16-project-detail-pages-design.md`

## Global Constraints

- Monorepo commands run from repo root with pnpm. Turbo does NOT load `.env`.
- CMS dev server and seed MUST run with `NODE_ENV=development` (ambient shell may have `NODE_ENV=production`; Payload only pushes schema changes in development).
- CMS dev/build uses `--webpack` — never switch to Turbopack.
- `apps/web` build requires a reachable CMS (`PUBLIC_CMS_URL`); no fallback content.
- After changing Payload config, run `pnpm --filter @monfolio/cms generate:types`.
- Schema changes need a CMS restart to push the Drizzle schema.
- Styling uses existing tokens only: `--color-surface`, `--color-surface-lift`, `--color-ink`, `--color-muted`, `--color-line`, `--color-accent` (#f15533), `--font-display` (Plus Jakarta Sans), `--ease-studio`. Dark/light theme aware (no hardcoded light-only colors).
- No test framework exists in this repo — verification gates are `pnpm typecheck` and `pnpm build`, plus visual checks.
- Dev servers must be stopped after verification (ports 4321 and 3000 free).
- Seed scripts must use top-level `await` (`payload run` exits immediately).

---

### Task 1: CMS `gallery` field + regenerated types

**Files:**
- Modify: `apps/cms/src/collections/Projects.ts` (fields array, after `imageAlt` field ~line 88; `preview` comment ~line 19)
- Modify: `apps/cms/src/payload-types.ts` (generated — do not hand-edit)

**Interfaces:**
- Consumes: existing `Media` collection (`slug: 'media'`, sizes `thumbnail|card|wide`).
- Produces: `projects` documents now carry `gallery: (number|string)[] | null` (media IDs, populated docs at depth ≥ 1). Later tasks read `gallery` via the mapper.

- [ ] **Step 1: Add the gallery field**

In `apps/cms/src/collections/Projects.ts`, inside `fields`, directly after the `imageAlt` field object, add:

```typescript
    {
      name: 'gallery',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      admin: {
        description: 'Case study images, rendered in order on the detail page.',
      },
    },
```

- [ ] **Step 2: Update the admin preview target**

Replace the comment and preview function (around line 19–24):

```typescript
    // Per-project detail page.
    preview: ({ data }) => {
      const base = process.env.WEB_URL ?? 'http://localhost:4321'
      const slug = (data as { slug?: string })?.slug
      return slug ? `${base}/work/project/${slug}` : base
    },
```

- [ ] **Step 3: Regenerate Payload types**

Run: `pnpm --filter @monfolio/cms generate:types`
Expected: `apps/cms/src/payload-types.ts` regenerated; `Project` interface gains `gallery?: (number | string)[] | null` (plus populated variants).

- [ ] **Step 4: Typecheck**

Run: `pnpm --filter @monfolio/cms typecheck` (or `pnpm typecheck` from root)
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add apps/cms/src/collections/Projects.ts apps/cms/src/payload-types.ts
git commit -m "feat(cms): gallery field on projects for detail pages"
```

---

### Task 2: Content bridge — gallery mapping + `getProjectBySlug`

**Files:**
- Modify: `packages/content/src/types.ts` (add type ~line 11; extend `Project` ~line 13–31)
- Modify: `packages/content/src/collections.ts` (`RawProject` ~line 22, `mapProject` ~line 42, new function after `getProjects` ~line 76)

**Interfaces:**
- Consumes: `mediaUrl(value, 'wide')`, `mediaAlt(value)` from `./media`; `fetchCollection`, `publishedOnly` from `./client`; `mapProject`.
- Produces:
  - `export type ProjectGalleryImage = { url: string; alt: string }`
  - `Project.gallery: ProjectGalleryImage[]` (always an array; `[]` when unset)
  - `export const getProjectBySlug = async (slug: string): Promise<Project | undefined>`
  - Both exported via `packages/content/src/index.ts` (`export *` already re-exports `collections.ts` and `types.ts` — no index change needed).

- [ ] **Step 1: Add the type**

In `packages/content/src/types.ts`, after `ProjectSize` (line 11), add:

```typescript
export type ProjectGalleryImage = {
  url: string
  alt: string
}
```

In the `Project` type, after `imageAlt: string`, add:

```typescript
  /** Case study images in display order; empty when the project has no gallery. */
  gallery: ProjectGalleryImage[]
```

- [ ] **Step 2: Extend `RawProject` and `mapProject`**

In `packages/content/src/collections.ts`, add `gallery?: unknown` to `RawProject`. Add the mapper helper above `mapProject`:

```typescript
export const mapGallery = (value: unknown): ProjectGalleryImage[] =>
  Array.isArray(value)
    ? value
        .map((item) => ({ url: mediaUrl(item, 'wide'), alt: mediaAlt(item) }))
        .filter((item): item is ProjectGalleryImage => item.url !== '')
    : []
```

Add `ProjectGalleryImage` to the type imports from `./types`. In `mapProject`'s returned object, after `imageAlt`, add:

```typescript
    gallery: mapGallery(doc.gallery),
```

- [ ] **Step 3: Add `getProjectBySlug`**

After `getProjects` in `packages/content/src/collections.ts`:

```typescript
export const getProjectBySlug = async (slug: string): Promise<Project | undefined> => {
  const docs = await fetchCollection<RawProject>('projects', {
    ...publishedOnly,
    depth: 1,
    limit: 1,
    'where[slug][equals]': slug,
  })

  const doc = docs[0]
  return doc ? mapProject(doc) : undefined
}
```

- [ ] **Step 4: Typecheck**

Run: `pnpm typecheck`
Expected: PASS (all three packages — `mapProject` callers in `globals.ts` consume the extended `Project` type without breakage since `gallery` is additive).

- [ ] **Step 5: Commit**

```bash
git add packages/content/src/types.ts packages/content/src/collections.ts
git commit -m "feat(content): project gallery mapping and getProjectBySlug"
```

---

### Task 3: Seed gallery images

**Files:**
- Modify: `apps/cms/src/seed/data.ts` (each entry in `projects`, lines 114–223)
- Modify: `apps/cms/src/seed.ts` (upload loop ~line 144, project create ~line 185)

**Interfaces:**
- Consumes: `uploadImage(payload, url, alt)` in `seed.ts`; `unsplash(id, width?)` helper in `data.ts`.
- Produces: seeded projects with populated `gallery` media IDs.

- [ ] **Step 1: Add gallery entries to seed data**

In `apps/cms/src/seed/data.ts`, add a `gallery` array to each project in `projects`. Use distinct Unsplash photo IDs thematically consistent with each project's card image. Exact entries:

```typescript
    // Mora Coffee (custom-build, coffee shop)
    gallery: [
      { url: unsplash('1495474472287-4d71bcdd2085'), alt: 'Mora Coffee homepage hero on desktop' },
      { url: unsplash('1447933601403-0c6688de566e'), alt: 'Coffee beans and brewing equipment detail' },
      { url: unsplash('1442512595191-816bb52a0ace'), alt: 'Barista pouring a flat white at the counter' },
    ],
```

```typescript
    // Form / Function (design-system, materials studio)
    gallery: [
      { url: unsplash('1581291518857-4e27b48ff24e'), alt: 'Component library overview page' },
      { url: unsplash('1524758631624-e3c20b28a1af'), alt: 'Material samples arranged on a studio table' },
    ],
```

```typescript
    // Good News Daily (migration, editorial)
    gallery: [
      { url: unsplash('1504711434969-e33886168f5c'), alt: 'Newly designed article template' },
      { url: unsplash('1495020689067-958852a7765e'), alt: 'Rolls of newsprint in a printing hall' },
    ],
```

```typescript
    // Kite Finance (growth-site)
    gallery: [
      { url: unsplash('1554224155-6726b3ff858f'), alt: 'Kite Finance landing page with pricing section' },
      { url: unsplash('1460925895917-afdab827c52f'), alt: 'Analytics dashboard with growth charts' },
    ],
```

```typescript
    // Nara Objects (custom-commerce)
    gallery: [
      { url: unsplash('1610701596007-11502861dcfa'), alt: 'Product listing grid for ceramic objects' },
      { url: unsplash('1578749472219-02ba66a4b3b3'), alt: 'Ceramic vessel detail in studio light' },
      { url: unsplash('1493106819501-66d381c466f9'), alt: 'Packaging and unboxing sequence' },
    ],
```

```typescript
    // Pollen Club (launch-site)
    gallery: [
      { url: unsplash('1490750967868-88aa4486c946'), alt: 'Pollen Club launch page hero' },
      { url: unsplash('1466781783364-36c955e42a7f'), alt: 'Wildflower meadow at golden hour' },
    ],
```

```typescript
    // Field Notes (campaign-system)
    gallery: [
      { url: unsplash('1506905925346-21bda4d32df4'), alt: 'Field Notes campaign landing above the clouds' },
      { url: unsplash('1464822759023-fed622ff2c3b'), alt: 'Hiker on a ridge trail at sunrise' },
      { url: unsplash('1441974231531-c6227db76b6e'), alt: 'Forest canopy from the trail' },
    ],
```

```typescript
    // Arc Studio (studio-site)
    gallery: [
      { url: unsplash('1486406146926-c627a92ad1ab'), alt: 'Arc Studio portfolio index page' },
      { url: unsplash('1487958449943-2429e8be8625'), alt: 'Concrete building detail in daylight' },
    ],
```

- [ ] **Step 2: Upload gallery images and pass IDs in `seed.ts`**

In `apps/cms/src/seed.ts`, replace the project image upload loop (lines 144–147) with:

```typescript
  payload.logger.info('Uploading imagery…')
  const projectImages = new Map<string, Id | undefined>()
  const projectGalleries = new Map<string, Id[]>()
  for (const project of projects) {
    projectImages.set(project.title, await uploadImage(payload, project.image, project.imageAlt))

    const galleryIds: Id[] = []
    for (const item of project.gallery ?? []) {
      const id = await uploadImage(payload, item.url, item.alt)
      if (id !== undefined) galleryIds.push(id)
    }
    projectGalleries.set(project.title, galleryIds)
  }
```

In the project `payload.create` data object (line 187), after `imageAlt: project.imageAlt,` add:

```typescript
        gallery: projectGalleries.get(project.title) ?? [],
```

- [ ] **Step 3: Typecheck**

Run: `pnpm --filter @monfolio/cms typecheck`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add apps/cms/src/seed/data.ts apps/cms/src/seed.ts
git commit -m "feat(cms): seed gallery images for project detail pages"
```

---

### Task 4: ProjectCard links to detail page

**Files:**
- Modify: `apps/web/src/components/ProjectCard.astro` (markup lines 6–34)

**Interfaces:**
- Consumes: `Project.slug` from `@monfolio/content`.
- Produces: every rendered card is an `<a href="/work/project/<slug>">`. Callers (`index.astro` grid, `GridLayout.astro`) need no changes — the component's outer element changes from `<article>` to `<a>` but keeps `class="project-card"` and the same data attributes.

- [ ] **Step 1: Wrap the card in an anchor**

In `apps/web/src/components/ProjectCard.astro`, change the outer element and the category pill:

```astro
---
import type { Project } from '@monfolio/content';
import ProjectVisual from './ProjectVisual.astro';
const { project, index } = Astro.props as { project: Project; index?: number };
---
<a
  class="project-card"
  href={`/work/project/${project.slug}`}
  data-category={project.categoryKey}
  data-index={index}
  data-fade-stagger
>
  <div class="project-visual-wrap">
    <ProjectVisual image={project.image} imageAlt={project.imageAlt} />
  </div>
  <div class="project-caption">
    <div class="project-info">
      <div class="project-meta-row">
        <span class="project-cat-pill">{project.category.split('/')[0].trim()}</span>
        <span class="project-year">{project.year}</span>
      </div>
      <h3 class="project-title">{project.title}</h3>
      <p class="project-desc">{project.description}</p>
      {project.metrics.length > 0 && (
        <div class="project-metrics">
          {project.metrics.map((metric) => <span class="metric">{metric}</span>)}
        </div>
      )}
    </div>
    <div class="project-footer">
      <span class="project-action">View case study</span>
      <span class="project-arrow" aria-hidden="true">↗</span>
    </div>
  </div>
</a>
```

(The `<style>` block is unchanged — selectors are class-based and still apply.)

- [ ] **Step 2: Typecheck**

Run: `pnpm --filter @monfolio/web typecheck` (or root `pnpm typecheck`)
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/components/ProjectCard.astro
git commit -m "feat(web): project cards link to detail pages"
```

---

### Task 5: Detail route + three layout components

**Files:**
- Create: `apps/web/src/pages/work/project/[slug].astro`
- Create: `apps/web/src/components/project/NextProject.astro`
- Create: `apps/web/src/components/project/CaseStudyLayout.astro`
- Create: `apps/web/src/components/project/GalleryLayout.astro`
- Create: `apps/web/src/components/project/EditorialDetailLayout.astro`

**Interfaces:**
- Consumes: `getProjects`, `getCategories`, `getSiteSettings`, `getNavigation`, `getAnnouncement`, types `Project`, `Category` from `@monfolio/content`; `SiteShell` (props: `settings`, `navigation`, `announcement`, `title?`, `description?`); `ProjectVisual` (props: `image`, `imageAlt`).
- Produces: static routes `/work/project/<slug>` for every published project. Each layout receives props `{ project: Project; next: Project; category?: Category }`.

- [ ] **Step 1: Create the route**

`apps/web/src/pages/work/project/[slug].astro`:

```astro
---
import type { Category, Project } from '@monfolio/content';
import {
  getAnnouncement,
  getCategories,
  getNavigation,
  getProjects,
  getSiteSettings,
} from '@monfolio/content';
import SiteShell from '../../../layouts/SiteShell.astro';
import CaseStudyLayout from '../../../components/project/CaseStudyLayout.astro';
import GalleryLayout from '../../../components/project/GalleryLayout.astro';
import EditorialDetailLayout from '../../../components/project/EditorialDetailLayout.astro';

export const getStaticPaths = async () => {
  const projects = await getProjects();

  return projects.map((project, index) => ({
    params: { slug: project.slug },
    props: {
      project,
      next: projects[(index + 1) % projects.length],
    },
  }));
};

const { project, next } = Astro.props as { project: Project; next: Project };

const categories = await getCategories();
const category = categories.find((entry) => entry.slug === project.categorySlug);
const layout = category?.page.layout ?? 'grid';

const [settings, navigation, announcement] = await Promise.all([
  getSiteSettings(),
  getNavigation(),
  getAnnouncement(),
]);

const layouts = {
  grid: GalleryLayout,
  showcase: CaseStudyLayout,
  editorial: EditorialDetailLayout,
};

const DetailLayout = layouts[layout] ?? GalleryLayout;

const title = `${project.title} — ${settings.title}`;
const description = project.description;
---
<SiteShell
  settings={settings}
  navigation={navigation}
  announcement={announcement}
  title={title}
  description={description}
>
  <DetailLayout project={project} next={next} category={category} />
</SiteShell>
```

- [ ] **Step 2: Create the shared next-project footer**

`apps/web/src/components/project/NextProject.astro`:

```astro
---
import type { Project } from '@monfolio/content';
const { project } = Astro.props as { project: Project };
---
<a class="next-project" href={`/work/project/${project.slug}`}>
  <span class="next-label">Next project</span>
  <span class="next-title">{project.title}</span>
  <span class="next-arrow" aria-hidden="true">→</span>
</a>

<style>
  .next-project {
    display: flex;
    align-items: center;
    gap: 1.25rem;
    padding: 2.5rem 0;
    border-top: 1px solid var(--color-line);
    text-decoration: none;
  }
  .next-label {
    font-size: 11px;
    font-weight: 800;
    letter-spacing: .14em;
    text-transform: uppercase;
    color: var(--color-muted);
  }
  .next-title {
    font-family: var(--font-display);
    font-size: 1.6rem;
    font-weight: 700;
    letter-spacing: -0.03em;
    color: var(--color-ink);
    transition: color .3s ease;
  }
  .next-project:hover .next-title { color: var(--color-accent); }
  .next-arrow {
    margin-left: auto;
    display: flex;
    height: 2.5rem;
    width: 2.5rem;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    border: 1px solid var(--color-line);
    color: var(--color-ink);
    background: var(--color-surface);
    transition: all .4s var(--ease-studio);
  }
  .next-project:hover .next-arrow {
    background: var(--color-accent);
    border-color: var(--color-accent);
    color: #fff;
    transform: translateX(4px);
  }
</style>
```

- [ ] **Step 3: Create `CaseStudyLayout.astro`** (showcase categories — Behance-style)

`apps/web/src/components/project/CaseStudyLayout.astro`:

```astro
---
import type { Category, Project } from '@monfolio/content';
import ProjectVisual from '../ProjectVisual.astro';
import NextProject from './NextProject.astro';

const { project, next, category } = Astro.props as {
  project: Project;
  next: Project;
  category?: Category;
};

const visuals = project.gallery.length > 0
  ? project.gallery
  : [{ url: project.image, alt: project.imageAlt }];
---
<article class="case-study">
  <header class="cs-hero">
    <div class="cs-hero-inner">
      <p class="cs-eyebrow">{category?.name ?? project.category.split('/')[0].trim()} · Case study</p>
      <h1 class="cs-title">{project.title}</h1>
      <p class="cs-desc">{project.description}</p>
      <div class="cs-meta">
        <span class="cs-chip">{project.year}</span>
        {project.metrics.map((metric) => <span class="cs-chip cs-chip-accent">{metric}</span>)}
      </div>
    </div>
    <div class="cs-cover">
      <ProjectVisual image={visuals[0]?.url ?? ''} imageAlt={visuals[0]?.alt ?? project.imageAlt} />
    </div>
  </header>

  <div class="cs-body">
    {project.deliverables.length > 0 && (
      <section class="cs-section">
        <h2 class="cs-heading">Delivered</h2>
        <ul class="cs-deliverables">
          {project.deliverables.map((item) => <li>{item}</li>)}
        </ul>
      </section>
    )}

    <section class="cs-gallery">
      {visuals.slice(1).map((image, index) => (
        <figure class:list={['cs-figure', { 'cs-figure-wide': index % 2 === 0 }]}>
          <img src={image.url} alt={image.alt} loading="lazy" decoding="async" />
        </figure>
      ))}
    </section>

    {project.quote && (
      <section class="cs-section">
        <blockquote class="cs-quote">{project.quote}</blockquote>
      </section>
    )}
  </div>

  <footer class="cs-footer">
    <NextProject project={next} />
  </footer>
</article>

<style>
  .case-study { display: block; }
  .cs-hero { padding: 4rem 1.5rem 0; }
  .cs-hero-inner { max-width: 56rem; margin: 0 auto; }
  .cs-eyebrow {
    font-size: 11px; font-weight: 800; letter-spacing: .14em;
    text-transform: uppercase; color: var(--color-accent);
  }
  .cs-title {
    margin-top: 0.75rem;
    font-family: var(--font-display);
    font-size: clamp(2.25rem, 6vw, 4rem);
    font-weight: 700; letter-spacing: -0.04em; line-height: 1.05;
    color: var(--color-ink);
  }
  .cs-desc { margin-top: 1rem; max-width: 40rem; font-size: 1rem; line-height: 1.7; color: var(--color-muted); }
  .cs-meta { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 1.5rem; }
  .cs-chip {
    border: 1px solid var(--color-line); border-radius: 999px;
    padding: 0.35rem 0.8rem; font-size: 11px; font-weight: 600;
    color: var(--color-muted); background: var(--color-surface-lift);
  }
  .cs-chip-accent {
    color: var(--color-accent);
    border-color: color-mix(in srgb, var(--color-accent) 40%, var(--color-line));
  }
  .cs-cover { max-width: 72rem; margin: 2.5rem auto 0; }
  .cs-body { max-width: 56rem; margin: 0 auto; padding: 3rem 1.5rem 0; }
  .cs-section { margin-bottom: 3rem; }
  .cs-heading {
    font-size: 11px; font-weight: 800; letter-spacing: .14em;
    text-transform: uppercase; color: var(--color-muted);
  }
  .cs-deliverables {
    margin-top: 1rem; padding: 0; list-style: none;
    display: flex; flex-wrap: wrap; gap: 0.5rem;
  }
  .cs-deliverables li {
    border: 1px solid var(--color-line); border-radius: 999px;
    padding: 0.4rem 0.9rem; font-size: 12px; font-weight: 600; color: var(--color-ink);
    background: var(--color-surface-lift);
  }
  .cs-gallery { display: flex; flex-direction: column; gap: 1.5rem; margin-bottom: 3rem; }
  .cs-figure { margin: 0; overflow: hidden; border-radius: 1rem; }
  .cs-figure img { display: block; width: 100%; height: auto; }
  .cs-figure-wide { max-width: 72rem; margin-left: -3rem; margin-right: -3rem; }
  @media (max-width: 48rem) { .cs-figure-wide { margin-left: 0; margin-right: 0; } }
  .cs-quote {
    margin: 0; padding: 0 0 0 1.5rem;
    border-left: 3px solid var(--color-accent);
    font-family: var(--font-display);
    font-size: clamp(1.25rem, 3vw, 1.75rem);
    font-weight: 600; letter-spacing: -0.02em; line-height: 1.4;
    color: var(--color-ink);
  }
  .cs-footer { max-width: 56rem; margin: 0 auto; padding: 0 1.5rem 2rem; }
</style>
```

- [ ] **Step 4: Create `GalleryLayout.astro`** (grid categories — Dribbble-style)

`apps/web/src/components/project/GalleryLayout.astro`:

```astro
---
import type { Category, Project } from '@monfolio/content';
import NextProject from './NextProject.astro';

const { project, next, category } = Astro.props as {
  project: Project;
  next: Project;
  category?: Category;
};

const visuals = project.gallery.length > 0
  ? project.gallery
  : [{ url: project.image, alt: project.imageAlt }];
---
<article class="gallery-detail">
  <header class="gd-hero">
    <p class="gd-eyebrow">{category?.name ?? project.category.split('/')[0].trim()} · {project.year}</p>
    <h1 class="gd-title">{project.title}</h1>
    <p class="gd-desc">{project.description}</p>
  </header>

  <div class="gd-grid">
    {visuals.map((image) => (
      <figure class="gd-figure">
        <img src={image.url} alt={image.alt} loading="lazy" decoding="async" />
      </figure>
    ))}
  </div>

  <footer class="gd-footer">
    <NextProject project={next} />
  </footer>
</article>

<style>
  .gallery-detail { display: block; }
  .gd-hero { max-width: 56rem; margin: 0 auto; padding: 4rem 1.5rem 0; text-align: center; }
  .gd-eyebrow {
    font-size: 11px; font-weight: 800; letter-spacing: .14em;
    text-transform: uppercase; color: var(--color-accent);
  }
  .gd-title {
    margin-top: 0.75rem;
    font-family: var(--font-display);
    font-size: clamp(2rem, 5vw, 3.25rem);
    font-weight: 700; letter-spacing: -0.04em; line-height: 1.08;
    color: var(--color-ink);
  }
  .gd-desc { margin: 1rem auto 0; max-width: 36rem; font-size: 0.95rem; line-height: 1.7; color: var(--color-muted); }
  .gd-grid {
    max-width: 72rem; margin: 3rem auto 0; padding: 0 1.5rem;
    columns: 2; column-gap: 1.5rem;
  }
  @media (max-width: 48rem) { .gd-grid { columns: 1; } }
  .gd-figure { margin: 0 0 1.5rem; break-inside: avoid; overflow: hidden; border-radius: 1rem; }
  .gd-figure img { display: block; width: 100%; height: auto; }
  .gd-footer { max-width: 56rem; margin: 0 auto; padding: 0 1.5rem 2rem; }
</style>
```

- [ ] **Step 5: Create `EditorialDetailLayout.astro`** (editorial categories — sticky meta sidebar)

`apps/web/src/components/project/EditorialDetailLayout.astro`:

```astro
---
import type { Category, Project } from '@monfolio/content';
import NextProject from './NextProject.astro';

const { project, next, category } = Astro.props as {
  project: Project;
  next: Project;
  category?: Category;
};

const visuals = project.gallery.length > 0
  ? project.gallery
  : [{ url: project.image, alt: project.imageAlt }];
---
<article class="editorial-detail">
  <header class="ed-hero">
    <p class="ed-eyebrow">{category?.name ?? project.category.split('/')[0].trim()} · Case study</p>
    <h1 class="ed-title">{project.title}</h1>
  </header>

  <div class="ed-body">
    <aside class="ed-meta">
      <div class="ed-meta-block">
        <span class="ed-label">Year</span>
        <span class="ed-value">{project.year}</span>
      </div>
      {project.deliverables.length > 0 && (
        <div class="ed-meta-block">
          <span class="ed-label">Deliverables</span>
          <ul class="ed-list">
            {project.deliverables.map((item) => <li>{item}</li>)}
          </ul>
        </div>
      )}
      {project.metrics.length > 0 && (
        <div class="ed-meta-block">
          <span class="ed-label">Results</span>
          <ul class="ed-list">
            {project.metrics.map((item) => <li>{item}</li>)}
          </ul>
        </div>
      )}
    </aside>

    <div class="ed-content">
      <p class="ed-intro">{project.description}</p>
      <div class="ed-gallery">
        {visuals.map((image) => (
          <figure class="ed-figure">
            <img src={image.url} alt={image.alt} loading="lazy" decoding="async" />
          </figure>
        ))}
      </div>
      {project.quote && <blockquote class="ed-quote">{project.quote}</blockquote>}
    </div>
  </div>

  <footer class="ed-footer">
    <NextProject project={next} />
  </footer>
</article>

<style>
  .editorial-detail { display: block; }
  .ed-hero { max-width: 72rem; margin: 0 auto; padding: 4rem 1.5rem 0; }
  .ed-eyebrow {
    font-size: 11px; font-weight: 800; letter-spacing: .14em;
    text-transform: uppercase; color: var(--color-accent);
  }
  .ed-title {
    margin-top: 0.75rem;
    font-family: var(--font-display);
    font-size: clamp(2rem, 5vw, 3.5rem);
    font-weight: 700; letter-spacing: -0.04em; line-height: 1.08;
    color: var(--color-ink);
  }
  .ed-body {
    max-width: 72rem; margin: 3rem auto 0; padding: 0 1.5rem;
    display: grid; grid-template-columns: 16rem 1fr; gap: 3rem;
    align-items: start;
  }
  @media (max-width: 64rem) { .ed-body { grid-template-columns: 1fr; gap: 2rem; } }
  .ed-meta {
    position: sticky; top: 6rem;
    display: flex; flex-direction: column; gap: 1.5rem;
  }
  .ed-meta-block { border-top: 1px solid var(--color-line); padding-top: 1rem; }
  .ed-label {
    display: block;
    font-size: 10px; font-weight: 800; letter-spacing: .14em;
    text-transform: uppercase; color: var(--color-muted);
  }
  .ed-value { margin-top: 0.5rem; font-size: 0.95rem; font-weight: 600; color: var(--color-ink); }
  .ed-list { margin: 0.5rem 0 0; padding: 0; list-style: none; display: flex; flex-direction: column; gap: 0.35rem; }
  .ed-list li { font-size: 0.85rem; line-height: 1.5; color: var(--color-muted); }
  .ed-intro { font-size: 1.05rem; line-height: 1.75; color: var(--color-muted); max-width: 40rem; }
  .ed-gallery { display: flex; flex-direction: column; gap: 1.5rem; margin-top: 2rem; }
  .ed-figure { margin: 0; overflow: hidden; border-radius: 1rem; }
  .ed-figure img { display: block; width: 100%; height: auto; }
  .ed-quote {
    margin: 2.5rem 0 0; padding: 0 0 0 1.5rem;
    border-left: 3px solid var(--color-accent);
    font-family: var(--font-display);
    font-size: clamp(1.15rem, 2.5vw, 1.5rem);
    font-weight: 600; letter-spacing: -0.02em; line-height: 1.4;
    color: var(--color-ink);
  }
  .ed-footer { max-width: 72rem; margin: 0 auto; padding: 2rem 1.5rem 2rem; }
</style>
```

- [ ] **Step 6: Typecheck**

Run: `pnpm typecheck`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add apps/web/src/pages/work/project apps/web/src/components/project
git commit -m "feat(web): project detail route with three category templates"
```

---

### Task 6: Build + visual verification

**Files:** none (verification only)

**Interfaces:**
- Consumes: everything from Tasks 1–5.

- [ ] **Step 1: Start the CMS dev server (background, correct NODE_ENV)**

```bash
cd apps/cms && NODE_ENV=development pnpm dev
```
Run in background. Wait for "ready" on :3000. Schema push happens on boot (gallery field reaches Postgres).

- [ ] **Step 2: Reseed if the database predates the gallery field**

```bash
cd apps/cms && NODE_ENV=development SEED_RESET=1 pnpm seed
```
Expected: "Seed complete." (Only needed if projects exist without gallery data; a fresh DB seeds without reset.)

- [ ] **Step 3: Start the web dev server (background)**

```bash
cd apps/web && pnpm dev
```
Wait for :4321.

- [ ] **Step 4: Visual check**

Visit and verify (dark AND light theme):
- `http://localhost:4321/` — cards link to `/work/project/<slug>`; hover states intact.
- `http://localhost:4321/work/project/mora-coffee` — CaseStudyLayout (showcase category): hero, chips, full-bleed gallery, quote, next-project footer.
- `http://localhost:4321/work/project/form-function` — GalleryLayout (grid category): centered hero, masonry columns.
- `http://localhost:4321/work/project/good-news-daily` — EditorialDetailLayout (editorial category): sticky meta sidebar.
- Category pill inside cards is a non-link span; no nested-anchor console errors.

- [ ] **Step 5: Full build**

With the CMS still running:
```bash
pnpm build
```
Expected: both apps build; web statically generates all `/work/project/*` pages.

- [ ] **Step 6: Stop dev servers**

Kill both background dev servers; verify ports 4321 and 3000 are free.

- [ ] **Step 7: Commit any remaining changes and summarize**

```bash
git status
```
Commit anything uncommitted from visual fixes, then report results.
