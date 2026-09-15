import type { Access } from 'payload'

export const anyone: Access = () => true

export const isAdmin: Access = ({ req }) => Boolean(req.user)

/**
 * Public visitors only ever see published documents; logged in admins see
 * everything, including drafts.
 */
export const publishedOrAdmin: Access = ({ req }) => {
  if (req.user) return true

  return {
    _status: {
      equals: 'published',
    },
  }
}
