import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url')
  if (!url) return NextResponse.json({ error: 'no url' }, { status: 400 })

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'CARApp/1.0 (https://car-app-chi-eight.vercel.app; contact@example.com) Node.js',
        'Referer': 'https://en.wikipedia.org/',
        'Accept': 'image/webp,image/jpeg,image/*',
      }
    })
    if (!res.ok) return NextResponse.json({ error: 'fetch failed' }, { status: 404 })

    const buffer = await res.arrayBuffer()
    const contentType = res.headers.get('content-type') || 'image/jpeg'

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400',
      }
    })
  } catch {
    return NextResponse.json({ error: 'error' }, { status: 500 })
  }
}
