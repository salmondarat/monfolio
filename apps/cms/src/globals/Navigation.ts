import type { GlobalConfig } from 'payload'

import { anyone, isAdmin } from '../access'
import { linkFields } from '../fields/link'
import { rebuildOnGlobalChange } from '../hooks/rebuildWebhook'

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  label: 'Navigation',
  admin: {
    group: 'Settings',
    description: 'Header menu, header call to action and the footer link columns.',
  },
  access: {
    read: anyone,
    update: isAdmin,
  },
  hooks: {
    afterChange: [rebuildOnGlobalChange],
  },
  fields: [
    {
      name: 'headerLinks',
      type: 'array',
      label: 'Header links',
      fields: linkFields,
    },
    {
      name: 'headerCta',
      type: 'group',
      label: 'Header call to action',
      fields: linkFields,
    },
    {
      name: 'footerColumns',
      type: 'array',
      label: 'Footer columns',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'source',
          type: 'select',
          defaultValue: 'manual',
          options: [
            { label: 'Manual links', value: 'manual' },
            { label: 'First 5 projects', value: 'projects' },
            { label: 'All services', value: 'services' },
          ],
          admin: {
            description:
              'Projects and services columns are generated from their collections instead of a manual list.',
          },
        },
        {
          name: 'links',
          type: 'array',
          admin: {
            condition: (_, siblingData) => siblingData?.source === 'manual',
          },
          fields: linkFields,
        },
      ],
    },
  ],
}
