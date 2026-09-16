import type { CollectionConfig } from 'payload'

import { anyone, isAdmin } from '../access'
import { rebuildOnChange, rebuildOnDelete } from '../hooks/rebuildWebhook'

export const Faqs: CollectionConfig = {
  slug: 'faqs',
  labels: {
    singular: 'FAQ',
    plural: 'FAQs',
  },
  admin: {
    group: 'Marketing',
    useAsTitle: 'question',
    defaultColumns: ['question', 'order'],
    listSearchableFields: ['question', 'answer'],
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
      name: 'question',
      type: 'text',
      required: true,
    },
    {
      name: 'answer',
      type: 'textarea',
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
