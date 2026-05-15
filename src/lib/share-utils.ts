import { toPng } from 'html-to-image'

export async function renderStripToDataUrl(element: HTMLElement): Promise<string> {
  return toPng(element, { quality: 1, pixelRatio: 2, cacheBust: true })
}

export async function renderStripToBlob(element: HTMLElement): Promise<Blob> {
  const dataUrl = await renderStripToDataUrl(element)
  const res = await fetch(dataUrl)
  return res.blob()
}

export async function shareStripImage(
  element: HTMLElement,
  title: string
): Promise<'shared' | 'downloaded' | 'cancelled'> {
  const blob = await renderStripToBlob(element)
  const file = new File([blob], `photobooth-${Date.now()}.png`, { type: 'image/png' })

  if (typeof navigator !== 'undefined' && navigator.share && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({
        title,
        text: 'My photobooth strip',
        files: [file],
      })
      return 'shared'
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return 'cancelled'
    }
  }

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = file.name
  link.click()
  URL.revokeObjectURL(url)
  return 'downloaded'
}

export async function uploadStripForShare(dataUrl: string): Promise<{ id: string; url: string }> {
  const res = await fetch('/api/share', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: dataUrl }),
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error((body as { error?: string }).error || 'Upload failed')
  }
  return res.json() as Promise<{ id: string; url: string }>
}
