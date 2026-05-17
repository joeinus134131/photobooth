import { z } from 'zod';

/**
 * Photo data schema
 */
export const PhotoSchema = z.object({
  id: z.string().uuid().optional(),
  dataUrl: z.string().url(),
  timestamp: z.number(),
  filters: z.array(z.string()).optional(),
  thumbnail: z.string().url().optional(),
});

export type Photo = z.infer<typeof PhotoSchema>;

/**
 * Event configuration schema
 */
export const EventConfigSchema = z.object({
  eventName: z.string().min(1, 'Event name is required').max(100),
  eventDate: z.date().optional(),
  location: z.string().max(100).optional(),
  photosPerStrip: z.number().int().min(1).max(4).default(4),
  stripLayout: z.enum(['vertical', 'horizontal']).default('vertical'),
  theme: z.enum(['retro', 'modern', 'dark']).default('retro'),
});

export type EventConfig = z.infer<typeof EventConfigSchema>;

/**
 * Photo Strip metadata schema
 */
export const PhotoStripSchema = z.object({
  id: z.string().uuid().optional(),
  eventId: z.string().uuid().optional(),
  photos: z.array(PhotoSchema),
  createdAt: z.date().optional(),
  layout: z.enum(['vertical', 'horizontal']),
  theme: z.string().optional(),
});

export type PhotoStrip = z.infer<typeof PhotoStripSchema>;

/**
 * Share link schema for API
 */
export const ShareLinkSchema = z.object({
  id: z.string().uuid().optional(),
  photoStripId: z.string().uuid(),
  shareUrl: z.string().url().optional(),
  qrCode: z.string().optional(),
  expiresAt: z.date().optional(),
  createdAt: z.date().optional(),
  downloads: z.number().int().default(0),
});

export type ShareLink = z.infer<typeof ShareLinkSchema>;

/**
 * Share response from API
 */
export const ShareResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  shareLink: ShareLinkSchema.optional(),
});

export type ShareResponse = z.infer<typeof ShareResponseSchema>;

/**
 * Download request schema
 */
export const DownloadRequestSchema = z.object({
  format: z.enum(['png', 'jpg', 'pdf']).default('png'),
  quality: z.number().int().min(0.1).max(1).default(0.95),
});

export type DownloadRequest = z.infer<typeof DownloadRequestSchema>;

/**
 * Filter settings schema
 */
export const FilterSettingsSchema = z.object({
  type: z.enum(['grayscale', 'sepia', 'vintage', 'cool', 'warm', 'none']),
  intensity: z.number().min(0).max(1).default(1),
});

export type FilterSettings = z.infer<typeof FilterSettingsSchema>;

/**
 * Validation helpers
 */
export const validatePhoto = (data: unknown) => {
  return PhotoSchema.safeParse(data);
};

export const validateEventConfig = (data: unknown) => {
  return EventConfigSchema.safeParse(data);
};

export const validateShareResponse = (data: unknown) => {
  return ShareResponseSchema.safeParse(data);
};

export const validateDownloadRequest = (data: unknown) => {
  return DownloadRequestSchema.safeParse(data);
};
