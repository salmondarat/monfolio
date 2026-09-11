export type FeedItem = {
  title: string;
  kind: string;
  visual: 'orbit' | 'type' | 'colour' | 'shape' | 'desk' | 'grid';
};

export const feed: FeedItem[] = [
  { title: 'What a good CMS model looks like', kind: 'Process / 01', visual: 'colour' },
  { title: 'Motion with a job to do', kind: 'Build notes / 02', visual: 'type' },
  { title: 'A quieter launch checklist', kind: 'Notes / 03', visual: 'desk' },
  { title: 'Naming the system', kind: 'Systems / 04', visual: 'shape' },
  { title: 'The handoff after handoff', kind: 'Process / 05', visual: 'orbit' },
  { title: 'One grid, many pages', kind: 'Custom / 06', visual: 'grid' },
];
