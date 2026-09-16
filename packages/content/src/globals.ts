import { fetchGlobal } from './client'
import { getProjects, getServices, mapProject } from './collections'
import { mediaUrl } from './media'
import { bool, group, link, marker, num, rows, text, textArray } from './normalize'
import type {
  AnnouncementContent,
  FooterColumn,
  HomeContent,
  Link,
  NavigationContent,
  SectionCopy,
  SiteSettingsContent,
  StoryContent,
} from './types'

const mapLinks = (value: unknown): Link[] =>
  rows(value).map((row) => ({ label: text(row.label), href: text(row.href, '#') }))

const sectionCopy = (value: unknown): SectionCopy => {
  const source = group(value)

  return {
    heading: text(source.heading),
    intro: text(source.intro),
  }
}

export const getSiteSettings = async (): Promise<SiteSettingsContent> => {
  const raw = await fetchGlobal<Record<string, unknown>>('site-settings')
  const banner = group(raw.footerBanner)

  return {
    title: text(raw.title, 'Monfolio — design & build studio'),
    description: text(raw.description),
    ogImage: mediaUrl(raw.ogImage, 'wide') || '/og.svg',
    favicon: text(raw.favicon, '/favicon.svg'),
    themeColor: text(raw.themeColor, '#ffffff'),
    contactEmail: text(raw.contactEmail),
    address: text(raw.address),
    footerTagline: text(raw.footerTagline),
    footerBanner: {
      eyebrow: text(banner.eyebrow, 'Work with us'),
      heading: text(banner.heading),
      ctaLabel: text(banner.ctaLabel, 'Start a conversation ↗'),
    },
    copyright: text(raw.copyright),
    legalLinks: mapLinks(raw.legalLinks),
    socialLinks: mapLinks(raw.socialLinks),
  }
}

export const getNavigation = async (): Promise<NavigationContent> => {
  const raw = await fetchGlobal<Record<string, unknown>>('navigation')
  const rawColumns = rows(raw.footerColumns)

  const needsProjects = rawColumns.some((column) => text(column.source) === 'projects')
  const needsServices = rawColumns.some((column) => text(column.source) === 'services')

  const [projects, services] = await Promise.all([
    needsProjects ? getProjects() : Promise.resolve([]),
    needsServices ? getServices() : Promise.resolve([]),
  ])

  const footerColumns: FooterColumn[] = rawColumns.map((column) => {
    const source = text(column.source, 'manual')
    const title = text(column.title)

    if (source === 'projects') {
      return {
        title,
        links: projects.slice(0, 5).map((project) => ({ label: project.title, href: '#work' })),
      }
    }

    if (source === 'services') {
      return {
        title,
        links: services.map((service) => ({ label: service.title, href: '#services' })),
      }
    }

    return { title, links: mapLinks(column.links) }
  })

  return {
    headerLinks: mapLinks(raw.headerLinks),
    headerCta: link(raw.headerCta, 'Start a project ↗', '#contact'),
    footerColumns,
  }
}

export const getAnnouncement = async (): Promise<AnnouncementContent> => {
  const raw = await fetchGlobal<Record<string, unknown>>('announcement')

  return {
    enabled: bool(raw.enabled),
    badge: text(raw.badge),
    message: text(raw.message),
    link: text(raw.link, '#contact'),
  }
}

export const getHomePage = async (): Promise<HomeContent> => {
  const raw = await fetchGlobal<Record<string, unknown>>('home-page')

  const hero = group(raw.hero)
  const about = group(raw.about)
  const work = group(raw.work)
  const featured = group(work.featured)
  const story = group(raw.story)
  const contact = group(raw.contact)
  const form = group(contact.form)
  const infoCard = group(contact.infoCard)
  const markers = group(raw.markers)

  const featuredRelationship = featured.project
  const featuredProject =
    featuredRelationship && typeof featuredRelationship === 'object'
      ? mapProject(featuredRelationship as Parameters<typeof mapProject>[0])
      : undefined

  const storyContent: StoryContent = {
    title: text(story.title),
    intro: text(story.intro),
    artWord: text(story.artWord),
    videoLabel: text(story.videoLabel),
    barLocation: text(story.barLocation),
    barNote: text(story.barNote),
  }

  return {
    hero: {
      badge: text(hero.badge),
      heading: text(hero.heading),
      skills: textArray(hero.skills),
      description: text(hero.description),
      primaryCta: link(hero.primaryCta, 'View Work ↗', '#work'),
      secondaryCta: link(hero.secondaryCta, 'Contact Me ↓', '#contact'),
      locationBadge: text(hero.locationBadge),
      availability: text(hero.availability),
      availabilityNote: text(hero.availabilityNote),
      carousel: rows(hero.carousel).map((row) => ({
        image: mediaUrl(row.image, 'wide'),
        caption: text(row.caption),
      })),
      marquee: textArray(hero.marquee),
    },
    about: {
      heading: text(about.heading),
      intro: text(about.intro),
      steps: rows(about.steps).map((row) => ({
        number: text(row.number),
        title: text(row.title),
        body: text(row.body),
        deliverables: textArray(row.deliverables),
      })),
    },
    work: {
      heading: text(work.heading),
      intro: text(work.intro),
      filters: rows(work.filters).map((row) => ({
        label: text(row.label),
        key: text(row.key),
      })),
      maxVisible: num(work.maxVisible, 4),
      showAllLabel: text(work.showAllLabel, 'Show all'),
      showLessLabel: text(work.showLessLabel, 'Show fewer'),
      featured: {
        badge: text(featured.badge, 'Featured build'),
        category: text(featured.category),
        title: text(featured.title),
        description: text(featured.description),
        cta: link(featured.cta, 'Explore case study ↗', '#contact'),
        readTime: text(featured.readTime),
        backImage: mediaUrl(featured.backImage, 'wide'),
        backBadge: text(featured.backBadge),
        project: featuredProject,
      },
    },
    faq: sectionCopy(raw.faq),
    story: storyContent,
    reviews: sectionCopy(raw.reviews),
    services: sectionCopy(raw.services),
    contact: {
      title: text(contact.title),
      eyebrow: text(contact.eyebrow),
      heading: text(contact.heading),
      avatars: rows(contact.avatars).map((row) => ({
        initials: text(row.initials),
        name: text(row.name),
      })),
      topics: rows(contact.topics).map((row) => text(row.label)).filter((label) => label.length > 0),
      form: {
        submitLabel: text(form.submitLabel, 'Send message ↗'),
        consent: text(form.consent),
        successHeading: text(form.successHeading, 'Message received.'),
        successBody: text(form.successBody),
        resetLabel: text(form.resetLabel, 'Send another message'),
      },
      infoCard: {
        emailLabel: text(infoCard.emailLabel, 'Direct inquiries'),
        studioLabel: text(infoCard.studioLabel, 'Studio'),
        howWeWorkLabel: text(infoCard.howWeWorkLabel, 'How we work'),
        howWeWorkItems: textArray(infoCard.howWeWorkItems),
      },
    },
    markers: {
      about: marker(markers.about, '1', 'How we work'),
      work: marker(markers.work, '2', 'Selected builds'),
      faq: marker(markers.faq, '3', 'FAQ'),
      story: marker(markers.story, '4', 'Our story'),
      reviews: marker(markers.reviews, '5', 'Client reviews'),
      services: marker(markers.services, '6', 'Services'),
      contact: marker(markers.contact, '7', 'Let’s make & build together'),
    },
  }
}
