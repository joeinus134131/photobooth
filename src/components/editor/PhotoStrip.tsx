import { forwardRef, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { usePhotoboothStore } from '@/store/usePhotoboothStore'
import { THEMES, ThemeType } from '@/lib/themes'
import { getStripGridClass, getStripWidth } from '@/lib/strip-layout'
import Draggable from 'react-draggable'

interface PhotoStripProps {
  className?: string
  id?: string
  onRetakeSlot?: (index: number) => void
  retakeSlot?: number | null
  draggable?: boolean
}

export const PhotoStrip = forwardRef<HTMLDivElement, PhotoStripProps>(
  ({ className, id, onRetakeSlot, retakeSlot, draggable = true }, ref) => {
    const { photos, settings, editState, eventConfig } = usePhotoboothStore()
    const [isFlipped, setIsFlipped] = useState(false)
    const nodeRef = useRef<HTMLDivElement>(null)

    const currentTheme = THEMES[(editState.stripTheme as ThemeType) || 'classic']
    const stripWidth = getStripWidth(settings.stripLayout)
    const gridClass = getStripGridClass(settings.stripLayout, settings.gridRows)

    const stripInner = (
      <div
        ref={draggable ? nodeRef : undefined}
        className={draggable ? 'cursor-move' : undefined}
        style={{ perspective: '1000px' }}
        onDoubleClick={() => setIsFlipped(!isFlipped)}
      >
        <div
          className="relative transition-transform duration-700"
          style={{
            width: stripWidth,
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          <div
            ref={ref}
            id={id}
            className={cn(
              'p-3 shadow-2xl relative overflow-hidden print-strip',
              currentTheme.bg,
              settings.borderThickness === 'thin'
                ? 'border border-stone-300'
                : 'border-2 border-stone-400',
              className
            )}
            style={{ backfaceVisibility: 'hidden' }}
          >
            {currentTheme.decoration}

            {eventConfig.logoUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={eventConfig.logoUrl}
                alt=""
                className="h-8 max-w-full mx-auto mb-2 object-contain relative z-10"
              />
            )}

            <div
              className={cn('grid relative z-10', gridClass, {
                'gap-2': settings.gridGap === 'small',
                'gap-4': settings.gridGap === 'medium',
                'gap-6': settings.gridGap === 'large',
              })}
            >
              {Array.from({ length: settings.gridRows }).map((_, i) => {
                const hasPhoto = !!photos[i]
                const isRetakeTarget = retakeSlot === i
                return (
                  <button
                    key={i}
                    type="button"
                    disabled={!hasPhoto || !onRetakeSlot}
                    onClick={() => hasPhoto && onRetakeSlot?.(i)}
                    title={hasPhoto ? `Retake photo ${i + 1}` : `Slot ${i + 1}`}
                    className={cn(
                      'aspect-square relative overflow-hidden shadow-inner text-left w-full',
                      editState.stripTheme === 'neon'
                        ? 'border-2 border-cyan-400 bg-slate-800'
                        : 'border border-stone-200 bg-stone-100',
                      hasPhoto &&
                        onRetakeSlot &&
                        'cursor-pointer hover:ring-2 hover:ring-red-400/80 focus:outline-none focus:ring-2 focus:ring-red-500',
                      isRetakeTarget && 'ring-2 ring-red-500 animate-pulse'
                    )}
                  >
                    {hasPhoto ? (
                      <>
                        <img
                          src={photos[i]}
                          alt={`Photo ${i + 1}`}
                          className="w-full h-full object-cover pointer-events-none"
                        />
                        {onRetakeSlot && (
                          <span className="absolute bottom-1 right-1 text-[8px] font-bold uppercase bg-black/50 text-white px-1 rounded pointer-events-none">
                            Retake
                          </span>
                        )}
                      </>
                    ) : (
                      <div
                        className={cn(
                          'w-full h-full flex items-center justify-center font-display text-2xl pointer-events-none',
                          editState.stripTheme === 'neon' ? 'text-pink-500/50' : 'text-stone-300'
                        )}
                      >
                        {i + 1}
                      </div>
                    )}
                  </button>
                )
              })}
            </div>

            <div
              className={cn(
                'mt-6 text-center font-display text-xs tracking-widest uppercase relative z-10 break-words px-2',
                currentTheme.text
              )}
            >
              {editState.footerText}
            </div>

            {/* Render Stickers */}
            {editState.stickers?.map((sticker) => (
              <DraggableSticker 
                key={sticker.id} 
                sticker={sticker} 
                draggable={draggable} 
              />
            ))}
          </div>

          <div
            className={cn(
              'absolute inset-0 shadow-2xl flex flex-col items-center justify-center p-6 text-center',
              currentTheme.bg ? currentTheme.bg : 'bg-white'
            )}
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <div className="flex-1 flex flex-col items-center justify-center w-full border-4 border-dashed border-stone-300/50 rounded-lg p-4">
              <div className="text-2xl mb-4 opacity-50">💌</div>
              <p
                className={cn(
                  'font-handwriting text-lg leading-relaxed break-words w-full',
                  currentTheme.text
                )}
                style={{ fontFamily: 'cursive' }}
              >
                {editState.secretMessage || 'Secret Message...'}
              </p>
            </div>

            <div className="mt-4 opacity-50">
              <p className={cn('text-[10px] uppercase tracking-widest', currentTheme.text)}>
                {new Date().toLocaleDateString()}
              </p>
            </div>

            {currentTheme.decoration}
          </div>
        </div>
      </div>
    )

    if (!draggable) {
      return (
        <div ref={ref}>
          {stripInner}
        </div>
      )
    }

    return <Draggable nodeRef={nodeRef}>{stripInner}</Draggable>
  }
)

PhotoStrip.displayName = 'PhotoStrip'

function DraggableSticker({ sticker, draggable }: { sticker: any; draggable: boolean }) {
  const nodeRef = useRef<HTMLDivElement>(null)

  return (
    <Draggable
      nodeRef={nodeRef}
      defaultPosition={{ x: sticker.x, y: sticker.y }}
      disabled={!draggable}
      bounds="parent"
      onStop={(e, data) => {
        const state = usePhotoboothStore.getState()
        const newStickers = state.editState.stickers.map((s: any) => 
          s.id === sticker.id ? { ...s, x: data.x, y: data.y } : s
        )
        state.updateEditState({ stickers: newStickers })
      }}
    >
      <div 
        ref={nodeRef}
        className={cn("absolute z-50 text-4xl select-none", draggable && "cursor-move hover:ring-2 hover:ring-red-400/50 rounded")}
        style={{ transform: `rotate(${sticker.rotation}deg)` }}
      >
        {sticker.emoji}
      </div>
    </Draggable>
  )
}
