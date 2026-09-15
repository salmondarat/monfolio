'use client'

import React, { useEffect, useState } from 'react'

import { DashboardCounts } from './DashboardCounts'

type Submission = { id: string | number; name: string; email: string; topic?: string; createdAt: string }
type FeaturedProject = { id: string | number; title: string; slug?: string }

export const DashboardClient = () => {
  const [submissions, setSubmissions] = useState<Submission[] | null>(null)
  const [featured, setFeatured] = useState<FeaturedProject[] | null>(null)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const [subsRes, featRes] = await Promise.all([
          fetch('/api/form-submissions?limit=5&sort=-createdAt&depth=0'),
          fetch('/api/projects?limit=3&depth=0&where[featured][equals]=true'),
        ])
        const subs = await subsRes.json()
        const feat = await featRes.json()
        if (cancelled) return
        setSubmissions(subs.docs ?? [])
        setFeatured(feat.docs ?? [])
      } catch {
        if (!cancelled) { setSubmissions([]); setFeatured([]) }
      }
    }
    void load()
    return () => { cancelled = true }
  }, [])

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Overview</h1>
        <p>Everything on the site, at a glance.</p>
      </header>
      <DashboardCounts />
      <div className="dashboard-columns">
        <section className="dashboard-panel">
          <h2>Recent form submissions</h2>
          {submissions === null ? (
            <p className="dashboard-loading">Loading…</p>
          ) : submissions.length === 0 ? (
            <p className="dashboard-empty">No submissions yet.</p>
          ) : (
            <ul>
              {submissions.map((s) => (
                <li key={s.id}>
                  <a href={`/admin/collections/form-submissions/${s.id}`}>
                    <strong>{s.name}</strong> — {s.email}
                    {s.topic ? ` · ${s.topic}` : ''}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="dashboard-panel">
          <h2>Featured projects</h2>
          {featured === null ? (
            <p className="dashboard-loading">Loading…</p>
          ) : featured.length === 0 ? (
            <p className="dashboard-empty">Nothing featured yet.</p>
          ) : (
            <ul>
              {featured.map((p) => (
                <li key={p.id}>
                  <a href={`/admin/collections/projects/${p.id}`}>{p.title}</a>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}

export default DashboardClient
