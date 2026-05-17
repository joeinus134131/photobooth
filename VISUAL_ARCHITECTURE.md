# 🎨 Photobooth Enhancement — Visual Architecture & Diagrams

**Visual guide to understanding the enhancement plan**

---

## 📊 Current vs. Future Architecture

### Current Architecture (May 2026)
```
┌─────────────────────────────────────────────────────┐
│                    PHOTOBOOTH APP                   │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────────────────────────────────────────┐   │
│  │         CLIENT SIDE (React/Next.js)          │   │
│  ├──────────────────────────────────────────────┤   │
│  │  UI Components                               │   │
│  │  ├─ Camera Phase                             │   │
│  │  ├─ Review Phase                             │   │
│  │  ├─ Filters (CSS only)                       │   │
│  │  └─ Share/Print                              │   │
│  │                                              │   │
│  │  State Management: Zustand                   │   │
│  │  ├─ Photos (in session)                      │   │
│  │  ├─ Settings                                 │   │
│  │  └─ Edit State                               │   │
│  │                                              │   │
│  │  Storage: Browser only                       │   │
│  │  ├─ localStorage (transient)                 │   │
│  │  ├─ IndexedDB (session only)                 │   │
│  │  └─ ❌ No persistence                        │   │
│  └──────────────────────────────────────────────┘   │
│                          ↓                          │
│  ┌──────────────────────────────────────────────┐   │
│  │      MINIMAL BACKEND (Next.js API)           │   │
│  ├──────────────────────────────────────────────┤   │
│  │  /api/share (in-memory store, 7-day TTL)    │   │
│  │  └─ ❌ Data lost on restart                  │   │
│  │                                              │   │
│  │  ❌ No analytics                             │   │
│  │  ❌ No error tracking                        │   │
│  │  ❌ No database                              │   │
│  └──────────────────────────────────────────────┘   │
│                                                     │
│  External Services:                                │
│  ├─ PWA (offline cache)                            │
│  ├─ Service Worker                                │
│  └─ ❌ No monitoring                              │
│                                                     │
└─────────────────────────────────────────────────────┘

SCORE: 5/10 (Functional but incomplete)
```

---

### Future Architecture (June 2026)
```
┌──────────────────────────────────────────────────────────────┐
│                    PHOTOBOOTH PLATFORM                       │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌───────────────────────────────────────────────────────┐   │
│  │           CLIENT SIDE (React/Next.js)                 │   │
│  ├───────────────────────────────────────────────────────┤   │
│  │  UI Components                                        │   │
│  │  ├─ Camera Phase + ML Effects                         │   │
│  │  ├─ Review Phase + Canvas Editing                     │   │
│  │  ├─ Filters (CSS + MediaPipe)                        │   │
│  │  ├─ Background Blur (MediaPipe)                       │   │
│  │  ├─ Stickers (Konva.js)                              │   │
│  │  ├─ Share/Print with QR                              │   │
│  │  └─ Error Boundary                                    │   │
│  │                                                       │   │
│  │  State Management: Zustand                           │   │
│  │  ├─ Photos                                            │   │
│  │  ├─ Settings                                          │   │
│  │  └─ Edit State (with effects)                        │   │
│  │                                                       │   │
│  │  Data Fetching: SWR                                  │   │
│  │  ├─ Smart caching                                    │   │
│  │  ├─ Auto-retry                                       │   │
│  │  └─ Error handling                                   │   │
│  │                                                       │   │
│  │  Validation: Zod                                     │   │
│  │  ├─ URL params validation                            │   │
│  │  ├─ API response validation                          │   │
│  │  └─ Type safety at runtime                           │   │
│  │                                                       │   │
│  │  Error Handling:                                     │   │
│  │  ├─ Error Boundary                                   │   │
│  │  ├─ Toast notifications                              │   │
│  │  └─ → Sentry (automatic reporting)                  │   │
│  │                                                       │   │
│  │  Analytics: PostHog                                  │   │
│  │  ├─ Event tracking                                   │   │
│  │  ├─ User journey tracking                            │   │
│  │  └─ Feature usage analysis                           │   │
│  └───────────────────────────────────────────────────────┘   │
│                            ↓ ↓ ↓                            │
│  ┌──────────────────────────────────────────────────────┐    │
│  │       BACKEND (Next.js API + Middleware)             │    │
│  ├──────────────────────────────────────────────────────┤    │
│  │  API Routes:                                         │    │
│  │  ├─ /api/photos (upload, list, delete)             │    │
│  │  ├─ /api/share (create shareable links)            │    │
│  │  ├─ /api/events (event management)                 │    │
│  │  ├─ /api/analytics (query analytics)               │    │
│  │  └─ /api/auth (authentication)                     │    │
│  │                                                      │    │
│  │  Middleware:                                        │    │
│  │  ├─ Auth validation (NextAuth.js)                  │    │
│  │  ├─ Rate limiting                                   │    │
│  │  ├─ CORS handling                                   │    │
│  │  └─ Error tracking (Sentry)                        │    │
│  │                                                      │    │
│  │  Image Processing:                                 │    │
│  │  ├─ Sharp (optimization)                           │    │
│  │  ├─ Compression                                     │    │
│  │  └─ CDN caching                                     │    │
│  └──────────────────────────────────────────────────────┘    │
│                            ↓                                 │
│  ┌──────────────────────────────────────────────────────┐    │
│  │              DATABASE LAYER                          │    │
│  ├──────────────────────────────────────────────────────┤    │
│  │  Supabase (PostgreSQL)                              │    │
│  │  ├─ Tables:                                         │    │
│  │  │  ├─ users (auth)                                 │    │
│  │  │  ├─ events (event config)                        │    │
│  │  │  ├─ photos (photo data + metadata)               │    │
│  │  │  ├─ analytics (event tracking)                   │    │
│  │  │  └─ share_links (shareable gallery links)        │    │
│  │  │                                                  │    │
│  │  ├─ Storage:                                        │    │
│  │  │  └─ Photo files (with auto-cleanup)              │    │
│  │  │                                                  │    │
│  │  └─ Real-time subscriptions                         │    │
│  └──────────────────────────────────────────────────────┘    │
│                            ↓                                 │
│  ┌──────────────────────────────────────────────────────┐    │
│  │         EXTERNAL SERVICES & MONITORING               │    │
│  ├──────────────────────────────────────────────────────┤    │
│  │  Observability:                                      │    │
│  │  ├─ Sentry (error tracking)                         │    │
│  │  │  └─ Error rate, debugging info, alerts          │    │
│  │  │                                                  │    │
│  │  ├─ PostHog (product analytics)                    │    │
│  │  │  ├─ Dashboards                                   │    │
│  │  │  ├─ Trends & funnels                             │    │
│  │  │  └─ User cohorts                                 │    │
│  │  │                                                  │    │
│  │  └─ Vercel Analytics (performance)                 │    │
│  │     ├─ Web Vitals                                   │    │
│  │     ├─ Deployment tracking                          │    │
│  │     └─ Edge function logs                           │    │
│  │                                                      │    │
│  │  Authentication:                                    │    │
│  │  ├─ NextAuth.js (OAuth, JWT)                       │    │
│  │  ├─ Google Login                                    │    │
│  │  ├─ GitHub Login                                    │    │
│  │  └─ Email/Password (optional)                       │    │
│  │                                                      │    │
│  │  CDN & Deployment:                                 │    │
│  │  ├─ Vercel Edge Network                            │    │
│  │  ├─ Image Optimization                              │    │
│  │  └─ Automatic deployments                           │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                              │
└──────────────────────────────────────────────────────────────┘

SCORE: 8.5/10 (Professional, scalable, monitored)
```

---

## 🔄 Data Flow Diagram

### User Journey — Photo Capture to Share

```
1. USER OPENS APP
   │
   └─→ Check auth (NextAuth.js)
       ├─ If logged in → Load user settings
       └─ If not → Continue as guest
           │
           └─→ Load event config from URL
               └─→ Apply theme, logo, etc.
               │
               └─→ PostHog: track('session_start')

2. USER CAPTURES PHOTO
   │
   ├─→ Camera view renders
   ├─→ Apply filters (CSS + MediaPipe)
   │   ├─ Background blur (MediaPipe worker)
   │   ├─ Face detection & landmarks
   │   └─ AR stickers (Konva.js)
   │
   ├─→ On capture:
   │   ├─ Canvas → Base64 data URL
   │   ├─ Zustand: addPhoto()
   │   ├─ Toast.success("Photo captured!")
   │   ├─ Sentry: log event (if error)
   │   └─→ PostHog: track('photo_captured', {filter, mode})
   │
   └─→ Check if strip full
       └─ If full → Auto-review (if enabled)

3. USER REVIEWS PHOTOS
   │
   ├─→ Review phase renders
   ├─→ Show photo strip with filters baked in
   ├─→ User can retake any slot
   │   ├─ Click slot → Camera resets to that index
   │   └─→ PostHog: track('photo_retaken')
   │
   └─→ User approves
       └─→ PostHog: track('photos_approved')

4. USER SHARES
   │
   ├─→ Click "Share" button
   ├─→ Toast: "Preparing share link..."
   │
   ├─→ SWR: POST /api/share
   │   ├─ Validate request (Zod schema)
   │   ├─ Sharp: optimize photo
   │   ├─ Upload to Supabase storage
   │   ├─ Insert row in photos table
   │   ├─ Create share_link record
   │   └─ Generate QR code
   │
   ├─→ Toast: "✅ Link copied!"
   ├─→ Show QR code
   └─→ PostHog: track('photo_shared')

5. ERROR HANDLING
   │
   ├─→ Network error:
   │   ├─ SWR auto-retry
   │   ├─ Toast error message
   │   ├─ Sentry: log error
   │   └─ User can retry manually
   │
   └─→ Camera permission error:
       ├─ Toast: "Camera permission denied"
       ├─ Sentry: log permission error
       └─ Show setup instructions

6. ANALYTICS
   │
   └─→ All events sent to PostHog
       ├─ photo_captured
       ├─ photo_retaken
       ├─ photos_approved
       ├─ photo_shared
       ├─ error (if any)
       └─→ Dashboard shows trends
```

---

## 🛠️ Technology Stack Layers

```
                     PHOTOBOOTH PLATFORM STACK

┌─────────────────────────────────────────────────────────┐
│                  PRESENTATION LAYER                     │
├─────────────────────────────────────────────────────────┤
│  React 19                                               │
│  Next.js 16 (App Router, SSR, API routes)             │
│  TypeScript                                             │
│  Tailwind CSS + Radix UI                               │
│  Framer Motion (already have it)                        │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│                   FEATURE LAYER                         │
├─────────────────────────────────────────────────────────┤
│  Camera Capture:        Canvas API                      │
│  Filters:               CSS + MediaPipe + Konva         │
│  State:                 Zustand + SWR                   │
│  Validation:            Zod                             │
│  Error Handling:        Error Boundary + Sentry        │
│  Notifications:         React Hot Toast                 │
│  Canvas Editing:        Konva.js + react-konva         │
│  Vision:                MediaPipe (ML models)           │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│                  APPLICATION LAYER                      │
├─────────────────────────────────────────────────────────┤
│  API Routes:            Next.js /api/*                  │
│  Authentication:        NextAuth.js v5                  │
│  Image Processing:      Sharp                           │
│  Middleware:            Rate limit, CORS, Auth         │
│  Error Tracking:        Sentry                          │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│                   DATABASE LAYER                        │
├─────────────────────────────────────────────────────────┤
│  PostgreSQL:            Supabase                        │
│  Tables:                users, events, photos, etc.     │
│  Storage:               Supabase Storage                │
│  Real-time:             Supabase Realtime               │
│  ORM:                   Raw SQL / Supabase client      │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│               EXTERNAL SERVICES LAYER                   │
├─────────────────────────────────────────────────────────┤
│  Error Monitoring:      Sentry                          │
│  Analytics:             PostHog                         │
│  Authentication:        OAuth (Google, GitHub)          │
│  Deployment:            Vercel                          │
│  CDN:                   Vercel Edge Network             │
└─────────────────────────────────────────────────────────┘
```

---

## 📦 Dependency Graph

```
ROOT: Next.js 16
│
├─ UI Framework
│  ├─ React 19
│  ├─ React DOM 19
│  ├─ Tailwind CSS
│  ├─ Radix UI (labels, sliders, tabs)
│  └─ Lucide React (icons)
│
├─ State & Data
│  ├─ Zustand (app state)
│  ├─ SWR (data fetching)
│  ├─ Zod (validation)
│  └─ @supabase/supabase-js (backend)
│
├─ Effects & Animation
│  ├─ Framer Motion
│  ├─ Canvas API (built-in)
│  ├─ MediaPipe (vision)
│  ├─ Konva.js (canvas drawing)
│  └─ react-konva (React wrapper)
│
├─ Utilities
│  ├─ clsx (CSS class merging)
│  ├─ tailwind-merge (Tailwind merging)
│  ├─ class-variance-authority (CVA)
│  ├─ html-to-image (screenshot)
│  ├─ gifenc (GIF encoding)
│  └─ qrcode (QR generation)
│
├─ Observability
│  ├─ @sentry/nextjs (error tracking)
│  └─ posthog-js (analytics)
│
├─ Authentication
│  ├─ next-auth (session management)
│  └─ @auth/supabase-adapter (DB adapter)
│
├─ Server-side
│  └─ sharp (image optimization)
│
└─ Dev Tools
   ├─ TypeScript
   ├─ ESLint
   ├─ Jest
   ├─ React Testing Library
   └─ Playwright (E2E tests)
```

---

## 🔐 Authentication Flow

```
UNAUTHENTICATED USER
│
└─→ Visit app
    ├─ NextAuth.js checks session
    ├─ No session found
    └─→ Continue as guest
        ├─ Can use photobooth
        ├─ Photos stored in browser session
        ├─ Can share via QR (photos stored 7 days)
        └─ No persistent gallery

AUTHENTICATED USER (Login)
│
└─→ Click "Sign In"
    ├─ NextAuth.js OAuth flow
    ├─ Redirect to provider (Google)
    │   ├─ User approves
    │   └─ Provider redirects back
    │
    ├─ NextAuth creates session
    ├─ Supabase adapter:
    │   ├─ Check if user exists in DB
    │   ├─ If not, create user record
    │   └─ Create session token
    │
    ├─ Cookie set on client
    └─→ Logged in state
        ├─ Can create galleries
        ├─ Photos stored in DB (permanent)
        ├─ Can see past sessions
        ├─ Can create shareable albums
        └─ Can see analytics if admin

USER-SPECIFIC FEATURES
│
├─ Guest:
│  ├─ Capture photos
│  ├─ Share via QR (7 days)
│  └─ Download locally
│
├─ User:
│  ├─ All guest features +
│  ├─ Create galleries/albums
│  ├─ Permanent storage
│  ├─ See past captures
│  └─ Social sharing
│
└─ Admin:
    ├─ All user features +
    ├─ Create events
    ├─ Manage users
    ├─ See analytics dashboard
    └─ Configure themes
```

---

## 📊 Data Model (Supabase)

```
┌─────────────────────────────────────────────────────┐
│                      USERS                          │
├─────────────────────────────────────────────────────┤
│ id (UUID) — Primary Key                             │
│ email (VARCHAR)                                     │
│ name (VARCHAR)                                      │
│ avatar_url (VARCHAR)                                │
│ role (ENUM: user, admin)                           │
│ created_at (TIMESTAMP)                              │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│                      EVENTS                         │
├─────────────────────────────────────────────────────┤
│ id (UUID) — Primary Key                             │
│ user_id (UUID) — Foreign Key to users              │
│ name (VARCHAR)                                      │
│ slug (VARCHAR) — URL-friendly slug                 │
│ description (TEXT)                                  │
│ logo_url (VARCHAR)                                  │
│ theme (VARCHAR)                                     │
│ theme_locked (BOOLEAN)                              │
│ settings (JSONB) — Grid rows, gaps, etc.          │
│ created_at (TIMESTAMP)                              │
│ updated_at (TIMESTAMP)                              │
└─────────────────────────────────────────────────────┘
                ↓                    ↓
    ┌──────────────────┐    ┌────────────────────┐
    │      PHOTOS      │    │    SHARE_LINKS     │
    └──────────────────┘    └────────────────────┘
│ id (UUID)          │     │ id (UUID)          │
│ event_id (UUID)    │     │ photo_id (UUID)    │
│ user_id (UUID)     │     │ slug (VARCHAR)     │
│ title (VARCHAR)    │     │ expires_at (TS)    │
│ data_url (TEXT)    │     │ password (VARCHAR) │
│ metadata (JSONB)   │     │ created_at (TS)    │
│ created_at (TS)    │     └────────────────────┘
│ expires_at (TS)    │
└──────────────────┘
        ↓
┌─────────────────────────────────────────────────────┐
│                   ANALYTICS                         │
├─────────────────────────────────────────────────────┤
│ id (UUID) — Primary Key                             │
│ user_id (UUID) — Foreign Key (nullable for guests) │
│ event_id (UUID) — Foreign Key (nullable)           │
│ action (VARCHAR) — Event type                       │
│ properties (JSONB) — Event data (filter, etc.)     │
│ user_agent (VARCHAR)                                │
│ ip_address (VARCHAR)                                │
│ created_at (TIMESTAMP)                              │
│                                                     │
│ Indices:                                            │
│ ├─ (event_id, created_at)                          │
│ ├─ (user_id, created_at)                           │
│ ├─ (action, created_at)                            │
│ └─ created_at (for time-series queries)            │
└─────────────────────────────────────────────────────┘
```

---

## 🔄 Request/Response Flow

### Example: Share Photo

```
CLIENT REQUEST
│
└─→ User clicks "Share"
    ├─ Toast: "Preparing link..."
    │
    ├─ SWR fetches: POST /api/share
    │   ├─ Request body:
    │   │  {
    │   │    dataUrl: "data:image/png;base64,...",
    │   │    title: "My Photo",
    │   │    eventId?: "uuid..."
    │   │  }
    │   │
    │   └─ Headers:
    │      ├─ Content-Type: application/json
    │      ├─ Authorization: Bearer [token]
    │      └─ User-Agent: [browser]
    │
    └─→ VALIDATION (Zod)
        ├─ Check dataUrl is valid base64
        ├─ Check eventId is UUID (if provided)
        ├─ If invalid → 400 Bad Request
        └─ If valid → Continue

SERVER PROCESSING
│
└─→ POST /api/share
    ├─ Extract data from request
    ├─ Validate schema (Zod)
    │
    ├─ Auth middleware:
    │   ├─ Get session from JWT cookie
    │   ├─ If no session → 401 Unauthorized
    │   └─ If valid → Continue as guest or user
    │
    ├─ Process image:
    │   ├─ Decode base64 to buffer
    │   ├─ Sharp: compress & optimize
    │   │  └─ Reduce size by 70-80%
    │   │
    │   └─ Upload to Supabase Storage:
    │      ├─ Path: photos/{eventId}/{slug}.webp
    │      ├─ Set cache headers (1 year)
    │      └─ Get public URL
    │
    ├─ Database operations:
    │   ├─ Insert photo record:
    │   │  {
    │   │    id: uuid(),
    │   │    event_id: eventId,
    │   │    user_id: userId || null,
    │   │    data_url: storageUrl,
    │   │    created_at: now(),
    │   │    expires_at: now() + 7 days
    │   │  }
    │   │
    │   ├─ Create share_link:
    │   │  {
    │   │    id: uuid(),
    │   │    photo_id: photoId,
    │   │    slug: randomSlug(),
    │   │    created_at: now()
    │   │  }
    │   │
    │   ├─ Track analytics:
    │   │  {
    │   │    action: 'photo_shared',
    │   │    user_id: userId || null,
    │   │    event_id: eventId || null,
    │   │    properties: {
    │   │      size: compressedSize,
    │   │      format: 'webp'
    │   │    },
    │   │    created_at: now()
    │   │  }
    │   │
    │   └─ All operations in transaction:
    │      ├─ All succeed → Commit
    │      └─ Any fails → Rollback
    │
    ├─ Error handling:
    │   ├─ If upload fails:
    │   │  ├─ Sentry.captureException(error)
    │   │  └─ Return 500 Server Error
    │   │
    │   └─ If DB fails:
    │      ├─ Sentry.captureException(error)
    │      └─ Return 500 Server Error
    │
    └─→ Success response:
        {
          status: 'success',
          data: {
            photoId: 'uuid...',
            shareUrl: 'https://app.com/share/abc123',
            qrCodeUrl: 'data:image/png;...',
            expiresAt: '2026-05-22T14:30:00Z'
          }
        }

CLIENT RECEIVES
│
└─→ Response arrives
    ├─ SWR validates with Zod
    ├─ If invalid → Retry
    │
    ├─ If valid:
    │   ├─ Display QR code
    │   ├─ Copy link to clipboard
    │   ├─ Toast: "✅ Link copied!"
    │   ├─ PostHog: track('photo_shared', {...})
    │   └─ Sentry: log success (optional)
    │
    └─→ User can share link or download QR
```

---

## 🎯 Deployment Flow

```
DEVELOPMENT
│
├─ Write code locally
├─ Run `pnpm dev`
├─ Test in browser
├─ Test with Supabase local setup (optional)
│
└─→ Ready to commit

STAGING
│
├─ Push to branch
├─ GitHub Actions CI:
│  ├─ Run type-check
│  ├─ Run lint
│  ├─ Run tests
│  └─ Build
│
├─ If all pass:
│  └─ Deploy preview to Vercel
│
├─ Test in preview environment
└─→ Looks good?

PRODUCTION
│
├─ Create Pull Request
├─ Code review
├─ Merge to main branch
│
├─ Vercel auto-deploys:
│  ├─ Build Next.js app
│  ├─ Run Edge Functions
│  ├─ Optimize images
│  ├─ Deploy to CDN
│  └─ Invalidate cache
│
├─ Health checks:
│  ├─ DNS checks
│  ├─ SSL verification
│  ├─ Smoke tests
│  └─ Performance metrics
│
├─ Monitoring:
│  ├─ Sentry tracks errors
│  ├─ PostHog tracks events
│  ├─ Vercel tracks performance
│  └─ Alerts configured
│
└─→ Live! 🎉

ROLLBACK (if needed)
│
├─ Click "Rollback" in Vercel
├─ Previous version deployed immediately
├─ Sentry notified
├─ Team alerted
└─→ Back to stable version
```

---

## ✨ Feature Rollout Timeline

```
WEEK 1
├─ Mon: Phase 0 foundation
│  ├─ Error handling
│  ├─ Notifications
│  └─ Deploy beta
│
├─ Tue-Wed: Polish Phase 0
│  ├─ User testing
│  ├─ Bug fixes
│  └─ Deploy v0.1
│
├─ Thu-Fri: Start Phase 1
│  └─ Supabase setup
│
└─→ DEPLOYED v0.1 ✅

WEEK 2
├─ Mon-Tue: Phase 1 backend
│  ├─ Database schema
│  ├─ API routes
│  └─ Deploy beta
│
├─ Wed-Thu: Phase 1 polish
│  ├─ Testing
│  ├─ Performance
│  └─ Deploy v0.2
│
└─→ DEPLOYED v0.2 ✅

WEEK 3
├─ Mon-Tue: Phase 2 effects
│  ├─ MediaPipe setup
│  ├─ Background blur
│  └─ Deploy beta
│
├─ Wed-Thu: Effects polish
│  ├─ Face detection
│  ├─ Stickers
│  └─ Deploy v0.3
│
└─→ DEPLOYED v0.3 ✅

WEEK 4
├─ Mon-Tue: Phase 3 analytics
│  ├─ PostHog setup
│  ├─ Dashboard
│  └─ Deploy beta
│
├─ Wed-Thu: Final polish
│  ├─ Security review
│  ├─ Performance optimization
│  └─ Deploy v1.0
│
└─→ DEPLOYED v1.0 ✅ FINAL RELEASE
```

---

## 🎓 Learning Path Visualization

```
START HERE
   │
   ├─→ Week 1: Error Handling Basics
   │   ├─ Sentry setup
   │   ├─ Error boundaries
   │   └─ Toast notifications
   │
   ├─→ Week 2: Backend Development
   │   ├─ Database fundamentals
   │   ├─ API design
   │   └─ Authentication
   │
   ├─→ Week 3: Advanced UI/ML
   │   ├─ MediaPipe & vision
   │   ├─ Canvas drawing
   │   └─ Performance optimization
   │
   └─→ Week 4: Analytics & Growth
       ├─ Event tracking
       ├─ Dashboard design
       └─ Data-driven decisions

SKILLS YOU'LL HAVE
   ├─ Production error monitoring
   ├─ Full-stack development
   ├─ Database design
   ├─ ML in browser
   ├─ Data analytics
   └─ Deployment practices

✨ EXPERT LEVEL ACHIEVED ✨
```

---

**Version**: 1.0  
**Created**: May 15, 2026  
**Status**: ✅ Ready for reference
