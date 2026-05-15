import { renderStripToDataUrl } from '@/lib/share-utils'

export async function printPhotoStrip(element: HTMLElement): Promise<void> {
  const dataUrl = await renderStripToDataUrl(element)
  const printWindow = window.open('', '_blank', 'noopener,noreferrer')
  if (!printWindow) {
    throw new Error('Popup blocked — allow popups to print')
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Print Photobooth</title>
        <style>
          @page { size: 2in 6in; margin: 0.15in; }
          body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
          img { max-width: 2in; max-height: 6in; width: auto; height: auto; object-fit: contain; }
        </style>
      </head>
      <body>
        <img src="${dataUrl}" alt="Photobooth strip" onload="window.print();" />
      </body>
    </html>
  `)
  printWindow.document.close()
}
