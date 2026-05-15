'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCountdownAudio } from '@/hooks/useCountdownAudio'

interface CountdownProps {
  seconds: number
  onComplete: () => void
  isActive: boolean
}

export function Countdown({ seconds, onComplete, isActive }: CountdownProps) {
  const [count, setCount] = useState(seconds)
  const [flash, setFlash] = useState(false)
  const { playTick } = useCountdownAudio()
  const completedRef = useRef(false)

  useEffect(() => {
    if (!isActive) {
      setCount(seconds)
      setFlash(false)
      completedRef.current = false
      return
    }
    setCount(seconds)
    completedRef.current = false
  }, [isActive, seconds])

  useEffect(() => {
    if (!isActive) return

    if (count <= 0) {
      if (!completedRef.current) {
        completedRef.current = true
        setFlash(true)
        playTick(0)
        const t = setTimeout(() => {
          setFlash(false)
          onComplete()
        }, 120)
        return () => clearTimeout(t)
      }
      return
    }

    playTick(count)
    const timer = setTimeout(() => setCount((c) => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [count, isActive, onComplete, playTick])

  return (
    <>
      <AnimatePresence>
        {isActive && count > 0 && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 pointer-events-none">
            <motion.div
              key={count}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1.5, opacity: 1 }}
              exit={{ scale: 2, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="text-9xl font-display font-bold text-white drop-shadow-lg"
              style={{ textShadow: '0 4px 12px rgba(0,0,0,0.5)' }}
            >
              {count}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {flash && (
        <motion.div
          className="absolute inset-0 z-[60] bg-white pointer-events-none"
          initial={{ opacity: 0.9 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
        />
      )}
    </>
  )
}
