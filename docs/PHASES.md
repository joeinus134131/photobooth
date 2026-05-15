# Photobooth Platform — Roadmap & Checklist

Dokumen ini memetakan perbaikan/improvement ke **fase bertahap** agar mudah diprioritaskan dan dilacak progresnya.

**Legenda status:** `[ ]` belum · `[~]` sebagian · `[x]` selesai

**Terakhir diperbarui:** Phase 2 — UX acara & distribusi (2026-05-15)

---

## Progress ringkas

| Fase | Fokus | Progress |
|------|--------|----------|
| **1** | Core capture & kepercayaan output | 100% |
| **2** | UX acara & output (share, print, kiosk) | 100% |
| **3** | Computer vision (client-side) | 0% |
| **4** | Platform & bisnis (backend, admin, analytics) | 0% |

---

## Phase 1 — Core capture & output yang konsisten

**Tujuan:** Photobooth terasa “nyata” — preview = hasil foto, burst otomatis, kontrol strip, retake per slot.

| # | Item | Status | Catatan |
|---|------|--------|---------|
| 1.1 | Bake filter CSS ke hasil capture (WYSIWYG) | [x] | `captureVideoFrame` + `getFilterString` |
| 1.2 | Panel pengaturan: jumlah foto (2/3/4) | [x] | `SettingsControls` |
| 1.3 | Panel pengaturan: durasi countdown (3/4/5 detik) | [x] | `SettingsControls` |
| 1.4 | Panel pengaturan: jarak grid strip | [x] | `SettingsControls` |
| 1.5 | Panel pengaturan: ketebalan border | [x] | `SettingsControls` |
| 1.6 | Mode burst otomatis (capture berurutan) | [x] | Toggle `autoBurst` |
| 1.7 | Retake per slot (klik foto di strip) | [x] | `setPhotoAtIndex` + UI strip |
| 1.8 | Logika slot kosong / strip penuh yang benar | [x] | `getNextEmptySlot`, `isStripFull` |
| 1.9 | Preview filter pakai sample lokal (bukan picsum) | [x] | `/public/images/filter-preview.svg` |
| 1.10 | Texture/pattern lokal (tanpa CDN eksternal) | [x] | CSS patterns di `globals.css` |
| 1.11 | PWA manifest + metadata installable | [x] | `public/manifest.webmanifest` |
| 1.12 | Unit test: capture dengan filter | [x] | `__tests__/lib/camera-utils.test.ts` |
| 1.13 | Unit test: helper slot strip | [x] | `__tests__/lib/photo-strip-utils.test.ts` |

### Definition of done — Phase 1

- [x] User memilih filter → foto tersimpan dengan filter yang sama
- [x] User bisa atur 2/3/4 foto dan countdown dari UI
- [x] Burst otomatis mengisi strip tanpa menekan Capture berulang
- [x] User bisa klik slot untuk foto ulang slot itu saja
- [x] Aplikasi tidak bergantung pada `picsum.photos` / `transparenttextures.com` untuk fitur inti

---

## Phase 2 — UX acara & distribusi hasil

**Tujuan:** Siap dipakai di acara — fullscreen, review, share, cetak.

| # | Item | Status | Catatan |
|---|------|--------|---------|
| 2.1 | Flow `review` (layar review sebelum download) | [x] | `ReviewPhase` + `step: 'review'` |
| 2.2 | Mode kiosk / fullscreen (sembunyikan chrome) | [x] | `?kiosk=1` + layar Start + `RetroShell` |
| 2.3 | Konfigurasi event (logo, footer default, tema lock) | [x] | Query URL di `event-config.ts` |
| 2.4 | Web Share API + fallback download | [x] | `share-utils.ts` |
| 2.5 | QR code ke galeri / hasil (butuh upload) | [x] | API `/api/share` + `ShareQrPanel` |
| 2.6 | Preset cetak 2×6" + `@media print` | [x] | `print-utils.ts` + `@media print` |
| 2.7 | GIF / boomerang (3–4 frame cepat) | [x] | Mode boomerang + `gifenc` |
| 2.8 | Layout strip tambahan (2×2, horizontal) | [x] | `stripLayout` di Setup |
| 2.9 | Flash putih + audio cue 3-2-1 | [x] | `Countdown` + `useCountdownAudio` |
| 2.10 | Service worker / offline cache asset | [x] | `public/sw.js` |

### Definition of done — Phase 2

- [x] Satu sesi tamu: capture → review → share/print tanpa kebingungan
- [x] Bisa dijalankan di tablet booth (fullscreen, touch-friendly)

### URL event (contoh)

```
/?event=wedding&name=John+%26+Jane&footer=2025&kiosk=1&theme=neon&lockTheme=1&logo=https://example.com/logo.png
```

---

## Phase 3 — Computer vision (on-device)

**Tujuan:** Filter cerdas & engagement — diproses di browser (privasi).

| # | Item | Status | Catatan |
|---|------|--------|---------|
| 3.1 | Pipeline vision: worker + compositor WebGL/Canvas | [ ] | `lib/vision/` |
| 3.2 | Background blur (bokeh) | [ ] | MediaPipe Selfie Segmentation |
| 3.3 | Background replace (gambar/warna) | [ ] | |
| 3.4 | Face-aware crop / peringatan “masuk frame” | [ ] | Face Detection |
| 3.5 | AR stickers (landmark wajah) | [ ] | |
| 3.6 | Tab Effects di UI (Blur / Replace / Stickers) | [ ] | |
| 3.7 | Fallback ke CSS-only jika CV gagal | [ ] | |
| 3.8 | Label privasi “diproses di perangkat Anda” | [ ] | |
| 3.9 | Optimasi performa mobile (FPS, resolusi inference) | [ ] | |

### Definition of done — Phase 3

- [ ] Minimal 2 efek CV stabil di Chrome/Safari desktop + mobile modern
- [ ] Preview live ≥ 24 FPS di perangkat target acara

---

## Phase 4 — Platform, template & bisnis

**Tujuan:** Bukan sekadar app tunggal — platform untuk banyak acara & branding.

| # | Item | Status | Catatan |
|---|------|--------|---------|
| 4.1 | Backend API + storage (S3/R2) untuk hasil foto | [ ] | |
| 4.2 | Galeri per event (session ID + QR) | [ ] | |
| 4.3 | Upload frame PNG custom (template builder) | [ ] | |
| 4.4 | Embed mode / white-label iframe | [ ] | |
| 4.5 | Dashboard organizer (event, tema, analytics) | [ ] | |
| 4.6 | Auth organizer + multi-tenant | [ ] | |
| 4.7 | `TextOverlay` draggable di foto | [ ] | Interface sudah ada di store |
| 4.8 | Style transfer / model berat (opsional server) | [ ] | |

### Definition of done — Phase 4

- [ ] Organizer bisa buat event, branding, dan tamu mengakses galeri via QR

---

## Cara memakai checklist ini

1. Centang `[x]` di tabel saat item selesai di-merge/deploy.
2. Update baris **Progress ringkas** (perkiraan % per fase).
3. Tambahkan tanggal di **Terakhir diperbarui** saat mengubah status fase.
4. Jangan mulai fase berikutnya sebelum **Definition of done** fase aktif terpenuhi (kecuali sengaja di-skip).

---

## Referensi teknis (implementasi Phase 1)

| File | Peran |
|------|--------|
| `src/lib/camera-utils.ts` | Capture + bake filter |
| `src/lib/photo-strip-utils.ts` | Slot kosong / strip penuh |
| `src/components/editor/SettingsControls.tsx` | UI pengaturan strip |
| `src/store/usePhotoboothStore.ts` | `setPhotoAtIndex`, `autoBurst` |
| `src/app/page.tsx` | Burst, retake, capture flow |
| `src/components/editor/PhotoStrip.tsx` | Klik slot → retake |
| `docs/PHASES.md` | Dokumen ini |
