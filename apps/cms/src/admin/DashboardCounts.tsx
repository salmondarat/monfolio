'use client'

import React, { useEffect, useState } from 'react'

type CountCard = {
  label: string
  href: string
  total: number
  draft?: number
}

async function fetchTotal(slug: string, extraQuery = ''): Promise<number> {
  const res = await fetch(`/api/${slug}?limit=1&depth=0${extraQuery}`)
  if (!res.ok) throw new Error(`${slug}: ${res.status}`)
  const json = await res.json()
  return json.totalDocs as number
}

export const DashboardCounts = () => {
  const [cards, setCards] = useState<CountCard[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const [projects, drafts, posts, services, testimonials, faqs, media, submissions] =
          await Promise.all([
            fetchTotal('projects'),
            fetchTotal('projects', '&where[_status][equals]=draft'),
            fetchTotal('posts'),
            fetchTotal('services'),
            fetchTotal('testimonials'),
            fetchTotal('faqs'),
            fetchTotal('media'),
            fetchTotal('form-submissions'),
          ])
        if (cancelled) return
        setCards([
          { label: 'Projects', href: '/admin/collections/projects', total: projects, draft: drafts },
          { label: 'Posts', href: '/admin/collections/posts', total: posts },
          { label: 'Services', href: '/admin/collections/services', total: services },
          { label: 'Testimonials', href: '/admin/collections/testimonials', total: testimonials },
          { label: 'FAQs', href: '/admin/collections/faqs', total: faqs },
          { label: 'Media', href: '/admin/collections/media', total: media },
          { label: 'Form submissions', href: '/admin/collections/form-submissions', total: submissions },
        ])
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load counts')
      }
    }
    void load()
    return () => { cancelled = true }
  }, [])

  if (error) return <p className="dashboard-error">Failed to load: {error}</p>
  if (!cards) return <p className="dashboard-loading">Loading…</p>

  return (
    <div className="dashboard-grid">
      {cards.map((card) => (
        <a key={card.href} className="dashboard-card" href={card.href}>
          <span className="dashboard-card-label">{card.label}</span>
          <span className="dashboard-card-total">{card.total}</span>
          {typeof card.draft === 'number' && card.draft > 0 && (
            <span className="dashboard-card-draft">{card.draft} draft{card.draft === 1 ? '' : 's'}</span>
          )}
        </a>
      ))}
    </div>
  )
}
