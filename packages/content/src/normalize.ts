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
