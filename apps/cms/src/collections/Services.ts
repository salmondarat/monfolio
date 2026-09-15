import type { CollectionConfig } from 'payload'

import { anyone, isAdmin } from '../access'
import { rebuildOnChange, rebuildOnDelete } from '../hooks/rebuildWebhook'

export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    group: 'Marketing',
    useAsTitle: 'title',
    defaultColumns: ['number', 'title', 'order'],
    description: 'Offer cards in the services section and the footer services column.',
  },
  access: {
    read: anyone,
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
      name: 'number',
      type: 'text',
      required: true,
      admin: {
        description: 'Display index, e.g. "01".',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'items',
      type: 'text',
      hasMany: true,
      admin: {
        description: 'Bullet chips listed under the description.',
      },
    },
    {
      name: 'order',
      type: 'number',
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
