'use client'

import { useCallback, useRef } from 'react'

/** Short beeps for 3-2-1 countdown via Web Audio (no external file). */
export function useCountdownAudio() {
  const ctxRef = useRef<AudioContext | null>(null)

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new AudioContext()
    }
    return ctxRef.current
  }, [])

  const playTick = useCallback(
    (remaining: number) => {
      try {
        const ctx = getCtx()
        if (ctx.state === 'suspended') void ctx.resume()

        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain)
        gain.connect(ctx.destination)

        const isFinal = remaining <= 1
        osc.frequency.value = isFinal ? 880 : 440
        gain.gain.setValueAtTime(0.15, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (isFinal ? 0.2 : 0.1))

        osc.start(ctx.currentTime)
        osc.stop(ctx.currentTime + (isFinal ? 0.2 : 0.1))
      } catch {
        /* audio optional */
      }
    },
    [getCtx]
  )

  return { playTick }
}
