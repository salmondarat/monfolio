export type Project = {
  title: string;
  category: string;
  description: string;
  year: string;
  image: string;
  imageAlt: string;
  size?: 'wide' | 'tall' | 'standard';
  metrics?: string[];
  deliverables?: string[];
  quote?: string;
};

const unsplash = (id: string) => `https://images.unsplash.com/photo-${id}?q=80&w=1600&auto=format&fit=crop`;

export const projects: Project[] = [
  { title: 'Mora Coffee', category: 'Custom build / 2024', description: 'A conversion-ready shop with CMS-driven stories and a lighter publishing workflow.', year: '2024', image: unsplash('1495474472287-4d71bcdd2085'), imageAlt: 'Warm interior of the Mora Coffee shop with seating and pendant lamps', size: 'wide', metrics: ['+42% sign-ups', '6 weeks'], deliverables: ['Custom CMS', 'Motion system', 'Launch support'], quote: 'We can finally update the site without waiting on a developer.' },
  { title: 'Form / Function', category: 'Design system / 2024', description: 'A modular marketing site for a materials studio with room to grow.', year: '2024', image: unsplash('1581291518857-4e27b48ff24e'), imageAlt: 'Hand sketching interface wireframes on paper', size: 'tall', metrics: ['38 components', '3 markets'], deliverables: ['Component library', 'CMS architecture'] },
  { title: 'Good News Daily', category: 'Migration / 2023', description: 'A careful WordPress migration that kept the editorial rhythm and search equity.', year: '2023', image: unsplash('1504711434969-e33886168f5c'), imageAlt: 'Stack of freshly printed newspapers', size: 'standard', metrics: ['0 redirects lost', '2× publish speed'], deliverables: ['SEO migration', 'Editorial CMS'] },
  { title: 'Kite Finance', category: 'Growth site / 2023', description: 'A clearer product story for a financial team shipping at pace.', year: '2023', image: unsplash('1554224155-6726b3ff858f'), imageAlt: 'Desk with tax paperwork, a calculator and a hand taking notes', size: 'standard', metrics: ['+28% demo starts'], deliverables: ['Landing pages', 'A/B-ready sections'] },
  { title: 'Nara Objects', category: 'Custom commerce / 2023', description: 'A considered catalogue for objects made to last, built for a small internal team.', year: '2023', image: unsplash('1610701596007-11502861dcfa'), imageAlt: 'Handmade ceramic vessels in soft daylight', size: 'wide', deliverables: ['CMS collections', 'Training handoff'] },
  { title: 'Pollen Club', category: 'Launch site / 2022', description: 'A bright membership launch with a simple, fast content model.', year: '2022', image: unsplash('1490750967868-88aa4486c946'), imageAlt: 'Orange poppies against a clear blue sky', size: 'standard' },
  { title: 'Field Notes', category: 'Campaign system / 2022', description: 'A flexible campaign surface for a more curious outdoors brand.', year: '2022', image: unsplash('1506905925346-21bda4d32df4'), imageAlt: 'Mountain peaks rising above a sea of clouds', size: 'tall' },
  { title: 'Arc Studio', category: 'Studio site / 2022', description: 'A quiet digital home for an architecture practice.', year: '2022', image: unsplash('1486406146926-c627a92ad1ab'), imageAlt: 'Modern building facade photographed from below', size: 'standard' },
];
