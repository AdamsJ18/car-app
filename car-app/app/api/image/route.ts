import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const title = request.nextUrl.searchParams.get('title')
  if (!title) return NextResponse.json({ error: 'no title' }, { status: 400 })

  try {
    const res = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&titles=${title}&prop=pageimages&format=json&pithumbsize=320`,
      { headers: { 'User-Agent': 'CARApp/1.0 (https://car-app-chi-eight.vercel.app)' } }
    )
    const data = await res.json()
    const pages = data?.query?.pages
    const page = pages?.[Object.keys(pages)[0]]
    const url = page?.thumbnail?.source
    if (!url) return NextResponse.json({ error: 'not found' }, { status: 404 })
    return NextResponse.json({ url })
  } catch {
    return NextResponse.json({ error: 'error' }, { status: 500 })
  }
}
