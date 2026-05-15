import { NextResponse } from 'next/server'
import { getShareImage } from '@/lib/share-server'

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params
  const dataUrl = getShareImage(id)

  if (!dataUrl) {
    return NextResponse.json({ error: 'Not found or expired' }, { status: 404 })
  }

  return NextResponse.json({ image: dataUrl })
}
