import React from 'react'
import { usePhotoboothStore } from '@/store/usePhotoboothStore'
import { cn } from '@/lib/utils'
import { Ghost, Sparkles, Palette, Zap } from 'lucide-react'

export function ThemeSelector() {
  const { editState, updateEditState, eventConfig } = usePhotoboothStore()

  const themes = [
    { id: 'classic', name: 'Classic', icon: Palette, color: 'bg-stone-100 border-stone-300' },
    { id: 'halloween', name: 'Spooky', icon: Ghost, color: 'bg-orange-100 border-orange-300' },
    { id: 'retro', name: 'Retro', icon: Sparkles, color: 'bg-yellow-100 border-yellow-300' },
    { id: 'neon', name: 'Neon', icon: Zap, color: 'bg-purple-100 border-purple-300' },
  ] as const

  return (
    <div className="w-full">
      <h3 className="font-display font-bold text-stone-700 mb-2 text-xs uppercase tracking-wider">Strip Theme</h3>
      <div className="grid grid-cols-4 gap-2">
        {themes.map((theme) => {
          const Icon = theme.icon
          const isSelected = editState.stripTheme === theme.id
          
          return (
            <button
              key={theme.id}
              type="button"
              disabled={eventConfig.themeLocked}
              onClick={() => !eventConfig.themeLocked && updateEditState({ stripTheme: theme.id })}
              className={cn(
                eventConfig.themeLocked && 'opacity-50 cursor-not-allowed',
                "flex flex-col items-center justify-center p-2 rounded-lg border-2 transition-all",
                theme.color,
                isSelected 
                  ? "ring-2 ring-stone-800 ring-offset-1 scale-95 shadow-inner" 
                  : "hover:scale-105 hover:shadow-md"
              )}
            >
              <Icon className={cn("w-5 h-5 mb-1", isSelected ? "text-stone-900" : "text-stone-600")} />
              <span className={cn("text-[10px] font-bold uppercase", isSelected ? "text-stone-900" : "text-stone-600")}>
                {theme.name}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
