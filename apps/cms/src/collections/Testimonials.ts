import type { CollectionConfig } from 'payload'

import { anyone, isAdmin } from '../access'
import { rebuildOnChange, rebuildOnDelete } from '../hooks/rebuildWebhook'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: {
    group: 'Marketing',
    useAsTitle: 'name',
    defaultColumns: ['name', 'role', 'order'],
    listSearchableFields: ['name', 'role', 'quote'],
    description: 'Client reviews shown in the reviews section.',
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
      name: 'quote',
      type: 'textarea',
      required: true,
    },
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'text',
      required: true,
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
