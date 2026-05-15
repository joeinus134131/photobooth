import type { StripLayout } from '@/store/usePhotoboothStore'

/** Tailwind grid classes for strip photo area (must be static strings). */
export function getStripGridClass(layout: StripLayout, photoCount: number): string {
  switch (layout) {
    case 'horizontal':
      if (photoCount <= 2) return 'grid-cols-2 grid-rows-1'
      if (photoCount === 3) return 'grid-cols-3 grid-rows-1'
      return 'grid-cols-4 grid-rows-1'
    case 'grid-2x2':
      return 'grid-cols-2 grid-rows-2'
    case 'vertical':
    default:
      return 'grid-cols-1'
  }
}

/** Strip container width per layout */
export function getStripWidth(layout: StripLayout): number {
  switch (layout) {
    case 'horizontal':
      return 360
    case 'grid-2x2':
      return 280
    case 'vertical':
    default:
      return 260
  }
}
