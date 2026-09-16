import type { GlobalConfig } from 'payload'

import { anyone, isAdmin } from '../access'
import { linkFields } from '../fields/link'
import { rebuildOnGlobalChange } from '../hooks/rebuildWebhook'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site settings',
  admin: {
    group: 'Settings',
    description: 'Title, SEO defaults, contact details and footer copy.',
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
      type: 'tabs',
      tabs: [
        {
          label: 'Identity & SEO',
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
              defaultValue: 'Monfolio — design & build studio',
            },
            {
              name: 'description',
              type: 'textarea',
              required: true,
              defaultValue:
                'A design & build studio for marketing teams that need a faster, clearer website.',
            },
            {
              name: 'ogImage',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Social sharing image. Falls back to /og.svg when empty.',
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'favicon',
                  type: 'text',
                  defaultValue: '/favicon.svg',
                  admin: { width: '50%' },
                },
                {
                  name: 'themeColor',
                  type: 'text',
                  defaultValue: '#ffffff',
                  admin: { width: '50%' },
                },
              ],
            },
          ],
        },
        {
          label: 'Contact',
          fields: [
            {
              name: 'contactEmail',
              type: 'email',
              required: true,
              defaultValue: 'hello@monfolio.studio',
            },
            {
              name: 'address',
              type: 'textarea',
              admin: {
                description: 'Rendered with line breaks preserved.',
              },
            },
          ],
        },
        {
          label: 'Footer',
          fields: [
            {
              name: 'footerTagline',
              type: 'textarea',
            },
            {
              name: 'footerBanner',
              type: 'group',
              fields: [
                {
                  name: 'eyebrow',
                  type: 'text',
                  defaultValue: 'Work with us',
                },
                {
                  name: 'heading',
                  type: 'textarea',
                },
                {
                  name: 'ctaLabel',
                  type: 'text',
                  defaultValue: 'Start a conversation ↗',
                },
              ],
            },
            {
              name: 'copyright',
              type: 'text',
            },
            {
              name: 'legalLinks',
              type: 'array',
              labels: { singular: 'Legal link', plural: 'Legal links' },
              fields: linkFields,
            },
            {
              name: 'socialLinks',
              type: 'array',
              labels: { singular: 'Social link', plural: 'Social links' },
              fields: linkFields,
            },
          ],
        },
      ],
    },
  ],
}
