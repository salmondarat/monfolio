import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
  PayloadRequest,
} from 'payload'

/**
 * Pings a deploy hook so the static Astro site rebuilds with the new content.
 * Intentionally a no-op when REVALIDATE_WEBHOOK_URL is unset, so local
 * development never depends on a deployment target.
 */
export const triggerRebuild = async (label: string, req: PayloadRequest): Promise<void> => {
  const webhookUrl = process.env.REVALIDATE_WEBHOOK_URL

  if (!webhookUrl) return

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        source: 'monfolio-cms',
        label,
        at: new Date().toISOString(),
      }),
    })

    if (!response.ok) {
      req.payload.logger.error(
        `Rebuild webhook failed for ${label}: ${response.status} ${response.statusText}`,
      )
      return
    }

    req.payload.logger.info(`Rebuild webhook triggered for ${label}`)
  } catch (error) {
    req.payload.logger.error(
      `Rebuild webhook error for ${label}: ${
        error instanceof Error ? error.message : String(error)
      }`,
    )
  }
}

export const rebuildOnChange: CollectionAfterChangeHook = ({ collection, req }) =>
  triggerRebuild(`collection:${collection.slug}`, req)

export const rebuildOnDelete: CollectionAfterDeleteHook = ({ collection, req }) =>
  triggerRebuild(`collection:${collection.slug}`, req)

export const rebuildOnGlobalChange: GlobalAfterChangeHook = ({ global, req }) =>
  triggerRebuild(`global:${global.slug}`, req)
