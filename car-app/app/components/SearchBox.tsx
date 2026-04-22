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

const vehicleEmoji: { [key: string]: string } = {
  'フェラーリ 250 GTO': '🔴',
  'トヨタ 2000GT': '⚪',
  'メルセデス・ベンツ 300SL': '⚫',
  'ポルシェ 911（930）ターボ': '🟡',
  'ランボルギーニ ミウーラ': '🟠',
  'ジャガー Eタイプ': '🟢',
  '日産 スカイライン GT-R（KPGC10）': '⚪',
  'アルファ・ロメオ ジュリア スプリント GTA': '🔴',
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
    case 'total_score':
      return arr.sort((a, b) => b.total_score - a.total_score)
    case 'japan_total_score':
      return arr.sort((a, b) => b.japan_total_score - a.japan_total_score)
    case 'price_asc':
      return arr.sort((a, b) => (a.price_range_min_jpy || 0) - (b.price_range_min_jpy || 0))
    case 'price_desc':
      return arr.sort((a, b) => (b.price_range_max_jpy || 0) - (a.price_range_max_jpy || 0))
    case 'year_asc':
      return arr.sort((a, b) => a.year_start - b.year_start)
    default:
      return arr
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

  return (
    <div>
      <div className="bg-[#1A1A1A] rounded-xl p-4 mb-6 border border-gray-800">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input
              type="text"
              placeholder="車名・メーカー・国で検索..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full bg-gray-900 text-white pl-9 pr-4 py-2.5 rounded-lg border border-gray-700 focus:border-[#C9A84C] focus:outline-none text-sm"
            />
          </div>
          <select
            value={selectedCountry}
            onChange={e => setSelectedCountry(e.target.value)}
            className="bg-gray-900 text-white px-4 py-2.5 rounded-lg border border-gray-700 focus:border-[#C9A84C] focus:outline-none text-sm"
          >
            <option value="">🌍 全ての国</option>
            {countries.map(c => (
              <option key={c} value={c}>{countryFlag[c]} {c}</option>
            ))}
          </select>
          <select
            value={sortKey}
            onChange={e => setSortKey(e.target.value as SortKey)}
            className="bg-gray-900 text-white px-4 py-2.5 rounded-lg border border-gray-700 focus:border-[#C9A84C] focus:outline-none text-sm"
          >
            {sortOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          {(query || selectedCountry) && (
            <button
              onClick={() => { setQuery(''); setSelectedCountry('') }}
              className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2.5 rounded-lg text-sm transition-colors"
            >
              クリア
            </button>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {sorted.length}件表示
          {query && <span className="ml-2 text-[#C9A84C]">「{query}」の検索結果</span>}
          <span className="ml-2 text-gray-600">｜{sortOptions.find(o => o.value === sortKey)?.label}</span>
        </p>
      </div>

      {sorted.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-4xl mb-4">🔍</p>
          <p className="text-lg">「{query}」に一致する車両が見つかりませんでした</p>
          <p className="text-sm mt-2">別のキーワードで検索してみてください</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {sorted.map((v, i) => (
            <a key={v.id} href={`/vehicle/${v.id}`}>
              <div className="bg-[#1A1A1A] rounded-xl overflow-hidden border border-gray-800 hover:border-[#C9A84C]/50 transition-all cursor-pointer">
                <div className="flex">
                  <div className="w-24 md:w-40 shrink-0 bg-gradient-to-br from-gray-800 to-gray-900 flex flex-col items-center justify-center gap-2 p-4">
                    <span className="text-4xl">{vehicleEmoji[v.name_jp] || '🚗'}</span>
                    <span className="text-2xl">{countryFlag[v.country] || '🌍'}</span>
                    <span className="text-xl font-bold text-[#C9A84C]">#{i + 1}</span>
                  </div>
                  <div className="flex-1 p-5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg font-bold text-white">{v.name_jp}</h3>
                      <span className="text-xs text-gray-500 ml-auto">詳細を見る →</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-400">
                      <span>{v.maker}</span><span>·</span>
                      <span>{v.country}</span><span>·</span>
                      <span>{v.year_start}〜{v.year_end}年</span>
                    </div>
                    <p className="text-sm text-gray-400 mt-2 line-clamp-1">{v.description}</p>
                    <div className="mt-3 grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">グローバル評価指数</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-800 rounded-full h-2">
                            <div className="bg-[#C9A84C] h-2 rounded-full" style={{ width: v.total_score + '%' }} />
                          </div>
                          <span className="text-sm font-bold text-[#C9A84C] w-8">{v.total_score}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">🇯🇵 日本市場スコア</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-gray-800 rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: v.japan_total_score + '%' }} />
                          </div>
                          <span className="text-sm font-bold text-blue-400 w-8">{v.japan_total_score}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      データ充足率：{v.data_completeness}%　|　AI参考価格：{v.price_range_min_jpy ? formatPrice(v.price_range_min_jpy) + '〜' + formatPrice(v.price_range_max_jpy) : '調査中'}
                    </div>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
