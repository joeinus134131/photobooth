/** In-memory share store (single-instance; use S3/R2 for production multi-instance). */

const TTL_MS = 60 * 60 * 1000 // 1 hour

interface ShareEntry {
  dataUrl: string
  expiresAt: number
}

type ShareStore = Map<string, ShareEntry>

function getStore(): ShareStore {
  const g = globalThis as unknown as { __photoboothShareStore?: ShareStore }
  if (!g.__photoboothShareStore) {
    g.__photoboothShareStore = new Map()
  }
  return g.__photoboothShareStore
}

function prune(store: ShareStore) {
  const now = Date.now()
  for (const [id, entry] of store.entries()) {
    if (entry.expiresAt <= now) store.delete(id)
  }
}

export function saveShareImage(dataUrl: string): string {
  const store = getStore()
  prune(store)
  const id = crypto.randomUUID().replace(/-/g, '').slice(0, 12)
  store.set(id, { dataUrl, expiresAt: Date.now() + TTL_MS })
  return id
}

export function getShareImage(id: string): string | null {
  const store = getStore()
  const entry = store.get(id)
  if (!entry) return null
  if (entry.expiresAt <= Date.now()) {
    store.delete(id)
    return null
  }
  return entry.dataUrl
}
