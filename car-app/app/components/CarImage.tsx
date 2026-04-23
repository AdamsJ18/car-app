'use client'
import { useState, useEffect } from 'react'

export default function CarImage({ imageUrl, name, fallbackEmoji }: { imageUrl: string | null, name: string, fallbackEmoji: string }) {
  const [src, setSrc] = useState<string | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!imageUrl) return
    if (imageUrl.includes('api.php')) {
      const title = new URLSearchParams(imageUrl.split('?')[1]).get('titles')
      fetch('/api/image?title=' + title)
        .then(r => r.json())
        .then(data => {
          if (data.url) setSrc(data.url)
          else setError(true)
        })
        .catch(() => setError(true))
    } else {
      setSrc(imageUrl)
    }
  }, [imageUrl])

  if (!imageUrl || error || !src) {
    return (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
        <span style={{ fontSize: 36 }}>{fallbackEmoji}</span>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={name}
      style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}
      onError={() => setError(true)}
    />
  )
}
