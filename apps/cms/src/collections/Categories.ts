import type { CollectionConfig } from 'payload'

import { anyone, isAdmin } from '../access'
import { slugField } from '../fields/slug'
import { rebuildOnChange, rebuildOnDelete } from '../hooks/rebuildWebhook'

const htmlNote =
  'Inline HTML is allowed for decorative markup kept from the original design, e.g. <em>…</em>, <br /> or a chip span.'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: {
    group: 'Content',
    useAsTitle: 'name',
    defaultColumns: ['name', 'key', 'order'],
    listSearchableFields: ['name', 'key', 'filter'],
    description:
      'Project categories. Each one gets a page at /work/<slug>, using the layout picked on the Page tab.',
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
      type: 'tabs',
      tabs: [
        {
          label: 'Basics',
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
            },
            slugField('name'),
            {
              name: 'key',
              type: 'text',
              required: true,
              unique: true,
              index: true,
              admin: {
                position: 'sidebar',
                description: 'Unique identifier, e.g. custom-commerce.',
              },
            },
            {
              name: 'filter',
              type: 'text',
              required: true,
              defaultValue: 'all',
              admin: {
                description:
                  'Which filter tab this category belongs to. Must match a key in Home page > Work > Filters.',
              },
            },
            {
              name: 'order',
              type: 'number',
              admin: {
                position: 'sidebar',
              },
            },
          ],
        },
        {
          label: 'Page',
          fields: [
            {
              name: 'page',
              type: 'group',
              label: 'Category page',
              fields: [
                {
                  name: 'layout',
                  type: 'select',
                  required: true,
                  defaultValue: 'grid',
                  options: [
                    { label: 'Uniform grid', value: 'grid' },
                    { label: 'Alternating showcase', value: 'showcase' },
                    { label: 'Editorial list', value: 'editorial' },
                  ],
                  admin: {
                    description: 'How the projects on this category page are presented.',
                  },
                },
                {
                  name: 'eyebrow',
                  type: 'text',
                  admin: {
                    description: 'Small label above the heading, e.g. "Category".',
                  },
                },
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
                  name: 'heroImage',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    description: 'Optional. Used as a full-width band by the showcase layout.',
                  },
                },
                {
                  name: 'seo',
                  type: 'group',
                  label: 'SEO',
                  fields: [
                    {
                      name: 'title',
                      type: 'text',
                      admin: {
                        description: 'Falls back to "Category name — site title" when empty.',
                      },
                    },
                    {
                      name: 'description',
                      type: 'textarea',
                      admin: {
                        description: 'Falls back to the intro above when empty.',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
