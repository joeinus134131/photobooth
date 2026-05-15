/**
 * Capture satu frame dari video. Mirror horizontal agar sesuai preview selfie.
 * Jika `filterString` diberikan, filter di-bake ke pixel (WYSIWYG dengan preview CSS).
 */
export function captureVideoFrame(
  video: HTMLVideoElement,
  filterString?: string
): string | null {
  if (!video.videoWidth || !video.videoHeight) return null

  const canvas = document.createElement('canvas')
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight
  const ctx = canvas.getContext('2d')

  if (!ctx) return null

  ctx.translate(canvas.width, 0)
  ctx.scale(-1, 1)

  if (filterString?.trim()) {
    ctx.filter = filterString.trim()
  }

  ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

  return canvas.toDataURL('image/jpeg', 0.9)
}
