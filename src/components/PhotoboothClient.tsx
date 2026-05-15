'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { RetroShell } from '@/components/layout/RetroShell'
import { ReviewPhase } from '@/components/review/ReviewPhase'
import { CameraPhase } from '@/components/phases/CameraPhase'
import { usePhotoboothStore } from '@/store/usePhotoboothStore'
import { parseEventSearchParams, applyEventToStore } from '@/lib/event-config'
import { isStripFull } from '@/lib/photo-strip-utils'
import { cn } from '@/lib/utils'

const BOOMERANG_FRAMES = 4
const BOOMERANG_GAP_MS = 450

export function PhotoboothClient() {
  const searchParams = useSearchParams()
  const {
    step,
    photos,
    settings,
    editState,
    eventConfig,
    setStep,
    setPhotoAtIndex,
    clearPhotos,
    updateSettings,
    updateEditState,
    updateEventConfig,
  } = usePhotoboothStore()

  const [eventReady, setEventReady] = useState(false)
  const [kioskEntered, setKioskEntered] = useState(false)

  useEffect(() => {
    const parsed = parseEventSearchParams(searchParams)
    updateEventConfig({
      eventId: parsed.eventId,
      eventName: parsed.eventName,
      logoUrl: parsed.logoUrl,
      themeLocked: parsed.themeLocked,
    })
    applyEventToStore(parsed, updateEditState, updateSettings)
    if (parsed.kioskMode) updateSettings({ kioskMode: true })
    setEventReady(true)
  }, [searchParams, updateEditState, updateEventConfig, updateSettings])

  const isBoomerang = settings.captureMode === 'boomerang'
  const isFull = isStripFull(photos, settings.gridRows)

  useEffect(() => {
    if (
      step === 'camera' &&
      settings.autoReviewOnFull &&
      !isBoomerang &&
      isFull
    ) {
      const t = setTimeout(() => setStep('review'), 400)
      return () => clearTimeout(t)
    }
  }, [step, settings.autoReviewOnFull, isBoomerang, isFull, setStep])

  const enterKiosk = useCallback(async () => {
    setKioskEntered(true)
    try {
      await document.documentElement.requestFullscreen()
    } catch {
      /* fullscreen may require user gesture — still hide chrome */
    }
  }, [])

  if (!eventReady) {
    return (
      <RetroShell kioskMode={settings.kioskMode}>
        <p className="text-center text-stone-500 animate-pulse">Loading booth...</p>
      </RetroShell>
    )
  }

  if (settings.kioskMode && !kioskEntered && step === 'camera') {
    return (
      <RetroShell kioskMode eventName={eventConfig.eventName}>
        <div className="flex flex-col items-center justify-center h-full gap-6 p-8">
          {eventConfig.logoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={eventConfig.logoUrl}
              alt=""
              className="h-16 object-contain"
            />
          )}
          <h2 className="font-display text-2xl font-bold text-stone-800 uppercase text-center">
            {eventConfig.eventName}
          </h2>
          <p className="text-stone-500 text-center max-w-xs">
            Tap below to start the photobooth
          </p>
          <button
            type="button"
            onClick={() => void enterKiosk()}
            className={cn(
              'px-10 py-5 bg-red-600 text-white rounded-xl font-bold text-xl',
              'shadow-[0_6px_0_rgb(153,27,27)] active:translate-y-[6px] active:shadow-none',
              'min-h-[56px] min-w-[200px]'
            )}
          >
            Start
          </button>
        </div>
      </RetroShell>
    )
  }

  return (
    <RetroShell kioskMode={settings.kioskMode} eventName={eventConfig.eventName}>
      {step === 'review' ? (
        <ReviewPhase kioskMode={settings.kioskMode} />
      ) : (
        <CameraPhase
          onGoToReview={() => setStep('review')}
          boomerangFrames={BOOMERANG_FRAMES}
          boomerangGapMs={BOOMERANG_GAP_MS}
        />
      )}
    </RetroShell>
  )
}
