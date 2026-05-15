'use client'

import { usePhotoboothStore } from '@/store/usePhotoboothStore'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { Zap } from 'lucide-react'

export function SettingsControls() {
  const { settings, updateSettings } = usePhotoboothStore()

  return (
    <div className="space-y-5">
      <h4 className="font-display text-sm text-stone-500 uppercase tracking-wider">Strip Setup</h4>

      <div className="space-y-2">
        <Label className="text-xs font-bold text-stone-600">Photos per strip</Label>
        <div className="grid grid-cols-3 gap-2">
          {([2, 3, 4] as const).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => updateSettings({ gridRows: n })}
              disabled={settings.captureMode === 'boomerang'}
              className={cn(
                'py-2 rounded-lg border-2 text-sm font-bold transition-all',
                settings.gridRows === n
                  ? 'border-red-500 bg-red-50 text-red-800'
                  : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
              )}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-bold text-stone-600">Countdown (seconds)</Label>
        <div className="grid grid-cols-3 gap-2">
          {([3, 4, 5] as const).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => updateSettings({ countdownDuration: n })}
              className={cn(
                'py-2 rounded-lg border-2 text-sm font-bold transition-all',
                settings.countdownDuration === n
                  ? 'border-red-500 bg-red-50 text-red-800'
                  : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
              )}
            >
              {n}s
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-bold text-stone-600">Photo spacing</Label>
        <div className="grid grid-cols-3 gap-2">
          {(
            [
              { id: 'small' as const, label: 'Tight' },
              { id: 'medium' as const, label: 'Normal' },
              { id: 'large' as const, label: 'Wide' },
            ] as const
          ).map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => updateSettings({ gridGap: id })}
              className={cn(
                'py-2 rounded-lg border-2 text-xs font-bold transition-all',
                settings.gridGap === id
                  ? 'border-red-500 bg-red-50 text-red-800'
                  : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-bold text-stone-600">Border</Label>
        <div className="grid grid-cols-2 gap-2">
          {(
            [
              { id: 'thin' as const, label: 'Thin' },
              { id: 'medium' as const, label: 'Medium' },
            ] as const
          ).map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => updateSettings({ borderThickness: id })}
              className={cn(
                'py-2 rounded-lg border-2 text-xs font-bold transition-all',
                settings.borderThickness === id
                  ? 'border-red-500 bg-red-50 text-red-800'
                  : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-bold text-stone-600">Strip layout</Label>
        <div className="grid grid-cols-3 gap-2">
          {(
            [
              { id: 'vertical' as const, label: 'Vertical' },
              { id: 'grid-2x2' as const, label: '2×2' },
              { id: 'horizontal' as const, label: 'Row' },
            ] as const
          ).map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => updateSettings({ stripLayout: id })}
              className={cn(
                'py-2 rounded-lg border-2 text-[10px] font-bold transition-all',
                settings.stripLayout === id
                  ? 'border-red-500 bg-red-50 text-red-800'
                  : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-bold text-stone-600">Capture mode</Label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() =>
              updateSettings({ captureMode: 'strip', gridRows: settings.gridRows || 3 })
            }
            className={cn(
              'py-2 rounded-lg border-2 text-xs font-bold transition-all',
              settings.captureMode === 'strip'
                ? 'border-red-500 bg-red-50 text-red-800'
                : 'border-stone-200 bg-white text-stone-600'
            )}
          >
            Photo strip
          </button>
          <button
            type="button"
            onClick={() =>
              updateSettings({
                captureMode: 'boomerang',
                gridRows: 4,
                stripLayout: 'grid-2x2',
                autoBurst: false,
              })
            }
            className={cn(
              'py-2 rounded-lg border-2 text-xs font-bold transition-all',
              settings.captureMode === 'boomerang'
                ? 'border-red-500 bg-red-50 text-red-800'
                : 'border-stone-200 bg-white text-stone-600'
            )}
          >
            Boomerang GIF
          </button>
        </div>
      </div>

      <div className="pt-2 border-t border-stone-300/50 space-y-2">
        <SettingsToggle
          label="Kiosk mode"
          hint="Fullscreen-friendly UI for event booths"
          on={settings.kioskMode}
          onToggle={() => updateSettings({ kioskMode: !settings.kioskMode })}
        />
        <SettingsToggle
          label="Auto review when full"
          hint="Go to review screen when strip is complete"
          on={settings.autoReviewOnFull}
          onToggle={() => updateSettings({ autoReviewOnFull: !settings.autoReviewOnFull })}
        />
        <button
          type="button"
          onClick={() => updateSettings({ autoBurst: !settings.autoBurst })}
          disabled={settings.captureMode === 'boomerang'}
          className={cn(
            'w-full flex items-center justify-between gap-3 p-3 rounded-lg border-2 transition-all text-left',
            settings.autoBurst
              ? 'border-red-500 bg-red-50'
              : 'border-stone-200 bg-white hover:border-stone-300'
          )}
        >
          <div className="flex items-center gap-2">
            <Zap
              className={cn('w-4 h-4', settings.autoBurst ? 'text-red-600' : 'text-stone-400')}
            />
            <div>
              <p className="text-xs font-bold text-stone-700">Auto burst</p>
              <p className="text-[10px] text-stone-500">
                Capture all strip photos in sequence after one tap
              </p>
            </div>
          </div>
          <span
            className={cn(
              'text-[10px] font-bold uppercase px-2 py-1 rounded shrink-0',
              settings.autoBurst ? 'bg-red-600 text-white' : 'bg-stone-200 text-stone-600'
            )}
          >
            {settings.autoBurst ? 'On' : 'Off'}
          </span>
        </button>
      </div>
    </div>
  )
}

function SettingsToggle({
  label,
  hint,
  on,
  onToggle,
}: {
  label: string
  hint: string
  on: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        'w-full flex items-center justify-between gap-3 p-3 rounded-lg border-2 transition-all text-left',
        on ? 'border-red-500 bg-red-50' : 'border-stone-200 bg-white hover:border-stone-300'
      )}
    >
      <div>
        <p className="text-xs font-bold text-stone-700">{label}</p>
        <p className="text-[10px] text-stone-500">{hint}</p>
      </div>
      <span
        className={cn(
          'text-[10px] font-bold uppercase px-2 py-1 rounded shrink-0',
          on ? 'bg-red-600 text-white' : 'bg-stone-200 text-stone-600'
        )}
      >
        {on ? 'On' : 'Off'}
      </span>
    </button>
  )
}
