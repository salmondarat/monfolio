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
    // Targets the category page containing the project grid until per-project detail pages exist.
    preview: ({ data }) => {
      const base = process.env.WEB_URL ?? 'http://localhost:4321'
      return data?.slug ? `${base}/work/${data.slug}` : base
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
        description: 'Stored for the future project detail page.',
      },
    },
    {
      name: 'quote',
      type: 'textarea',
      admin: {
        description: 'Stored for the future project detail page.',
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
