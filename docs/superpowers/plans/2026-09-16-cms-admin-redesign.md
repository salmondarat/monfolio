# CMS Admin Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give the Payload admin a Monfolio theme, branding, a custom dashboard landing page, curated list views, and built-in live preview — using only Payload 3 native admin customization.

**Architecture:** All changes are admin-layer: a theme SCSS file overriding Payload CSS variables, custom React components registered via `admin.components` (resolved by the existing `importMap`), and per-collection `admin.*` config edits. No schema changes, no changes to `apps/web` or `packages/content`.

**Tech Stack:** Payload 3 (Next.js app under `apps/cms`), React, SCSS, REST API.

**Spec:** `docs/superpowers/specs/2026-09-16-cms-admin-redesign-design.md`

## Global Constraints

- Monorepo commands run from repo root; filter apps with `pnpm --filter @monfolio/cms ...`.
- The ambient shell may have `NODE_ENV=production` — always run CMS dev/seed with `NODE_ENV=development` (Payload only pushes schema in dev, and we must not push anything anyway).
- CMS dev server: port 3000. Web dev server: port 4321. Run dev servers in background and stop them afterwards.
- `apps/cms` runs `next dev --webpack` on purpose — do not change scripts.
- No new env vars; `WEB_URL` already exists in `apps/cms/.env`.
- No changes to `apps/web`, `packages/content`, or collection fields (admin config only).
- Palette (from `apps/web/src/styles/global.css`): ink `#070d14`, surface `#ffffff`, surface-lift `#f5f7f9`, accent `#f15533`, muted `#7f8183`, line `#d8dbdd`; dark: surface `#11161d`, surface-lift `#161c25`, ink `#f5f7f9`, muted `#a8adb4`, line `#232a33`. Font: Plus Jakarta Sans.
- There is no test framework in this repo; verification = `pnpm typecheck`, visual checks against a running dev server, and `pnpm build` at the end.

---

### Task 1: Monfolio theme

**Files:**
- Create: `apps/cms/src/admin/theme.scss`
- Modify: `apps/cms/src/payload.config.ts` (add `admin.css` + `admin.meta.icon`)

**Interfaces:**
- Consumes: nothing.
- Produces: `theme.scss` imported into the admin bundle; later tasks' components rely on these variables (they use Payload tokens, never hard-coded colors).

- [ ] **Step 1: Write `apps/cms/src/admin/theme.scss`**

```scss
/* Monfolio admin theme — overrides Payload's CSS variables.
   Values mirror apps/web/src/styles/global.css. */

:root {
  --font-body: 'Plus Jakarta Sans', sans-serif;
  --theme-bg: #f5f7f9;
  --theme-text: #070d14;
  --theme-border: #d8dbdd;

  --theme-elevation-0: #f5f7f9;
  --theme-elevation-50: #ffffff;
  --theme-elevation-100: #ffffff;
  --theme-elevation-150: #f5f7f9;
  --theme-elevation-200: #ffffff;
  --theme-elevation-300: #d8dbdd;
  --theme-elevation-400: #7f8183;
  --theme-elevation-500: #070d14;
  --theme-elevation-600: #070d14;
  --theme-elevation-700: #070d14;
  --theme-elevation-800: #070d14;
  --theme-elevation-900: #070d14;
  --theme-elevation-1000: #070d14;

  --theme-success: #1d8a5b;
  --theme-warning: #c77b1e;
  --theme-error: #c73a2e;

  --theme-success-500: #1d8a5b;
  --theme-warning-500: #c77b1e;
  --theme-error-500: #c73a2e;
}

html[data-theme='dark'] {
  --theme-bg: #11161d;
  --theme-text: #f5f7f9;
  --theme-border: #232a33;

  --theme-elevation-0: #11161d;
  --theme-elevation-50: #161c25;
  --theme-elevation-100: #161c25;
  --theme-elevation-150: #11161d;
  --theme-elevation-200: #161c25;
  --theme-elevation-300: #232a33;
  --theme-elevation-400: #a8adb4;
  --theme-elevation-500: #f5f7f9;
  --theme-elevation-600: #f5f7f9;
  --theme-elevation-700: #f5f7f9;
  --theme-elevation-800: #f5f7f9;
  --theme-elevation-900: #f5f7f9;
  --theme-elevation-1000: #f5f7f9;

  --theme-success-500: #2fb37a;
  --theme-warning-500: #e09a3e;
  --theme-error-500: #e05a4e;
}

/* Accent: Payload's primary action color */
:root, html[data-theme='dark'] {
  --theme-baseline: #f15533;
}
```

Note: if the admin still renders with default colors after this step, check Payload's actual variable names in the running admin (DevTools → inspect `:root`) and adjust the override list — the mechanism (variable override) stays the same.

- [ ] **Step 2: Wire it into `payload.config.ts`**

In `apps/cms/src/payload.config.ts`, inside `admin: { ... }`:

```ts
admin: {
  user: Users.slug,
  importMap: {
    baseDir: path.resolve(dirname),
  },
  meta: {
    titleSuffix: '— Monfolio CMS',
    icon: '/media/monfolio-favicon.svg', // adjust to an existing media file; fallback: omit icon if no favicon asset exists in /public
  },
  css: [path.resolve(dirname, './admin/theme.scss')],
},
```

If no favicon asset exists under `apps/cms/public/`, skip `icon` (leave `titleSuffix` only) — do not invent a file.

- [ ] **Step 3: Verify visually**

Run: `NODE_ENV=development pnpm --filter @monfolio/cms dev` (background), open `http://localhost:3000/admin`, log in.
Expected: admin surfaces use Monfolio grays/white, accent orange on primary buttons, Plus Jakarta Sans. Toggle light/dark from the user menu and check both.

- [ ] **Step 4: Commit**

```bash
git add apps/cms/src/admin/theme.scss apps/cms/src/payload.config.ts
git commit -m "feat(cms): Monfolio admin theme via Payload CSS variables"
```

---

### Task 2: Logo + collection grouping

**Files:**
- Create: `apps/cms/src/admin/Logo.tsx`
- Modify: `apps/cms/src/payload.config.ts` (`admin.components.graphics.Logo`)
- Modify: `apps/cms/src/collections/{Services,Testimonials,Faqs,FormSubmissions,Users}.ts` and `apps/cms/src/globals/{HomePage,SiteSettings,Navigation,Announcement}.ts` (`admin.group`)

**Interfaces:**
- Consumes: theme variables from Task 1.
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: Write `apps/cms/src/admin/Logo.tsx`**

```tsx
import React from 'react'

export const Logo = () => (
  <span
    style={{
      fontFamily: 'var(--font-body, "Plus Jakarta Sans", sans-serif)',
      fontSize: '1.25rem',
      fontWeight: 800,
      letterSpacing: '-0.06em',
      color: 'var(--theme-text)',
    }}
  >
    mon<span style={{ color: 'var(--theme-baseline, #f15533)' }}>folio</span>
  </span>
)
```

- [ ] **Step 2: Register it in `payload.config.ts`**

```ts
admin: {
  // ...existing
  components: {
    graphics: {
      Logo: '/admin/Logo',
    },
  },
}
```

(Path is relative to `importMap.baseDir` = `apps/cms/src`.)

- [ ] **Step 3: Tidy groups**

Set `admin.group` to:
- `Content`: Projects, Posts, Categories, Media, HomePage (already `Content` — no change except verify).
- `Marketing`: Services, Testimonials, Faqs (change from `Content`).
- `Settings`: SiteSettings, Navigation, Announcement (already `Settings`).
- `Utilities`: FormSubmissions (from `Leads`), Users (from `Settings`).

- [ ] **Step 4: Verify visually**

Restart CMS dev server (config changed). Expected: sidebar shows the Monfolio wordmark logo (top-left, both themes) and grouped nav: Content / Marketing / Settings / Utilities.

- [ ] **Step 5: Commit**

```bash
git add apps/cms/src/admin/Logo.tsx apps/cms/src/payload.config.ts apps/cms/src/collections apps/cms/src/globals
git commit -m "feat(cms): Monfolio logo and tidied admin nav groups"
```

---

### Task 3: Custom dashboard view

**Files:**
- Create: `apps/cms/src/admin/Dashboard.tsx`
- Create: `apps/cms/src/admin/DashboardCounts.tsx`
- Create: `apps/cms/src/admin/dashboard.scss`
- Modify: `apps/cms/src/payload.config.ts` (`admin.components.views.dashboard`)

**Interfaces:**
- Consumes: theme variables (Task 1).
- Produces: `Dashboard` component registered at `/admin/Dashboard` in the importMap.

- [ ] **Step 1: Write `apps/cms/src/admin/DashboardCounts.tsx`**

```tsx
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

type CountCard = {
  label: string
  href: string
  total: number
  draft?: number
}

async function fetchTotal(slug: string, extraQuery = ''): Promise<number> {
  const res = await fetch(`/api/${slug}?limit=1&depth=0${extraQuery}`)
  if (!res.ok) throw new Error(`${slug}: ${res.status}`)
  const json = await res.json()
  return json.totalDocs as number
}

export const DashboardCounts = () => {
  const [cards, setCards] = useState<CountCard[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const [projects, drafts, posts, services, testimonials, faqs, media, submissions] =
          await Promise.all([
            fetchTotal('projects'),
            fetchTotal('projects', '&where[_status][equals]=draft'),
            fetchTotal('posts'),
            fetchTotal('services'),
            fetchTotal('testimonials'),
            fetchTotal('faqs'),
            fetchTotal('media'),
            fetchTotal('form-submissions'),
          ])
        if (cancelled) return
        setCards([
          { label: 'Projects', href: '/admin/collections/projects', total: projects, draft: drafts },
          { label: 'Posts', href: '/admin/collections/posts', total: posts },
          { label: 'Services', href: '/admin/collections/services', total: services },
          { label: 'Testimonials', href: '/admin/collections/testimonials', total: testimonials },
          { label: 'FAQs', href: '/admin/collections/faqs', total: faqs },
          { label: 'Media', href: '/admin/collections/media', total: media },
          { label: 'Form submissions', href: '/admin/collections/form-submissions', total: submissions },
        ])
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load counts')
      }
    }
    void load()
    return () => { cancelled = true }
  }, [])

  if (error) return <p className="dashboard-error">Failed to load: {error}</p>
  if (!cards) return <p className="dashboard-loading">Loading…</p>

  return (
    <div className="dashboard-grid">
      {cards.map((card) => (
        <a key={card.href} className="dashboard-card" href={card.href}>
          <span className="dashboard-card-label">{card.label}</span>
          <span className="dashboard-card-total">{card.total}</span>
          {typeof card.draft === 'number' && card.draft > 0 && (
            <span className="dashboard-card-draft">{card.draft} draft{card.draft === 1 ? '' : 's'}</span>
          )}
        </a>
      ))}
    </div>
  )
}
```

Note: `react-router-dom` is available inside the Payload admin bundle (Payload 3 uses it). If the import fails at build, switch the `<a>` to plain anchors and drop the import — the links work either way.

- [ ] **Step 2: Write `apps/cms/src/admin/Dashboard.tsx`**

```tsx
import React, { useEffect, useState } from 'react'
import { DefaultTemplate } from '@payloadcms/next/templates'
import type { AdminViewProps } from 'payload'

import { DashboardCounts } from './DashboardCounts'
import './dashboard.scss'

type Submission = { id: string | number; name: string; email: string; topic?: string; createdAt: string }
type FeaturedProject = { id: string | number; title: string; slug?: string }

export const Dashboard = ({ initPageResult, params, searchParams }: AdminViewProps) => {
  const [submissions, setSubmissions] = useState<Submission[] | null>(null)
  const [featured, setFeatured] = useState<FeaturedProject[] | null>(null)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const [subsRes, featRes] = await Promise.all([
          fetch('/api/form-submissions?limit=5&sort=-createdAt&depth=0'),
          fetch('/api/projects?limit=3&depth=0&where[featured][equals]=true'),
        ])
        const subs = await subsRes.json()
        const feat = await featRes.json()
        if (cancelled) return
        setSubmissions(subs.docs ?? [])
        setFeatured(feat.docs ?? [])
      } catch {
        if (!cancelled) { setSubmissions([]); setFeatured([]) }
      }
    }
    void load()
    return () => { cancelled = true }
  }, [])

  return (
    <DefaultTemplate
      initPageResult={initPageResult}
      params={params}
      searchParams={searchParams}
    >
      <div className="dashboard">
        <header className="dashboard-header">
          <h1>Overview</h1>
          <p>Everything on the site, at a glance.</p>
        </header>
        <DashboardCounts />
        <div className="dashboard-columns">
          <section className="dashboard-panel">
            <h2>Recent form submissions</h2>
            {submissions === null ? (
              <p className="dashboard-loading">Loading…</p>
            ) : submissions.length === 0 ? (
              <p className="dashboard-empty">No submissions yet.</p>
            ) : (
              <ul>
                {submissions.map((s) => (
                  <li key={s.id}>
                    <a href={`/admin/collections/form-submissions/${s.id}`}>
                      <strong>{s.name}</strong> — {s.email}
                      {s.topic ? ` · ${s.topic}` : ''}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </section>
          <section className="dashboard-panel">
            <h2>Featured projects</h2>
            {featured === null ? (
              <p className="dashboard-loading">Loading…</p>
            ) : featured.length === 0 ? (
              <p className="dashboard-empty">Nothing featured yet.</p>
            ) : (
              <ul>
                {featured.map((p) => (
                  <li key={p.id}>
                    <a href={`/admin/collections/projects/${p.id}`}>{p.title}</a>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </DefaultTemplate>
  )
}

export default Dashboard
```

If `DefaultTemplate` is not exported from `@payloadcms/next/templates` in the installed version, check `node_modules/@payloadcms/next/dist/templates` exports and use the documented equivalent (it exists in Payload 3 as the standard wrapper for custom views).

- [ ] **Step 3: Write `apps/cms/src/admin/dashboard.scss`**

```scss
.dashboard {
  padding: 2rem;
  max-width: 72rem;
}

.dashboard-header h1 {
  font-family: var(--font-body, 'Plus Jakarta Sans', sans-serif);
  font-size: 1.75rem;
  font-weight: 800;
  letter-spacing: -0.04em;
  margin: 0;
}

.dashboard-header p {
  color: var(--theme-elevation-400);
  margin: 0.35rem 0 0;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(11rem, 1fr));
  gap: 0.75rem;
  margin-top: 1.75rem;
}

.dashboard-card {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  padding: 1rem 1.1rem;
  border: 1px solid var(--theme-border);
  border-radius: 1rem;
  background: var(--theme-elevation-50);
  text-decoration: none;
  transition: border-color 0.2s ease, transform 0.2s ease;

  &:hover {
    border-color: var(--theme-baseline, #f15533);
    transform: translateY(-2px);
  }
}

.dashboard-card-label {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--theme-elevation-400);
}

.dashboard-card-total {
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--theme-text);
}

.dashboard-card-draft {
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--theme-warning-500, #c77b1e);
}

.dashboard-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 1.5rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
}

.dashboard-panel {
  border: 1px solid var(--theme-border);
  border-radius: 1rem;
  background: var(--theme-elevation-50);
  padding: 1.1rem 1.25rem;

  h2 {
    font-size: 0.8rem;
    font-weight: 800;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--theme-elevation-400);
    margin: 0 0 0.75rem;
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  a {
    color: var(--theme-text);
    text-decoration: none;

    &:hover { color: var(--theme-baseline, #f15533); }
  }
}

.dashboard-loading,
.dashboard-empty,
.dashboard-error {
  color: var(--theme-elevation-400);
  font-size: 0.85rem;
}
```

- [ ] **Step 4: Register the view in `payload.config.ts`**

```ts
admin: {
  // ...existing
  components: {
    graphics: { Logo: '/admin/Logo' },
    views: {
      dashboard: {
        Component: '/admin/Dashboard',
      },
    },
  },
}
```

- [ ] **Step 5: Verify visually**

Restart CMS dev server. Open `http://localhost:3000/admin`.
Expected: landing page shows "Overview" with count cards (real numbers matching the DB), recent submissions, featured projects. Clicking a card navigates to the collection list. Check light and dark themes. Check the browser console for errors.

- [ ] **Step 6: Commit**

```bash
git add apps/cms/src/admin/Dashboard.tsx apps/cms/src/admin/DashboardCounts.tsx apps/cms/src/admin/dashboard.scss apps/cms/src/payload.config.ts
git commit -m "feat(cms): custom dashboard as admin landing view"
```

---

### Task 4: Curated list views

**Files:**
- Modify: `apps/cms/src/collections/Projects.ts`, `Posts.ts`, `Categories.ts`, `Services.ts`, `Testimonials.ts`, `Faqs.ts`, `Media.ts`, `FormSubmissions.ts`, `Users.ts`

**Interfaces:**
- Consumes: nothing.
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: Edit each collection's `admin` block**

Projects.ts:
```ts
admin: {
  group: 'Content',
  useAsTitle: 'title',
  defaultColumns: ['image', 'title', 'category', 'featured', '_status', 'updatedAt'],
  listSearchableFields: ['title', 'description', 'year'],
  description: 'Case studies shown in the work grid and the featured build block.',
},
```

Posts.ts:
```ts
listSearchableFields: ['title', 'excerpt'],
```
(keep its existing `defaultColumns`).

Categories.ts:
```ts
listSearchableFields: ['name', 'key', 'filter'],
```

Services.ts:
```ts
listSearchableFields: ['title'],
```

Testimonials.ts:
```ts
listSearchableFields: ['name', 'role', 'quote'],
```

Faqs.ts:
```ts
listSearchableFields: ['question', 'answer'],
```

Media.ts:
```ts
listSearchableFields: ['alt'],
```
(check the actual field names in `Media.ts` first — use its alt/filename fields; if none are text-searchable, omit `listSearchableFields` for Media.)

FormSubmissions.ts:
```ts
admin: {
  // existing props kept
  defaultColumns: ['name', 'email', 'topic', 'createdAt'],
  listSearchableFields: ['name', 'email', 'topic', 'message'],
  pagination: { resultsPerPage: 25 },
},
```
(check `message`/field names against `FormSubmissions.ts` and adjust.)

Users.ts: no change beyond group (already done in Task 2).

- [ ] **Step 2: Verify visually**

Restart CMS dev server. Open each list view: columns match, typing in search filters by the configured fields, form-submissions shows 25 rows per page.

- [ ] **Step 3: Commit**

```bash
git add apps/cms/src/collections
git commit -m "feat(cms): curated list columns, search fields, page size"
```

---

### Task 5: Live preview

**Files:**
- Modify: `apps/cms/src/payload.config.ts` (`admin.livePreview`)
- Modify: `apps/cms/src/collections/Projects.ts` (`admin.preview`)
- Modify: `apps/cms/src/globals/HomePage.ts` (`admin.preview`)

**Interfaces:**
- Consumes: `WEB_URL` env var (already set in `apps/cms/.env`).
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: Global livePreview in `payload.config.ts`**

```ts
admin: {
  // ...existing
  livePreview: {
    url: process.env.WEB_URL ?? 'http://localhost:4321',
    breakpoints: [
      { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
      { label: 'Mobile', name: 'mobile', width: 390, height: 844 },
    ],
    collections: ['projects'],
    globals: ['home-page'],
  },
}
```

- [ ] **Step 2: Per-document preview URLs**

Projects.ts, inside `admin`:
```ts
preview: ({ data }) => {
  const base = process.env.WEB_URL ?? 'http://localhost:4321'
  return data?.slug ? `${base}/work/${data.slug}` : base
},
```

HomePage.ts, inside `admin`:
```ts
preview: () => process.env.WEB_URL ?? 'http://localhost:4321',
```

- [ ] **Step 3: Verify end-to-end**

1. Start web dev server in background: `pnpm --filter @monfolio/web dev` (port 4321).
2. CMS dev server running (restart if config changed).
3. Open a project in the admin → click "Live Preview" in the edit view toolbar.
4. Expected: iframe renders `/work/<slug>` from the web dev server; breakpoint buttons switch sizes; saving the document refreshes the iframe.
5. Open the `home-page` global → Live Preview shows `/`.
6. Stop both dev servers afterwards.

- [ ] **Step 4: Commit**

```bash
git add apps/cms/src/payload.config.ts apps/cms/src/collections/Projects.ts apps/cms/src/globals/HomePage.ts
git commit -m "feat(cms): built-in live preview for projects and home page"
```

---

### Task 6: Final verification

**Files:** none (verification only).

- [ ] **Step 1: Typecheck**

Run: `pnpm typecheck`
Expected: passes in cms, content, and web.

- [ ] **Step 2: Types unchanged**

Run: `pnpm --filter @monfolio/cms generate:types && git diff --exit-code apps/cms/src/payload-types.ts`
Expected: no diff (admin-only changes must not alter generated types).

- [ ] **Step 3: Full build**

With CMS dev server running in background (`NODE_ENV=development pnpm --filter @monfolio/cms dev`):
Run: `pnpm build`
Expected: both apps build. Stop the CMS dev server afterwards.

- [ ] **Step 4: Commit any stragglers**

```bash
git status --short
# if anything uncommitted: git add -A && git commit -m "chore(cms): admin redesign final touches"
```
