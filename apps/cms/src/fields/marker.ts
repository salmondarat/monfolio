import type { Field } from 'payload'

/**
 * The small numbered marker that opens each page section, e.g. "2 · Selected builds".
 */
export const markerField = (
  name: string,
  label: string,
  defaultNumber: string,
  defaultLabel: string,
): Field => ({
  name,
  type: 'group',
  label,
  fields: [
    {
      name: 'number',
      type: 'text',
      required: true,
      defaultValue: defaultNumber,
    },
    {
      name: 'label',
      type: 'text',
      required: true,
      defaultValue: defaultLabel,
    },
  ],
})
