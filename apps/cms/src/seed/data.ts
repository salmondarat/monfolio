/**
 * Source content migrated from the original hardcoded src/data/*.ts modules and
 * the inline copy in pages/index.astro, so seeding produces the same site.
 */

const unsplash = (id: string, width = 1600) =>
  `https://images.unsplash.com/photo-${id}?q=80&w=${width}&auto=format&fit=crop`

export const categories = [
  {
    name: 'Custom build',
    key: 'custom-build',
    filter: 'custom-build',
    order: 1,
    page: {
      layout: 'showcase' as const,
      eyebrow: 'Category',
      heading: 'Custom builds that <em>keep working.</em>',
      intro:
        'Bespoke sites built around a content model your team can actually run — from the first working session through to launch support.',
      heroImage: unsplash('1501339847302-ac426a4a7cbb'),
    },
  },
  {
    name: 'Design system',
    key: 'design-system',
    filter: 'design-system',
    order: 2,
    page: {
      layout: 'grid' as const,
      eyebrow: 'Category',
      heading: 'Systems that keep <em>every page coherent.</em>',
      intro:
        'Component libraries, tokens and rules that make the next page easier to ship than the last.',
    },
  },
  {
    name: 'Migration',
    key: 'migration',
    filter: 'migration',
    order: 3,
    page: {
      layout: 'editorial' as const,
      eyebrow: 'Category',
      heading: 'Moved carefully, <em>nothing lost.</em>',
      intro:
        'Legacy platforms retired without dropping redirects, rankings or the editorial rhythm the team relies on.',
    },
  },
  {
    name: 'Growth site',
    key: 'growth-site',
    filter: 'growth',
    order: 4,
    page: {
      layout: 'grid' as const,
      eyebrow: 'Category',
      heading: 'Sites built to <em>keep moving.</em>',
      intro: 'Product stories that stay clear while the roadmap underneath them keeps changing.',
    },
  },
  {
    name: 'Custom commerce',
    key: 'custom-commerce',
    filter: 'custom-build',
    order: 5,
    page: {
      layout: 'showcase' as const,
      eyebrow: 'Category',
      heading: 'Catalogues with <em>room to grow.</em>',
      intro:
        'Considered storefronts for small teams who need to publish new products without a developer in the loop.',
      heroImage: unsplash('1610701596007-11502861dcfa'),
    },
  },
  {
    name: 'Launch site',
    key: 'launch-site',
    filter: 'growth',
    order: 6,
    page: {
      layout: 'grid' as const,
      eyebrow: 'Category',
      heading: 'Launches that <em>land cleanly.</em>',
      intro: 'Fast, focused builds for the moment a new thing goes public.',
    },
  },
  {
    name: 'Campaign system',
    key: 'campaign-system',
    filter: 'growth',
    order: 7,
    page: {
      layout: 'editorial' as const,
      eyebrow: 'Category',
      heading: 'Campaign surfaces that <em>bend without breaking.</em>',
      intro: 'Flexible page systems for teams running more than one story at a time.',
    },
  },
  {
    name: 'Studio site',
    key: 'studio-site',
    filter: 'growth',
    order: 8,
    page: {
      layout: 'grid' as const,
      eyebrow: 'Category',
      heading: 'A quiet home for <em>the work.</em>',
      intro: 'Understated portfolio sites for practices that would rather show than tell.',
    },
  },
]

export const projects = [
  {
    title: 'Mora Coffee',
    categoryKey: 'custom-build',
    description:
      'A conversion-ready shop with CMS-driven stories and a lighter publishing workflow.',
    year: '2024',
    image: unsplash('1495474472287-4d71bcdd2085'),
    imageAlt: 'Warm interior of the Mora Coffee shop with seating and pendant lamps',
    gallery: [
      { url: unsplash('1495474472287-4d71bcdd2085'), alt: 'Mora Coffee homepage hero on desktop' },
      { url: unsplash('1447933601403-0c6688de566e'), alt: 'Coffee beans and brewing equipment detail' },
      { url: unsplash('1509042239860-f550ce710b93'), alt: 'Barista pouring a flat white at the counter' },
    ],
    size: 'wide',
    metrics: ['+42% sign-ups', '6 weeks'],
    deliverables: ['Custom CMS', 'Motion system', 'Launch support'],
    quote: 'We can finally update the site without waiting on a developer.',
    featured: true,
    order: 1,
  },
  {
    title: 'Form / Function',
    categoryKey: 'design-system',
    description: 'A modular marketing site for a materials studio with room to grow.',
    year: '2024',
    image: unsplash('1581291518857-4e27b48ff24e'),
    imageAlt: 'Hand sketching interface wireframes on paper',
    gallery: [
      { url: unsplash('1581291518857-4e27b48ff24e'), alt: 'Component library overview page' },
      { url: unsplash('1495020689067-958852a7765e'), alt: 'Material samples arranged on a studio table' },
    ],
    size: 'tall',
    metrics: ['38 components', '3 markets'],
    deliverables: ['Component library', 'CMS architecture'],
    featured: false,
    order: 2,
  },
  {
    title: 'Good News Daily',
    categoryKey: 'migration',
    description:
      'A careful WordPress migration that kept the editorial rhythm and search equity.',
    year: '2023',
    image: unsplash('1504711434969-e33886168f5c'),
    imageAlt: 'Stack of freshly printed newspapers',
    gallery: [
      { url: unsplash('1504711434969-e33886168f5c'), alt: 'Newly designed article template' },
      { url: unsplash('1495020689067-958852a7765e'), alt: 'Rolls of newsprint in a printing hall' },
    ],
    size: 'standard',
    metrics: ['0 redirects lost', '2× publish speed'],
    deliverables: ['SEO migration', 'Editorial CMS'],
    featured: false,
    order: 3,
  },
  {
    title: 'Kite Finance',
    categoryKey: 'growth-site',
    description: 'A clearer product story for a financial team shipping at pace.',
    year: '2023',
    image: unsplash('1554224155-6726b3ff858f'),
    imageAlt: 'Desk with tax paperwork, a calculator and a hand taking notes',
    gallery: [
      { url: unsplash('1554224155-6726b3ff858f'), alt: 'Kite Finance landing page with pricing section' },
      { url: unsplash('1460925895917-afdab827c52f'), alt: 'Analytics dashboard with growth charts' },
    ],
    size: 'standard',
    metrics: ['+28% demo starts'],
    deliverables: ['Landing pages', 'A/B-ready sections'],
    featured: false,
    order: 4,
  },
  {
    title: 'Nara Objects',
    categoryKey: 'custom-commerce',
    description:
      'A considered catalogue for objects made to last, built for a small internal team.',
    year: '2023',
    image: unsplash('1610701596007-11502861dcfa'),
    imageAlt: 'Handmade ceramic vessels in soft daylight',
    gallery: [
      { url: unsplash('1610701596007-11502861dcfa'), alt: 'Product listing grid for ceramic objects' },
      { url: unsplash('1460925895917-afdab827c52f'), alt: 'Ceramic vessel detail in studio light' },
      { url: unsplash('1466781783364-36c955e42a7f'), alt: 'Packaging and unboxing sequence' },
    ],
    size: 'wide',
    metrics: [],
    deliverables: ['CMS collections', 'Training handoff'],
    featured: false,
    order: 5,
  },
  {
    title: 'Pollen Club',
    categoryKey: 'launch-site',
    description: 'A bright membership launch with a simple, fast content model.',
    year: '2022',
    image: unsplash('1490750967868-88aa4486c946'),
    imageAlt: 'Orange poppies against a clear blue sky',
    gallery: [
      { url: unsplash('1490750967868-88aa4486c946'), alt: 'Pollen Club launch page hero' },
      { url: unsplash('1466781783364-36c955e42a7f'), alt: 'Wildflower meadow at golden hour' },
    ],
    size: 'standard',
    metrics: [],
    deliverables: [],
    featured: false,
    order: 6,
  },
  {
    title: 'Field Notes',
    categoryKey: 'campaign-system',
    description: 'A flexible campaign surface for a more curious outdoors brand.',
    year: '2022',
    image: unsplash('1506905925346-21bda4d32df4'),
    imageAlt: 'Mountain peaks rising above a sea of clouds',
    gallery: [
      { url: unsplash('1506905925346-21bda4d32df4'), alt: 'Field Notes campaign landing above the clouds' },
      { url: unsplash('1464822759023-fed622ff2c3b'), alt: 'Hiker on a ridge trail at sunrise' },
      { url: unsplash('1441974231531-c6227db76b6e'), alt: 'Forest canopy from the trail' },
    ],
    size: 'tall',
    metrics: [],
    deliverables: [],
    featured: false,
    order: 7,
  },
  {
    title: 'Arc Studio',
    categoryKey: 'studio-site',
    description: 'A quiet digital home for an architecture practice.',
    year: '2022',
    image: unsplash('1486406146926-c627a92ad1ab'),
    imageAlt: 'Modern building facade photographed from below',
    gallery: [
      { url: unsplash('1486406146926-c627a92ad1ab'), alt: 'Arc Studio portfolio index page' },
      { url: unsplash('1487958449943-2429e8be8625'), alt: 'Concrete building detail in daylight' },
    ],
    size: 'standard',
    metrics: [],
    deliverables: [],
    featured: false,
    order: 8,
  },
]

export const featuredProjectTitle = 'Mora Coffee'

/** Image for the card stacked behind the featured build visual. */
export const featuredBackImage = {
  url: unsplash('1501339847302-ac426a4a7cbb'),
  alt: 'Artisan coffee detail at Mora Coffee',
}

export const services = [
  {
    number: '01',
    title: 'Design & build',
    description: 'Clean, responsive builds that your team can actually run.',
    items: ['CMS architecture', 'Interactions', 'QA + launch'],
    order: 1,
  },
  {
    number: '02',
    title: 'Design systems',
    description: 'A small set of rules that keeps every new page coherent.',
    items: ['Component libraries', 'Tokens', 'Figma handoff'],
    order: 2,
  },
  {
    number: '03',
    title: 'Migrations',
    description: 'Move off a legacy stack without leaving content or search equity behind.',
    items: ['WordPress', 'Redirect mapping', 'Content modelling'],
    order: 3,
  },
  {
    number: '04',
    title: 'Ongoing growth',
    description: 'A reliable partner for the pages and experiments after launch.',
    items: ['Sprints', 'A/B tests', 'New pages'],
    order: 4,
  },
]

export const testimonials = [
  {
    quote:
      'Monfolio gave our marketing team a site we can run ourselves. The build is fast, clear and still feels like us.',
    name: 'Maya Santoso',
    role: 'Founder, Mora Coffee',
    order: 1,
  },
  {
    quote:
      'They asked the right questions, made the trade-offs visible and shipped a system our team could use on day one.',
    name: 'Rafi Pranoto',
    role: 'Marketing Director, Form / Function',
    order: 2,
  },
  {
    quote:
      'The migration was calm and methodical. We kept our rankings and gained a much better publishing workflow.',
    name: 'Nadine Putri',
    role: 'Brand Lead, Good News Daily',
    order: 3,
  },
]

export const faqs = [
  {
    question: 'What does your design & build process look like end-to-end?',
    answer:
      'We start with a short working session, map the content and components, then build in small reviewable steps. We QA across devices, train your team and stay close through launch.',
    order: 1,
  },
  {
    question: 'How long does a typical project take from kickoff to launch?',
    answer:
      'Most marketing sites take six to ten weeks. The honest answer depends on content readiness, integrations and how quickly decisions get made.',
    order: 2,
  },
  {
    question: 'What engagement models do you offer — fixed scope, sprint, or retainer?',
    answer:
      'All three. Fixed scope works for a defined launch, sprints keep a moving backlog healthy, and retainers reserve a dependable block of studio time each month.',
    order: 3,
  },
  {
    question: 'Do you build design systems from scratch or work from existing Figma libraries?',
    answer:
      'Both. We can turn an existing Figma library into a useful production system, or define the component rules with your design team before the build starts.',
    order: 4,
  },
  {
    question: 'Can you migrate our site off WordPress or a legacy CMS without losing SEO?',
    answer:
      'Yes. We inventory URLs, content and metadata first, model the CMS carefully, then test redirects and key templates before anything goes live.',
    order: 5,
  },
  {
    question: 'How do you handle ongoing updates, A/B tests, and new page requests after launch?',
    answer:
      'We keep a shared backlog and work in short, visible sprints. Small content changes can stay with your team; structural or experimental work comes through us.',
    order: 6,
  },
  {
    question: 'What does your pricing look like and what’s typically included?',
    answer:
      'Projects are priced around scope, complexity and the level of collaboration needed. A proposal includes the build, QA, launch support and a clear list of what is not included.',
    order: 7,
  },
  {
    question: 'How do we get started — and what do you need from us on day one?',
    answer:
      'Send the current site, the problem you are trying to solve and your target launch window. We will reply with a few useful questions, not a generic deck.',
    order: 8,
  },
]

export const posts = [
  { title: 'What a good CMS model looks like', kind: 'Process / 01', visual: 'colour' },
  { title: 'Motion with a job to do', kind: 'Build notes / 02', visual: 'type' },
  { title: 'A quieter launch checklist', kind: 'Notes / 03', visual: 'desk' },
  { title: 'Naming the system', kind: 'Systems / 04', visual: 'shape' },
  { title: 'The handoff after handoff', kind: 'Process / 05', visual: 'orbit' },
  { title: 'One grid, many pages', kind: 'Custom / 06', visual: 'grid' },
]

export const heroSlides = [
  {
    url: unsplash('1506905925346-21bda4d32df4', 800),
    alt: 'Mora Coffee brand shoot',
    caption: 'Mora Coffee — Brand',
  },
  {
    url: unsplash('1504711434969-e33886168f5c', 800),
    alt: 'Northwind campaign photography',
    caption: 'Northwind — Campaign',
  },
  {
    url: unsplash('1554224155-6726b3ff858f', 800),
    alt: 'Atlas Labs editorial spread',
    caption: 'Atlas Labs — Editorial',
  },
]

export const homePage = {
  hero: {
    badge: 'Graphic Designer',
    heading:
      'Graphic designer for brands that need <span class="client-chip">real work <i>↗</i></span> — identity, illustration, and material that <span class="showreel-chip">ships <b>▶</b></span>.',
    skills: [
      'Brand Identity',
      'Illustration',
      'Layout & Print',
      'Social Media Kit',
      'Figma',
      'Photoshop',
      'Illustrator',
    ],
    description:
      'Every project shown here is real, shipped work — from brief and concept through to production files your team can use.',
    primaryCta: { label: 'View Work ↗', href: '#work' },
    secondaryCta: { label: 'Contact Me ↓', href: '#contact' },
    locationBadge: 'Monfolio Studio — Jakarta + remote',
    availability: 'Available for Q4 builds',
    availabilityNote: '2 project slots',
    marquee: [
      'Northwind',
      'Atlas Labs',
      'Mora',
      'Fieldwork',
      'Kite',
      'Northwind',
      'Atlas Labs',
      'Mora',
    ],
  },
  about: {
    heading: 'Design-driven craft, built to give marketing teams <em>leverage.</em>',
    intro:
      'We explore, prototype and build alongside the people who will run the site. The result is a useful system, not a handoff-shaped problem.',
    tiles: [
      {
        label: 'Monfolio studio',
        caption: 'Working sessions in Jakarta',
        variant: 'accent' as const,
      },
      {
        label: 'Figma → Build',
        caption: 'Component libraries that stay coherent',
        variant: 'dark' as const,
      },
    ],
    pillars: [
      {
        label: '01 · Architecture',
        title: 'Design systems that scale',
        body: 'A content model that makes the next page easier, not harder.',
      },
      {
        label: '02 · Motion & UX',
        title: 'Interaction with a job to do',
        body: 'Motion that orients, explains or rewards attention.',
      },
      {
        label: '03 · Growth partnership',
        title: 'A studio that stays useful',
        body: 'A clear handoff, a shared backlog and help when the next launch arrives.',
      },
    ],
  },
  work: {
    heading: 'Sites that do<br /><em>useful work.</em>',
    intro:
      'A few custom builds, migrations and systems made with marketing teams who needed momentum.',
    filters: [
      { label: 'All', key: 'all' },
      { label: 'Custom builds', key: 'custom-build' },
      { label: 'Design systems', key: 'design-system' },
      { label: 'Migrations', key: 'migration' },
      { label: 'Growth', key: 'growth' },
    ],
    maxVisible: 4,
    showAllLabel: 'Show all',
    showLessLabel: 'Show fewer',
    featured: {
      badge: 'Featured build',
      category: 'Mora Coffee / Custom build',
      title: 'A warmer shop for slow mornings and good company.',
      description:
        'A conversion-ready shop with CMS-driven stories and a publishing workflow the team can own.',
      cta: { label: 'Explore case study ↗', href: '#contact' },
      readTime: 'Read 3 min',
      backBadge: 'Mora · Detail',
    },
  },
  faq: {
    heading: 'The useful<br /><em>answers.</em>',
    intro:
      'No theatre, no vague process language. Here is how we work when the project is real.',
  },
  story: {
    title: 'Our <span class="w-chip">W</span> studio story.',
    intro:
      'Small enough to stay close to the work. Structured enough to make complex custom builds feel calm.',
    artWord: 'MAKE<br />SPACE',
    videoLabel: 'Watch our story · 1:30',
    barLocation: 'Jakarta + remote / working worldwide',
    barNote: 'Custom builds, made together',
  },
  reviews: {
    heading: 'Words from<br /><em>the teams.</em>',
    intro: 'Three marketing teams on what it is like to build with us — in their own words.',
  },
  services: {
    heading: 'Build once.<br /><em>Keep moving.</em>',
    intro:
      'Bring us a launch, a legacy site or a backlog. We will help you choose the right shape of engagement.',
  },
  contact: {
    title: 'Looking to level-up your site or ship a custom design? <em>Let’s build it.</em>',
    eyebrow: 'The people behind the pixels',
    heading: 'A small studio, close to the work.',
    avatars: [
      { initials: 'MS', name: 'Maya — strategy' },
      { initials: 'RP', name: 'Rafi — design' },
      { initials: 'NP', name: 'Nadine — content' },
      { initials: '+', name: 'You — next project' },
    ],
    topics: [{ label: 'Marketing website' }, { label: 'Migration' }, { label: 'Something else' }],
    form: {
      submitLabel: 'Send message ↗',
      consent: 'By sending this form, you agree to our privacy policy.',
      successHeading: 'Message received.',
      successBody: 'We’ll get back to you within one working day.',
      resetLabel: 'Send another message',
    },
    infoCard: {
      emailLabel: 'Direct inquiries',
      studioLabel: 'Studio',
      howWeWorkLabel: 'How we work',
      howWeWorkItems: ['Custom design & build', 'Remote-first studio', 'Response within 24 hours'],
    },
  },
  markers: {
    about: { number: '1', label: 'How we work' },
    work: { number: '2', label: 'Selected builds' },
    faq: { number: '3', label: 'FAQ' },
    story: { number: '4', label: 'Our story' },
    reviews: { number: '5', label: 'Client reviews' },
    services: { number: '6', label: 'Services' },
    contact: { number: '7', label: 'Let’s make & build together' },
  },
}

export const siteSettings = {
  title: 'Monfolio — design & build studio',
  description:
    'A design & build studio for marketing teams that need a faster, clearer website.',
  contactEmail: 'hello@monfolio.studio',
  address: 'Jl. Kemang Raya 12\nJakarta, Indonesia',
  footerTagline:
    'Design & build studio for marketing teams that need a clearer way to ship.',
  footerBanner: {
    eyebrow: 'Work with us',
    heading:
      'Looking to level-up your site or launch a custom design? Start with a free consultation.',
    ctaLabel: 'Start a conversation ↗',
  },
  copyright: '© Monfolio Studio · Jakarta, Indonesia',
  legalLinks: [
    { label: 'Privacy policy', href: '#contact' },
    { label: 'Cookie preferences', href: '#contact' },
  ],
}

export const navigation = {
  headerLinks: [
    { label: 'Work', href: '#work' },
    { label: 'Services', href: '#services' },
    { label: 'FAQ', href: '#faq' },
  ],
  headerCta: { label: 'Start a project ↗', href: '#contact' },
  footerColumns: [
    {
      title: 'Explore',
      source: 'manual' as const,
      links: [
        { label: 'Home', href: '#top' },
        { label: 'Work', href: '#work' },
        { label: 'About', href: '#about' },
        { label: 'FAQ', href: '#faq' },
        { label: 'Reviews', href: '#reviews' },
        { label: 'Contact', href: '#contact' },
      ],
    },
    { title: 'Case studies', source: 'projects' as const },
    { title: 'Services', source: 'services' as const },
  ],
}

export const announcement = {
  enabled: true,
  badge: 'New',
  message: 'Now booking Q4 custom builds — two slots open this quarter.',
  link: '#contact',
}
