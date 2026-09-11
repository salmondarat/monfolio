export type Service = { number: string; title: string; items: string[]; description: string };
export const services: Service[] = [
  { number: '01', title: 'Design & build', description: 'Clean, responsive builds that your team can actually run.', items: ['CMS architecture', 'Interactions', 'QA + launch'] },
  { number: '02', title: 'Design systems', description: 'A small set of rules that keeps every new page coherent.', items: ['Component libraries', 'Tokens', 'Figma handoff'] },
  { number: '03', title: 'Migrations', description: 'Move off a legacy stack without leaving content or search equity behind.', items: ['WordPress', 'Redirect mapping', 'Content modelling'] },
  { number: '04', title: 'Ongoing growth', description: 'A reliable partner for the pages and experiments after launch.', items: ['Sprints', 'A/B tests', 'New pages'] },
];
