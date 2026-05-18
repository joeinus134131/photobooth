import React from 'react'
import { usePhotoboothStore } from '@/store/usePhotoboothStore'
import { StickerData } from '@/store/usePhotoboothStore'
import { cn } from '@/lib/utils'
import { Trash2 } from 'lucide-react'

const EMOJI_PACKS = {
  Trending: ['✨', '🔥', '💖', '💅', '🥺', '🦋', '💀', '🤡'],
  Cute: ['🌸', '🍓', '🧸', '🎀', '☁️', '🍄', '🍼', '🍡'],
  Party: ['🎉', '🎂', '🥂', '🎈', '🎁', '🎊', '🕺', '💃'],
  Mood: ['😎', '🫠', '😵‍💫', '🥹', '😏', '🥱', '🫶', '✌️'],
}

export function StickerControls() {
  const { editState, updateEditState } = usePhotoboothStore()

  const addSticker = (emoji: string) => {
    const newSticker: StickerData = {
      id: Math.random().toString(36).substr(2, 9),
      emoji,
      x: 50 + Math.random() * 20, // slightly offset center
      y: 50 + Math.random() * 20,
      scale: 1,
      rotation: (Math.random() - 0.5) * 30, // slight random rotation
    }
    updateEditState({ stickers: [...(editState.stickers || []), newSticker] })
  }

  const removeSticker = (id: string) => {
    updateEditState({
      stickers: editState.stickers.filter((s) => s.id !== id),
    })
  }

  const clearStickers = () => {
    updateEditState({ stickers: [] })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-display text-sm text-stone-500 uppercase tracking-wider">Stickers</h4>
        {editState.stickers?.length > 0 && (
          <button
            onClick={clearStickers}
            className="text-xs text-red-500 hover:text-red-700 font-bold flex items-center gap-1"
          >
            <Trash2 className="w-3 h-3" /> Clear
          </button>
        )}
      </div>

      <div className="space-y-4 max-h-[200px] overflow-y-auto pr-2">
        {Object.entries(EMOJI_PACKS).map(([category, emojis]) => (
          <div key={category} className="space-y-2">
            <h5 className="text-[10px] font-bold text-stone-400 uppercase">{category}</h5>
            <div className="grid grid-cols-4 gap-2">
              {emojis.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => addSticker(emoji)}
                  className="aspect-square flex items-center justify-center text-2xl bg-white border-2 border-stone-200 rounded-lg hover:border-red-400 hover:scale-110 transition-all shadow-sm"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
