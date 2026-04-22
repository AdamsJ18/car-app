import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

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

function getScoreLabel(score: number): { label: string; color: string } {
  if (score >= 90) return { label: '非常に高い', color: 'text-yellow-400' }
  if (score >= 75) return { label: '高い', color: 'text-green-400' }
  if (score >= 60) return { label: '普通', color: 'text-blue-400' }
  if (score >= 45) return { label: 'やや低い', color: 'text-orange-400' }
  return { label: '低い', color: 'text-red-400' }
}

function getValuationComment(total: number): string {
  if (total >= 88) return '非常に高い評価指数です。希少性・文化的価値ともに突出しており、今後も価値の上昇が期待されます。コレクターズアイテムとして世界的に注目度が高く、長期的な資産価値の維持・向上が見込まれます。'
  if (total >= 80) return '高い評価指数です。市場での需要が安定しており、価値の維持が期待できます。希少性または文化的価値が高く、クラシックカー市場での地位が確立されています。'
  if (total >= 70) return '平均以上の評価指数です。一定のコレクター需要があり、適切なメンテナンスを行うことで価値の維持が期待できます。市場への露出が増えることで評価が上昇する可能性があります。'
  if (total >= 60) return '平均的な評価指数です。維持コストと価値のバランスを考慮した判断が必要です。状態の良い個体は希少性が高まる可能性があります。'
  return 'やや低い評価指数です。維持コストが価値を上回る可能性があります。ただし個人的な楽しみや趣味としての価値は別途存在します。'
}

function getJapanComment(japanScore: number, difficulty: string): string {
  const diffNote = difficulty === 'easy' ? '並行輸入の実績が豊富で手続きが比較的容易です。' : difficulty === 'medium' ? '並行輸入には専門業者への相談が推奨されます。' : '並行輸入の実績が少なく専門知識が必要です。'
  if (japanScore >= 80) return diffNote + '国内に専門整備士や部品供給網が整っており、長期所有に適しています。'
  if (japanScore >= 60) return diffNote + '専門ショップへの相談を推奨します。'
  return diffNote + '購入前に必ず専門家への相談をお勧めします。'
}

export default async function VehiclePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const { data: v, error } = await supabase.from('vehicles').select('*').eq('id', id).single()
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

          {/* ヘッダー */}
          <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl">{countryFlag[v.country] || '🌍'}</span>
                <h2 className="text-3xl font-bold text-white">{v.name_jp}</h2>
              </div>
              <p className="text-gray-400">{v.name_en}</p>
              <div className="flex items-center gap-3 mt-2 text-sm text-gray-400">
                <span>{v.maker}</span><span>·</span><span>{v.country}</span><span>·</span><span>{v.year_start}〜{v.year_end}年</span>
              </div>
            </div>
            <div className="text-center bg-gray-900 rounded-xl p-4">
              <div className="text-5xl font-bold text-[#C9A84C]">{v.total_score}</div>
              <div className="text-xs text-gray-400 mt-1">総合評価指数</div>
              <div className={`text-sm font-bold mt-1 ${getScoreLabel(v.total_score).color}`}>{getScoreLabel(v.total_score).label}</div>
            </div>
          </div>

          <p className="text-gray-300 mb-8 leading-relaxed">{v.description}</p>

          {/* スペック */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {[
              { label: 'エンジン', value: v.engine || '不明' },
              { label: '駆動方式', value: v.drive_type || '不明' },
              { label: '生産台数', value: v.production_count ? v.production_count.toLocaleString() + '台' : '不明' },
            ].map(item => (
              <div key={item.label} className="bg-gray-900 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                <p className="text-white font-medium text-sm">{item.value}</p>
              </div>
            ))}
          </div>

          {/* グローバル評価指数 */}
          <div className="bg-gray-900 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-[#C9A84C]">グローバル評価指数</h3>
              <span className="text-3xl font-bold text-[#C9A84C]">{v.total_score}<span className="text-sm text-gray-400">/100</span></span>
            </div>
            <p className="text-xs text-gray-500 mb-5">5つの指標を重み付けして算出したAI参考評価スコアです。スコアが高いほど希少性・文化的価値・維持性に優れています。</p>
            <div className="space-y-5">
              {[
                { label: '希少性', value: v.score_rarity, weight: '30%', desc: '生産台数・現存台数から算出。生産台数が少なく現存数が少ないほど高スコア。クラシックカー市場で最も価値に直結する指標。' },
                { label: '文化的価値', value: v.score_culture, weight: '25%', desc: '歴史的背景・受賞歴・映画や音楽との関連・レース戦績から算出。時代を超えた影響力を持つモデルほど高スコア。' },
                { label: '維持性', value: v.score_maintenance, weight: '20%', desc: '部品供給・整備のしやすさ・技術情報の充実度から算出。現実的に所有・維持できるかどうかを評価。' },
                { label: '革新性', value: v.score_design, weight: '15%', desc: 'デザインの独自性・技術的革新性・時代への影響力から算出。業界に与えた影響が大きいほど高スコア。' },
                { label: '著名オーナー・受賞歴', value: v.score_owner, weight: '10%', desc: '著名人の所有歴・主要な賞の受賞歴から算出。コレクター需要に影響する指標。' },
              ].map(item => (
                <div key={item.label}>
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-white font-medium">{item.label}</span>
                      <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full">重み {item.weight}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs ${getScoreLabel(item.value).color}`}>{getScoreLabel(item.value).label}</span>
                      <span className="text-[#C9A84C] font-bold w-8 text-right">{item.value}</span>
                    </div>
                  </div>
                  <div className="bg-gray-800 rounded-full h-2 mb-1">
                    <div className="bg-[#C9A84C] h-2 rounded-full" style={{ width: item.value + '%' }} />
                  </div>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-800">
              <div className="flex justify-between items-center mb-3">
                <span className="text-white font-bold">総合評価指数</span>
                <span className="text-2xl font-bold text-[#C9A84C]">{v.total_score}/100</span>
              </div>
              <div className="bg-[#C9A84C]/10 border border-[#C9A84C]/30 rounded-lg p-4">
                <p className="text-xs text-[#C9A84C] font-bold mb-1">🤖 AI総合判定</p>
                <p className="text-sm text-gray-300 leading-relaxed">{getValuationComment(v.total_score)}</p>
              </div>
              <p className="text-xs text-gray-600 mt-2">※ このスコアはAI参考評価です。データ充足率：{v.data_completeness}%</p>
            </div>
          </div>

          {/* 日本市場スコア */}
          <div className="bg-gray-900 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-blue-400">🇯🇵 日本市場スコア</h3>
              <span className="text-3xl font-bold text-blue-400">{v.japan_total_score}<span className="text-sm text-gray-400">/100</span></span>
            </div>
            <p className="text-xs text-gray-500 mb-5">日本国内での購入・維持・登録のしやすさを評価した独立スコアです。グローバル評価指数とは別軸の指標です。</p>
            <div className="space-y-5">
              {[
                { label: '国内流通実績', value: v.japan_score_distribution, desc: '国内での正規販売歴・並行輸入の実績から算出。流通実績が多いほど専門知識・部品・整備士が充実しやすい。' },
                { label: '車検適合難易度', value: v.japan_score_inspection, desc: '日本の保安基準への適合しやすさから算出。スコアが高いほど車検が通りやすく追加費用が少ない。' },
                { label: '部品入手性（国内）', value: v.japan_score_parts, desc: '国内での部品調達のしやすさから算出。スコアが低いほど海外輸入に頼る必要があり維持コストが増加。' },
                { label: '専門整備士の国内存在', value: v.japan_score_mechanic, desc: '国内に専門整備できるショップが存在するかどうかを評価。スコアが低いほど整備に苦労する可能性がある。' },
              ].map(item => (
                <div key={item.label}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm text-white font-medium">{item.label}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs ${getScoreLabel(item.value).color}`}>{getScoreLabel(item.value).label}</span>
                      <span className="text-blue-400 font-bold w-8 text-right">{item.value}</span>
                    </div>
                  </div>
                  <div className="bg-gray-800 rounded-full h-2 mb-1">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: (item.value * 4) + '%' }} />
                  </div>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-800">
              <div className="flex justify-between items-center mb-3">
                <span className="text-white font-bold">日本市場総合スコア</span>
                <span className="text-2xl font-bold text-blue-400">{v.japan_total_score}/100</span>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs text-gray-400">並行輸入難易度：</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${v.parallel_import_difficulty === 'easy' ? 'bg-green-900/50 text-green-400' : v.parallel_import_difficulty === 'medium' ? 'bg-yellow-900/50 text-yellow-400' : 'bg-red-900/50 text-red-400'}`}>
                  {v.parallel_import_difficulty === 'easy' ? '易（手続きが比較的容易）' : v.parallel_import_difficulty === 'medium' ? '中（専門業者推奨）' : '難（高度な専門知識が必要）'}
                </span>
              </div>
              <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                <p className="text-xs text-blue-400 font-bold mb-1">🇯🇵 日本市場判定</p>
                <p className="text-sm text-gray-300 leading-relaxed">{getJapanComment(v.japan_total_score, v.parallel_import_difficulty)}</p>
              </div>
            </div>
          </div>

          {/* AI参考価格 */}
          <div className="bg-gray-900 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-bold text-[#C9A84C] mb-2">💰 AI参考価格レンジ</h3>
            <p className="text-xs text-gray-500 mb-4">生産台数・希少性・文化的価値・市場トレンドをもとにAIが算出した参考価格です。</p>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-800 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">最低参考価格</p>
                <p className="text-2xl font-bold text-white">{v.price_range_min_jpy ? formatPrice(v.price_range_min_jpy) : '調査中'}</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">最高参考価格</p>
                <p className="text-2xl font-bold text-white">{v.price_range_max_jpy ? formatPrice(v.price_range_max_jpy) : '調査中'}</p>
              </div>
            </div>
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3">
              <p className="text-xs text-yellow-400">⚠️ 重要な注意事項</p>
              <p className="text-xs text-gray-400 mt-1">同一車種・同一年式でも走行距離・修復歴・オリジナリティ・コンディションにより価格が2〜3倍以上異なるケースがあります。必ず専門家の査定を受けてください。この価格は投資判断に使用しないでください。</p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-600">データ充足率：{v.data_completeness}%　|　本情報は参考目的のみです　|　AI生成コンテンツを含みます</p>
          </div>
        </div>
      </div>
    </main>
  )
}
