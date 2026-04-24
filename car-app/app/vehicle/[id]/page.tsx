import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

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

function getScoreLabel(score: number): { label: string; color: string } {
  if (score >= 90) return { label: '非常に高い', color: '#F5A623' }
  if (score >= 75) return { label: '高い', color: '#4CAF82' }
  if (score >= 60) return { label: '普通', color: '#4BA3D3' }
  if (score >= 45) return { label: 'やや低い', color: '#FF9800' }
  return { label: '低い', color: '#E74C3C' }
}

function getValuationComment(total: number): string {
  if (total >= 88) return '非常に高い評価指数です。希少性・文化的価値ともに突出しており、今後も価値の上昇が期待されます。コレクターズアイテムとして世界的に注目度が高く、長期的な資産価値の維持・向上が見込まれます。'
  if (total >= 80) return '高い評価指数です。市場での需要が安定しており、価値の維持が期待できます。希少性または文化的価値が高く、クラシックカー市場での地位が確立されています。'
  if (total >= 70) return '平均以上の評価指数です。一定のコレクター需要があり、適切なメンテナンスを行うことで価値の維持が期待できます。'
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
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #E8F4FD, #F0F9FF)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: 22, color: '#2C3E50' }}>車両が見つかりません</p>
        <Link href="/" style={{ color: '#4BA3D3', textDecoration: 'none', fontWeight: 700 }}>← トップへ戻る</Link>
      </div>
    </div>
  )

  const cc = countryColors[v.country] ?? { bg: '#F8FAFB', color: '#4BA3D3' }

  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #E8F4FD 0%, #F0F9FF 50%, #E8F8F0 100%)' }}>

      {/* ヘッダー */}
      <header style={{ background: 'white', borderBottom: '3px solid #BAE0F7', padding: '14px 16px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/" style={{ textDecoration: 'none', color: '#4BA3D3', fontWeight: 700, fontSize: 14, display: 'flex', alignItems: 'center', gap: 4 }}>
            ← 戻る
          </Link>
          <span style={{ color: '#BAE0F7' }}>|</span>
          <span style={{ fontSize: 16, fontWeight: 900, color: '#2980B9' }}>🚗 CARアプリ</span>
        </div>
      </header>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '20px 16px 40px' }}>

        {/* 車両ヘッダーカード */}
        <div style={{ background: 'white', borderRadius: 20, padding: '20px', boxShadow: '0 4px 20px rgba(75,163,211,0.12)', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                <span style={{ fontSize: 28 }}>{countryFlag[v.country] || '🌍'}</span>
                <h2 style={{ fontSize: 20, fontWeight: 900, color: '#2C3E50', margin: 0, wordBreak: 'break-word' }}>{v.name_jp}</h2>
              </div>
              <p style={{ fontSize: 12, color: '#8BA4B5', margin: '0 0 4px' }}>{v.name_en}</p>
              {v.wikipedia_url && <a href={v.wikipedia_url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: '#4BA3D3', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 4 }}>🖼️ 車両参考画像</a>}
              <p style={{ fontSize: 12, color: '#8BA4B5', margin: 0 }}>{v.maker} · {v.country} · {v.year_start}〜{v.year_end}年</p>
            </div>
            <div style={{ textAlign: 'center', background: cc.bg, borderRadius: 16, padding: '12px 16px', flexShrink: 0 }}>
              <div style={{ fontSize: 32, fontWeight: 900, color: cc.color, lineHeight: 1 }}>{v.total_score}</div>
              <div style={{ fontSize: 10, color: '#8BA4B5', marginTop: 2 }}>評価指数</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: getScoreLabel(v.total_score).color, marginTop: 2 }}>{getScoreLabel(v.total_score).label}</div>
            </div>
          </div>
          <p style={{ fontSize: 13, color: '#6B8A9A', lineHeight: 1.7, margin: 0 }}>{v.description}</p>
        </div>

        {/* スペック */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 }}>
          {[
            { label: 'エンジン', value: v.engine || '不明' },
            { label: '駆動方式', value: v.drive_type || '不明' },
            { label: '生産台数', value: v.production_count ? v.production_count.toLocaleString() + '台' : '不明' },
          ].map(item => (
            <div key={item.label} style={{ background: 'white', borderRadius: 14, padding: '12px', boxShadow: '0 2px 10px rgba(75,163,211,0.08)', textAlign: 'center' }}>
              <p style={{ fontSize: 10, color: '#8BA4B5', margin: '0 0 4px', fontWeight: 600 }}>{item.label}</p>
              <p style={{ fontSize: 12, fontWeight: 800, color: '#2C3E50', margin: 0, wordBreak: 'break-word' }}>{item.value}</p>
            </div>
          ))}
        </div>

        {/* グローバル評価指数 */}
        <div style={{ background: 'white', borderRadius: 20, padding: '20px', boxShadow: '0 4px 20px rgba(75,163,211,0.12)', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <h3 style={{ fontSize: 16, fontWeight: 900, color: '#F5A623', margin: 0 }}>グローバル評価指数</h3>
            <span style={{ fontSize: 22, fontWeight: 900, color: '#F5A623' }}>{v.total_score}<span style={{ fontSize: 12, color: '#8BA4B5' }}>/100</span></span>
          </div>
          <p style={{ fontSize: 11, color: '#8BA4B5', margin: '0 0 16px' }}>5つの指標を重み付けして算出したAI参考評価スコアです。</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { label: '希少性', value: v.score_rarity, weight: '30%', desc: '生産台数・現存台数から算出。少ないほど高スコア。' },
              { label: '文化的価値', value: v.score_culture, weight: '25%', desc: '歴史的背景・映画や音楽との関連・レース戦績から算出。' },
              { label: '維持性', value: v.score_maintenance, weight: '20%', desc: '部品供給・整備のしやすさから算出。' },
              { label: '革新性', value: v.score_design, weight: '15%', desc: 'デザイン独自性・技術的革新性から算出。' },
              { label: '著名オーナー・受賞歴', value: v.score_owner, weight: '10%', desc: '著名人の所有歴・受賞歴から算出。' },
            ].map(item => (
              <div key={item.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1, minWidth: 0 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#2C3E50' }}>{item.label}</span>
                    <span style={{ fontSize: 10, color: '#8BA4B5', background: '#F0F9FF', padding: '1px 6px', borderRadius: 99, flexShrink: 0 }}>{item.weight}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                    <span style={{ fontSize: 11, color: getScoreLabel(item.value).color, fontWeight: 700 }}>{getScoreLabel(item.value).label}</span>
                    <span style={{ fontSize: 15, fontWeight: 900, color: '#F5A623', minWidth: 28, textAlign: 'right' }}>{item.value}</span>
                  </div>
                </div>
                <div style={{ height: 8, borderRadius: 99, background: '#FFF3CD', overflow: 'hidden' }}>
                  <div style={{ height: '100%', borderRadius: 99, background: 'linear-gradient(90deg, #F5A623, #FFD700)', width: item.value + '%' }} />
                </div>
                <p style={{ fontSize: 11, color: '#8BA4B5', margin: '4px 0 0' }}>{item.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 16, background: '#FFF9E6', border: '1.5px solid #F5A623', borderRadius: 12, padding: '12px' }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#F5A623', margin: '0 0 4px' }}>🤖 AI総合判定</p>
            <p style={{ fontSize: 12, color: '#6B8A9A', margin: 0, lineHeight: 1.7 }}>{getValuationComment(v.total_score)}</p>
          </div>
          <p style={{ fontSize: 10, color: '#8BA4B5', margin: '8px 0 0' }}>※ AI参考評価です。データ充足率：{v.data_completeness}%</p>
        </div>

        {/* 日本市場スコア */}
        <div style={{ background: 'white', borderRadius: 20, padding: '20px', boxShadow: '0 4px 20px rgba(75,163,211,0.12)', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <h3 style={{ fontSize: 16, fontWeight: 900, color: '#4BA3D3', margin: 0 }}>🇯🇵 日本市場スコア</h3>
            <span style={{ fontSize: 22, fontWeight: 900, color: '#4BA3D3' }}>{v.japan_total_score}<span style={{ fontSize: 12, color: '#8BA4B5' }}>/100</span></span>
          </div>
          <p style={{ fontSize: 11, color: '#8BA4B5', margin: '0 0 16px' }}>日本国内での購入・維持・登録のしやすさを評価した独立スコアです。</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { label: '国内流通実績', value: v.japan_score_distribution, desc: '国内での正規販売歴・並行輸入の実績から算出。' },
              { label: '車検適合難易度', value: v.japan_score_inspection, desc: '日本の保安基準への適合しやすさから算出。' },
              { label: '部品入手性（国内）', value: v.japan_score_parts, desc: '国内での部品調達のしやすさから算出。' },
              { label: '専門整備士の国内存在', value: v.japan_score_mechanic, desc: '国内に専門整備できるショップが存在するか。' },
            ].map(item => (
              <div key={item.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#2C3E50', flex: 1, minWidth: 0 }}>{item.label}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                    <span style={{ fontSize: 11, color: getScoreLabel(item.value).color, fontWeight: 700 }}>{getScoreLabel(item.value).label}</span>
                    <span style={{ fontSize: 15, fontWeight: 900, color: '#4BA3D3', minWidth: 28, textAlign: 'right' }}>{item.value}</span>
                  </div>
                </div>
                <div style={{ height: 8, borderRadius: 99, background: '#E8F4FD', overflow: 'hidden' }}>
                  <div style={{ height: '100%', borderRadius: 99, background: 'linear-gradient(90deg, #4BA3D3, #7BC8F0)', width: (item.value * 4) + '%' }} />
                </div>
                <p style={{ fontSize: 11, color: '#8BA4B5', margin: '4px 0 0' }}>{item.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, color: '#8BA4B5' }}>並行輸入難易度：</span>
            <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 99, background: v.parallel_import_difficulty === 'easy' ? '#E8F8F0' : v.parallel_import_difficulty === 'medium' ? '#FFF3CD' : '#FFF0F0', color: v.parallel_import_difficulty === 'easy' ? '#4CAF82' : v.parallel_import_difficulty === 'medium' ? '#F5A623' : '#E74C3C' }}>
              {v.parallel_import_difficulty === 'easy' ? '易（比較的容易）' : v.parallel_import_difficulty === 'medium' ? '中（専門業者推奨）' : '難（専門知識が必要）'}
            </span>
          </div>

          <div style={{ marginTop: 12, background: '#E8F4FD', border: '1.5px solid #4BA3D3', borderRadius: 12, padding: '12px' }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#4BA3D3', margin: '0 0 4px' }}>🇯🇵 日本市場判定</p>
            <p style={{ fontSize: 12, color: '#6B8A9A', margin: 0, lineHeight: 1.7 }}>{getJapanComment(v.japan_total_score, v.parallel_import_difficulty)}</p>
          </div>
        </div>

        {/* AI参考価格 */}
        <div style={{ background: 'white', borderRadius: 20, padding: '20px', boxShadow: '0 4px 20px rgba(75,163,211,0.12)', marginBottom: 16 }}>
          <h3 style={{ fontSize: 16, fontWeight: 900, color: '#4CAF82', margin: '0 0 4px' }}>💰 AI参考価格レンジ</h3>
          <p style={{ fontSize: 11, color: '#8BA4B5', margin: '0 0 14px' }}>希少性・市場トレンドをもとにAIが算出した参考価格です。</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div style={{ background: '#E8F8F0', borderRadius: 14, padding: '14px', textAlign: 'center' }}>
              <p style={{ fontSize: 10, color: '#8BA4B5', margin: '0 0 4px' }}>最低参考価格</p>
              <p style={{ fontSize: 18, fontWeight: 900, color: '#4CAF82', margin: 0, wordBreak: 'break-all' }}>{v.price_range_min_jpy ? formatPrice(v.price_range_min_jpy) : '調査中'}</p>
            </div>
            <div style={{ background: '#E8F8F0', borderRadius: 14, padding: '14px', textAlign: 'center' }}>
              <p style={{ fontSize: 10, color: '#8BA4B5', margin: '0 0 4px' }}>最高参考価格</p>
              <p style={{ fontSize: 18, fontWeight: 900, color: '#4CAF82', margin: 0, wordBreak: 'break-all' }}>{v.price_range_max_jpy ? formatPrice(v.price_range_max_jpy) : '調査中'}</p>
            </div>
          </div>
          <div style={{ background: '#FFF9E6', border: '1.5px solid #F5A623', borderRadius: 12, padding: '10px 12px' }}>
            <p style={{ fontSize: 10, color: '#F5A623', fontWeight: 700, margin: '0 0 3px' }}>⚠️ 重要な注意事項</p>
            <p style={{ fontSize: 11, color: '#8BA4B5', margin: 0, lineHeight: 1.6 }}>同一車種でも走行距離・修復歴・コンディションにより価格が大きく異なります。必ず専門家の査定を受けてください。投資判断には使用しないでください。</p>
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: 10, color: '#8BA4B5' }}>
          データ充足率：{v.data_completeness}% | 本情報は参考目的のみ | AI生成コンテンツを含みます
        </p>
      </div>
    </main>
  )
}
