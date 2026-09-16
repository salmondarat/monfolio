import type { GlobalConfig } from 'payload'

import { anyone, isAdmin } from '../access'
import { linkField } from '../fields/link'
import { markerField } from '../fields/marker'
import { rebuildOnGlobalChange } from '../hooks/rebuildWebhook'

const htmlNote =
  'Inline HTML is allowed for decorative markup kept from the original design, e.g. <em>…</em>, <br /> or a chip span.'

export const HomePage: GlobalConfig = {
  slug: 'home-page',
  label: 'Home page',
  admin: {
    group: 'Content',
    description: 'Every block of copy on the single page site.',
    preview: () => process.env.WEB_URL ?? 'http://localhost:4321',
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
          label: 'Hero',
          fields: [
            {
              name: 'hero',
              type: 'group',
              label: 'Hero',
              fields: [
                {
                  name: 'badge',
                  type: 'text',
                  defaultValue: 'Graphic Designer',
                },
                {
                  name: 'heading',
                  type: 'textarea',
                  required: true,
                  admin: { description: htmlNote },
                },
                {
                  name: 'skills',
                  type: 'text',
                  hasMany: true,
                },
                {
                  name: 'description',
                  type: 'textarea',
                },
                {
                  name: 'primaryCta',
                  type: 'group',
                  fields: [
                    { name: 'label', type: 'text', admin: { width: '50%' } },
                    { name: 'href', type: 'text', admin: { width: '50%' } },
                  ],
                },
                {
                  name: 'secondaryCta',
                  type: 'group',
                  fields: [
                    { name: 'label', type: 'text', admin: { width: '50%' } },
                    { name: 'href', type: 'text', admin: { width: '50%' } },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'locationBadge',
                      type: 'text',
                      admin: { width: '60%', description: 'e.g. "Monfolio Studio — Jakarta + remote".' },
                    },
                    {
                      name: 'availability',
                      type: 'text',
                      admin: { width: '40%' },
                    },
                  ],
                },
                {
                  name: 'availabilityNote',
                  type: 'text',
                  admin: { description: 'Muted suffix, e.g. "2 project slots".' },
                },
                {
                  name: 'carousel',
                  type: 'array',
                  labels: { singular: 'Slide', plural: 'Slides' },
                  maxRows: 6,
                  fields: [
                    {
                      name: 'image',
                      type: 'upload',
                      relationTo: 'media',
                      required: true,
                    },
                    {
                      name: 'caption',
                      type: 'text',
                      required: true,
                      admin: { description: 'e.g. "Mora Coffee — Brand".' },
                    },
                  ],
                },
                {
                  name: 'marquee',
                  type: 'text',
                  hasMany: true,
                  label: 'Client marquee',
                },
              ],
            },
          ],
        },
        {
          label: 'About',
          fields: [
            {
              name: 'about',
              type: 'group',
              label: 'About',
              fields: [
                {
                  name: 'heading',
                  type: 'textarea',
                  admin: { description: htmlNote },
                },
                {
                  name: 'intro',
                  type: 'textarea',
                },
                {
                  name: 'tiles',
                  type: 'array',
                  maxRows: 4,
                  fields: [
                    {
                      name: 'label',
                      type: 'text',
                      required: true,
                    },
                    {
                      name: 'caption',
                      type: 'text',
                      required: true,
                    },
                    {
                      name: 'variant',
                      type: 'select',
                      required: true,
                      defaultValue: 'accent',
                      options: [
                        { label: 'Accent (orange)', value: 'accent' },
                        { label: 'Dark', value: 'dark' },
                      ],
                    },
                  ],
                },
                {
                  name: 'pillars',
                  type: 'array',
                  fields: [
                    { name: 'label', type: 'text', required: true },
                    { name: 'title', type: 'text', required: true },
                    { name: 'body', type: 'textarea', required: true },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Work',
          fields: [
            {
              name: 'work',
              type: 'group',
              label: 'Work',
              fields: [
                {
                  name: 'heading',
                  type: 'textarea',
                  admin: { description: htmlNote },
                },
                {
                  name: 'intro',
                  type: 'textarea',
                },
                {
                  name: 'filters',
                  type: 'array',
                  label: 'Filter tabs',
                  admin: {
                    description:
                      'Tabs above the project grid. Each category is assigned to one of these keys.',
                  },
                  fields: [
                    { name: 'label', type: 'text', required: true },
                    {
                      name: 'key',
                      type: 'text',
                      required: true,
                      admin: { description: 'Use "all" for the unfiltered tab.' },
                    },
                  ],
                },
                {
                  name: 'maxVisible',
                  type: 'number',
                  defaultValue: 4,
                  admin: { description: 'How many project cards show before "show all".' },
                },
                {
                  name: 'showAllLabel',
                  type: 'text',
                  defaultValue: 'Show all',
                },
                {
                  name: 'showLessLabel',
                  type: 'text',
                  defaultValue: 'Show fewer',
                },
                {
                  name: 'featured',
                  type: 'group',
                  label: 'Featured build',
                  fields: [
                    {
                      name: 'project',
                      type: 'relationship',
                      relationTo: 'projects',
                      admin: {
                        description:
                          'Optional. Leave empty to use the project flagged as featured.',
                      },
                    },
                    { name: 'badge', type: 'text', defaultValue: 'Featured build' },
                    {
                      name: 'category',
                      type: 'text',
                      admin: { description: 'e.g. "Mora Coffee / Custom build".' },
                    },
                    { name: 'title', type: 'text' },
                    { name: 'description', type: 'textarea' },
                    linkField('cta', 'Call to action'),
                    { name: 'readTime', type: 'text', admin: { description: 'e.g. "Read 3 min".' } },
                    {
                      name: 'backImage',
                      type: 'upload',
                      relationTo: 'media',
                      admin: { description: 'Image shown on the stacked card behind the front card.' },
                    },
                    { name: 'backBadge', type: 'text' },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'FAQ',
          fields: [
            {
              name: 'faq',
              type: 'group',
              label: 'FAQ',
              fields: [
                { name: 'heading', type: 'textarea', admin: { description: htmlNote } },
                { name: 'intro', type: 'textarea' },
              ],
            },
          ],
        },
        {
          label: 'Story',
          fields: [
            {
              name: 'story',
              type: 'group',
              label: 'Story',
              fields: [
                { name: 'title', type: 'textarea', admin: { description: htmlNote } },
                { name: 'intro', type: 'textarea' },
                { name: 'artWord', type: 'text', admin: { description: 'Large art word, e.g. "MAKE SPACE".' } },
                { name: 'videoLabel', type: 'text', admin: { description: 'e.g. "Watch our story · 1:30".' } },
                { name: 'barLocation', type: 'text' },
                { name: 'barNote', type: 'text' },
              ],
            },
          ],
        },
        {
          label: 'Reviews',
          fields: [
            {
              name: 'reviews',
              type: 'group',
              label: 'Reviews',
              fields: [
                { name: 'heading', type: 'textarea', admin: { description: htmlNote } },
                { name: 'intro', type: 'textarea' },
              ],
            },
          ],
        },
        {
          label: 'Services',
          fields: [
            {
              name: 'services',
              type: 'group',
              label: 'Services',
              fields: [
                { name: 'heading', type: 'textarea', admin: { description: htmlNote } },
                { name: 'intro', type: 'textarea' },
              ],
            },
          ],
        },
        {
          label: 'Contact',
          fields: [
            {
              name: 'contact',
              type: 'group',
              label: 'Contact',
              fields: [
                { name: 'title', type: 'textarea', admin: { description: htmlNote } },
                { name: 'eyebrow', type: 'text' },
                { name: 'heading', type: 'text' },
                {
                  name: 'avatars',
                  type: 'array',
                  maxRows: 6,
                  fields: [
                    { name: 'initials', type: 'text', required: true },
                    {
                      name: 'name',
                      type: 'text',
                      admin: { description: 'Tooltip text, e.g. "Maya — strategy".' },
                    },
                  ],
                },
                {
                  name: 'topics',
                  type: 'array',
                  label: 'Enquiry topics',
                  fields: [{ name: 'label', type: 'text', required: true }],
                },
                {
                  name: 'form',
                  type: 'group',
                  label: 'Form copy',
                  fields: [
                    { name: 'submitLabel', type: 'text', defaultValue: 'Send message ↗' },
                    { name: 'consent', type: 'text' },
                    { name: 'successHeading', type: 'text', defaultValue: 'Message received.' },
                    { name: 'successBody', type: 'textarea' },
                    { name: 'resetLabel', type: 'text', defaultValue: 'Send another message' },
                  ],
                },
                {
                  name: 'infoCard',
                  type: 'group',
                  label: 'Info card',
                  fields: [
                    { name: 'emailLabel', type: 'text', defaultValue: 'Direct inquiries' },
                    { name: 'studioLabel', type: 'text', defaultValue: 'Studio' },
                    { name: 'howWeWorkLabel', type: 'text', defaultValue: 'How we work' },
                    {
                      name: 'howWeWorkItems',
                      type: 'text',
                      hasMany: true,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Section markers',
          fields: [
            {
              name: 'markers',
              type: 'group',
              label: 'Section markers',
              fields: [
                markerField('about', 'About', '1', 'How we work'),
                markerField('work', 'Work', '2', 'Selected builds'),
                markerField('faq', 'FAQ', '3', 'FAQ'),
                markerField('story', 'Story', '4', 'Our story'),
                markerField('reviews', 'Reviews', '5', 'Client reviews'),
                markerField('services', 'Services', '6', 'Services'),
                markerField('contact', 'Contact', '7', 'Let’s make & build together'),
              ],
            },
          ],
        },
      ],
    },
  ],
}
