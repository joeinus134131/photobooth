import { Photo } from '@/store/usePhotoboothStore'

/** Index slot kosong pertama (0 .. gridRows-1), atau -1 jika penuh. */
export function getNextEmptySlot(photos: Photo[], gridRows: number): number {
  for (let i = 0; i < gridRows; i++) {
    if (!photos[i]) return i
  }
  return -1
}

/** Semua slot 0 .. gridRows-1 terisi. */
export function isStripFull(photos: Photo[], gridRows: number): boolean {
  return getNextEmptySlot(photos, gridRows) === -1
}

/** Jumlah slot yang sudah berisi foto. */
export function filledSlotCount(photos: Photo[], gridRows: number): number {
  let count = 0
  for (let i = 0; i < gridRows; i++) {
    if (photos[i]) count++
  }
  return count
}
