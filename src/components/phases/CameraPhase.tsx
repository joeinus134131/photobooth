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
import { StickerControls } from '@/components/editor/StickerControls'
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
  const [showFlash, setShowFlash] = useState(false)
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
      if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(50)
      }
      setShowFlash(true)
      setTimeout(() => setShowFlash(false), 150)
      
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

  const [showControls, setShowControls] = useState(false)

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-[1.8fr_1fr] gap-3 lg:gap-4 h-full min-h-0 overflow-y-auto lg:overflow-hidden">
      {/* ── Left column (camera + controls + theme) ── */}
      <div className="flex flex-col gap-3 lg:gap-4 lg:h-full lg:min-h-0">

        {/* ── Camera + capture row: side-by-side on mobile ── */}
        <div className="flex flex-row gap-3 items-stretch shrink-0">
          {/* Camera viewfinder */}
          <div className="relative w-[55%] max-w-[260px] shrink-0">
            <div className="absolute -inset-2 bg-[#2a2a2a] rounded-[16px] shadow-xl border border-stone-600">
              <div className="absolute inset-0 opacity-50 pattern-leather rounded-[14px]" />
            </div>
            <div className="relative aspect-square bg-black rounded-xl overflow-hidden border-4 border-[#1a1a1a] shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] z-10 ring-1 ring-white/10">
              <CameraPreview videoRef={videoRef} stream={stream} error={error} isLoading={isLoading} />
              <Countdown
                seconds={isBoomerang ? 2 : settings.countdownDuration}
                isActive={isCountingDown}
                onComplete={handleCountdownComplete}
              />
              <div 
                className={cn(
                  "absolute inset-0 bg-white z-40 pointer-events-none transition-opacity duration-150",
                  showFlash ? "opacity-100" : "opacity-0"
                )} 
              />
            </div>
          </div>

          {/* Capture controls next to camera */}
          <div className="flex flex-col justify-center gap-2 flex-1 min-w-0 z-20">
            <button
              type="button"
              onClick={handleStartCapture}
              disabled={captureDisabled}
              className={cn(
                'w-full py-3 rounded-lg font-bold shadow-[0_4px_0_rgb(153,27,27)] active:shadow-none active:translate-y-[4px] transition-all flex items-center justify-center gap-2 text-sm border-2 border-red-900 min-h-[48px]',
                captureDisabled
                  ? 'bg-stone-300 text-stone-500 cursor-not-allowed border-stone-400 shadow-none translate-y-[4px]'
                  : 'bg-red-600 text-white hover:bg-red-500'
              )}
            >
              <Camera className="w-4 h-4" />
              <span className="truncate">
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
              </span>
            </button>

            {filledCount > 0 && (
              <button
                type="button"
                onClick={handleClear}
                className="w-full px-3 py-2 bg-stone-200 text-stone-700 rounded-lg font-bold border-2 border-stone-400 text-sm flex items-center justify-center gap-2"
                title="Clear"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear</span>
              </button>
            )}

            <p className="text-[10px] text-center text-stone-500">
              {isBoomerang
                ? `${boomerangFrames} rapid shots → GIF`
                : `${filledCount}/${settings.gridRows} photos`}
            </p>

            {canReview && (
              <button
                type="button"
                onClick={onGoToReview}
                className="w-full py-2.5 rounded-lg font-bold bg-stone-800 text-white flex items-center justify-center gap-2 border-2 border-stone-900 text-sm lg:hidden"
              >
                Review
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* ── Strip theme selector ── */}
        <div className="bg-stone-100 p-2.5 rounded-xl border-2 border-stone-200 shrink-0">
          <ThemeSelector />
        </div>

        {/* ── Collapsible Studio Controls (mobile) / Always visible (desktop) ── */}
        <div className="bg-stone-200 rounded-xl border-4 border-stone-300 shadow-inner relative overflow-hidden shrink-0 lg:flex-1 lg:min-h-0 lg:flex lg:flex-col">
          <div className="absolute inset-0 opacity-30 pattern-brushed-metal pointer-events-none" />
          <button
            type="button"
            onClick={() => setShowControls(!showControls)}
            className="lg:pointer-events-none w-full font-display font-bold text-stone-700 uppercase tracking-wider text-xs text-center bg-stone-300/50 py-2 border-b border-stone-400/30 backdrop-blur-sm relative z-10 flex items-center justify-center gap-2"
          >
            Studio Controls
            <ChevronRight className={cn('w-3.5 h-3.5 transition-transform lg:hidden', showControls && 'rotate-90')} />
          </button>

          <div className={cn(
            'p-3 relative z-10 lg:!flex lg:flex-col lg:flex-1 lg:min-h-0',
            showControls ? 'block' : 'hidden'
          )}>
            <Tabs defaultValue="filters" className="w-full flex-1 flex flex-col min-h-0">
              <TabsList className="w-full bg-stone-300/50 p-1 mb-3 h-9 shrink-0 border border-stone-400/30 grid grid-cols-5">
                <TabsTrigger value="filters" className="text-[10px] sm:text-xs data-[state=active]:bg-stone-100 px-1">
                  Filters
                </TabsTrigger>
                <TabsTrigger value="color" className="text-[10px] sm:text-xs data-[state=active]:bg-stone-100 px-1">
                  Color
                </TabsTrigger>
                <TabsTrigger value="stickers" className="text-[10px] sm:text-xs data-[state=active]:bg-stone-100 px-1">
                  Stickers
                </TabsTrigger>
                <TabsTrigger value="text" className="text-[10px] sm:text-xs data-[state=active]:bg-stone-100 px-1">
                  Text
                </TabsTrigger>
                <TabsTrigger value="setup" className="text-[10px] sm:text-xs data-[state=active]:bg-stone-100 px-1">
                  Setup
                </TabsTrigger>
              </TabsList>
              <div className="flex-1 overflow-y-auto pr-1 min-h-0 max-h-[30vh] lg:max-h-none">
                <TabsContent value="filters" className="mt-0">
                  <FilterControls />
                </TabsContent>
                <TabsContent value="color" className="mt-0">
                  <ColorGrading />
                </TabsContent>
                <TabsContent value="stickers" className="mt-0">
                  <StickerControls />
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
        </div>
      </div>

      {/* ── Right column: photo strip preview ── */}
      <div className="bg-[#e8e4d9] rounded-xl border-4 border-[#d6d3c9] p-2 flex flex-col items-center relative overflow-hidden min-h-[200px] lg:h-full lg:min-h-0 shadow-inner">
        <div className="absolute inset-0 opacity-40 pattern-cork pointer-events-none" />
        <div className="flex-1 flex items-center justify-center w-full min-h-0 overflow-hidden relative z-10">
          <div className="relative scale-[0.55] sm:scale-[0.6] lg:scale-[0.7] origin-center shadow-xl rotate-1">
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
            className="w-full mt-2 py-3 rounded-lg font-bold bg-stone-800 text-white hidden lg:flex items-center justify-center gap-2 border-2 border-stone-900 min-h-[48px] z-10 shrink-0"
          >
            Review strip
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}
