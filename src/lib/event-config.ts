import type { EventConfig, FilterSettings } from '@/store/usePhotoboothStore'

type StripTheme = 'classic' | 'halloween' | 'retro' | 'neon'

export interface ParsedEventConfig {
  eventId: string | null
  eventName: string
  logoUrl: string | null
  footerText: string | null
  stripTheme: StripTheme | null
  themeLocked: boolean
  kioskMode: boolean
}

const VALID_THEMES = ['classic', 'halloween', 'retro', 'neon'] as const

export function parseEventSearchParams(params: URLSearchParams): ParsedEventConfig {
  const theme = params.get('theme')
  const stripTheme =
    theme && VALID_THEMES.includes(theme as (typeof VALID_THEMES)[number])
      ? (theme as ParsedEventConfig['stripTheme'])
      : null

  return {
    eventId: params.get('event') || params.get('eventId'),
    eventName: params.get('name') || params.get('eventName') || 'Photobooth',
    logoUrl: params.get('logo') || null,
    footerText: params.get('footer'),
    stripTheme,
    themeLocked: params.get('lockTheme') === '1' || params.get('lockTheme') === 'true',
    kioskMode: params.get('kiosk') === '1' || params.get('kiosk') === 'true',
  }
}

export function applyEventToStore(
  parsed: ParsedEventConfig,
  updateEditState: (s: Partial<FilterSettings & { footerText: string; secretMessage: string; stripTheme: StripTheme }>) => void,
  updateSettings: (s: { kioskMode?: boolean }) => void
) {
  const editPatch: Partial<FilterSettings & { footerText: string; stripTheme: StripTheme }> = {}
  if (parsed.footerText) editPatch.footerText = parsed.footerText.slice(0, 20)
  if (parsed.stripTheme) editPatch.stripTheme = parsed.stripTheme

  if (Object.keys(editPatch).length > 0) {
    updateEditState(editPatch)
  }

  if (parsed.kioskMode) {
    updateSettings({ kioskMode: true })
  }
}
