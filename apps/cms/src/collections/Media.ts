import type { CollectionConfig } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'

import { anyone } from '../access'

const dirname = path.dirname(fileURLToPath(import.meta.url))

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'Content',
    listSearchableFields: ['alt', 'credit'],
    description: 'Uploads used across the site: project imagery, hero carousel, OG image.',
  },
  access: {
    read: anyone,
  },
  upload: {
    staticDir: path.resolve(dirname, '../../media'),
    focalPoint: true,
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*'],
    imageSizes: [
      {
        name: 'thumbnail',
        width: 480,
        height: 320,
        position: 'centre',
      },
      {
        name: 'card',
        width: 900,
        height: 600,
        position: 'centre',
      },
      {
        name: 'wide',
        width: 1600,
        height: 1000,
        position: 'centre',
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        description: 'Describe the image for screen readers and SEO.',
      },
    },
    {
      name: 'credit',
      type: 'text',
    },
  ],
}
