import { Suspense } from 'react'
import { RetroShell } from '@/components/layout/RetroShell'
import { PhotoboothClient } from '@/components/PhotoboothClient'

export default function Home() {
  return (
    <Suspense
      fallback={
        <RetroShell>
          <p className="text-center text-stone-500 animate-pulse py-20">Loading photobooth...</p>
        </RetroShell>
      }
    >
      <PhotoboothClient />
    </Suspense>
  )
}
