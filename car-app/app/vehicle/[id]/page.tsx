import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const countryFlag: { [key: string]: string } = {
  'イタリア': '🇮🇹', '日本': '🇯🇵', 'ドイツ': '🇩🇪',
  'イギリス': '🇬🇧', 'アメリカ': '🇺🇸', 'フランス': '🇫🇷', 'スウェーデン': '🇸🇪'
}

function formatPrice(yen: number): string {
  if (yen >= 100000000) {
    const oku = yen / 100000000
    const formatted = oku % 1 === 0 ? oku.toFixed(0) : oku.toFixed(1)
    return formatted + '億円'
  }
  return (yen / 10000).toLocaleString() + '万円'
}

export default async function VehiclePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data: v, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !v) return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center">
      <div className="text-center">
        <p className="text-2xl mb-4">車両が見つかりません</p>
        <Link href="/" className="text-[#C9A84C]">トップへ戻る</Link>
      </div>
    </div>
  )

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#F5F5F5]">
      <header className="border-b border-[#C9A84C]/30 p-6 flex items-center gap-4">
        <Link href="/" className="text-[#C9A84C] hover:text-white transition-colors">← 戻る</Link>
        <h1 className="text-2xl font-bold text-[#C9A84C]">🚗 CARアプリ</h1>
      </header>
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-[#1A1A1A] rounded-xl p-8 border border-gray-800">
          <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl">{countryFlag[v.country] || '🌍'}</span>
                <h2 className="text-3xl font-bold text-white">{v.name_jp}</h2>
              </div>
              <p className="text-gray-400">{v.name_en}</p>
              <div className="flex items-center gap-3 mt-2 text-sm text-gray-400">
                <span>{v.maker}</span><span>·</span>
                <span>{v.country}</span><span>·</span>
                <span>{v.year_start}〜{v.year_end}年</span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-[#C9A84C]">{v.total_score}</div>
              <div className="text-xs text-gray-400 mt-1">評価指数</div>
            </div>
          </div>

          <p className="text-gray-300 mb-8 leading-relaxed">{v.description}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-900 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-1">エンジン</p>
              <p className="text-white font-medium text-sm">{v.engine || '不明'}</p>
            </div>
            <div className="bg-gray-900 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-1">駆動方式</p>
              <p className="text-white font-medium text-sm">{v.drive_type || '不明'}</p>
            </div>
            <div className="bg-gray-900 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-1">生産台数</p>
              <p className="text-white font-medium text-sm">{v.production_count ? v.production_count.toLocaleString() + '台' : '不明'}</p>
            </div>
            <div className="bg-gray-900 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-1">ハンドル</p>
              <p className="text-white font-medium text-sm">{v.steering === 'right' ? '🔵 右ハンドル' : '🟠 左ハンドル'}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-900 rounded-xl p-6">
              <h3 className="text-lg font-bold text-[#C9A84C] mb-4">グローバル評価指数</h3>
              {[
                { label: '希少性', value: v.score_rarity, weight: '30%' },
                { label: '文化的価値', value: v.score_culture, weight: '25%' },
                { label: '維持性', value: v.score_maintenance, weight: '20%' },
                { label: '革新性', value: v.score_design, weight: '15%' },
                { label: '著名オーナー', value: v.score_owner, weight: '10%' },
              ].map((item) => (
                <div key={item.label} className="mb-3">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>{item.label} ({item.weight})</span>
                    <span className="text-[#C9A84C] font-bold">{item.value}</span>
                  </div>
                  <div className="bg-gray-800 rounded-full h-1.5">
                    <div className="bg-[#C9A84C] h-1.5 rounded-full" style={{ width: item.value + '%' }} />
                  </div>
                </div>
              ))}
              <div className="mt-4 pt-4 border-t border-gray-800 flex justify-between">
                <span className="text-white font-bold">総合スコア</span>
                <span className="text-2xl font-bold text-[#C9A84C]">{v.total_score}</span>
              </div>
            </div>

            <div className="bg-gray-900 rounded-xl p-6">
              <h3 className="text-lg font-bold text-blue-400 mb-4">🇯🇵 日本市場スコア</h3>
              {[
                { label: '国内流通実績', value: v.japan_score_distribution },
                { label: '車検適合性', value: v.japan_score_inspection },
                { label: '部品入手性', value: v.japan_score_parts },
                { label: '専門整備士', value: v.japan_score_mechanic },
              ].map((item) => (
                <div key={item.label} className="mb-3">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>{item.label}</span>
                    <span className="text-blue-400 font-bold">{item.value}</span>
                  </div>
                  <div className="bg-gray-800 rounded-full h-1.5">
                    <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: (item.value * 4) + '%' }} />
                  </div>
                </div>
              ))}
              <div className="mt-4 pt-4 border-t border-gray-800 flex justify-between">
                <span className="text-white font-bold">総合スコア</span>
                <span className="text-2xl font-bold text-blue-400">{v.japan_total_score}</span>
              </div>
              <div className="mt-3 text-xs text-gray-500">
                並行輸入難易度：{v.parallel_import_difficulty === 'easy' ? '易' : v.parallel_import_difficulty === 'medium' ? '中' : '難'}
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-bold text-[#C9A84C] mb-4">💰 AI参考価格レンジ</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">最低参考価格</p>
                <p className="text-2xl font-bold text-white">{v.price_range_min_jpy ? formatPrice(v.price_range_min_jpy) : '調査中'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">最高参考価格</p>
                <p className="text-2xl font-bold text-white">{v.price_range_max_jpy ? formatPrice(v.price_range_max_jpy) : '調査中'}</p>
              </div>
            </div>
            <p className="text-xs text-gray-600 mt-4">⚠️ この価格はAI参考レンジです。実際の価格は個体差により大きく異なります。投資判断には使用しないでください。</p>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-600">データ充足率：{v.data_completeness}%　|　本情報は参考目的のみです</p>
          </div>
        </div>
      </div>
    </main>
  )
}
