'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  ArrowLeft,
  Download,
  Printer,
  RotateCcw,
  Share2,
} from 'lucide-react'
import { PhotoStrip } from '@/components/editor/PhotoStrip'
import { ShareQrPanel } from '@/components/review/ShareQrPanel'
import { usePhotoboothStore } from '@/store/usePhotoboothStore'
import { downloadPhotoStrip } from '@/lib/download-utils'
import { shareStripImage, renderStripToDataUrl } from '@/lib/share-utils'
import { printPhotoStrip } from '@/lib/print-utils'
import { framesToGif, downloadBlob } from '@/lib/gif-utils'
import { cn } from '@/lib/utils'

interface ReviewPhaseProps {
  kioskMode?: boolean
}

export function ReviewPhase({ kioskMode }: ReviewPhaseProps) {
  const { photos, settings, eventConfig, setStep, resetSession } = usePhotoboothStore()
  const stripRef = useRef<HTMLDivElement>(null)
  const [stripDataUrl, setStripDataUrl] = useState<string | null>(null)
  const [busy, setBusy] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const filledFrames = photos.filter(Boolean)
  const isBoomerang = settings.captureMode === 'boomerang'

  const refreshPreview = useCallback(async () => {
    if (!stripRef.current) return
    try {
      const url = await renderStripToDataUrl(stripRef.current)
      setStripDataUrl(url)
    } catch {
      setStripDataUrl(null)
    }
  }, [])

  useEffect(() => {
    const t = setTimeout(() => void refreshPreview(), 300)
    return () => clearTimeout(t)
  }, [refreshPreview, photos, settings.stripLayout])

  const handleDownload = async () => {
    if (!stripRef.current) return
    setBusy('download')
    try {
      if (isBoomerang && filledFrames.length > 0) {
        const gif = await framesToGif(filledFrames)
        downloadBlob(gif, `photobooth-boomerang-${Date.now()}.gif`)
        setMessage('GIF downloaded')
      } else {
        await downloadPhotoStrip(stripRef.current, 'png', `photobooth-${Date.now()}`)
        setMessage('Strip downloaded')
      }
    } catch {
      setMessage('Download failed')
    } finally {
      setBusy(null)
    }
  }

  const handleShare = async () => {
    if (!stripRef.current) return
    setBusy('share')
    try {
      const result = await shareStripImage(stripRef.current, eventConfig.eventName)
      setMessage(
        result === 'shared'
          ? 'Shared successfully'
          : result === 'cancelled'
            ? 'Share cancelled'
            : 'Saved to downloads'
      )
    } catch {
      setMessage('Share failed')
    } finally {
      setBusy(null)
    }
  }

  const handlePrint = async () => {
    if (!stripRef.current || isBoomerang) return
    setBusy('print')
    try {
      await printPhotoStrip(stripRef.current)
      setMessage('Print dialog opened')
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'Print failed')
    } finally {
      setBusy(null)
    }
  }

  const btnClass = cn(
    'flex-1 min-h-[44px] sm:min-h-[48px] py-2.5 sm:py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm border-2',
    kioskMode && 'min-h-[56px] text-base'
  )

  return (
    <div className="flex flex-col h-full min-h-0 gap-2 sm:gap-4 overflow-y-auto lg:overflow-hidden">
      <div className="text-center shrink-0">
        <h2 className="font-display font-bold text-stone-800 text-base sm:text-lg uppercase tracking-wide">
          {isBoomerang ? 'Your Boomerang' : 'Review Your Strip'}
        </h2>
        {eventConfig.eventName && (
          <p className="text-[10px] sm:text-xs text-stone-500 mt-0.5 sm:mt-1">{eventConfig.eventName}</p>
        )}
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-3 sm:gap-4 min-h-0">
        <div className="flex-1 flex items-center justify-center min-h-[180px] sm:min-h-0 overflow-auto print-area">
          <div
            className={cn(
              'relative shadow-xl',
              kioskMode ? 'scale-75 sm:scale-90 lg:scale-100' : 'scale-[0.5] sm:scale-[0.65] lg:scale-[0.85]'
            )}
          >
            <PhotoStrip ref={stripRef} draggable={false} />
          </div>
        </div>

        <div className="shrink-0 flex flex-col gap-3 lg:w-[220px]">
          {!isBoomerang && <ShareQrPanel dataUrl={stripDataUrl} />}

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={!!busy}
              onClick={() => void handleShare()}
              className={cn(btnClass, 'bg-stone-800 text-white border-stone-900 col-span-2')}
            >
              <Share2 className="w-4 h-4" />
              {busy === 'share' ? 'Sharing...' : 'Share'}
            </button>
            <button
              type="button"
              disabled={!!busy}
              onClick={() => void handleDownload()}
              className={cn(btnClass, 'bg-red-600 text-white border-red-800')}
            >
              <Download className="w-4 h-4" />
              {busy === 'download' ? '...' : 'Save'}
            </button>
            {!isBoomerang && (
              <button
                type="button"
                disabled={!!busy}
                onClick={() => void handlePrint()}
                className={cn(btnClass, 'bg-stone-200 text-stone-800 border-stone-400')}
              >
                <Printer className="w-4 h-4" />
                {busy === 'print' ? '...' : 'Print'}
              </button>
            )}
          </div>
        </div>
      </div>

      {message && (
        <p className="text-center text-xs text-stone-600 shrink-0" role="status">
          {message}
        </p>
      )}

      <div className="flex gap-2 shrink-0">
        <button
          type="button"
          onClick={() => setStep('camera')}
          className={cn(btnClass, 'flex-1 bg-stone-200 text-stone-800 border-stone-400')}
        >
          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          Edit more
        </button>
        <button
          type="button"
          onClick={() => {
            resetSession()
            setMessage(null)
          }}
          className={cn(btnClass, 'flex-1 bg-white text-stone-700 border-stone-300')}
        >
          <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          New guest
        </button>
      </div>
    </div>
  )
}
