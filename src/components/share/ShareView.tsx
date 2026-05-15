'use client'

import { useEffect, useState } from 'react'
import { Download } from 'lucide-react'

interface ShareViewProps {
  shareId: string
}

export function ShareView({ shareId }: ShareViewProps) {
  const [image, setImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch(`/api/share/${shareId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Photo not found or expired')
        return res.json()
      })
      .then((data: { image: string }) => {
        if (!cancelled) setImage(data.image)
      })
      .catch((e: Error) => {
        if (!cancelled) setError(e.message)
      })
    return () => {
      cancelled = true
    }
  }, [shareId])

  const handleDownload = () => {
    if (!image) return
    const link = document.createElement('a')
    link.href = image
    link.download = `photobooth-${shareId}.png`
    link.click()
  }

  return (
    <main className="min-h-screen bg-stone-100 flex flex-col items-center justify-center p-6">
      <h1 className="font-display text-xl font-bold text-stone-800 mb-6 uppercase tracking-wide">
        Your Photobooth
      </h1>

      {error && (
        <p className="text-red-600 text-center max-w-sm">{error}</p>
      )}

      {image && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt="Shared photobooth strip"
            className="max-w-full max-h-[70vh] shadow-2xl rounded-lg border-4 border-white"
          />
          <button
            type="button"
            onClick={handleDownload}
            className="mt-6 flex items-center gap-2 px-6 py-3 bg-stone-800 text-white rounded-lg font-bold hover:bg-stone-700"
          >
            <Download className="w-5 h-5" />
            Download
          </button>
        </>
      )}

      {!image && !error && (
        <p className="text-stone-500 animate-pulse">Loading your photo...</p>
      )}
    </main>
  )
}
