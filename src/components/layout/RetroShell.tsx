'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface RetroShellProps {
  children: React.ReactNode
  className?: string
  kioskMode?: boolean
  eventName?: string
}

export function RetroShell({
  children,
  className,
  kioskMode,
  eventName,
}: RetroShellProps) {
  return (
    <main
      className={cn(
        'flex h-[100dvh] flex-col items-center justify-center p-1 sm:p-2 bg-[#f5f0e6] overflow-hidden relative',
        kioskMode && 'p-0 sm:p-1',
        className
      )}
    >
      <div className="absolute inset-0 pattern-wood opacity-60 pointer-events-none" />
      <div className="w-full max-w-[98vw] sm:max-w-[95vw] h-full flex flex-col max-h-[99dvh] sm:max-h-[98vh] relative z-10">
        {!kioskMode && (
          <header className="mb-1 sm:mb-2 text-center shrink-0">
            <h1 className="text-lg sm:text-2xl md:text-3xl font-display font-bold text-stone-800 tracking-tighter uppercase drop-shadow-sm">
              {eventName || 'Photobooth'}
            </h1>
          </header>
        )}

        <div className="relative bg-white rounded-xl sm:rounded-2xl shadow-xl border-2 sm:border-4 border-stone-200 overflow-hidden flex-1 flex flex-col min-h-0">
          <div className="h-2 sm:h-3 bg-stone-200 w-full flex items-center justify-center gap-2 shrink-0">
            <div className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-stone-300" />
            <div className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-stone-300" />
            <div className="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full bg-stone-300" />
          </div>

          <div className="p-2 sm:p-3 md:p-4 flex-1 overflow-hidden flex flex-col min-h-0">{children}</div>
        </div>

        {!kioskMode && (
          <footer className="mt-1 sm:mt-2 text-center text-stone-500 text-[9px] sm:text-[10px] font-body shrink-0">
            <p>© {new Date().getFullYear()} Photobooth App. Made with nostalgia.</p>
          </footer>
        )}
      </div>
    </main>
  )
}

