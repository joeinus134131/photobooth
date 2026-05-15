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
              className="w-full aspect-square rounded bg-stone-200 overflow-hidden"
              style={{ filter: preset.value === 'none' ? '' : preset.value }}
            >
               {/* Preview thumbnail - could be a sample image or just a color block */}
               <div
                 className="w-full h-full bg-cover bg-center"
                 style={{ backgroundImage: "url('/images/filter-preview.svg')" }}
               />
            </div>
            <span className="text-xs font-bold text-stone-600">{preset.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
