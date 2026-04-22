'use client'
import { useState } from 'react'

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
}

const countryFlag: { [key: string]: string } = {
  'イタリア': '🇮🇹', '日本': '🇯🇵', 'ドイツ': '🇩🇪',
  'イギリス': '🇬🇧', 'アメリカ': '🇺🇸', 'フランス': '🇫🇷', 'スウェーデン': '🇸🇪'
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

const countryColors: { [key: string]: { bg: string; color: string } } = {
  'イタリア': { bg: '#FFF0F0', color: '#E74C3C' },
  '日本': { bg: '#FFF0F5', color: '#E91E63' },
  'ドイツ': { bg: '#F0F4FF', color: '#3F51B5' },
  'イギリス': { bg: '#F0F8FF', color: '#2196F3' },
  'アメリカ': { bg: '#F0F4FF', color: '#1976D2' },
  'フランス': { bg: '#F5F0FF', color: '#673AB7' },
  'スウェーデン': { bg: '#FFFBF0', color: '#FF9800' },
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
    background: 'white',
    border: '2px solid #BAE0F7',
    borderRadius: 12,
    padding: '10px 16px',
    fontSize: 13,
    color: '#2C3E50',
    fontWeight: 600,
    cursor: 'pointer',
    outline: 'none',
  }

  return (
    <div>
      {/* 検索・フィルターエリア */}
      <div style={{
        background: 'white',
        borderRadius: 20,
        padding: '20px',
        boxShadow: '0 4px 20px rgba(75,163,211,0.12)',
        marginBottom: 24
      }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ flex: 1, minWidth: 200, position: 'relative' }}>
            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16 }}>🔍</span>
            <input
              type="text"
              placeholder="車名・メーカー・国で検索..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              style={{
                width: '100%',
                background: '#F8FAFB',
                border: '2px solid #BAE0F7',
                borderRadius: 12,
                padding: '10px 16px 10px 42px',
                fontSize: 13,
                color: '#2C3E50',
                fontWeight: 600,
                outline: 'none',
              }}
            />
          </div>
          <select value={selectedCountry} onChange={e => setSelectedCountry(e.target.value)} style={selectStyle}>
            <option value="">🌍 全ての国</option>
            {countries.map(c => (
              <option key={c} value={c}>{countryFlag[c]} {c}</option>
            ))}
          </select>
          <select value={sortKey} onChange={e => setSortKey(e.target.value as SortKey)} style={selectStyle}>
            {sortOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          {(query || selectedCountry) && (
            <button
              onClick={() => { setQuery(''); setSelectedCountry('') }}
              style={{
                background: '#F8FAFB',
                border: '2px solid #BAE0F7',
                borderRadius: 12,
                padding: '10px 16px',
                fontSize: 13,
                color: '#8BA4B5',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              ✕ クリア
            </button>
          )}
        </div>
        <p style={{ fontSize: 12, color: '#8BA4B5', marginTop: 10, marginBottom: 0 }}>
          <strong style={{ color: '#4BA3D3' }}>{sorted.length}件</strong>表示
          {query && <span style={{ marginLeft: 8, color: '#F5A623' }}>「{query}」の検索結果</span>}
          <span style={{ marginLeft: 8 }}>｜{sortOptions.find(o => o.value === sortKey)?.label}</span>
        </p>
      </div>

      {/* 車両リスト */}
      {sorted.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#8BA4B5' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🔍</div>
          <p style={{ fontSize: 18, fontWeight: 700 }}>「{query}」に一致する車両が見つかりませんでした</p>
          <p style={{ fontSize: 13, marginTop: 8 }}>別のキーワードで検索してみてください</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 16 }}>
          {sorted.map((v, i) => {
            const cc = countryColors[v.country] || { bg: '#F8FAFB', color: '#8BA4B5' }
            return (
              <a key={v.id} href={`/vehicle/${v.id}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: 'white',
                  borderRadius: 20,
                  overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(75,163,211,0.10)',
                  display: 'flex',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'
                    ;(e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 32px rgba(75,163,211,0.22)'
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'
                    ;(e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 20px rgba(75,163,211,0.10)'
                  }}
                >
                  {/* 左サイドバー */}
                  <div style={{
                    width: 120,
                    flexShrink: 0,
                    background: `linear-gradient(180deg, ${cc.bg}, white)`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px 12px',
                    borderRight: '2px dashed #E8F4FD',
                    gap: 8,
                  }}>
                    <div style={{
                      width: 56, height: 56,
                      background: cc.bg,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 28,
                      border: `2px solid ${cc.color}30`
                    }}>
                      🚗
                    </div>
                    <div style={{ fontSize: 24 }}>{countryFlag[v.country] || '🌍'}</div>
                    <div style={{
                      fontSize: 18, fontWeight: 900,
                      color: cc.color,
                      background: cc.bg,
                      padding: '2px 10px',
                      borderRadius: 99,
                    }}>
                      #{i + 1}
                    </div>
                  </div>

                  {/* メインコンテンツ */}
                  <div style={{ flex: 1, padding: '20px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                      <div>
                        <h3 style={{ fontSize: 17, fontWeight: 900, color: '#2C3E50', margin: 0 }}>{v.name_jp}</h3>
                        <p style={{ fontSize: 11, color: '#8BA4B5', margin: '2px 0 0' }}>{v.name_en}</p>
                      </div>
                      <span style={{
                        fontSize: 12, fontWeight: 700,
                        color: '#4BA3D3',
                        background: '#E8F4FD',
                        padding: '4px 12px',
                        borderRadius: 99,
                      }}>
                        詳細を見る →
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: 12, marginTop: 6, fontSize: 12, color: '#8BA4B5' }}>
                      <span>{v.maker}</span><span>·</span>
                      <span>{v.country}</span><span>·</span>
                      <span>{v.year_start}〜{v.year_end}年</span>
                    </div>

                    <p style={{ fontSize: 13, color: '#6B8A9A', marginTop: 8, lineHeight: 1.6, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {v.description}
                    </p>

                    {/* スコアバー */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 14 }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span style={{ fontSize: 11, color: '#8BA4B5', fontWeight: 600 }}>グローバル評価指数</span>
                          <span style={{ fontSize: 13, fontWeight: 900, color: '#F5A623' }}>{v.total_score}</span>
                        </div>
                        <div style={{ height: 8, borderRadius: 99, background: '#F0F9FF', overflow: 'hidden' }}>
                          <div style={{ height: '100%', borderRadius: 99, background: 'linear-gradient(90deg, #F5A623, #FFD700)', width: v.total_score + '%' }} />
                        </div>
                      </div>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span style={{ fontSize: 11, color: '#8BA4B5', fontWeight: 600 }}>🇯🇵 日本市場スコア</span>
                          <span style={{ fontSize: 13, fontWeight: 900, color: '#4BA3D3' }}>{v.japan_total_score}</span>
                        </div>
                        <div style={{ height: 8, borderRadius: 99, background: '#F0F9FF', overflow: 'hidden' }}>
                          <div style={{ height: '100%', borderRadius: 99, background: 'linear-gradient(90deg, #4BA3D3, #7BC8F0)', width: v.japan_total_score + '%' }} />
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 16, marginTop: 10, fontSize: 11, color: '#8BA4B5' }}>
                      <span>データ充足率：<strong style={{ color: '#4BA3D3' }}>{v.data_completeness}%</strong></span>
                      <span>AI参考価格：<strong style={{ color: '#F5A623' }}>{v.price_range_min_jpy ? formatPrice(v.price_range_min_jpy) + '〜' + formatPrice(v.price_range_max_jpy) : '調査中'}</strong></span>
                    </div>
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
