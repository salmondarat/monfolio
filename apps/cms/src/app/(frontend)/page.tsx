import { redirect } from 'next/navigation'

/**
 * This app is the CMS only — the public site lives in apps/web (Astro).
 */
export default function HomePage() {
  redirect('/admin')
}
