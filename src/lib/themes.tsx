import React from 'react'

export const THEMES: Record<string, { bg: string, border: string, text: string, decoration: React.ReactNode }> = {
  classic: {
    bg: 'bg-white',
    border: 'border-stone-200',
    text: 'text-stone-400',
    decoration: null
  },
  minimalist: {
    bg: 'bg-stone-50',
    border: 'border-stone-900',
    text: 'text-stone-900',
    decoration: <div className="absolute inset-0 border-[4px] border-stone-900 pointer-events-none z-20"></div>
  },
  halloween: {
    bg: 'bg-orange-50',
    border: 'border-orange-900',
    text: 'text-orange-900',
    decoration: (
      <>
        <div className="absolute top-2 right-2 text-2xl animate-bounce z-20">🎃</div>
        <div className="absolute bottom-12 left-2 text-2xl animate-pulse z-20">👻</div>
        <div className="absolute inset-0 border-[8px] border-orange-900/20 pointer-events-none z-20"></div>
      </>
    )
  },
  retro: {
    bg: 'bg-[#f0e6d2]',
    border: 'border-[#8c7b6c]',
    text: 'text-[#8c7b6c]',
    decoration: (
      <div className="absolute inset-0 opacity-40 pattern-retro-paper pointer-events-none z-20" />
    )
  },
  neon: {
    bg: 'bg-slate-900',
    border: 'border-pink-500',
    text: 'text-cyan-400',
    decoration: (
      <div className="absolute inset-0 border-4 border-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.5)] pointer-events-none z-20"></div>
    )
  },
  y2k: {
    bg: 'bg-fuchsia-100',
    border: 'border-fuchsia-400',
    text: 'text-fuchsia-600',
    decoration: (
      <>
        <div className="absolute top-1 left-1 text-2xl z-20">💿</div>
        <div className="absolute bottom-1 right-1 text-2xl z-20">🦋</div>
      </>
    )
  },
  cottage: {
    bg: 'bg-[#f4f1ea]',
    border: 'border-[#5b7c53]',
    text: 'text-[#5b7c53]',
    decoration: (
      <>
        <div className="absolute top-2 right-2 text-2xl z-20">🌿</div>
        <div className="absolute inset-0 border-[2px] border-dashed border-[#5b7c53]/50 pointer-events-none z-20"></div>
      </>
    )
  }
}

export type ThemeType = keyof typeof THEMES
