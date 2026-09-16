import type { Field } from 'payload'

/**
 * Reusable {label, href} sub-fields for link arrays.
 */
export const linkFields: Field[] = [
  {
    name: 'label',
    type: 'text',
    required: true,
  },
  {
    name: 'href',
    type: 'text',
    required: true,
    admin: {
      description: 'In-page anchor like #work, or a full URL.',
    },
  },
]

export const linkField = (name: string, label: string): Field => ({
  name,
  type: 'group',
  label,
  fields: linkFields,
})
