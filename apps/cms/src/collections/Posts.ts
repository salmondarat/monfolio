import type { CollectionConfig } from 'payload'

import { isAdmin, publishedOrAdmin } from '../access'
import { slugField } from '../fields/slug'
import { rebuildOnChange, rebuildOnDelete } from '../hooks/rebuildWebhook'

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: {
    singular: 'Journal entry',
    plural: 'Journal',
  },
  admin: {
    group: 'Content',
    useAsTitle: 'title',
    defaultColumns: ['title', 'kind', 'visual', '_status'],
    listSearchableFields: ['title', 'excerpt'],
    description: 'Notes and process write-ups. Not linked from the site yet.',
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
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    slugField(),
    {
      name: 'kind',
      type: 'text',
      required: true,
      admin: {
        description: 'Label shown above the title, e.g. "Process / 01".',
      },
    },
    {
      name: 'visual',
      type: 'select',
      required: true,
      defaultValue: 'grid',
      options: [
        { label: 'Orbit', value: 'orbit' },
        { label: 'Type', value: 'type' },
        { label: 'Colour', value: 'colour' },
        { label: 'Shape', value: 'shape' },
        { label: 'Desk', value: 'desk' },
        { label: 'Grid', value: 'grid' },
      ],
    },
    {
      name: 'excerpt',
      type: 'textarea',
    },
    {
      name: 'content',
      type: 'richText',
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
  ],
}
