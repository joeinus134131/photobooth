'use client'

import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { Loader2 } from 'lucide-react'
import { uploadStripForShare } from '@/lib/share-utils'

interface ShareQrPanelProps {
  dataUrl: string | null
}

export function ShareQrPanel({ dataUrl }: ShareQrPanelProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!dataUrl) {
      setQrDataUrl(null)
      setShareUrl(null)
      setError(null)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)

    uploadStripForShare(dataUrl)
      .then(async ({ url }) => {
        if (cancelled) return
        setShareUrl(url)
        const qr = await QRCode.toDataURL(url, {
          width: 200,
          margin: 2,
          color: { dark: '#292524', light: '#ffffff' },
        })
        if (!cancelled) setQrDataUrl(qr)
      })
      .catch((e: Error) => {
        if (!cancelled) setError(e.message || 'Could not create QR')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [dataUrl])

  if (!dataUrl) return null

  return (
    <div className="flex flex-col items-center gap-2 p-3 bg-white rounded-lg border-2 border-stone-200">
      <p className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
        Scan to download
      </p>
      {loading && <Loader2 className="w-8 h-8 animate-spin text-stone-400" />}
      {error && <p className="text-xs text-red-600 text-center">{error}</p>}
      {qrDataUrl && !loading && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={qrDataUrl} alt="QR code to download strip" className="w-[180px] h-[180px]" />
          {shareUrl && (
            <p className="text-[9px] text-stone-400 break-all text-center max-w-[200px] line-clamp-2">
              {shareUrl}
            </p>
          )}
        </>
      )}
    </div>
  )
}
