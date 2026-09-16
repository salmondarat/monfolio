import type { Field } from 'payload'

const formatSlug = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')

/**
 * URL slug that falls back to a sibling text field when left empty.
 */
export const slugField = (sourceField = 'title'): Field => ({
  name: 'slug',
  type: 'text',
  required: true,
  unique: true,
  index: true,
  admin: {
    position: 'sidebar',
    description: `Leave empty to generate from "${sourceField}".`,
  },
  hooks: {
    beforeValidate: [
      ({ data, value }) => {
        if (typeof value === 'string' && value.length > 0) {
          return formatSlug(value)
        }

        const source = (data as Record<string, unknown> | undefined)?.[sourceField]

        if (typeof source === 'string' && source.length > 0) {
          return formatSlug(source)
        }

        return value
      },
    ],
  },
})
