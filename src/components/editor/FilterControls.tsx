import React from 'react'
import { usePhotoboothStore } from '@/store/usePhotoboothStore'
import { FILTER_PRESETS } from '@/lib/filters'
import { cn } from '@/lib/utils'

export function FilterControls() {
  const { editState, updateEditState } = usePhotoboothStore()

  return (
    <div className="space-y-4">
      <h4 className="font-display text-sm text-stone-500 uppercase tracking-wider">Filters</h4>
      <div className="grid grid-cols-3 gap-2">
        {FILTER_PRESETS.map((preset) => (
          <button
            key={preset.name}
            onClick={() => updateEditState({ filter: preset.value })}
            className={cn(
              "flex flex-col items-center gap-2 p-2 rounded-lg border-2 transition-all",
              editState.filter === preset.value
                ? "border-red-500 bg-red-50"
                : "border-stone-200 hover:border-stone-300 bg-white"
            )}
          >
            <div 
              className="w-full aspect-square rounded overflow-hidden relative"
            >
               <div
                 className="absolute inset-0 bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-500"
                 style={{ filter: preset.value === 'none' ? '' : preset.value }}
               />
               <div className="absolute inset-0 bg-white/10" />
            </div>
            <span className="text-xs font-bold text-stone-600">{preset.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
