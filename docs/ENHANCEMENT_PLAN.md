# 📸 Photobooth Platform — Enhancement Plan & Library Recommendations

**Tanggal**: May 15, 2026  
**Status**: Strategic Planning  
**Prepared for**: Platform Enhancement & Feature Expansion

---

## Table of Contents
1. [Current State Assessment](#current-state-assessment)
2. [Recommended Libraries & Plugins](#recommended-libraries--plugins)
3. [Enhancement Planning by Feature](#enhancement-planning-by-feature)
4. [Implementation Roadmap](#implementation-roadmap)
5. [Technical Debt & Improvements](#technical-debt--improvements)

---

## Current State Assessment

### ✅ Strengths

| Aspek | Status | Detail |
|-------|--------|--------|
| **Core Architecture** | Excellent | Next.js 16 + Turbopack, Type-safe dengan TS, Component-based |
| **State Management** | Excellent | Zustand (lightweight, performant) |
| **Testing** | Good | Jest + React Testing Library setup |
| **UI/UX Framework** | Good | Tailwind CSS + Radix UI components |
| **Capture Pipeline** | Solid | Canvas-based capture, CSS filter WYSIWYG |
| **Output Formats** | Good | PNG, GIF (boomerang), Print-ready |
| **Offline Support** | Good | PWA + Service Worker |
| **Code Organization** | Good | Clear separation: lib, components, hooks, store |

### ⚠️ Current Limitations

| Aspek | Issue | Impact |
|-------|-------|--------|
| **Filters & Effects** | CSS-only filters | Limited to CSS capabilities, no advanced ML/CV |
| **Image Processing** | Basic Canvas operations | No real-time image enhancement |
| **Analytics** | None | No usage tracking, event insights |
| **Backend** | Minimal (`share-server.ts` only) | No persistent storage, user accounts, admin panel |
| **Mobile Support** | Limited touch optimization | Can work but UX could be better |
| **Accessibility** | Basic | Need ARIA labels, keyboard navigation |
| **Performance** | Decent but not optimized | Bundle size, image compression potential |
| **Real-time Features** | None | No collaborative features, live feeds |
| **Customization** | Basic | Limited branding options |
| **Error Handling** | Basic | Minimal error recovery, UX |

---

## Recommended Libraries & Plugins

### 🎨 **Visual Effects & Image Processing**

#### 1. **MediaPipe** (CV/AI Filters)
- **Link**: https://mediapipe.dev
- **Purpose**: On-device ML for background blur, face detection, segmentation
- **NPM**: `@mediapipe/selfie-segmentation`, `@mediapipe/face_detection`
- **Why**: Privacy-preserving, real-time, no server needed
- **Cost**: FREE
- **Integration Effort**: Medium (2-3 days)

```
Current: CSS filters only (grayscale, sepia, etc.)
With MediaPipe: Background blur, AR stickers, face detection
```

#### 2. **Sharp** (Server-side Image Processing)
- **Link**: https://sharp.pixelplumbing.com
- **Purpose**: High-performance image resizing, compression, optimization
- **NPM**: `sharp`
- **Why**: Optimize output before storing/sharing
- **Cost**: FREE
- **Integration Effort**: Easy (1 day)

#### 3. **Konva.js** (Canvas Drawing & Effects)
- **Link**: https://konva.js.org
- **Purpose**: Advanced canvas manipulation, real-time drawing, layer management
- **NPM**: `konva`, `react-konva`
- **Why**: More control than raw Canvas, better for text overlay & stickers
- **Cost**: FREE
- **Integration Effort**: Medium (2-3 days)

#### 4. **Jimp** (Client-side Image Processing)
- **Link**: https://github.com/jimp-dev/jimp
- **Purpose**: Pure JS image processing (no Node.js needed)
- **NPM**: `jimp`
- **Why**: Runtime filters, color adjustments, effects
- **Cost**: FREE
- **Integration Effort**: Easy (1-2 days)

---

### 📊 **Analytics & Monitoring**

#### 5. **Posthog** (Product Analytics)
- **Link**: https://posthog.com
- **Purpose**: Event tracking, user journeys, feature flags
- **NPM**: `posthog-js`
- **Why**: Understand user behavior, optimize UX
- **Cost**: FREE tier (up to 1M events/month)
- **Integration Effort**: Easy (1 day)

#### 6. **Sentry** (Error Tracking)
- **Link**: https://sentry.io
- **Purpose**: Real-time error monitoring & debugging
- **NPM**: `@sentry/nextjs`
- **Why**: Catch bugs users experience
- **Cost**: FREE tier (100 errors/month)
- **Integration Effort**: Easy (1 day)

---

### 🗄️ **Backend & Database**

#### 7. **Supabase** (Backend-as-a-Service)
- **Link**: https://supabase.com
- **Purpose**: PostgreSQL + Auth + Real-time + Storage
- **NPM**: `@supabase/supabase-js`
- **Why**: Zero-setup backend, perfect for photobooth gallery, user accounts
- **Cost**: FREE tier (2GB storage, unlimited realtime)
- **Integration Effort**: Medium (3-4 days)

#### 8. **Prisma** (ORM)
- **Link**: https://www.prisma.io
- **Purpose**: Type-safe DB access
- **NPM**: `@prisma/client`
- **Why**: Better than raw SQL, integrates well with Next.js
- **Cost**: FREE
- **Integration Effort**: Medium (2-3 days)

#### 9. **NextAuth.js** v5 (Authentication)
- **Link**: https://authjs.dev
- **Purpose**: OAuth, JWT, Session management
- **NPM**: `next-auth`
- **Why**: Secure user login without implementing from scratch
- **Cost**: FREE
- **Integration Effort**: Medium (2-3 days)

---

### 🎭 **UI/UX Enhancements**

#### 10. **Headless UI / Shadcn/ui** (Already using Radix!)
- **Status**: ✅ Already have Radix UI
- **Consider adding**: More Shadcn/ui components for consistency
- **Link**: https://ui.shadcn.com

#### 11. **React Hot Toast** (Notifications)
- **Link**: https://react-hot-toast.com
- **Purpose**: Beautiful toast notifications
- **NPM**: `react-hot-toast`
- **Why**: Better UX for feedback (success, error, info)
- **Cost**: FREE
- **Integration Effort**: Easy (1 day)

#### 12. **React Confetti** (Celebrations)
- **Link**: https://github.com/alampros/react-confetti
- **Purpose**: Celebratory animations
- **NPM**: `react-confetti`
- **Why**: Gamification, user delight
- **Cost**: FREE
- **Integration Effort**: Easy (1 day)

#### 13. **SWR / TanStack Query** (Data Fetching)
- **Link**: https://swr.vercel.app or https://tanstack.com/query
- **Purpose**: Smart caching, automatic refetching
- **NPM**: `swr` or `@tanstack/react-query`
- **Why**: Better than manual `fetch` + `useState`
- **Cost**: FREE
- **Integration Effort**: Easy-Medium (1-2 days)

---

### 📱 **Mobile & Responsive**

#### 14. **react-use-gesture** → **@use-gesture/react**
- **Link**: https://use-gesture.js.org
- **Purpose**: Touch gestures (swipe, pinch, long-press)
- **NPM**: `@use-gesture/react`
- **Why**: Better mobile UX for photobooth (swipe between photos, pinch zoom)
- **Cost**: FREE
- **Integration Effort**: Medium (1-2 days)

#### 15. **React Window** (Virtual Lists)
- **Link**: https://github.com/bvaughn/react-window
- **Purpose**: Efficient rendering of large lists
- **NPM**: `react-window`
- **Why**: Gallery view with many photos won't lag
- **Cost**: FREE
- **Integration Effort**: Easy (1 day)

---

### 🔧 **Developer Experience**

#### 16. **Storybook** (Component Showcase)
- **Link**: https://storybook.js.org
- **Purpose**: Interactive component playground
- **NPM**: `storybook`
- **Why**: Document components, design system
- **Cost**: FREE
- **Integration Effort**: Easy (1-2 days)

#### 17. **Playwright / Cypress** (E2E Testing)
- **Link**: https://playwright.dev or https://cypress.io
- **Purpose**: End-to-end testing (full user flows)
- **NPM**: `@playwright/test` or `cypress`
- **Why**: Test capture → review → share flow automatically
- **Cost**: FREE (self-hosted)
- **Integration Effort**: Medium (2-3 days)

#### 18. **Zod** (Schema Validation)
- **Link**: https://zod.dev
- **Purpose**: Runtime type validation
- **NPM**: `zod`
- **Why**: Validate API responses, user input
- **Cost**: FREE
- **Integration Effort**: Easy (1-2 days)

---

## Enhancement Planning by Feature

### 🎥 **Phase 3A: Advanced Visual Effects (2-3 weeks)**

#### Goal
Expand from CSS-only to ML-powered effects + creative tools

#### Recommended Stack
- **MediaPipe** (background blur, face detection)
- **Konva.js** (layer management, sticker system)
- **Jimp** (runtime color grading)

#### Implementation Steps
```
Week 1:
  - Set up MediaPipe worker thread
  - Integrate background blur effect
  - Add UI toggle for effects

Week 2:
  - Implement AR sticker system (faces, props)
  - Build Konva canvas for text + sticker overlay
  - Add sticker library management

Week 3:
  - Performance optimization (WebGL rendering)
  - Mobile testing & polish
  - Fallback to CSS for old browsers
```

#### Files to Create/Modify
```
src/lib/vision/
  ├── media-pipe-worker.ts
  ├── background-blur.ts
  ├── face-detection.ts
  └── segmentation.ts

src/components/effects/
  ├── EffectsList.tsx
  ├── StickerPanel.tsx
  └── AdvancedFilters.tsx

src/hooks/
  ├── useMediaPipe.ts
  ├── useVisionEffects.ts
  └── useLayerManager.ts
```

---

### 📊 **Phase 3B: Analytics & Admin Dashboard (2-3 weeks)**

#### Goal
Track usage, understand user behavior, manage events

#### Recommended Stack
- **Supabase** (storage + analytics)
- **PostHog** (event tracking)
- **Prisma** (database ORM)

#### Implementation Steps
```
Week 1:
  - Set up Supabase project
  - Create analytics schema (events, users, photos)
  - Implement PostHog tracking

Week 2:
  - Build admin dashboard
  - Event management UI (create, configure, view stats)
  - Photo gallery view

Week 3:
  - Real-time analytics dashboard
  - Export/reporting features
  - Permission system (admin, event owner)
```

#### Files to Create
```
src/app/admin/
  ├── page.tsx (dashboard)
  ├── events/
  │   ├── page.tsx (list)
  │   └── [id]/page.tsx (detail)
  └── analytics/
      └── page.tsx

src/lib/
  ├── supabase-client.ts
  ├── analytics.ts
  └── admin-queries.ts

src/components/admin/
  ├── EventForm.tsx
  ├── AnalyticsDashboard.tsx
  └── PhotoGallery.tsx
```

---

### 👤 **Phase 3C: User Accounts & Social (2 weeks)**

#### Goal
Users save, share, compare, compete with friends

#### Recommended Stack
- **NextAuth.js** (authentication)
- **Supabase** (storage, profiles)
- **SWR** (data fetching)

#### Implementation Steps
```
Week 1:
  - OAuth login (Google, GitHub)
  - User profiles & galleries
  - Photo collections / albums

Week 2:
  - Social sharing (share photo link)
  - Leaderboard / challenges
  - Friend comparison
```

---

### ♿ **Phase 3D: Accessibility & Mobile UX (1 week)**

#### Goal
Make photobooth usable for everyone, on all devices

#### Recommended Stack
- **@use-gesture/react** (touch gestures)
- **React Hot Toast** (accessible notifications)
- **aria-label** updates

#### Implementation Steps
```
- Add ARIA labels to all interactive elements
- Keyboard navigation (Tab, Enter, Escape)
- Touch gestures (swipe filters, pinch zoom)
- High contrast mode
- Screen reader testing
```

---

### 🎊 **Phase 3E: Gamification & Engagement (1 week)**

#### Goal
Make photobooth fun, increase reuse

#### Recommended Stack
- **React Confetti** (celebrations)
- **React Hot Toast** (achievements)
- **Framer Motion** (animations — already have it!)

#### Ideas
- Achievement badges (first photo, 10 photos, perfect shot, etc.)
- Streaks (consecutive days using photobooth)
- Challenges ("smile the biggest", "most creative pose")
- Social leaderboard

---

## Implementation Roadmap

### Quarter 2 (Current)
- ✅ Phase 2: Complete (kiosk, sharing, printing)
- 🚀 Start Phase 3A: Visual Effects

### Quarter 3 (Next)
- 🎨 Phase 3A: Complete Advanced Effects
- 📊 Phase 3B: Start Analytics & Admin

### Quarter 4
- 📊 Phase 3B: Complete Admin Dashboard
- 👤 Phase 3C: Start User Accounts

### Q1 2027
- 👤 Phase 3C: Complete Social Features
- ♿ Phase 3D: Accessibility polish
- 🎊 Phase 3E: Gamification

---

## Technical Debt & Improvements

### 🔴 High Priority

| Issue | Impact | Effort | Solution |
|-------|--------|--------|----------|
| No backend persistence | Can't store photos > session | High | Add Supabase + DB schema |
| Limited error handling | Users confused on failure | High | Add error boundaries + Sentry |
| No accessibility | Excludes users | High | ARIA labels + keyboard nav |
| Bundle size unchecked | Slow load on mobile | Medium | Analyze with `next/bundle-analyzer` |
| No E2E tests | Risky deploys | Medium | Add Playwright tests |

### 🟡 Medium Priority

| Issue | Impact | Effort | Solution |
|-------|--------|--------|----------|
| Manual fetch calls | Error-prone data fetching | Medium | Migrate to SWR/TanStack Query |
| No validation | Bad data from URL params | Medium | Add Zod schemas |
| Limited notifications | Poor user feedback | Low | Add React Hot Toast |
| No mobile gestures | Poor touch experience | Medium | Add `@use-gesture/react` |
| Repetitive imports | Code quality | Low | Create barrel exports (index.ts) |

### 🟢 Low Priority

| Issue | Impact | Effort | Solution |
|-------|--------|--------|----------|
| No component stories | Hard to maintain | Medium | Add Storybook |
| CSS disorganized | Hard to modify themes | Medium | Extract theme to CSS vars |
| No type safety for API | Runtime errors possible | Low | Add Zod validation |
| Limited logging | Hard to debug | Low | Add structured logging |

---

## Quick Start Implementation Plan

### Week 1: Foundation (Frontend Polish)
```bash
# Install essentials
pnpm add react-hot-toast swr zod @sentry/nextjs

# Add to files
1. Wrap app with toast provider + Sentry
2. Add Zod schemas for API validation
3. Replace manual fetch with SWR
4. Add error boundary + Sentry fallback UI
```

### Week 2: Backend Setup
```bash
# Database & Auth
pnpm add @supabase/supabase-js @supabase/auth-helpers-nextjs next-auth

# Create:
1. Supabase project (free tier)
2. Database schema (users, photos, events)
3. NextAuth.js OAuth setup (Google)
4. API route for storing photos
```

### Week 3: Analytics
```bash
# Tracking
pnpm add posthog-js

# Implement:
1. PostHog event tracking (capture, share, print)
2. Simple analytics dashboard
3. Event creation UI
```

### Week 4: Visual Effects
```bash
# Vision & Canvas
pnpm add @mediapipe/selfie-segmentation konva react-konva

# Implement:
1. Background blur effect toggle
2. Sticker system
3. Advanced layer management
```

---

## Performance Optimization Checklist

- [ ] Analyze bundle with `npx next/bundle-analyzer`
- [ ] Enable image optimization (Next.js Image component)
- [ ] Implement lazy loading for effects libraries
- [ ] Add Web Workers for heavy CV processing
- [ ] Compress photos before upload
- [ ] Use responsive images for gallery
- [ ] Implement pagination/virtual list for photo gallery
- [ ] Cache MediaPipe models
- [ ] Minify & tree-shake unused code

---

## Security Considerations

- [ ] Validate all URL parameters with Zod
- [ ] HTTPS only for sharing links
- [ ] CORS policy for API routes
- [ ] Rate limit API endpoints
- [ ] Sanitize user input (footer text, names)
- [ ] Add CSRF tokens if using forms
- [ ] Rotate share links periodically
- [ ] Audit dependencies with `npm audit`

---

## Estimated Time & Resource Requirements

| Phase | Duration | Effort | Team Size |
|-------|----------|--------|-----------|
| 3A (Visual Effects) | 2-3 weeks | Medium-High | 2 devs |
| 3B (Analytics + Admin) | 2-3 weeks | Medium | 1-2 devs |
| 3C (User Accounts) | 2 weeks | Medium | 1-2 devs |
| 3D (Accessibility) | 1 week | Low-Medium | 1 dev + QA |
| 3E (Gamification) | 1 week | Low | 1 dev |
| **Total** | **8-10 weeks** | **Medium-High** | **1-2 devs** |

---

## Conclusion

Photobooth sudah solid di core functionality. Next step adalah:

1. **Short-term (Month 1)**: Polish UX + add analytics (Week 1-2)
2. **Medium-term (Month 2-3)**: Advanced effects + backend (Week 3-6)
3. **Long-term (Month 4+)**: Social features + gamification (Week 7-10)

**Recommended starting point**: Begin with Week 1 foundation tasks (hot toast + error handling + SWR) — highest ROI untuk effort.

---

**Last Updated**: May 15, 2026  
**Next Review**: June 15, 2026
