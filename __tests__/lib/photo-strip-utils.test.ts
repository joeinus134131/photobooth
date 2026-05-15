import { filledSlotCount, getNextEmptySlot, isStripFull } from '@/lib/photo-strip-utils'

describe('photo-strip-utils', () => {
  const photo = 'data:image/jpeg;base64,x'

  it('getNextEmptySlot returns first empty index', () => {
    expect(getNextEmptySlot([], 3)).toBe(0)
    expect(getNextEmptySlot([photo], 3)).toBe(1)
    expect(getNextEmptySlot([photo, '', photo], 3)).toBe(1)
  })

  it('getNextEmptySlot returns -1 when full', () => {
    expect(getNextEmptySlot([photo, photo, photo], 3)).toBe(-1)
  })

  it('isStripFull detects all slots filled', () => {
    expect(isStripFull([photo, photo], 2)).toBe(true)
    expect(isStripFull([photo], 2)).toBe(false)
  })

  it('filledSlotCount counts non-empty slots in range', () => {
    expect(filledSlotCount([photo, '', photo], 3)).toBe(2)
  })
})
