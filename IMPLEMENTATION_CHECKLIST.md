# 🚀 Implementation Checklist & Quick Start Guide

**Tujuan**: Prioritized tasks untuk improving photobooth platform  
**Target Completion**: Next 4 weeks  
**Priority**: Foundation → Features → Polish

---

## Phase 0: Foundation (Week 1) ⚡
**Goal**: Improve user experience + error handling + code quality  
**Estimated Time**: 3-4 days  
**Dependencies**: None

### Essential Additions

#### [ ] 1. Error Boundary & Sentry Integration (1 day)
**Why**: Catch and report errors automatically  
**Files to create**:
- `src/components/ErrorBoundary.tsx`
- `src/lib/sentry-init.ts`

**Steps**:
```bash
pnpm add @sentry/nextjs
```

```typescript
// src/lib/sentry-init.ts
import * as Sentry from "@sentry/nextjs";

if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 1.0,
  });
}

// next.config.ts
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig = { /* ... */ };
export default withSentryConfig(nextConfig, { silent: true });
```

**Result**: Errors logged automatically, development easier

---

#### [ ] 2. Toast Notifications (1 day)
**Why**: Better user feedback for actions  
**Files to modify**:
- `src/app/layout.tsx` (add provider)
- `src/components/**/*.tsx` (add toast calls)

**Steps**:
```bash
pnpm add react-hot-toast
```

```typescript
// src/app/layout.tsx
import { Toaster } from 'react-hot-toast'

export default function RootLayout({ children }: ...) {
  return (
    <html>
      <body>
        {children}
        <Toaster position="bottom-center" />
      </body>
    </html>
  )
}

// Usage in components:
import toast from 'react-hot-toast'

export function ReviewPhase() {
  const handleDownload = async () => {
    try {
      // download logic
      toast.success('✅ Photo downloaded!')
    } catch (error) {
      toast.error('❌ Download failed')
    }
  }
}
```

**Result**: Professional notifications, better UX

---

#### [ ] 3. Input Validation with Zod (1 day)
**Why**: Type-safe runtime validation for URL params  
**Files to create**:
- `src/lib/schemas.ts`

**Steps**:
```bash
pnpm add zod
```

```typescript
// src/lib/schemas.ts
import { z } from 'zod'

export const eventConfigSchema = z.object({
  eventId: z.string().optional(),
  eventName: z.string().default('Photobooth'),
  logoUrl: z.string().url().optional(),
  themeLocked: z.boolean().default(false),
  kioskMode: z.boolean().default(false),
})

// Use in event-config.ts:
export function parseEventSearchParams(searchParams: URLSearchParams) {
  const raw = Object.fromEntries(searchParams)
  return eventConfigSchema.parse(raw)
}
```

**Result**: No more invalid data in app

---

#### [ ] 4. Migrate to SWR for Data Fetching (1 day)
**Why**: Built-in caching, retry logic, error handling  
**Files to modify**:
- `src/components/share/ShareQrPanel.tsx`
- `src/lib/share-utils.ts`

**Steps**:
```bash
pnpm add swr
```

```typescript
// Create hook: src/hooks/useShareLink.ts
import useSWR from 'swr'

export function useShareLink(dataUrl: string | null) {
  const { data, error, isLoading } = useSWR(
    dataUrl ? ['share', dataUrl] : null,
    async ([_, url]) => {
      const res = await fetch('/api/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dataUrl: url }),
      })
      if (!res.ok) throw new Error('Failed to create share link')
      return res.json()
    }
  )

  return { shareLink: data?.shareUrl, error, isLoading }
}

// Use in component:
function ShareQrPanel() {
  const { shareLink, isLoading, error } = useShareLink(dataUrl)
  
  if (error) return <div className="text-red-500">Error: {error.message}</div>
  if (isLoading) return <div>Generating QR code...</div>
  
  return <QRCode value={shareLink} />
}
```

**Result**: Robust data fetching, automatic retries

---

### Quick Wins (< 1 day each)

#### [ ] 5. Add Bundle Analyzer
```bash
pnpm add -D @next/bundle-analyzer

# next.config.ts
import withBundleAnalyzer from '@next/bundle-analyzer'

const withAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

export default withAnalyzer(nextConfig)

# Run: ANALYZE=true pnpm build
```

**Why**: Identify large dependencies, optimize

#### [ ] 6. Improve Console Output
```typescript
// src/lib/logger.ts
const isDev = process.env.NODE_ENV === 'development'

export const logger = {
  info: (msg: string, data?: any) => {
    if (isDev) console.log(`ℹ️ ${msg}`, data)
  },
  error: (msg: string, err?: Error) => {
    console.error(`❌ ${msg}`, err)
  },
  success: (msg: string) => {
    if (isDev) console.log(`✅ ${msg}`)
  },
}
```

---

## Phase 1: Backend & Database (Week 2) 🗄️
**Goal**: Persistent storage + user management  
**Estimated Time**: 4-5 days  
**Dependencies**: Phase 0 complete

### Setup Supabase

#### [ ] 7. Create Supabase Project
**Steps**:
1. Go to https://supabase.com → Sign Up (FREE)
2. Create new project
3. Save API URL & public key
4. Add to `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

#### [ ] 8. Create Database Schema
**SQL to run in Supabase console**:
```sql
-- Users (optional, if using auth)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Events
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  slug VARCHAR UNIQUE,
  logo_url VARCHAR,
  theme VARCHAR,
  settings JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Photos
CREATE TABLE photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  data_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP DEFAULT NOW() + INTERVAL '7 days'
);

CREATE INDEX idx_photos_event_created ON photos(event_id, created_at);
CREATE INDEX idx_photos_expires ON photos(expires_at);

-- Analytics
CREATE TABLE events_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id),
  action VARCHAR, -- 'capture', 'share', 'print'
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### [ ] 9. Supabase Client Setup
```bash
pnpm add @supabase/supabase-js
```

```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

// API helpers
export async function uploadPhoto(eventId: string, dataUrl: string) {
  const { data, error } = await supabase
    .from('photos')
    .insert([{ event_id: eventId, data_url: dataUrl }])

  if (error) throw error
  return data[0]
}

export async function trackAnalytics(eventId: string, action: string) {
  await supabase
    .from('events_analytics')
    .insert([{ event_id: eventId, action }])
    .select()
}
```

**Result**: Persistent storage ready

---

## Phase 2: Visual Effects (Week 3) 🎨
**Goal**: Add ML-powered effects  
**Estimated Time**: 4-5 days  
**Dependencies**: Phase 0 complete

### Setup MediaPipe

#### [ ] 10. Background Blur Effect
```bash
pnpm add @mediapipe/selfie-segmentation
```

```typescript
// src/lib/vision/background-blur.ts
import * as selfie from '@mediapipe/selfie-segmentation'

export async function initSegmentation() {
  const segmenter = new selfie.SelfieSegmentation({
    locateFile: (file) => 
      `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`,
  })

  await segmenter.initialize()
  return segmenter
}

export async function applyBackgroundBlur(
  video: HTMLVideoElement,
  canvas: HTMLCanvasElement,
  strength: number = 10
) {
  const segmenter = await initSegmentation()
  const results = await segmenter.send({ image: video })
  
  const ctx = canvas.getContext('2d')!
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  
  // Apply blur to background based on segmentation mask
  // (Implementation continues...)
}
```

**Result**: Professional-looking background blur

---

#### [ ] 11. Face Detection + Landmarks
```bash
# Already have MediaPipe, just add face detection
```

```typescript
// src/lib/vision/face-detection.ts
import * as faceMesh from '@mediapipe/face_mesh'

export async function detectFaces(video: HTMLVideoElement) {
  const faceMeshModel = new faceMesh.FaceMesh({
    locateFile: (file) =>
      `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
  })

  await faceMeshModel.initialize()
  const results = await faceMeshModel.send({ image: video })
  
  return results.multiFaceGeometry // Face landmarks
}

// Use for: AR stickers on face, smile detection, eye tracking
```

**Result**: Enable sticker + AR features

---

#### [ ] 12. Create Effects UI
**Files to create**:
- `src/components/effects/EffectsPanel.tsx`
- `src/components/effects/BackgroundBlurControl.tsx`

```typescript
// src/components/effects/EffectsPanel.tsx
'use client'

import { useState } from 'react'
import { usePhotoboothStore } from '@/store/usePhotoboothStore'

const EFFECTS = [
  { id: 'blur', name: '🫐 Background Blur', intensity: 10 },
  { id: 'bokeh', name: '✨ Bokeh', intensity: 15 },
  { id: 'replace', name: '🌅 Background Replace' },
]

export function EffectsPanel() {
  const [activeEffect, setActiveEffect] = useState<string | null>(null)
  const { updateEditState } = usePhotoboothStore()

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium">Effects</h3>
      <div className="grid grid-cols-2 gap-2">
        {EFFECTS.map((effect) => (
          <button
            key={effect.id}
            onClick={() => {
              setActiveEffect(effect.id)
              updateEditState({ effect: effect.id })
            }}
            className={`p-3 rounded border-2 transition ${
              activeEffect === effect.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            {effect.name}
          </button>
        ))}
      </div>
    </div>
  )
}
```

**Result**: Polished effects UI

---

## Phase 3: Analytics & Admin (Week 4) 📊
**Goal**: Track usage, manage events  
**Estimated Time**: 4-5 days  
**Dependencies**: Phase 1 complete

#### [ ] 13. PostHog Integration
```bash
pnpm add posthog-js
```

```typescript
// src/lib/posthog.ts
import posthog from 'posthog-js'

if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  })
}

export function trackEvent(name: string, properties?: Record<string, any>) {
  if (typeof window !== 'undefined') {
    posthog.capture(name, properties)
  }
}

// Usage:
import { trackEvent } from '@/lib/posthog'

trackEvent('photo_captured', {
  filter: settings.filter,
  gridRows: settings.gridRows,
})
```

#### [ ] 14. Analytics Tracking Points
Add tracking to:
- Photo capture (`trackEvent('photo_captured')`)
- Filter changed (`trackEvent('filter_changed')`)
- Share action (`trackEvent('photo_shared')`)
- Print action (`trackEvent('photo_printed')`)
- Download action (`trackEvent('photo_downloaded')`)

#### [ ] 15. Simple Analytics Dashboard
**File**: `src/app/analytics/page.tsx`
```typescript
'use client'

export default function AnalyticsDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">📊 Analytics</h1>
      
      <div className="grid grid-cols-3 gap-4">
        <MetricCard label="Total Captures" value={data?.totalCaptures} />
        <MetricCard label="Total Shares" value={data?.totalShares} />
        <MetricCard label="Total Prints" value={data?.totalPrints} />
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Popular Filters</h2>
        <FilterChart data={filterStats} />
      </div>
    </div>
  )
}
```

**Result**: Visibility into platform usage

---

## Priority Matrix

```
┌─────────────────────────────────────────────────────┐
│           HIGH IMPACT (What to do first)            │
├─────────────────────────────────────────────────────┤
│ 1. Error Handling + Sentry (Phase 0)                │
│ 2. Toast Notifications (Phase 0)                    │
│ 3. Input Validation (Phase 0)                       │
│ 4. SWR Data Fetching (Phase 0)                      │
│ ────────────────────────────────────────────────    │
│ 5. Supabase + Database (Phase 1)                    │
│ 6. Analytics Setup (Phase 3)                        │
│ ────────────────────────────────────────────────    │
│ 7. MediaPipe Effects (Phase 2) [OPTIONAL]           │
│ 8. Admin Dashboard (Phase 3) [OPTIONAL]             │
│ ────────────────────────────────────────────────    │
│ 9. Testing (E2E, Storybook) [NICE TO HAVE]         │
│ 10. Accessibility Polish [NICE TO HAVE]             │
└─────────────────────────────────────────────────────┘
```

---

## Estimated Effort Summary

| Phase | Tasks | Days | Complexity | ROI |
|-------|-------|------|-----------|-----|
| 0 (Foundation) | 6 | 3-4 | Low | High ⭐⭐⭐⭐⭐ |
| 1 (Backend) | 3 | 4-5 | Medium | High ⭐⭐⭐⭐ |
| 2 (Effects) | 3 | 4-5 | Medium | Medium ⭐⭐⭐ |
| 3 (Analytics) | 3 | 4-5 | Low | Medium ⭐⭐⭐ |
| **Total** | **15** | **15-19** | **Medium** | **High** |

---

## Success Metrics

After completing all 15 tasks, you should have:

- ✅ **Reliability**: Errors tracked + handled gracefully
- ✅ **UX**: Toast notifications + validation feedback
- ✅ **Persistence**: Photos stored 7+ days
- ✅ **Insights**: Analytics dashboard showing usage patterns
- ✅ **Features**: Professional visual effects
- ✅ **Quality**: No broken deployments (monitoring)
- ✅ **Analytics**: Data-driven decisions possible

---

## Next Steps

1. **Start Week 1**: Do Phase 0 (4 items, 3-4 days)
2. **Get feedback**: Deploy & gather user reactions
3. **Week 2**: Do Phase 1 (backend setup)
4. **Week 3**: Do Phase 2 (optional, visual effects)
5. **Week 4**: Do Phase 3 (analytics + dashboard)

**Recommendation**: Start with Phase 0 TODAY — highest impact, lowest effort.

---

**Version**: 1.0  
**Last Updated**: May 15, 2026  
**Status**: Ready to implement
