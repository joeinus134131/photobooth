import { create } from 'zustand'

export type Photo = string // Base64 data URL

export type AppStep = 'camera' | 'review'

export type StripLayout = 'vertical' | 'grid-2x2' | 'horizontal'

export type CaptureMode = 'strip' | 'boomerang'

export interface EventConfig {
  eventId: string | null
  eventName: string
  logoUrl: string | null
  themeLocked: boolean
}

export interface FilterSettings {
  filter: string
  brightness: number
  contrast: number
  saturation: number
  hue: number
}

export interface TextOverlay {
  text: string
  x: number
  y: number
  font: string
  color: string
  size: number
}

interface PhotoboothState {
  step: AppStep
  photos: Photo[]
  eventConfig: EventConfig
  settings: {
    countdownDuration: 3 | 4 | 5
    gridRows: 2 | 3 | 4
    gridGap: 'small' | 'medium' | 'large'
    borderThickness: 'thin' | 'medium'
    autoBurst: boolean
    stripLayout: StripLayout
    captureMode: CaptureMode
    kioskMode: boolean
    autoReviewOnFull: boolean
  }
  editState: FilterSettings & {
    footerText: string
    secretMessage: string
    stripTheme: 'classic' | 'halloween' | 'retro' | 'neon'
  }
  
  // Actions
  setStep: (step: AppStep) => void
  addPhoto: (photo: Photo) => void
  setPhotoAtIndex: (index: number, photo: Photo) => void
  removePhoto: (index: number) => void
  clearPhotos: () => void
  updateSettings: (settings: Partial<PhotoboothState['settings']>) => void
  updateEditState: (editState: Partial<PhotoboothState['editState']>) => void
  updateEventConfig: (config: Partial<EventConfig>) => void
  resetEditState: () => void
  resetSession: () => void
}

export type { PhotoboothState }

const DEFAULT_EDIT_STATE: FilterSettings & { footerText: string; secretMessage: string; stripTheme: 'classic' } = {
  filter: 'none',
  brightness: 100,
  contrast: 100,
  saturation: 100,
  hue: 0,
  footerText: 'Photobooth App',
  secretMessage: 'Secret Message...',
  stripTheme: 'classic',
}

export const usePhotoboothStore = create<PhotoboothState>((set) => ({
  step: 'camera',
  photos: [],
  eventConfig: {
    eventId: null,
    eventName: 'Photobooth',
    logoUrl: null,
    themeLocked: false,
  },
  settings: {
    countdownDuration: 3,
    gridRows: 3,
    gridGap: 'medium',
    borderThickness: 'medium',
    autoBurst: true,
    stripLayout: 'vertical',
    captureMode: 'strip',
    kioskMode: false,
    autoReviewOnFull: true,
  },
  editState: DEFAULT_EDIT_STATE,

  setStep: (step) => set({ step }),
  addPhoto: (photo) => set((state) => ({ photos: [...state.photos, photo] })),
  setPhotoAtIndex: (index, photo) =>
    set((state) => {
      const photos = [...state.photos]
      while (photos.length <= index) {
        photos.push('')
      }
      photos[index] = photo
      return { photos }
    }),
  removePhoto: (index) => set((state) => ({ photos: state.photos.filter((_, i) => i !== index) })),
  clearPhotos: () => set({ photos: [], step: 'camera' }),
  updateEventConfig: (config) =>
    set((state) => ({ eventConfig: { ...state.eventConfig, ...config } })),
  resetSession: () =>
    set({
      step: 'camera',
      photos: [],
    }),
  updateSettings: (newSettings) =>
    set((state) => ({ settings: { ...state.settings, ...newSettings } })),
  updateEditState: (newEditState) =>
    set((state) => ({ editState: { ...state.editState, ...newEditState } })),
  resetEditState: () => set({ editState: DEFAULT_EDIT_STATE }),
}))
