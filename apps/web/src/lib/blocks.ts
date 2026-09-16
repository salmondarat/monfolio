import type { Project, ProjectBlock } from '@monfolio/content';

/**
 * Projects authored before story blocks existed (or with the blocks left
 * empty) still get a full detail page: the legacy gallery, quote and metrics
 * fields are composed into a simple block stream here.
 */
export const composeFallbackBlocks = (project: Project): ProjectBlock[] => {
  const blocks: ProjectBlock[] = [];

  const gallery =
    project.gallery.length > 0
      ? project.gallery
      : project.image
        ? [{ url: project.image, alt: project.imageAlt }]
        : [];

  if (gallery.length > 1) {
    blocks.push({ blockType: 'gallery', images: gallery, columns: 2 });
  } else if (gallery.length === 1) {
    blocks.push({
      blockType: 'image',
      url: gallery[0].url,
      alt: gallery[0].alt,
      width: 'wide',
    });
  }

  if (project.quote) {
    blocks.push({ blockType: 'quote', text: project.quote });
  }

  if (project.metrics.length > 0) {
    blocks.push({
      blockType: 'stats',
      items: project.metrics.map((metric) => ({ value: metric, label: '' })),
    });
  }

  return blocks;
};
