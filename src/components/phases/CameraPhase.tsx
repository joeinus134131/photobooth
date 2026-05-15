'use client'

import { useCallback, useRef, useState } from 'react'
import { Camera, ChevronRight, Trash2 } from 'lucide-react'
import { useCamera } from '@/hooks/useCamera'
import { CameraPreview } from '@/components/camera/CameraPreview'
import { Countdown } from '@/components/camera/Countdown'
import { captureVideoFrame } from '@/lib/camera-utils'
import { getFilterString } from '@/lib/filters'
import { getNextEmptySlot, isStripFull } from '@/lib/photo-strip-utils'
import { usePhotoboothStore } from '@/store/usePhotoboothStore'
import { cn } from '@/lib/utils'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FilterControls } from '@/components/editor/FilterControls'
import { ColorGrading } from '@/components/editor/ColorGrading'
import { TextControls } from '@/components/editor/TextControls'
import { SettingsControls } from '@/components/editor/SettingsControls'
import { PhotoStrip } from '@/components/editor/PhotoStrip'
import { ThemeSelector } from '@/components/editor/ThemeSelector'
import { useShutterSound } from '@/hooks/useShutterSound'

const BURST_DELAY_MS = 900

interface CameraPhaseProps {
  onGoToReview: () => void
  boomerangFrames: number
  boomerangGapMs: number
}

export function CameraPhase({
  onGoToReview,
  boomerangFrames,
  boomerangGapMs,
}: CameraPhaseProps) {
  const {
    photos,
    setPhotoAtIndex,
    clearPhotos,
    settings,
    editState,
  } = usePhotoboothStore()

  const { stream, error, isLoading, videoRef } = useCamera()
  const { playShutter } = useShutterSound()
  const [isCountingDown, setIsCountingDown] = useState(false)
  const [captureTargetSlot, setCaptureTargetSlot] = useState<number | null>(null)
  const [isBurstCapturing, setIsBurstCapturing] = useState(false)
  const burstPendingRef = useRef(false)
  const photoStripRef = useRef<HTMLDivElement>(null)

  const isBoomerang = settings.captureMode === 'boomerang'
  const isFull = isStripFull(photos, settings.gridRows)
  const filledCount = photos.filter(Boolean).length
  const canReview = filledCount > 0 && (isFull || isBoomerang)

  const startCaptureForSlot = useCallback((slot: number) => {
    setCaptureTargetSlot(slot)
    setIsCountingDown(true)
  }, [])

  const captureFrameToSlot = useCallback(
    (slot: number): string | null => {
      if (!videoRef.current) return null
      playShutter()
      const filterStr = getFilterString(editState)
      const photoData = captureVideoFrame(videoRef.current, filterStr)
      if (photoData) {
        setPhotoAtIndex(slot, photoData)
        return photoData
      }
      return null
    },
    [editState, playShutter, setPhotoAtIndex, videoRef]
  )

  const runBoomerangSequence = useCallback(async () => {
    setIsBurstCapturing(true)
    for (let i = 0; i < boomerangFrames; i++) {
      captureFrameToSlot(i)
      if (i < boomerangFrames - 1) {
        await new Promise((r) => setTimeout(r, boomerangGapMs))
      }
    }
    setIsBurstCapturing(false)
    setCaptureTargetSlot(null)
    onGoToReview()
  }, [boomerangFrames, boomerangGapMs, captureFrameToSlot, onGoToReview])

  const handleStartCapture = () => {
    if (isFull || isCountingDown || isBurstCapturing) return

    if (isBoomerang) {
      burstPendingRef.current = false
      setIsCountingDown(true)
      return
    }

    const slot = getNextEmptySlot(photos, settings.gridRows)
    if (slot < 0) return
    burstPendingRef.current = settings.autoBurst
    startCaptureForSlot(slot)
  }

  const handleRetakeSlot = (index: number) => {
    if (isCountingDown || isBurstCapturing || isBoomerang) return
    burstPendingRef.current = false
    startCaptureForSlot(index)
  }

  const handleCountdownComplete = useCallback(() => {
    setIsCountingDown(false)

    if (isBoomerang) {
      void runBoomerangSequence()
      return
    }

    if (!videoRef.current) {
      setCaptureTargetSlot(null)
      burstPendingRef.current = false
      return
    }

    const slot = captureTargetSlot ?? getNextEmptySlot(photos, settings.gridRows)
    if (slot < 0) {
      setCaptureTargetSlot(null)
      burstPendingRef.current = false
      return
    }

    const photoData = captureFrameToSlot(slot)
    setCaptureTargetSlot(null)

    if (!photoData) {
      burstPendingRef.current = false
      return
    }

    const nextPhotos = [...photos]
    while (nextPhotos.length <= slot) nextPhotos.push('')
    nextPhotos[slot] = photoData

    if (
      burstPendingRef.current &&
      settings.autoBurst &&
      !isStripFull(nextPhotos, settings.gridRows)
    ) {
      const nextSlot = getNextEmptySlot(nextPhotos, settings.gridRows)
      if (nextSlot >= 0) {
        setTimeout(() => startCaptureForSlot(nextSlot), BURST_DELAY_MS)
        return
      }
    }

    burstPendingRef.current = false
  }, [
    captureTargetSlot,
    captureFrameToSlot,
    isBoomerang,
    photos,
    runBoomerangSequence,
    settings.autoBurst,
    settings.gridRows,
    startCaptureForSlot,
    videoRef,
  ])

  const handleClear = () => {
    clearPhotos()
    setCaptureTargetSlot(null)
    burstPendingRef.current = false
    setIsCountingDown(false)
  }

  const captureDisabled =
    isLoading || !!error || isFull || isCountingDown || isBurstCapturing

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.8fr_1fr] gap-4 h-full min-h-0">
      <div className="flex flex-col gap-4 h-full min-h-0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 min-h-0">
          <div className="bg-stone-200 p-4 rounded-xl border-4 border-stone-300 h-full min-h-0 flex flex-col shadow-inner relative overflow-hidden">
            <div className="absolute inset-0 opacity-30 pattern-brushed-metal pointer-events-none" />
            <h2 className="font-display font-bold text-stone-700 mb-4 uppercase tracking-wider text-sm text-center bg-stone-300/50 py-1 rounded border border-stone-400/30 backdrop-blur-sm relative z-10">
              Studio Controls
            </h2>
            <Tabs defaultValue="filters" className="w-full flex-1 flex flex-col min-h-0 relative z-10">
              <TabsList className="w-full bg-stone-300/50 p-1 mb-4 h-9 shrink-0 border border-stone-400/30 grid grid-cols-4">
                <TabsTrigger value="filters" className="text-xs data-[state=active]:bg-stone-100">
                  Filters
                </TabsTrigger>
                <TabsTrigger value="color" className="text-xs data-[state=active]:bg-stone-100">
                  Color
                </TabsTrigger>
                <TabsTrigger value="text" className="text-xs data-[state=active]:bg-stone-100">
                  Text
                </TabsTrigger>
                <TabsTrigger value="setup" className="text-xs data-[state=active]:bg-stone-100">
                  Setup
                </TabsTrigger>
              </TabsList>
              <div className="flex-1 overflow-y-auto pr-1 min-h-0">
                <TabsContent value="filters" className="mt-0">
                  <FilterControls />
                </TabsContent>
                <TabsContent value="color" className="mt-0">
                  <ColorGrading />
                </TabsContent>
                <TabsContent value="text" className="mt-0">
                  <TextControls />
                </TabsContent>
                <TabsContent value="setup" className="mt-0">
                  <SettingsControls />
                </TabsContent>
              </div>
            </Tabs>
          </div>

          <div className="flex flex-col gap-4 h-full min-h-0 items-center justify-center">
            <div className="relative shrink-0 w-[240px] mx-auto">
              <div className="absolute -inset-3 bg-[#2a2a2a] rounded-[20px] shadow-2xl border border-stone-600">
                <div className="absolute inset-0 opacity-50 pattern-leather rounded-[18px]" />
              </div>
              <div className="relative aspect-square bg-black rounded-xl overflow-hidden border-[6px] border-[#1a1a1a] shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] z-10 ring-1 ring-white/10">
                <CameraPreview videoRef={videoRef} stream={stream} error={error} isLoading={isLoading} />
                <Countdown
                  seconds={isBoomerang ? 2 : settings.countdownDuration}
                  isActive={isCountingDown}
                  onComplete={handleCountdownComplete}
                />
              </div>
            </div>

            <div className="w-[240px] flex flex-col gap-2 mt-4 shrink-0 z-20">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleStartCapture}
                  disabled={captureDisabled}
                  className={cn(
                    'flex-1 py-3 rounded-lg font-bold shadow-[0_4px_0_rgb(153,27,27)] active:shadow-none active:translate-y-[4px] transition-all flex items-center justify-center gap-2 text-sm border-2 border-red-900 min-h-[48px]',
                    captureDisabled
                      ? 'bg-stone-300 text-stone-500 cursor-not-allowed border-stone-400 shadow-none translate-y-[4px]'
                      : 'bg-red-600 text-white hover:bg-red-500'
                  )}
                >
                  <Camera className="w-4 h-4" />
                  {isBurstCapturing
                    ? 'Snapping...'
                    : isCountingDown
                      ? 'Ready!'
                      : isFull
                        ? 'Full'
                        : isBoomerang
                          ? 'Boomerang!'
                          : settings.autoBurst
                            ? 'Start strip'
                            : 'Capture'}
                </button>
                {filledCount > 0 && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="px-3 py-3 bg-stone-200 text-stone-700 rounded-lg font-bold border-2 border-stone-400 min-h-[48px]"
                    title="Clear"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <p className="text-[10px] text-center text-stone-500">
                {isBoomerang
                  ? `${boomerangFrames} rapid shots → GIF`
                  : `${filledCount}/${settings.gridRows} photos`}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-stone-100 p-3 rounded-xl border-2 border-stone-200 shrink-0">
          <ThemeSelector />
        </div>
      </div>

      <div className="bg-[#e8e4d9] rounded-xl border-4 border-[#d6d3c9] p-2 flex flex-col items-center relative overflow-hidden h-full min-h-0 shadow-inner">
        <div className="absolute inset-0 opacity-40 pattern-cork pointer-events-none" />
        <div className="flex-1 flex items-center justify-center w-full min-h-0 overflow-hidden relative z-10">
          <div className="relative scale-[0.7] origin-center shadow-xl rotate-1">
            <PhotoStrip
              ref={photoStripRef}
              onRetakeSlot={isBoomerang ? undefined : handleRetakeSlot}
              retakeSlot={captureTargetSlot}
            />
          </div>
        </div>
        {canReview && (
          <button
            type="button"
            onClick={onGoToReview}
            className="w-full mt-2 py-3 rounded-lg font-bold bg-stone-800 text-white flex items-center justify-center gap-2 border-2 border-stone-900 min-h-[48px] z-10 shrink-0"
          >
            Review strip
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}
