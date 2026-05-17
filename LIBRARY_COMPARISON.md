# 📚 Library Comparison & Selection Matrix

**Purpose**: Help you choose the right tools for each use case  
**Format**: Comparison tables by category  
**Last Updated**: May 15, 2026

---

## 🎨 Visual Effects & Image Processing

### MediaPipe vs TensorFlow.js vs Tracking.js

| Criteria | MediaPipe | TensorFlow.js | Tracking.js | Winner |
|----------|-----------|---------------|-------------|---------|
| **Bundle Size** | 3-5 MB | 5-8 MB | 200 KB | Tracking.js |
| **Real-time Performance** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | MediaPipe |
| **Background Blur** | ✅ Built-in | ⚠️ Custom code | ❌ No | MediaPipe |
| **Face Detection** | ✅ Excellent | ✅ Good | ✅ Basic | MediaPipe |
| **Hand Tracking** | ✅ SOTA | ✅ Good | ❌ No | MediaPipe |
| **Ease of Use** | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Tracking.js |
| **Documentation** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | TensorFlow.js |
| **Mobile Support** | ✅ Excellent | ✅ Good | ✅ Good | MediaPipe |
| **Community** | 🔥 Growing | 🔥🔥🔥 | ⭐⭐ | TensorFlow.js |
| **Cost** | FREE | FREE | FREE | Tie |

**Recommendation for Photobooth**: **MediaPipe** ✅
- Real-time performance crucial for camera app
- Background blur is killer feature
- Google-backed, actively maintained
- Perfect for client-side processing

**When to use TensorFlow.js**: If you need more custom models or advanced ML  
**When to use Tracking.js**: If bundle size is critical and features minimal

---

### Canvas Libraries: Konva.js vs Fabric.js vs Pixi.js

| Criteria | Konva | Fabric | Pixi |
|----------|-------|--------|------|
| **Learning Curve** | Easy | Medium | Hard |
| **2D Drawing** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | N/A |
| **Performance** | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Layers/Groups** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **React Integration** | ⭐⭐⭐⭐ | ⚠️ Tricky | ❌ No |
| **Text Support** | ✅ Good | ✅ Excellent | ⚠️ Basic |
| **File Size** | 35 KB | 30 KB | 120 KB |
| **For Photo Editor** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |

**Recommendation for Photobooth**: **Konva.js** ✅
- Easy React integration with `react-konva`
- Perfect for text + sticker layering
- Good balance of features and performance

---

### Image Processing: Sharp vs Jimp vs ImageMagick

| Criteria | Sharp | Jimp | ImageMagick |
|----------|-------|------|-------------|
| **Environment** | Node.js only | Browser + Node | Backend only |
| **Speed** | ⭐⭐⭐⭐⭐ (fastest) | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Features** | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Bundle Size** | N/A (backend) | 20-50 KB | N/A |
| **Ease of Use** | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| **Use Case** | Server optimization | Browser effects | CLI + backend |

**Recommendation for Photobooth**:
- **Sharp** (server-side): Optimize images before storage
- **Jimp** (client-side): Runtime color adjustments, optional

---

## 📊 Data & State Management

### State Management: Zustand vs Redux vs Jotai vs Valtio

| Criteria | Zustand | Redux | Jotai | Valtio |
|----------|---------|-------|-------|--------|
| **Bundle Size** | 3 KB | 15 KB | 3 KB | 4 KB |
| **Learning Curve** | Easy | Hard | Easy | Easy |
| **DevTools** | ✅ Built-in | ⭐⭐⭐⭐⭐ | ⚠️ Limited | ⚠️ Limited |
| **Middleware** | ✅ Good | ✅ Excellent | ⚠️ Limited | ❌ No |
| **Time-travel Debug** | ✅ Yes | ✅ Yes | ❌ No | ❌ No |
| **Use in Photobooth** | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |

**Current**: **Zustand** ✅ (KEEP - perfect choice)

---

### Data Fetching: SWR vs TanStack Query vs RTK Query

| Criteria | SWR | TanStack Query | RTK Query |
|----------|-----|---|---|
| **Bundle Size** | 4 KB | 8 KB | 16 KB |
| **Caching** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Devtools** | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Pagination** | ⚠️ Manual | ✅ Built-in | ✅ Built-in |
| **Infinite Scroll** | ⚠️ Manual | ✅ Easy | ✅ Easy |
| **Learning Curve** | Easy | Medium | Hard |
| **For Photobooth** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ |

**Recommendation for Photobooth**: **SWR** ✅
- Simple gallery uploads
- No complex pagination needs
- Lightweight, easy integration

**Upgrade later to**: **TanStack Query** (if needs grow)

---

## 🔐 Backend & Authentication

### Backend Platforms: Supabase vs Firebase vs Convex

| Criteria | Supabase | Firebase | Convex |
|----------|----------|----------|--------|
| **Database** | PostgreSQL | NoSQL | PostgreSQL |
| **Realtime** | ✅ Yes | ✅ Yes | ✅ Yes |
| **Auth** | ✅ Built-in | ✅ Built-in | ⚠️ Limited |
| **Storage** | ✅ Yes | ✅ Yes | ❌ No (external) |
| **Cost (Free)** | 2 GB storage | 1 GB storage | 3M reads/mo |
| **Pricing Scale** | Linear | Exponential | Generous |
| **Learning Curve** | Easy | Easy | Medium |
| **For Photobooth** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |

**Recommendation**: **Supabase** ✅
- PostgreSQL (proven, scalable)
- Generous free tier
- Best SQL access
- Can migrate to self-hosted later

**Alternatives**:
- **Firebase**: If you want Google ecosystem
- **Convex**: If you want TypeScript-first backend

---

### Authentication: NextAuth.js vs Auth0 vs Clerk

| Criteria | NextAuth.js | Auth0 | Clerk |
|----------|------------|-------|-------|
| **Setup Time** | 1-2 days | 1 day | 4 hours |
| **OAuth Support** | ✅ 20+ | ✅ 30+ | ✅ 15+ |
| **Self-hosted** | ✅ Yes | ❌ No | ⚠️ Partial |
| **Cost (Free)** | ✅ FREE | ✅ FREE | ✅ FREE |
| **Customization** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| **Dashboard UI** | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **For Photobooth** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

**Recommendation for Photobooth**: **NextAuth.js** ✅
- Integrates with Next.js perfectly
- Most control over implementation
- Can use Supabase as database
- FREE forever

**Quick Setup**:
```bash
pnpm add next-auth @auth/supabase-adapter
```

---

## 📱 UI & Animation

### Animation Library: Framer Motion vs React Spring vs Animate.css

| Criteria | Framer Motion | React Spring | Animate.css |
|----------|---------------|--------------|-------------|
| **Bundle** | 30 KB | 10 KB | 5 KB |
| **Performance** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Ease of Use** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Complex Sequences** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⚠️ Limited |
| **React Integration** | Native | Native | CSS-based |
| **In Photobooth** | ✅ Currently used | ✅ Alternative | ✅ For simple |

**Current**: **Framer Motion** ✅ (KEEP - excellent choice)

---

### Toast/Notification: React Hot Toast vs Sonner vs react-toastify

| Criteria | Hot Toast | Sonner | react-toastify |
|----------|-----------|--------|-----------------|
| **Bundle** | 5 KB | 8 KB | 15 KB |
| **UX** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Customization** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Dark Mode** | ✅ Easy | ✅ Built-in | ⚠️ Limited |
| **Promise Support** | ✅ Yes | ✅ Yes | ✅ Yes |
| **For Photobooth** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |

**Recommendation**: **React Hot Toast** ✅
- Lightweight
- Beautiful default styling
- Perfect for photobooth feedback

---

## 🔍 Testing & Quality

### E2E Testing: Playwright vs Cypress vs WebDriver

| Criteria | Playwright | Cypress | WebDriver |
|----------|-----------|---------|-----------|
| **Speed** | ⭐⭐⭐⭐⭐ (fastest) | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Debugging** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| **Browser Support** | All | Chromium | All |
| **Setup** | Fast | Easy | Moderate |
| **For Photobooth** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |

**Recommendation**: **Playwright** ✅
- Fastest E2E testing
- Test across browsers
- Perfect for camera workflows

---

### Analytics: PostHog vs Segment vs Amplitude

| Criteria | PostHog | Segment | Amplitude |
|----------|---------|---------|-----------|
| **Setup** | 10 min | 30 min | 30 min |
| **Self-hosted** | ✅ Yes | ⚠️ Cloud only | ❌ No |
| **Free Tier** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| **Feature Flags** | ✅ Yes | ✅ Yes | ⭐⭐ |
| **Heatmaps** | ✅ Yes | ❌ No | ❌ No |
| **For Photobooth** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |

**Recommendation**: **PostHog** ✅
- Generous FREE tier (1M events/month)
- All features in free tier
- Can self-host later
- Feature flags perfect for A/B testing

---

## 🎯 Decision Framework

### Choose Based On Your Priorities

```
If you prioritize: SPEED ⚡
→ Playwright + PostHog + SWR

If you prioritize: FEATURES 🎨
→ MediaPipe + Konva + TanStack Query

If you prioritize: SIMPLICITY 🎯
→ React Hot Toast + Supabase + NextAuth + Tracking.js

If you prioritize: SCALABILITY 📈
→ TensorFlow.js + Convex + TanStack Query + Auth0

RECOMMENDED FOR PHOTOBOOTH: 🌟
→ MediaPipe + Konva + Supabase + NextAuth + SWR + PostHog + Playwright
```

---

## Quick Decision Trees

### "What should I use for [X]?"

#### Background Blur?
→ MediaPipe ✅ (Use this immediately)

#### Store photos?
→ Supabase + Sharp ✅ (Easy, scalable)

#### User accounts?
→ NextAuth.js + Supabase ✅ (Open source, flexible)

#### Notifications?
→ React Hot Toast ✅ (Lightweight, beautiful)

#### Track analytics?
→ PostHog ✅ (Generous free tier)

#### Test user flows?
→ Playwright ✅ (Fast, reliable)

#### Complex canvas editing?
→ Konva.js ✅ (Best React support)

#### Color corrections?
→ Sharp (server) + Jimp (client) ✅

---

## Implementation Priority Score

**Highest ROI per effort**:

1. **React Hot Toast** (⭐⭐⭐⭐⭐ Impact / ⭐ Effort) → Do NOW
2. **Sentry** (⭐⭐⭐⭐ Impact / ⭐ Effort) → Do NOW
3. **SWR** (⭐⭐⭐⭐ Impact / ⭐⭐ Effort) → Do ASAP
4. **Zod** (⭐⭐⭐⭐ Impact / ⭐ Effort) → Do ASAP
5. **PostHog** (⭐⭐⭐⭐ Impact / ⭐⭐ Effort) → Do THIS WEEK
6. **Supabase** (⭐⭐⭐⭐⭐ Impact / ⭐⭐⭐ Effort) → Do NEXT WEEK
7. **MediaPipe** (⭐⭐⭐⭐ Impact / ⭐⭐⭐ Effort) → Do AFTER
8. **Konva.js** (⭐⭐⭐ Impact / ⭐⭐⭐ Effort) → Do IF TIME

---

## Cost Analysis

### Monthly Cost (at scale)

```
FREE Tier Stack:
├─ Supabase: FREE (2GB storage, 10GB bandwidth)
├─ PostHog: FREE (1M events)
├─ NextAuth: FREE (self-hosted)
├─ Sentry: FREE (100 errors)
├─ Vercel: FREE (12 deployments/month)
└─ Total: $0/month 🎉

Paid Stack (when you grow):
├─ Supabase: ~$20-50/mo (more storage)
├─ PostHog: ~$300/mo (10M events)
├─ Sentry: ~$20-30/mo (more errors)
└─ Vercel: ~$20/mo (extra bandwidth)
└─ Total: ~$360-450/month 💰
```

---

## Final Recommendations

### ✅ INSTALL NOW (This Week)
```bash
pnpm add react-hot-toast swr zod @sentry/nextjs
```

### ✅ SETUP NEXT (Next Week)
```bash
# Auth
pnpm add next-auth @auth/supabase-adapter

# Storage
pnpm add @supabase/supabase-js

# Analytics
pnpm add posthog-js
```

### ⏳ LATER (Month 2)
```bash
# Vision
pnpm add @mediapipe/selfie-segmentation

# Canvas
pnpm add konva react-konva

# Testing
pnpm add -D @playwright/test
```

---

**Version**: 1.0  
**Last Updated**: May 15, 2026  
**Next Review**: June 15, 2026
