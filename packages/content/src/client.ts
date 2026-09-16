type ImportMetaWithEnv = ImportMeta & { env?: Record<string, string | undefined> }

const readEnv = (key: string): string | undefined => {
  const fromImportMeta = (import.meta as ImportMetaWithEnv).env?.[key]

  return fromImportMeta ?? process.env[key]
}

const DEFAULT_CMS_URL = 'http://localhost:3000'

/** Base URL of the Payload REST API, without a trailing slash. */
export const cmsUrl = (): string =>
  (readEnv('PUBLIC_CMS_URL') ?? readEnv('CMS_URL') ?? DEFAULT_CMS_URL).replace(/\/+$/, '')

export type QueryValue = string | number | boolean | undefined

const request = async <TResponse>(path: string): Promise<TResponse> => {
  const response = await fetch(`${cmsUrl()}${path}`, {
    headers: { Accept: 'application/json' },
  })

  if (!response.ok) {
    throw new Error(
      `CMS request failed with ${response.status} ${response.statusText} for ${path}`,
    )
  }

  return (await response.json()) as TResponse
}

export const fetchCollection = async <TDoc>(
  slug: string,
  params: Record<string, QueryValue> = {},
): Promise<TDoc[]> => {
  const search = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) continue

    search.set(key, String(value))
  }

  const query = search.toString()
  const data = await request<{ docs?: TDoc[] }>(`/api/${slug}${query ? `?${query}` : ''}`)

  return data.docs ?? []
}

export const fetchGlobal = <TGlobal>(slug: string): Promise<TGlobal> =>
  request<TGlobal>(`/api/globals/${slug}`)

/** Restricts a collection query to published documents only. */
export const publishedOnly: Record<string, QueryValue> = {
  'where[_status][equals]': 'published',
}
