import { getPayload } from 'payload'
import type { Payload } from 'payload'

import config from './payload.config'
import {
  announcement,
  categories,
  faqs,
  featuredBackImage,
  featuredProjectTitle,
  heroSlides,
  homePage,
  navigation,
  posts,
  projects,
  services,
  siteSettings,
  testimonials,
} from './seed/data'

type Id = number

const uploadCache = new Map<string, Id | undefined>()

const required = <T>(value: T | undefined, label: string): T => {
  if (value === undefined) {
    throw new Error(`Seed is missing a required value: ${label}`)
  }

  return value
}

const slugify = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')

const uploadImage = async (
  payload: Payload,
  url: string,
  alt: string,
): Promise<Id | undefined> => {
  if (uploadCache.has(url)) {
    return uploadCache.get(url)
  }

  let id: Id | undefined

  try {
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const buffer = Buffer.from(await response.arrayBuffer())
    const contentType = response.headers.get('content-type') ?? 'image/jpeg'
    const extension = contentType.includes('png')
      ? 'png'
      : contentType.includes('webp')
        ? 'webp'
        : 'jpg'
    const base = new URL(url).pathname.split('/').pop() || `upload-${Date.now()}`

    const doc = await payload.create({
      collection: 'media',
      data: { alt },
      file: {
        data: buffer,
        mimetype: contentType,
        name: `${base}.${extension}`,
        size: buffer.length,
      },
    })

    id = doc.id
  } catch (error) {
    payload.logger.warn(
      `Could not upload ${url}: ${error instanceof Error ? error.message : String(error)}`,
    )
  }

  uploadCache.set(url, id)

  return id
}

const clearAll = async (payload: Payload): Promise<void> => {
  // Globals hold upload relationships, and those rows cannot be deleted while
  // anything still points at them. Drop the references first; the seed rewrites
  // both globals in full at the end anyway.
  await payload.updateGlobal({
    slug: 'home-page',
    data: {
      hero: { carousel: [] },
      work: { featured: { backImage: null } },
    },
  })

  await payload.updateGlobal({
    slug: 'site-settings',
    data: { ogImage: null },
  })

  const collections = [
    'projects',
    'categories',
    'services',
    'testimonials',
    'faqs',
    'posts',
    'form-submissions',
    'media',
  ] as const

  for (const collection of collections) {
    await payload.delete({ collection, where: { id: { exists: true } } })
    payload.logger.info(`Cleared ${collection}`)
  }
}

const seed = async (): Promise<void> => {
  const payload = await getPayload({ config })

  const existing = await payload.count({ collection: 'projects' })

  if (existing.totalDocs > 0 && process.env.SEED_RESET !== '1') {
    payload.logger.info(
      `Projects already exist (${existing.totalDocs}). Set SEED_RESET=1 to wipe and reseed.`,
    )
    return
  }

  if (process.env.SEED_RESET === '1') {
    payload.logger.info('SEED_RESET=1 — clearing existing content first.')
    await clearAll(payload)
  }

  payload.logger.info('Uploading imagery…')
  const projectImages = new Map<string, Id | undefined>()
  for (const project of projects) {
    projectImages.set(project.title, await uploadImage(payload, project.image, project.imageAlt))
  }
  const featuredBackId = await uploadImage(payload, featuredBackImage.url, featuredBackImage.alt)
  const slideIds: (Id | undefined)[] = []
  for (const slide of heroSlides) {
    slideIds.push(await uploadImage(payload, slide.url, slide.alt))
  }

  payload.logger.info('Creating categories…')
  const categoryIds = new Map<string, Id>()
  for (const category of categories) {
    const heroImage = category.page.heroImage
      ? await uploadImage(payload, category.page.heroImage, `${category.name} category hero`)
      : undefined

    const doc = await payload.create({
      collection: 'categories',
      data: {
        name: category.name,
        slug: category.key,
        key: category.key,
        filter: category.filter,
        order: category.order,
        page: {
          layout: category.page.layout,
          eyebrow: category.page.eyebrow,
          heading: category.page.heading,
          intro: category.page.intro,
          heroImage,
          seo: {},
        },
      },
    })
    categoryIds.set(category.key, doc.id)
  }

  payload.logger.info('Creating projects…')
  const projectIds = new Map<string, Id>()
  for (const project of projects) {
    const doc = await payload.create({
      collection: 'projects',
      data: {
        title: project.title,
        slug: slugify(project.title),
        category: required(categoryIds.get(project.categoryKey), project.categoryKey),
        year: project.year,
        description: project.description,
        image: projectImages.get(project.title),
        imageAlt: project.imageAlt,
        size: project.size as 'wide' | 'tall' | 'standard',
        metrics: project.metrics,
        deliverables: project.deliverables,
        quote: project.quote,
        featured: project.featured,
        order: project.order,
        _status: 'published',
      },
    })
    projectIds.set(project.title, doc.id)
  }

  payload.logger.info('Creating services…')
  for (const service of services) {
    await payload.create({ collection: 'services', data: service })
  }

  payload.logger.info('Creating testimonials…')
  for (const testimonial of testimonials) {
    await payload.create({ collection: 'testimonials', data: testimonial })
  }

  payload.logger.info('Creating FAQs…')
  for (const faq of faqs) {
    await payload.create({ collection: 'faqs', data: faq })
  }

  payload.logger.info('Creating journal entries…')
  for (const post of posts) {
    await payload.create({
      collection: 'posts',
      data: {
        title: post.title,
        slug: slugify(post.title),
        kind: post.kind,
        visual: post.visual as 'orbit' | 'type' | 'colour' | 'shape' | 'desk' | 'grid',
        publishedAt: new Date().toISOString(),
        _status: 'published',
      },
    })
  }

  payload.logger.info('Updating globals…')
  await payload.updateGlobal({
    slug: 'home-page',
    data: {
      ...homePage,
      hero: {
        ...homePage.hero,
        carousel: heroSlides.map((slide, index) => ({
          image: required(slideIds[index], `hero slide ${index + 1}`),
          caption: slide.caption,
        })),
      },
      work: {
        ...homePage.work,
        featured: {
          ...homePage.work.featured,
          project: required(projectIds.get(featuredProjectTitle), featuredProjectTitle),
          backImage: featuredBackId,
        },
      },
    },
  })

  await payload.updateGlobal({ slug: 'site-settings', data: siteSettings })
  await payload.updateGlobal({ slug: 'navigation', data: navigation })
  await payload.updateGlobal({ slug: 'announcement', data: announcement })

  payload.logger.info('Seed complete.')
}

// Top-level await matters here: `payload run` awaits the dynamic import of this
// file and then immediately calls process.exit(), so the work must not be
// detached into an un-awaited promise.
try {
  await seed()
} catch (error) {
  console.error('Seed failed:', error)
  process.exit(1)
}
