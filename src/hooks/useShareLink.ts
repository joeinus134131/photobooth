'use client';

import useSWR, { SWRConfiguration } from 'swr';
import { logger } from '@/lib/logger';

/**
 * Default fetcher function for SWR
 */
const fetcher = async (url: string) => {
  const res = await fetch(url);

  if (!res.ok) {
    logger.warn(`Fetch error: ${res.status} ${res.statusText}`, { url });
    throw new Error(`API error: ${res.status}`);
  }

  return res.json();
};

/**
 * Hook for sharing photos - fetches share links
 */
export function useShareLink(photoStripId?: string, options?: SWRConfiguration) {
  const { data, error, isLoading, mutate } = useSWR(
    photoStripId ? `/api/share/${photoStripId}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      ...options,
    }
  );

  return {
    shareLink: data,
    error,
    isLoading,
    mutate,
  };
}

/**
 * Hook for uploading photos
 */
export function useUploadPhoto(options?: SWRConfiguration) {
  const { mutate } = useSWR('/api/photos', fetcher, {
    revalidateOnFocus: false,
    ...options,
  });

  const upload = async (formData: FormData) => {
    try {
      logger.info('Uploading photo...');
      const res = await fetch('/api/photos', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Upload failed: ${res.status}`);
      }

      const data = await res.json();
      logger.info('Photo uploaded successfully', { photoId: data.id });

      // Revalidate the photos list
      mutate();

      return data;
    } catch (error) {
      logger.error('Photo upload failed', error);
      throw error;
    }
  };

  return { upload };
}

/**
 * Generic SWR hook with better error handling
 */
export function useAPI<T = any>(url: string | null, options?: SWRConfiguration) {
  const { data, error, isLoading, mutate } = useSWR<T>(url, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    dedupingInterval: 60000, // 1 minute
    focusThrottleInterval: 150000, // 2.5 minutes
    ...options,
  });

  return {
    data,
    error,
    isLoading,
    isError: !!error,
    mutate,
  };
}
