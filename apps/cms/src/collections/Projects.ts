import type { CollectionConfig } from 'payload'

import { isAdmin, publishedOrAdmin } from '../access'
import { slugField } from '../fields/slug'
import { rebuildOnChange, rebuildOnDelete } from '../hooks/rebuildWebhook'

export const Projects: CollectionConfig = {
  slug: 'projects',
  labels: {
    singular: 'Project',
    plural: 'Projects',
  },
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: ['image', 'title', 'category', 'featured', '_status', 'updatedAt'],
    listSearchableFields: ['title', 'description', 'year'],
    description: 'Case studies shown in the work grid and the featured build block.',
    // Per-project detail page.
    preview: ({ data }) => {
      const base = process.env.WEB_URL ?? 'http://localhost:4321'
      const slug = (data as { slug?: string })?.slug
      return slug ? `${base}/work/project/${slug}` : base
    },
  },
  versions: {
    drafts: true,
  },
  access: {
    read: publishedOrAdmin,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  hooks: {
    afterChange: [rebuildOnChange],
    afterDelete: [rebuildOnDelete],
  },
  defaultSort: 'order',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    slugField(),
    {
      type: 'row',
      fields: [
        {
          name: 'category',
          type: 'relationship',
          relationTo: 'categories',
          required: true,
          admin: {
            width: '60%',
          },
        },
        {
          name: 'year',
          type: 'text',
          required: true,
          admin: {
            width: '40%',
          },
        },
      ],
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'content',
      type: 'blocks',
      label: 'Story blocks',
      admin: {
        description:
          'Free-form case study body, rendered in order on the detail page. Leave empty to fall back to the gallery, quote and metrics below.',
      },
      blocks: [
        {
          slug: 'text',
          labels: { singular: 'Text', plural: 'Text' },
          fields: [
            {
              name: 'text',
              type: 'textarea',
              required: true,
              admin: {
                description:
                  'Separate paragraphs with a blank line. Inline HTML is allowed, e.g. <em>…</em> or <br />.',
              },
            },
          ],
        },
        {
          slug: 'image',
          labels: { singular: 'Image', plural: 'Images' },
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
            {
              name: 'alt',
              type: 'text',
              admin: { description: 'Falls back to the media alt text.' },
            },
            {
              name: 'width',
              type: 'select',
              defaultValue: 'wide',
              options: [
                { label: 'Wide — full content width', value: 'wide' },
                { label: 'Standard — text column', value: 'standard' },
                { label: 'Narrow — centered detail', value: 'narrow' },
              ],
            },
            {
              name: 'caption',
              type: 'text',
            },
          ],
        },
        {
          slug: 'gallery',
          labels: { singular: 'Gallery', plural: 'Galleries' },
          fields: [
            {
              name: 'images',
              type: 'upload',
              relationTo: 'media',
              hasMany: true,
              required: true,
            },
            {
              name: 'columns',
              type: 'select',
              defaultValue: '2',
              options: [
                { label: 'Two columns', value: '2' },
                { label: 'Three columns', value: '3' },
              ],
            },
            {
              name: 'caption',
              type: 'text',
            },
          ],
        },
        {
          slug: 'quote',
          labels: { singular: 'Quote', plural: 'Quotes' },
          fields: [
            {
              name: 'quote',
              type: 'textarea',
              required: true,
            },
            {
              name: 'attribution',
              type: 'text',
              admin: { description: 'e.g. "Maya Santoso — Founder, Mora Coffee".' },
            },
          ],
        },
        {
          slug: 'stats',
          labels: { singular: 'Stats', plural: 'Stats' },
          fields: [
            {
              name: 'items',
              type: 'array',
              labels: { singular: 'Stat', plural: 'Stats' },
              minRows: 1,
              maxRows: 6,
              fields: [
                {
                  name: 'value',
                  type: 'text',
                  required: true,
                  admin: { description: 'e.g. "47.2%", "+312 orders", "6 weeks".' },
                },
                { name: 'label', type: 'text', required: true },
              ],
            },
          ],
        },
        {
          slug: 'split',
          labels: { singular: 'Text + image', plural: 'Text + image' },
          fields: [
            {
              name: 'text',
              type: 'textarea',
              required: true,
              admin: {
                description:
                  'Separate paragraphs with a blank line. Inline HTML is allowed, e.g. <em>…</em>.',
              },
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
            {
              name: 'alt',
              type: 'text',
              admin: { description: 'Falls back to the media alt text.' },
            },
            {
              name: 'imageSide',
              type: 'select',
              defaultValue: 'left',
              options: [
                { label: 'Image left', value: 'left' },
                { label: 'Image right', value: 'right' },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Main visual for the project card. Without this the card renders empty.',
      },
    },
    {
      name: 'imageAlt',
      type: 'text',
      admin: {
        description: 'Alt text for the card image. Falls back to the media alt text.',
      },
    },
    {
      name: 'gallery',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      admin: {
        description:
          'Fallback story images, used when the story blocks above are empty. Also feeds the card.',
      },
    },
    {
      name: 'metrics',
      type: 'text',
      hasMany: true,
      admin: {
        description: 'Short result chips, e.g. "+42% sign-ups".',
      },
    },
    {
      name: 'deliverables',
      type: 'text',
      hasMany: true,
      admin: {
        description: 'Shown in the detail page meta rail.',
      },
    },
    {
      name: 'quote',
      type: 'textarea',
      admin: {
        description: 'Fallback quote, used when the story blocks above are empty.',
      },
    },
    {
      name: 'size',
      type: 'select',
      defaultValue: 'standard',
      options: [
        { label: 'Standard', value: 'standard' },
        { label: 'Wide', value: 'wide' },
        { label: 'Tall', value: 'tall' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Highlighted in the featured build block.',
      },
    },
    {
      name: 'order',
      type: 'number',
      admin: {
        position: 'sidebar',
        description: 'Lower numbers appear first.',
      },
    },
  ],
}
