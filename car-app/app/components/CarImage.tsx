'use client'
import { useState } from 'react'

export default function CarImage({ imageUrl, name, fallbackEmoji }: { imageUrl: string | null, name: string, fallbackEmoji: string }) {
  const [error, setError] = useState(false)

  if (!imageUrl || error) {
    return (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
        <span style={{ fontSize: 36 }}>{fallbackEmoji}</span>
      </div>
    )
  }

  return (
    <img
      src={imageUrl}
      alt={name}
      style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }}
      onError={() => setError(true)}
    />
  )
}
