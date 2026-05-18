import React from 'react'
import { X, Trash2, Download } from 'lucide-react'
import { useGallery } from '@/hooks/useGallery'

interface GalleryModalProps {
  isOpen: boolean
  onClose: () => void
}

export function GalleryModal({ isOpen, onClose }: GalleryModalProps) {
  const { items, isLoading, deleteFromGallery } = useGallery()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#f5f0e6] w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl border-4 border-stone-300 flex flex-col overflow-hidden relative">
        <div className="absolute inset-0 pattern-cork opacity-20 pointer-events-none" />
        
        <div className="bg-stone-800 text-white p-4 flex justify-between items-center relative z-10">
          <h2 className="font-display font-bold text-xl uppercase tracking-widest">My Gallery</h2>
          <button onClick={onClose} className="p-1 hover:bg-stone-700 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 relative z-10">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-stone-500 font-mono animate-pulse">Loading memories...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-stone-400">
              <div className="text-6xl mb-4">📸</div>
              <p className="font-display text-xl">No photos yet</p>
              <p className="text-sm mt-2">Take some photos to fill your gallery!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {items.map((item) => (
                <div key={item.id} className="group relative">
                  <div className="aspect-[1/3] sm:aspect-[1/2] bg-white p-2 rounded shadow-md border border-stone-200 transform transition-transform group-hover:scale-105 group-hover:shadow-xl">
                    <img src={item.dataUrl} alt="Photo strip" className="w-full h-full object-cover" />
                  </div>
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex flex-col items-center justify-center gap-2">
                    <a
                      href={item.dataUrl}
                      download={`photobooth-${item.id}.png`}
                      className="bg-white text-stone-900 p-2 rounded-full hover:bg-stone-200"
                      title="Download"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                    <button
                      onClick={() => deleteFromGallery(item.id)}
                      className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-[10px] text-stone-500 text-center mt-2 font-mono">
                    {new Date(item.date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
