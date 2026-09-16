import { cmsUrl } from './client'

export type MediaSize = {
  url?: string | null
  width?: number | null
  height?: number | null
}

export type MediaDoc = {
  id: number | string
  alt?: string | null
  credit?: string | null
  url?: string | null
  filename?: string | null
  width?: number | null
  height?: number | null
  sizes?: Record<string, MediaSize | null> | null
}

export const asMedia = (value: unknown): MediaDoc | undefined => {
  if (!value || typeof value !== 'object') return undefined

  return value as MediaDoc
}

/**
 * Payload returns media URLs as relative paths unless a serverURL is set.
 * Both shapes are normalised to an absolute URL here.
 */
export const mediaUrl = (
  value: unknown,
  size?: 'thumbnail' | 'card' | 'wide',
): string => {
  const media = asMedia(value)

  if (!media) return ''

  const sized = size ? media.sizes?.[size] : undefined
  const url = sized?.url || media.url

  if (!url) return ''

  return url.startsWith('http') ? url : `${cmsUrl()}${url}`
}

export const mediaAlt = (value: unknown, fallback = ''): string => {
  const media = asMedia(value)

  return media?.alt || fallback
}
