import React from 'react'

export const Logo = () => (
  <span
    style={{
      fontFamily: 'var(--font-body, "Plus Jakarta Sans", sans-serif)',
      fontSize: '1.25rem',
      fontWeight: 800,
      letterSpacing: '-0.06em',
      color: 'var(--theme-text)',
    }}
  >
    mon<span style={{ color: 'var(--color-success-500, #f15533)' }}>folio</span>
  </span>
)
