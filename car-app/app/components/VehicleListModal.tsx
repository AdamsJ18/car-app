'use client'
import { useState } from 'react'

type Vehicle = {
  id: string
  name_jp: string
  maker: string
  country: string
  year_start: number
  year_end: number
  total_score: number
  wikipedia_url?: string
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

const countries = ['日本', 'ドイツ', 'イタリア', 'イギリス', 'アメリカ', 'フランス', 'スウェーデン']

export default function VehicleListModal({ vehicles, totalCount }: { vehicles: Vehicle[], totalCount: number }) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)

  const grouped: Record<string, Vehicle[]> = {}
  countries.forEach(c => { grouped[c] = [] })
  vehicles.forEach(v => {
    if (grouped[v.country]) grouped[v.country].push(v)
  })

  const displayList = selectedCountry ? (grouped[selectedCountry] ?? []) : vehicles
  const sorted = [...displayList].sort((a, b) => b.total_score - a.total_score)
  const selectedCC = selectedCountry ? countryColors[selectedCountry] : null

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, padding: 0, width: '100%' }}
      >
        <div style={{ fontSize: 28, marginBottom: 4 }}>🚗</div>
        <div style={{ fontSize: 22, fontWeight: 900, color: '#4BA3D3' }}>{totalCount}台</div>
        <div style={{ fontSize: 11, color: '#8BA4B5' }}>登録車両数</div>
        <div style={{ fontSize: 10, color: '#4BA3D3', background: 'white', padding: '2px 8px', borderRadius: 99, marginTop: 2 }}>
          タップで一覧 →
        </div>
      </button>

      {isOpen && (
        <div
          onClick={e => { if (e.target === e.currentTarget) setIsOpen(false) }}
          style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(44,62,80,0.5)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', backdropFilter: 'blur(4px)' }}
        >
          <div style={{ background: 'white', borderRadius: '24px 24px 0 0', width: '100%', maxWidth: 680, height: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 -8px 40px rgba(44,62,80,0.2)' }}>

            {/* ヘッダー */}
            <div style={{ padding: '16px 20px 12px', borderBottom: '2px solid #E8F4FD', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 900, color: '#2C3E50', margin: 0 }}>🚗 登録車両一覧</h2>
                <p style={{ fontSize: 11, color: '#8BA4B5', margin: '2px 0 0' }}>全{totalCount}台 · 7カ国</p>
              </div>
              <button onClick={() => setIsOpen(false)} style={{ background: '#F8FAFB', border: '2px solid #BAE0F7', borderRadius: 10, width: 34, height: 34, fontSize: 14, cursor: 'pointer', color: '#8BA4B5', fontWeight: 700 }}>
                ✕
              </button>
            </div>

            {/* 国別タブ（横スクロール） */}
            <div style={{ flexShrink: 0, borderBottom: '2px solid #E8F4FD', overflowX: 'auto', overflowY: 'hidden' }}>
              <div style={{ display: 'flex', gap: 8, padding: '10px 16px', width: 'max-content' }}>
                <button
                  onClick={() => setSelectedCountry(null)}
                  style={{ padding: '6px 14px', borderRadius: 99, fontSize: 12, fontWeight: 700, cursor: 'pointer', border: 'none', whiteSpace: 'nowrap', background: selectedCountry === null ? '#4BA3D3' : '#F0F9FF', color: selectedCountry === null ? 'white' : '#8BA4B5' }}
                >
                  🌍 全て {totalCount}台
                </button>
                {countries.map(c => {
                  const cc = countryColors[c] ?? { bg: '#F8FAFB', color: '#8BA4B5' }
                  const count = grouped[c]?.length ?? 0
                  if (count === 0) return null
                  return (
                    <button
                      key={c}
                      onClick={() => setSelectedCountry(c)}
                      style={{ padding: '6px 14px', borderRadius: 99, fontSize: 12, fontWeight: 700, cursor: 'pointer', border: '2px solid ' + cc.color + '40', whiteSpace: 'nowrap', background: selectedCountry === c ? cc.color : cc.bg, color: selectedCountry === c ? 'white' : cc.color }}
                    >
                      {countryFlag[c]} {c} {count}台
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 選択中の国の情報 */}
            {selectedCountry && selectedCC && (
              <div style={{ padding: '8px 16px', background: selectedCC.bg, borderBottom: '1px solid ' + selectedCC.color + '20', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 18 }}>{countryFlag[selectedCountry?.trim()]}</span>
                <span style={{ fontSize: 13, fontWeight: 900, color: selectedCC.color }}>{selectedCountry}の名車</span>
                <span style={{ fontSize: 11, color: '#8BA4B5' }}>{grouped[selectedCountry]?.length ?? 0}台</span>
              </div>
            )}

            {/* 車両リスト */}
            <div style={{ overflowY: 'auto', flex: 1, padding: '12px 16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {sorted.map((v, i) => {
                  const cc = countryColors[v.country] ?? { bg: '#F8FAFB', color: '#8BA4B5' }
                  return (
                    <a key={v.id} href={'/vehicle/' + v.id} style={{ textDecoration: 'none', display: 'block' }} onClick={() => setIsOpen(false)}>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '32px 24px 1fr auto auto',
                        alignItems: 'center',
                        gap: 10,
                        padding: '12px 14px',
                        background: '#FAFCFF',
                        borderRadius: 14,
                        border: '1.5px solid #E8F4FD',
                        cursor: 'pointer',
                        width: '100%',
                        boxSizing: 'border-box'
                      }}>
                        {/* 順位 */}
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: cc.bg, color: cc.color, fontSize: 11, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          {i + 1}
                        </div>
                        {/* 国旗 */}
                        <span style={{ fontSize: 16, textAlign: 'center' }}>{countryFlag[v.country?.trim()]}</span>
                        {/* 車名 */}
                        <div style={{ minWidth: 0 }}>
                          <p style={{ fontSize: 14, fontWeight: 800, color: '#2C3E50', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.name_jp}</p>
                          <p style={{ fontSize: 11, color: '#8BA4B5', margin: 0 }}>{v.maker} · {v.year_start}〜{v.year_end}年</p>
                        </div>
                        {/* 車両参考画像 */}
                {v.wikipedia_url && <a href={v.wikipedia_url} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} style={{ fontSize: 11, color: '#4BA3D3', textDecoration: 'none' }}>🖼️ 車両参考画像</a>}
                {/* スコア */}
                        <div style={{ background: cc.bg, color: cc.color, padding: '3px 10px', borderRadius: 99, fontSize: 12, fontWeight: 900, whiteSpace: 'nowrap' }}>
                          {v.total_score}点
                        </div>
                        {/* 矢印 */}
                        <span style={{ fontSize: 12, color: '#4BA3D3' }}>→</span>
                      </div>
                    </a>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
