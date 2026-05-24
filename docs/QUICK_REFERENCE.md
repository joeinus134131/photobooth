# 🎯 Photobooth Enhancement — Quick Reference Card

**Print this or bookmark for quick lookup**

---

## ⚡ Phase 0 (Week 1) — START HERE

### Tasks
1. **Error Tracking** (Sentry) - 2 hours
2. **Notifications** (React Hot Toast) - 1 hour
3. **Validation** (Zod) - 1 hour
4. **Data Fetching** (SWR) - 1 hour
5. **Bundle Analyzer** - 30 min
6. **Logger** - 30 min

**Total Time**: ~6 hours  
**Impact**: ⭐⭐⭐⭐⭐  
**Effort**: ⭐

### Commands
```bash
# Install
pnpm add @sentry/nextjs react-hot-toast zod swr

# Add to .env.local
NEXT_PUBLIC_SENTRY_DSN=your-dsn-here
```

### Files to Create
- `src/lib/sentry-init.ts`
- `src/lib/schemas.ts`
- `src/lib/logger.ts`
- `src/hooks/useShareLink.ts`

---

## 🗄️ Phase 1 (Week 2) — Backend

### Tasks
1. **Supabase Setup** - 1 hour
2. **Database Schema** - 2 hours
3. **API Routes** - 2 hours

**Total Time**: ~5 hours  
**Impact**: ⭐⭐⭐⭐⭐  
**Effort**: ⭐⭐

### Commands
```bash
# Install
pnpm add @supabase/supabase-js

# Get free Supabase at: https://supabase.com
```

### Create
- Supabase project (free)
- Tables: users, events, photos, analytics
- API routes in `src/app/api/`

---

## 🎨 Phase 2 (Week 3) — Effects

### Tasks
1. **MediaPipe Background Blur** - 2 hours
2. **Face Detection** - 1 hour
3. **Sticker System** - 2 hours

**Total Time**: ~5 hours  
**Impact**: ⭐⭐⭐⭐  
**Effort**: ⭐⭐

### Commands
```bash
# Install
pnpm add @mediapipe/selfie-segmentation konva react-konva
```

### Files to Create
- `src/lib/vision/background-blur.ts`
- `src/lib/vision/face-detection.ts`
- `src/components/effects/EffectsPanel.tsx`

---

## 📊 Phase 3 (Week 4) — Analytics

### Tasks
1. **PostHog Setup** - 1 hour
2. **Event Tracking** - 2 hours
3. **Dashboard** - 2 hours

**Total Time**: ~5 hours  
**Impact**: ⭐⭐⭐⭐  
**Effort**: ⭐⭐

### Commands
```bash
# Install
pnpm add posthog-js

# Get free PostHog at: https://posthog.com
```

### Events to Track
- photo_captured
- filter_changed
- photo_shared
- photo_printed
- photo_downloaded

---

## 📚 Key Libraries Reference

### Error & Monitoring
- **Sentry** — Error tracking
- **React Error Boundary** — Component errors
- **Zod** — Input validation

### Notifications
- **React Hot Toast** — User feedback
- **Toast.success()** — Success messages
- **Toast.error()** — Error messages

### Data
- **SWR** — Smart caching + fetching
- **Supabase** — Database + auth + storage
- **@supabase/supabase-js** — JS client

### Vision & Canvas
- **MediaPipe** — ML face/pose detection
- **Konva.js** — Advanced canvas drawing
- **react-konva** — React wrapper

### Analytics
- **PostHog** — Event tracking + dashboards
- **@sentry/nextjs** — Error + performance

---

## 🚀 Deployment Checklist

### Before Each Deploy
- [ ] Run tests: `pnpm test`
- [ ] Check types: `pnpm type-check`
- [ ] Run linter: `pnpm lint`
- [ ] Check bundle size: `ANALYZE=true pnpm build`
- [ ] Test locally: `pnpm dev`

### Deployment
```bash
# To Vercel (automatic)
git push origin main

# Manual if needed
vercel deploy --prod
```

### After Deploy
- [ ] Check Sentry for errors
- [ ] Monitor analytics in PostHog
- [ ] Get user feedback
- [ ] Log issues for next sprint

---

## 📊 Quick Decision Matrix

| Need | Solution | Time | Cost |
|------|----------|------|------|
| Error tracking | Sentry | 1 hr | FREE |
| Notifications | Hot Toast | 1 hr | FREE |
| Validation | Zod | 1 hr | FREE |
| Data fetching | SWR | 1 hr | FREE |
| Database | Supabase | 2 hrs | FREE |
| Effects | MediaPipe | 2 hrs | FREE |
| Analytics | PostHog | 2 hrs | FREE |
| Canvas | Konva | 2 hrs | FREE |

---

## 🔗 Links You'll Need

### Services (Sign up free)
- Supabase: https://supabase.com
- PostHog: https://posthog.com
- Sentry: https://sentry.io

### Documentation
- Next.js: https://nextjs.org/docs
- React: https://react.dev
- Tailwind: https://tailwindcss.com

### Libraries
- MediaPipe: https://mediapipe.dev
- Konva: https://konva.js.org
- SWR: https://swr.vercel.app

---

## 💻 Common Commands

```bash
# Development
pnpm dev                    # Start dev server
pnpm build                  # Build for production
pnpm start                  # Start production server

# Quality
pnpm type-check            # Check TypeScript
pnpm lint                  # Run ESLint
pnpm test                  # Run tests
pnpm test:watch           # Watch mode

# Analysis
ANALYZE=true pnpm build    # Bundle analysis
pnpm test --coverage       # Coverage report

# Git
git diff                   # See changes
git status                 # Check status
git log --oneline          # See history
```

---

## 🆘 Troubleshooting

### "Sentry errors not showing"
1. Check `.env.local` has `NEXT_PUBLIC_SENTRY_DSN`
2. Check Sentry project is created
3. Check network tab in DevTools

### "SWR not caching"
1. Check request URL is identical
2. Check for trailing slashes
3. Check response headers for Cache-Control

### "Supabase connection failing"
1. Check URL and key in `.env.local`
2. Check internet connection
3. Check Supabase project is running
4. Check CORS settings

### "MediaPipe too slow"
1. Lower inference frequency (every Nth frame)
2. Reduce canvas resolution
3. Use web worker
4. Check browser DevTools Performance tab

---

## 📈 Success Metrics

### Phase 0 Complete
- [ ] Zero unhandled errors in console
- [ ] All user actions show toast feedback
- [ ] Invalid input caught and shown
- [ ] Page loads in <2s

### Phase 1 Complete
- [ ] Photos persist for 7 days
- [ ] Photo gallery works
- [ ] Analytics data flows to DB

### Phase 2 Complete
- [ ] Background blur toggles on/off
- [ ] Face detected and landmarks shown
- [ ] Stickers render on face

### Phase 3 Complete
- [ ] Dashboard shows daily stats
- [ ] Popular filters chart visible
- [ ] Events tracked in PostHog

---

## 🎓 Learning Resources

### Understanding Libraries
- Sentry: https://sentry.io/welcome
- MediaPipe: https://mediapipe.dev/solutions/guide
- PostHog: https://posthog.com/docs/getting-started

### Best Practices
- Error Handling: https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary
- Data Fetching: https://swr.vercel.app
- Web Workers: https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API

---

## 🎯 Priority Checklist

### Must Do
- [ ] Phase 0 (error handling)
- [ ] Phase 1 (persistence)

### Should Do
- [ ] Phase 3 (analytics)

### Nice to Have
- [ ] Phase 2 (effects)

### Test Suite (Optional)
- [ ] E2E tests (Playwright)
- [ ] Component tests
- [ ] Unit tests

---

## 📞 Quick Help

**Stuck on Phase 0?**
→ Read: `IMPLEMENTATION_CHECKLIST.md` → Phase 0 section

**Need library comparison?**
→ Read: `LIBRARY_COMPARISON.md` → Relevant category

**Want full plan?**
→ Read: `ENHANCEMENT_PLAN.md` → Full overview

**Need quick summary?**
→ Read: `EXECUTIVE_SUMMARY.md` → Decision section

---

## ⏰ Time Estimates

| Task | Estimate | Type |
|------|----------|------|
| Phase 0 | 3-4 days | Essential |
| Phase 1 | 4-5 days | Essential |
| Phase 2 | 4-5 days | Enhancement |
| Phase 3 | 4-5 days | Enhancement |
| **Total** | **15-19 days** | **~4 weeks** |

**With 1 developer working full-time**

---

## 🎊 Celebration Checkpoints

### After Phase 0
🎉 App is reliable and polished!

### After Phase 1
🎉 Photos persist and data flows!

### After Phase 2
🎉 Professional-grade effects!

### After Phase 3
🎉 Data-driven platform ready!

---

## 📝 Notes Section

```
Use this space for project-specific notes:

Week 1 Progress:
- [ ] Task 1 done
- [ ] Task 2 done
- [ ] Deployed Phase 0

Blockers:
- (none yet)

Learnings:
- (add as you go)
```

---

## 🎯 Final Checklist

Before starting:
- [ ] Read DOCUMENTATION_INDEX.md
- [ ] Read EXECUTIVE_SUMMARY.md
- [ ] Read IMPLEMENTATION_CHECKLIST.md
- [ ] Choose your starting point
- [ ] Set up 4 hours this week
- [ ] Install Phase 0 libraries
- [ ] Deploy first iteration

Good luck! 🚀

---

**Version**: 1.0  
**Last Updated**: May 15, 2026  
**Print-Friendly**: Yes ✅
