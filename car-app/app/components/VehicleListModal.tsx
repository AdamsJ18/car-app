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
}

const countryFlag: { [key: string]: string } = {
  'イタリア': '🇮🇹', '日本': '🇯🇵', 'ドイツ': '🇩🇪',
  'イギリス': '🇬🇧', 'アメリカ': '🇺🇸', 'フランス': '🇫🇷', 'スウェーデン': '🇸🇪'
}

const countryColors: { [key: string]: { bg: string; color: string; border: string } } = {
  'イタリア': { bg: '#FFF0F0', color: '#E74C3C', border: '#FFCDD2' },
  '日本': { bg: '#FFF0F5', color: '#E91E63', border: '#F8BBD0' },
  'ドイツ': { bg: '#F0F4FF', color: '#3F51B5', border: '#C5CAE9' },
  'イギリス': { bg: '#F0F8FF', color: '#2196F3', border: '#BBDEFB' },
  'アメリカ': { bg: '#F0F4FF', color: '#1976D2', border: '#BBDEFB' },
  'フランス': { bg: '#F5F0FF', color: '#673AB7', border: '#D1C4E9' },
  'スウェーデン': { bg: '#FFFBF0', color: '#FF9800', border: '#FFE0B2' },
}

export default function VehicleListModal({ vehicles, totalCount }: { vehicles: Vehicle[], totalCount: number }) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)

  const countries = ['日本', 'ドイツ', 'イタリア', 'イギリス', 'アメリカ', 'フランス', 'スウェーデン']

  const grouped: { [key: string]: Vehicle[] } = {}
  countries.forEach(function(c) { grouped[c] = [] })
  vehicles.forEach(function(v) {
    if (grouped[v.country]) {
      grouped[v.country].push(v)
    } else {
      grouped[v.country] = [v]
    }
  })

  const displayList = selectedCountry ? (grouped[selectedCountry] || []) : vehicles

  return (
    <>
      <button
        onClick={function() { setIsOpen(true) }}
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
          onClick={function(e) { if (e.target === e.currentTarget) { setIsOpen(false) } }}
          style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(44,62,80,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, backdropFilter: 'blur(4px)' }}
        >
          <div style={{ background: 'white', borderRadius: 24, width: '100%', maxWidth: 680, maxHeight: '85vh', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 60px rgba(44,62,80,0.3)' }}>

            <div style={{ padding: '20px 24px 16px', borderBottom: '2px solid #E8F4FD', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 900, color: '#2C3E50', margin: 0 }}>🚗 登録車両一覧</h2>
                <p style={{ fontSize: 12, color: '#8BA4B5', margin: '4px 0 0' }}>全{totalCount}台 · 7カ国のクラシックカー</p>
              </div>
              <button
                onClick={function() { setIsOpen(false) }}
                style={{ background: '#F8FAFB', border: '2px solid #BAE0F7', borderRadius: 12, width: 36, height: 36, fontSize: 16, cursor: 'pointer', color: '#8BA4B5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: '12px 24px', borderBottom: '2px solid #E8F4FD', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button
                onClick={function() { setSelectedCountry(null) }}
                style={{ padding: '6px 14px', borderRadius: 99, fontSize: 12, fontWeight: 700, cursor: 'pointer', border: 'none', background: selectedCountry === null ? '#4BA3D3' : '#F0F9FF', color: selectedCountry === null ? 'white' : '#8BA4B5' }}
              >
                🌍 全て（{totalCount}台）
              </button>
              {countries.map(function(c) {
                const cc = countryColors[c] || { bg: '#F8FAFB', color: '#8BA4B5', border: '#E0E0E0' }
                const count = grouped[c] ? grouped[c].length : 0
                if (count === 0) return null
                return (
                  <button
                    key={c}
                    onClick={function() { setSelectedCountry(c) }}
                    style={{ padding: '6px 14px', borderRadius: 99, fontSize: 12, fontWeight: 700, cursor: 'pointer', border: '2px solid ' + (selectedCountry === c ? cc.color : cc.border), background: selectedCountry === c ? cc.color : cc.bg, color: selectedCountry === c ? 'white' : cc.color }}
                  >
                    {countryFlag[c]} {c}（{count}台）
                  </button>
                )
              })}
            </div>

            <div style={{ overflowY: 'auto', flex: 1, padding: '16px 24px' }}>
              {selectedCountry && (
                <div style={{ marginBottom: 16, padding: '12px 16px', background: countryColors[selectedCountry] ? countryColors[selectedCountry].bg : '#F8FAFB', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 28 }}>{countryFlag[selectedCountry]}</span>
                  <div>
                    <p style={{ fontSize: 16, fontWeight: 900, color: countryColors[selectedCountry] ? countryColors[selectedCountry].color : '#333', margin: 0 }}>{selectedCountry}の名車</p>
                    <p style={{ fontSize: 12, color: '#8BA4B5', margin: 0 }}>{grouped[selectedCountry] ? grouped[selectedCountry].length : 0}台登録</p>
                  </div>
                </div>
              )}

              <div style={{ display: 'grid', gap: 8 }}>
                {displayList.slice().sort(function(a, b) { return b.total_score - a.total_score }).map(function(v, i) {
                  const cc = countryColors[v.country] || { bg: '#F8FAFB', color: '#8BA4B5', border: '#E0E0E0' }
                  return (
                    
                      key={v.id}
                      href={'/vehicle/' + v.id}
                      style={{ textDecoration: 'none' }}
                      onClick={function() { setIsOpen(false) }}
                    >
                      <div
                        style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: '#FAFCFF', borderRadius: 12, border: '1.5px solid #E8F4FD', cursor: 'pointer' }}
                      >
                        <div style={{ width: 28, height: 28, borderRadius: '50%', background: cc.bg, color: cc.color, fontSize: 11, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {i + 1}
                        </div>
                        <span style={{ fontSize: 18, flexShrink: 0 }}>{countryFlag[v.country]}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: 14, fontWeight: 800, color: '#2C3E50', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.name_jp}</p>
                          <p style={{ fontSize: 11, color: '#8BA4B5', margin: 0 }}>{v.maker} · {v.year_start}〜{v.year_end}年</p>
                        </div>
                        <div style={{ background: cc.bg, color: cc.color, padding: '4px 10px', borderRadius: 99, fontSize: 13, fontWeight: 900, flexShrink: 0 }}>
                          {v.total_score}点
                        </div>
                        <span style={{ fontSize: 12, color: '#4BA3D3', flexShrink: 0 }}>→</span>
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
