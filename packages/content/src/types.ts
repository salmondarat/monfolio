export type Link = {
  label: string
  href: string
}

export type Marker = {
  number: string
  label: string
}

export type ProjectSize = 'wide' | 'tall' | 'standard'

export type Project = {
  title: string
  slug: string
  /** Display label, e.g. "Custom build / 2024". */
  category: string
  /** Filter key the frontend tabs match on, e.g. "custom-build". */
  categoryKey: string
  /** Slug of the owning category, used to link to /work/<slug>. */
  categorySlug: string
  description: string
  year: string
  image: string
  imageAlt: string
  size: ProjectSize
  metrics: string[]
  deliverables: string[]
  quote?: string
  featured: boolean
}

export type CategoryLayout = 'grid' | 'showcase' | 'editorial'

export type Category = {
  name: string
  slug: string
  key: string
  filter: string
  order: number
  /** How many projects belong to this category (not to its whole filter group). */
  projectCount: number
  page: {
    layout: CategoryLayout
    eyebrow: string
    heading: string
    intro: string
    heroImage: string
    seo: {
      title: string
      description: string
    }
  }
}

export type Service = {
  number: string
  title: string
  description: string
  items: string[]
}

export type Testimonial = {
  quote: string
  name: string
  role: string
}

export type Faq = {
  question: string
  answer: string
}

export type JournalEntry = {
  title: string
  slug: string
  kind: string
  visual: string
  excerpt?: string
}

export type AnnouncementContent = {
  enabled: boolean
  badge: string
  message: string
  link: string
}

export type FooterColumn = {
  title: string
  links: Link[]
}

export type NavigationContent = {
  headerLinks: Link[]
  headerCta: Link
  footerColumns: FooterColumn[]
}

export type SiteSettingsContent = {
  title: string
  description: string
  ogImage: string
  favicon: string
  themeColor: string
  contactEmail: string
  address: string
  footerTagline: string
  footerBanner: {
    eyebrow: string
    heading: string
    ctaLabel: string
  }
  copyright: string
  legalLinks: Link[]
  socialLinks: Link[]
}

export type HeroContent = {
  badge: string
  heading: string
  skills: string[]
  description: string
  primaryCta: Link
  secondaryCta: Link
  locationBadge: string
  availability: string
  availabilityNote: string
  carousel: { image: string; caption: string }[]
  marquee: string[]
}

export type AboutTile = {
  label: string
  caption: string
  variant: 'accent' | 'dark'
}

export type AboutPillar = {
  label: string
  title: string
  body: string
}

export type AboutContent = {
  heading: string
  intro: string
  tiles: AboutTile[]
  pillars: AboutPillar[]
}

export type FeaturedBuildContent = {
  badge: string
  category: string
  title: string
  description: string
  cta: Link
  readTime: string
  backImage: string
  backBadge: string
  /** Resolved relationship, when one is picked in the CMS. */
  project?: Project
}

export type WorkContent = {
  heading: string
  intro: string
  filters: ProjectFilter[]
  maxVisible: number
  showAllLabel: string
  showLessLabel: string
  featured: FeaturedBuildContent
}

export type SectionCopy = {
  heading: string
  intro: string
}

export type StoryContent = {
  title: string
  intro: string
  artWord: string
  videoLabel: string
  barLocation: string
  barNote: string
}

export type ContactAvatar = {
  initials: string
  name: string
}

export type ContactFormCopy = {
  submitLabel: string
  consent: string
  successHeading: string
  successBody: string
  resetLabel: string
}

export type ContactInfoCard = {
  emailLabel: string
  studioLabel: string
  howWeWorkLabel: string
  howWeWorkItems: string[]
}

export type ContactContent = {
  title: string
  eyebrow: string
  heading: string
  avatars: ContactAvatar[]
  topics: string[]
  form: ContactFormCopy
  infoCard: ContactInfoCard
}

export type SectionMarkers = {
  about: Marker
  work: Marker
  faq: Marker
  story: Marker
  reviews: Marker
  services: Marker
  contact: Marker
}

export type HomeContent = {
  hero: HeroContent
  about: AboutContent
  work: WorkContent
  faq: SectionCopy
  story: StoryContent
  reviews: SectionCopy
  services: SectionCopy
  contact: ContactContent
  markers: SectionMarkers
}

export type ProjectFilter = {
  label: string
  key: string
}
