import { FilterSettings } from '@/store/usePhotoboothStore'

export const FILTER_PRESETS = [
  { name: 'Normal', value: 'none' },
  // B&W / Monochrome
  { name: 'Grayscale', value: 'grayscale(100%)' },
  { name: 'Noir', value: 'grayscale(100%) contrast(150%) brightness(90%)' },
  { name: 'Faded B&W', value: 'grayscale(100%) contrast(80%) brightness(110%)' },
  // Vintage / Retro
  { name: 'Sepia', value: 'sepia(100%)' },
  { name: 'Vintage', value: 'sepia(50%) contrast(120%) brightness(90%)' },
  { name: 'Polaroid', value: 'sepia(30%) contrast(110%) brightness(110%) saturate(120%)' },
  { name: 'Fade', value: 'contrast(85%) brightness(115%) saturate(80%)' },
  // Cinematic / Mood
  { name: 'Cool', value: 'hue-rotate(180deg) contrast(110%)' },
  { name: 'Warm', value: 'sepia(30%) hue-rotate(-10deg) saturate(140%)' },
  { name: 'Moody', value: 'contrast(130%) brightness(85%) saturate(80%)' },
  { name: 'Cinematic', value: 'contrast(120%) saturate(110%) brightness(95%) sepia(20%)' },
  // Aesthetic / Modern
  { name: 'Y2K', value: 'saturate(200%) contrast(120%) hue-rotate(15deg)' },
  { name: 'Cottage', value: 'sepia(20%) saturate(130%) brightness(105%) hue-rotate(-10deg)' },
  { name: 'Cyber', value: 'saturate(150%) contrast(120%) hue-rotate(180deg) brightness(90%)' },
  { name: 'Dreamy', value: 'brightness(110%) saturate(120%) contrast(90%) sepia(10%) blur(0.5px)' },
]

export function getFilterString(settings: FilterSettings): string {
  const { filter, brightness, contrast, saturation, hue } = settings
  
  const baseFilter = filter === 'none' ? '' : filter
  const adjustments = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) hue-rotate(${hue}deg)`
  
  return `${baseFilter} ${adjustments}`.trim()
}
