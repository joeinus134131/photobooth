import { NextResponse } from 'next/server'
import { saveShareImage } from '@/lib/share-server'

const MAX_BYTES = 6 * 1024 * 1024 // ~6MB data URL cap

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { image?: string }
    const image = body.image

    if (!image || typeof image !== 'string' || !image.startsWith('data:image/')) {
      return NextResponse.json({ error: 'Invalid image payload' }, { status: 400 })
    }

    if (image.length > MAX_BYTES) {
      return NextResponse.json({ error: 'Image too large' }, { status: 413 })
    }

    const id = saveShareImage(image)
    const origin = request.headers.get('origin') || new URL(request.url).origin
    const url = `${origin}/share/${id}`

    return NextResponse.json({ id, url })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
