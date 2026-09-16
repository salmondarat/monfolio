import { fetchCollection, publishedOnly } from './client'
import { asMedia, mediaAlt, mediaUrl } from './media'
import { group, num, rows, text, textArray } from './normalize'
import type {
  Category,
  CategoryLayout,
  Faq,
  JournalEntry,
  Project,
  ProjectBlock,
  ProjectGalleryImage,
  ProjectImageWidth,
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
  content?: unknown
  image?: unknown
  imageAlt?: unknown
  gallery?: unknown
  size?: unknown
  metrics?: unknown
  deliverables?: unknown
  quote?: unknown
  featured?: unknown
}

const PROJECT_SIZES: ProjectSize[] = ['wide', 'tall', 'standard']

export const mapGallery = (value: unknown): ProjectGalleryImage[] =>
  Array.isArray(value)
    ? value
        .map((item) => ({ url: mediaUrl(item, 'wide'), alt: mediaAlt(item) }))
        .filter((item): item is ProjectGalleryImage => item.url !== '')
    : []

const toSize = (value: unknown): ProjectSize =>
  PROJECT_SIZES.includes(value as ProjectSize) ? (value as ProjectSize) : 'standard'

const toImageWidth = (value: unknown): ProjectImageWidth =>
  value === 'standard' || value === 'narrow' ? value : 'wide'

const toColumns = (value: unknown): 2 | 3 => (text(value) === '3' ? 3 : 2)

const mediaCredit = (value: unknown): string | undefined =>
  text(asMedia(value)?.credit) || undefined

/**
 * Normalise Payload story blocks into the view model. Blocks that are broken
 * (missing media, empty text) are skipped rather than rendered half-alive.
 */
export const mapBlocks = (value: unknown): ProjectBlock[] => {
  if (!Array.isArray(value)) return []

  const blocks: ProjectBlock[] = []

  for (const item of value) {
    const block = group(item)

    switch (text(block.blockType)) {
      case 'text': {
        const textValue = text(block.text)
        if (textValue) blocks.push({ blockType: 'text', text: textValue })
        break
      }
      case 'image': {
        const url = mediaUrl(block.image, 'wide')
        if (!url) break
        blocks.push({
          blockType: 'image',
          url,
          alt: text(block.alt) || mediaAlt(block.image),
          width: toImageWidth(block.width),
          caption: text(block.caption) || undefined,
          credit: mediaCredit(block.image),
        })
        break
      }
      case 'gallery': {
        const images = mapGallery(block.images)
        if (images.length === 0) break
        blocks.push({
          blockType: 'gallery',
          images,
          columns: toColumns(block.columns),
          caption: text(block.caption) || undefined,
        })
        break
      }
      case 'quote': {
        const quote = text(block.quote)
        if (!quote) break
        blocks.push({
          blockType: 'quote',
          text: quote,
          attribution: text(block.attribution) || undefined,
        })
        break
      }
      case 'stats': {
        const items = rows(block.items)
          .map((row) => ({ value: text(row.value), label: text(row.label) }))
          .filter((item) => item.value !== '' && item.label !== '')
        if (items.length === 0) break
        blocks.push({ blockType: 'stats', items })
        break
      }
      case 'split': {
        const url = mediaUrl(block.image, 'wide')
        const textValue = text(block.text)
        if (!url || !textValue) break
        blocks.push({
          blockType: 'split',
          text: textValue,
          url,
          alt: text(block.alt) || mediaAlt(block.image),
          imageSide: text(block.imageSide) === 'right' ? 'right' : 'left',
        })
        break
      }
    }
  }

  return blocks
}

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
    gallery: mapGallery(doc.gallery),
    blocks: mapBlocks(doc.content),
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
