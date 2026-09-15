import type { GlobalConfig } from 'payload'

import { anyone, isAdmin } from '../access'
import { rebuildOnGlobalChange } from '../hooks/rebuildWebhook'

export const Announcement: GlobalConfig = {
  slug: 'announcement',
  label: 'Announcement bar',
  admin: {
    group: 'Settings',
    description: 'Dismissible bar shown above the header.',
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
      name: 'enabled',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'badge',
      type: 'text',
      defaultValue: 'New',
      admin: {
        condition: (data) => Boolean(data?.enabled),
      },
    },
    {
      name: 'message',
      type: 'text',
      admin: {
        condition: (data) => Boolean(data?.enabled),
      },
    },
    {
      name: 'link',
      type: 'text',
      defaultValue: '#contact',
      admin: {
        condition: (data) => Boolean(data?.enabled),
      },
    },
  ],
}
