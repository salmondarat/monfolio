import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Categories } from './collections/Categories'
import { Faqs } from './collections/Faqs'
import { FormSubmissions } from './collections/FormSubmissions'
import { Media } from './collections/Media'
import { Posts } from './collections/Posts'
import { Projects } from './collections/Projects'
import { Services } from './collections/Services'
import { Testimonials } from './collections/Testimonials'
import { Users } from './collections/Users'
import { Announcement } from './globals/Announcement'
import { HomePage } from './globals/HomePage'
import { Navigation } from './globals/Navigation'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const webOrigin = process.env.WEB_URL

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: '— Monfolio CMS',
    },
  },
  collections: [
    Projects,
    Categories,
    Services,
    Testimonials,
    Posts,
    Faqs,
    Media,
    FormSubmissions,
    Users,
  ],
  globals: [HomePage, SiteSettings, Navigation, Announcement],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL,
  ...(webOrigin ? { cors: [webOrigin], csrf: [webOrigin] } : {}),
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  plugins: [],
})
