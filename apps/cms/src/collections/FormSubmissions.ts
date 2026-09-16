import type { CollectionConfig } from 'payload'

import { anyone, isAdmin } from '../access'

export const FormSubmissions: CollectionConfig = {
  slug: 'form-submissions',
  labels: {
    singular: 'Submission',
    plural: 'Submissions',
  },
  admin: {
    group: 'Utilities',
    useAsTitle: 'email',
    defaultColumns: ['name', 'email', 'topic', 'createdAt'],
    listSearchableFields: ['name', 'email', 'topic', 'message'],
    pagination: { defaultLimit: 25 },
    description: 'Contact form requests sent from the website.',
  },
  access: {
    // The website posts here directly from the browser, so create is public.
    // Reading, editing and deleting stays with authenticated admins.
    create: anyone,
    read: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      maxLength: 120,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'topic',
      type: 'text',
      admin: {
        description: 'Which enquiry button the visitor picked.',
      },
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
      maxLength: 4000,
    },
    {
      name: 'source',
      type: 'text',
      admin: {
        readOnly: true,
        description: 'Page the submission came from.',
      },
    },
  ],
}
