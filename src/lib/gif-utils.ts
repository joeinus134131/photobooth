import { GIFEncoder, quantize, applyPalette } from 'gifenc'

const BOOMERANG_SIZE = 320

async function loadImage(dataUrl: string): Promise<ImageBitmap> {
  const res = await fetch(dataUrl)
  const blob = await res.blob()
  return createImageBitmap(blob)
}

function drawFrame(bitmap: ImageBitmap, size: number): ImageData {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas not supported')

  const scale = Math.max(size / bitmap.width, size / bitmap.height)
  const w = bitmap.width * scale
  const h = bitmap.height * scale
  ctx.drawImage(bitmap, (size - w) / 2, (size - h) / 2, w, h)
  return ctx.getImageData(0, 0, size, size)
}

/** Build animated GIF from capture frames (boomerang). */
export async function framesToGif(
  frameDataUrls: string[],
  options?: { delayMs?: number; size?: number }
): Promise<Blob> {
  const delay = options?.delayMs ?? 280
  const size = options?.size ?? BOOMERANG_SIZE
  const valid = frameDataUrls.filter(Boolean)
  if (valid.length === 0) throw new Error('No frames')

  const gif = GIFEncoder()
  const playOrder = valid.length > 1 ? [...valid, ...[...valid].reverse().slice(1, -1)] : valid

  for (const url of playOrder) {
    const bitmap = await loadImage(url)
    const imageData = drawFrame(bitmap, size)
    const palette = quantize(imageData.data, 256)
    const index = applyPalette(imageData.data, palette)
    gif.writeFrame(index, size, size, {
      palette,
      delay,
    })
    bitmap.close()
  }

  gif.finish()
  return new Blob([Uint8Array.from(gif.bytes())], { type: 'image/gif' })
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
