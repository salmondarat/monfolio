import { fetchCollection, publishedOnly } from './client'
import { mediaAlt, mediaUrl } from './media'
import { group, num, text, textArray } from './normalize'
import type {
  Category,
  CategoryLayout,
  Faq,
  JournalEntry,
  Project,
  ProjectSize,
  Service,
  Testimonial,
} from './types'

type RawCategory = {
  name?: unknown
  slug?: unknown
  key?: unknown
  filter?: unknown
}

type RawProject = {
  title?: unknown
  slug?: unknown
  category?: unknown
  year?: unknown
  description?: unknown
  image?: unknown
  imageAlt?: unknown
  size?: unknown
  metrics?: unknown
  deliverables?: unknown
  quote?: unknown
  featured?: unknown
}

const PROJECT_SIZES: ProjectSize[] = ['wide', 'tall', 'standard']

const toSize = (value: unknown): ProjectSize =>
  PROJECT_SIZES.includes(value as ProjectSize) ? (value as ProjectSize) : 'standard'

export const mapProject = (doc: RawProject): Project => {
  const category =
    doc.category && typeof doc.category === 'object' ? (doc.category as RawCategory) : undefined
  const categoryName = text(category?.name, 'Project')
  const year = text(doc.year)
  const imageAlt = text(doc.imageAlt)

  return {
    title: text(doc.title, 'Untitled project'),
    slug: text(doc.slug),
    category: year ? `${categoryName} / ${year}` : categoryName,
    categoryKey: text(category?.filter, 'all'),
    categorySlug: text(category?.slug),
    description: text(doc.description),
    year,
    image: mediaUrl(doc.image, 'card'),
    imageAlt: imageAlt || mediaAlt(doc.image),
    size: toSize(doc.size),
    metrics: textArray(doc.metrics),
    deliverables: textArray(doc.deliverables),
    quote: text(doc.quote) || undefined,
    featured: doc.featured === true,
  }
}

export const getProjects = async (): Promise<Project[]> => {
  const docs = await fetchCollection<RawProject>('projects', {
    ...publishedOnly,
    depth: 1,
    limit: 100,
    sort: 'order',
  })

  return docs.map(mapProject)
}

type RawService = {
  number?: unknown
  title?: unknown
  description?: unknown
  items?: unknown
}

export const getServices = async (): Promise<Service[]> => {
  const docs = await fetchCollection<RawService>('services', {
    depth: 0,
    limit: 100,
    sort: 'order',
  })

  return docs.map((doc) => ({
    number: text(doc.number),
    title: text(doc.title),
    description: text(doc.description),
    items: textArray(doc.items),
  }))
}

type RawTestimonial = {
  quote?: unknown
  name?: unknown
  role?: unknown
}

export const getTestimonials = async (): Promise<Testimonial[]> => {
  const docs = await fetchCollection<RawTestimonial>('testimonials', {
    depth: 0,
    limit: 100,
    sort: 'order',
  })

  return docs.map((doc) => ({
    quote: text(doc.quote),
    name: text(doc.name),
    role: text(doc.role),
  }))
}

type RawFaq = {
  question?: unknown
  answer?: unknown
}

export const getFaqs = async (): Promise<Faq[]> => {
  const docs = await fetchCollection<RawFaq>('faqs', {
    depth: 0,
    limit: 100,
    sort: 'order',
  })

  return docs.map((doc) => ({
    question: text(doc.question),
    answer: text(doc.answer),
  }))
}

type RawPost = {
  title?: unknown
  slug?: unknown
  kind?: unknown
  visual?: unknown
  excerpt?: unknown
}

export const getJournal = async (): Promise<JournalEntry[]> => {
  const docs = await fetchCollection<RawPost>('posts', {
    ...publishedOnly,
    depth: 0,
    limit: 100,
    sort: '-publishedAt',
  })

  return docs.map((doc) => ({
    title: text(doc.title),
    slug: text(doc.slug),
    kind: text(doc.kind),
    visual: text(doc.visual, 'grid'),
    excerpt: text(doc.excerpt) || undefined,
  }))
}

type RawCategoryDoc = {
  name?: unknown
  slug?: unknown
  key?: unknown
  filter?: unknown
  order?: unknown
  page?: unknown
}

const CATEGORY_LAYOUTS: CategoryLayout[] = ['grid', 'showcase', 'editorial']

const toLayout = (value: unknown): CategoryLayout =>
  CATEGORY_LAYOUTS.includes(value as CategoryLayout) ? (value as CategoryLayout) : 'grid'

export const mapCategory = (doc: RawCategoryDoc): Category => {
  const page = group(doc.page)
  const seo = group(page.seo)
  const name = text(doc.name, 'Category')

  return {
    name,
    slug: text(doc.slug),
    key: text(doc.key),
    filter: text(doc.filter, 'all'),
    order: num(doc.order, 0),
    projectCount: 0,
    page: {
      layout: toLayout(page.layout),
      eyebrow: text(page.eyebrow),
      heading: text(page.heading, name),
      intro: text(page.intro),
      heroImage: mediaUrl(page.heroImage, 'wide'),
      seo: {
        title: text(seo.title),
        description: text(seo.description),
      },
    },
  }
}

/**
 * Categories with a project count. The count is per category, not per filter
 * group — several categories can share one filter (e.g. "Custom commerce" and
 * "Custom build" both sit under the custom-build tab).
 */
export const getCategories = async (): Promise<Category[]> => {
  const [docs, projects] = await Promise.all([
    fetchCollection<RawCategoryDoc>('categories', {
      depth: 1,
      limit: 100,
      sort: 'order',
    }),
    getProjects(),
  ])

  const counts = new Map<string, number>()

  for (const project of projects) {
    counts.set(project.categorySlug, (counts.get(project.categorySlug) ?? 0) + 1)
  }

  return docs.map((doc) => {
    const category = mapCategory(doc)

    return { ...category, projectCount: counts.get(category.slug) ?? 0 }
  })
}

export const getCategoryBySlug = async (slug: string): Promise<Category | undefined> =>
  (await getCategories()).find((category) => category.slug === slug)

export const getProjectsByCategory = async (categorySlug: string): Promise<Project[]> => {
  const docs = await fetchCollection<RawProject>('projects', {
    ...publishedOnly,
    depth: 1,
    limit: 100,
    sort: 'order',
    'where[category.slug][equals]': categorySlug,
  })

  return docs.map(mapProject)
}
