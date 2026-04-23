'use client'
import { useState } from 'react'
import CarImage from './CarImage'

type Vehicle = {
  id: string
  name_jp: string
  name_en: string
  maker: string
  country: string
  year_start: number
  year_end: number
  description: string
  total_score: number
  japan_total_score: number
  data_completeness: number
  steering: string
  price_range_min_jpy: number
  price_range_max_jpy: number
  image_url: string | null
}

const countryFlag: Record<string, string> = {
  'イタリア': '🇮🇹', '日本': '🇯🇵', 'ドイツ': '🇩🇪',
  'イギリス': '🇬🇧', 'アメリカ': '🇺🇸', 'フランス': '🇫🇷', 'スウェーデン': '🇸🇪'
}

const countryColors: Record<string, { bg: string; color: string }> = {
  'イタリア': { bg: '#FFF0F0', color: '#E74C3C' },
  '日本': { bg: '#FFF0F5', color: '#E91E63' },
  'ドイツ': { bg: '#F0F4FF', color: '#3F51B5' },
  'イギリス': { bg: '#F0F8FF', color: '#2196F3' },
  'アメリカ': { bg: '#F0F4FF', color: '#1976D2' },
  'フランス': { bg: '#F5F0FF', color: '#673AB7' },
  'スウェーデン': { bg: '#FFFBF0', color: '#FF9800' },
}

function formatPrice(yen: number): string {
  if (yen >= 100000000) {
    const oku = yen / 100000000
    return (oku % 1 === 0 ? oku.toFixed(0) : oku.toFixed(1)) + '億円'
  }
  return (yen / 10000).toLocaleString() + '万円'
}

type SortKey = 'total_score' | 'japan_total_score' | 'price_asc' | 'price_desc' | 'year_asc'

const sortOptions: { value: SortKey; label: string }[] = [
  { value: 'total_score', label: '🏆 評価指数が高い順' },
  { value: 'japan_total_score', label: '🇯🇵 日本市場スコアが高い順' },
  { value: 'price_asc', label: '💰 価格が安い順' },
  { value: 'price_desc', label: '💎 価格が高い順' },
  { value: 'year_asc', label: '📅 生産年が古い順' },
]

function sortVehicles(vehicles: Vehicle[], sortKey: SortKey): Vehicle[] {
  const arr = [...vehicles]
  switch (sortKey) {
    case 'total_score': return arr.sort((a, b) => b.total_score - a.total_score)
    case 'japan_total_score': return arr.sort((a, b) => b.japan_total_score - a.japan_total_score)
    case 'price_asc': return arr.sort((a, b) => (a.price_range_min_jpy || 0) - (b.price_range_min_jpy || 0))
    case 'price_desc': return arr.sort((a, b) => (b.price_range_max_jpy || 0) - (a.price_range_max_jpy || 0))
    case 'year_asc': return arr.sort((a, b) => a.year_start - b.year_start)
    default: return arr
  }
}

export default function SearchBox({ vehicles }: { vehicles: Vehicle[] }) {
  const [query, setQuery] = useState('')
  const [selectedCountry, setSelectedCountry] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('total_score')

  const countries = ['イタリア', '日本', 'ドイツ', 'イギリス', 'アメリカ', 'フランス', 'スウェーデン']

  const filtered = vehicles.filter(v => {
    const q = query.toLowerCase()
    const matchQuery = q === '' ||
      v.name_jp.toLowerCase().includes(q) ||
      v.name_en.toLowerCase().includes(q) ||
      v.maker.toLowerCase().includes(q) ||
      v.country.toLowerCase().includes(q)
    const matchCountry = selectedCountry === '' || v.country === selectedCountry
    return matchQuery && matchCountry
  })

  const sorted = sortVehicles(filtered, sortKey)

  const selectStyle = {
    background: 'white', border: '2px solid #BAE0F7', borderRadius: 12,
    padding: '10px 16px', fontSize: 13, color: '#2C3E50', fontWeight: 600,
    cursor: 'pointer', outline: 'none',
  }

  return (
    <div>
      <div style={{ background: 'white', borderRadius: 20, padding: '16px', boxShadow: '0 4px 20px rgba(75,163,211,0.12)', marginBottom: 20 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          <div style={{ flex: 1, minWidth: 180, position: 'relative' }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 14 }}>🔍</span>
            <input
              type="text"
              placeholder="車名・メーカー・国で検索..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              style={{ width: '100%', background: '#F8FAFB', border: '2px solid #BAE0F7', borderRadius: 12, padding: '10px 12px 10px 36px', fontSize: 13, color: '#2C3E50', fontWeight: 600, outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <select value={selectedCountry} onChange={e => setSelectedCountry(e.target.value)} style={selectStyle}>
            <option value="">🌍 全ての国</option>
            {countries.map(c => <option key={c} value={c}>{countryFlag[c]} {c}</option>)}
          </select>
          <select value={sortKey} onChange={e => setSortKey(e.target.value as SortKey)} style={selectStyle}>
            {sortOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
          {(query || selectedCountry) && (
            <button onClick={() => { setQuery(''); setSelectedCountry('') }} style={{ background: '#F8FAFB', border: '2px solid #BAE0F7', borderRadius: 12, padding: '10px 14px', fontSize: 13, color: '#8BA4B5', fontWeight: 700, cursor: 'pointer' }}>✕</button>
          )}
        </div>
        <p style={{ fontSize: 12, color: '#8BA4B5', marginTop: 8, marginBottom: 0 }}>
          <strong style={{ color: '#4BA3D3' }}>{sorted.length}件</strong>表示
          {query && <span style={{ marginLeft: 8, color: '#F5A623' }}>「{query}」</span>}
          <span style={{ marginLeft: 8 }}>｜{sortOptions.find(o => o.value === sortKey)?.label}</span>
        </p>
      </div>

      {sorted.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#8BA4B5' }}>
          <div style={{ fontSize: 56, marginBottom: 12 }}>🔍</div>
          <p style={{ fontSize: 16, fontWeight: 700 }}>「{query}」に一致する車両が見つかりませんでした</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {sorted.map((v, i) => {
            const cc = countryColors[v.country] || { bg: '#F8FAFB', color: '#8BA4B5' }
            return (
              <a key={v.id} href={`/vehicle/${v.id}`} style={{ textDecoration: 'none', display: 'block' }}>
                <div style={{ background: 'white', borderRadius: 20, overflow: 'hidden', boxShadow: '0 4px 16px rgba(75,163,211,0.10)', display: 'flex', cursor: 'pointer' }}>

                  {/* 左：画像エリア */}
                  <div style={{ width: 120, flexShrink: 0, position: 'relative', background: cc.bg, minHeight: 110, overflow: 'hidden' }}>
                    <CarImage
                      imageUrl={v.image_url}
                      name={v.name_jp}
                      fallbackEmoji={countryFlag[v.country] || '🚗'}
                    />
                    <div style={{ position: 'absolute', top: 8, left: 8, background: 'rgba(255,255,255,0.92)', borderRadius: 99, width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 900, color: cc.color, boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}>
                      {i + 1}
                    </div>
                  </div>

                  {/* 右：情報エリア */}
                  <div style={{ flex: 1, padding: '14px 16px', minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                      <div style={{ minWidth: 0 }}>
                        <h3 style={{ fontSize: 15, fontWeight: 900, color: '#2C3E50', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.name_jp}</h3>
                        <p style={{ fontSize: 11, color: '#8BA4B5', margin: '2px 0 0' }}>{v.maker} · {v.country} · {v.year_start}〜{v.year_end}年</p>
                      </div>
                      <span style={{ fontSize: 11, color: '#4BA3D3', background: '#E8F4FD', padding: '3px 10px', borderRadius: 99, flexShrink: 0, fontWeight: 700 }}>詳細→</span>
                    </div>

                    <p style={{ fontSize: 12, color: '#6B8A9A', margin: '8px 0', lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any }}>
                      {v.description}
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                          <span style={{ fontSize: 10, color: '#8BA4B5' }}>評価指数</span>
                          <span style={{ fontSize: 12, fontWeight: 900, color: '#F5A623' }}>{v.total_score}</span>
                        </div>
                        <div style={{ height: 6, borderRadius: 99, background: '#FFF3CD', overflow: 'hidden' }}>
                          <div style={{ height: '100%', borderRadius: 99, background: 'linear-gradient(90deg, #F5A623, #FFD700)', width: v.total_score + '%' }} />
                        </div>
                      </div>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                          <span style={{ fontSize: 10, color: '#8BA4B5' }}>🇯🇵 日本市場</span>
                          <span style={{ fontSize: 12, fontWeight: 900, color: '#4BA3D3' }}>{v.japan_total_score}</span>
                        </div>
                        <div style={{ height: 6, borderRadius: 99, background: '#E8F4FD', overflow: 'hidden' }}>
                          <div style={{ height: '100%', borderRadius: 99, background: 'linear-gradient(90deg, #4BA3D3, #7BC8F0)', width: v.japan_total_score + '%' }} />
                        </div>
                      </div>
                    </div>

                    <p style={{ fontSize: 10, color: '#8BA4B5', margin: '6px 0 0' }}>
                      AI参考価格：<strong style={{ color: '#F5A623' }}>{v.price_range_min_jpy ? formatPrice(v.price_range_min_jpy) + '〜' + formatPrice(v.price_range_max_jpy) : '調査中'}</strong>
                    </p>
                  </div>
                </div>
              </a>
            )
          })}
        </div>
      )}
    </div>
  )
}
