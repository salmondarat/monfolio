import type { Link, Marker } from './types'

export const text = (value: unknown, fallback = ''): string =>
  typeof value === 'string' && value.length > 0 ? value : fallback

export const textArray = (value: unknown): string[] =>
  Array.isArray(value)
    ? value.filter((item): item is string => typeof item === 'string' && item.length > 0)
    : []

export const bool = (value: unknown, fallback = false): boolean =>
  typeof value === 'boolean' ? value : fallback

export const num = (value: unknown, fallback: number): number =>
  typeof value === 'number' && Number.isFinite(value) ? value : fallback

export const link = (value: unknown, fallbackLabel = '', fallbackHref = '#'): Link => {
  const group = (value ?? {}) as { label?: unknown; href?: unknown }

  return {
    label: text(group.label, fallbackLabel),
    href: text(group.href, fallbackHref),
  }
}

export const marker = (
  value: unknown,
  fallbackNumber: string,
  fallbackLabel: string,
): Marker => {
  const group = (value ?? {}) as { number?: unknown; label?: unknown }

  return {
    number: text(group.number, fallbackNumber),
    label: text(group.label, fallbackLabel),
  }
}

export const group = (value: unknown): Record<string, unknown> =>
  value && typeof value === 'object' ? (value as Record<string, unknown>) : {}

export const rows = (value: unknown): Record<string, unknown>[] =>
  Array.isArray(value) ? value.map((row) => group(row)) : []

/**
 * Turn a textarea value into paragraph strings for the web renderer.
 * Blank lines split paragraphs; single newlines become <br /> so editors can
 * force line breaks. Strings survive verbatim otherwise — inline HTML is the
 * author's responsibility, matching the house convention for display copy.
 */
export const paragraphHtml = (value: unknown): string[] =>
  text(value)
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim().replace(/\n/g, '<br />'))
    .filter((paragraph) => paragraph.length > 0)
