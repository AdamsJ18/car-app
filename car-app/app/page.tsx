import { supabase } from '@/lib/supabase'
import SearchBox from './components/SearchBox'
import VehicleListModal from './components/VehicleListModal'

async function getVehicles() {
  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .order('total_score', { ascending: false })
  if (error) { console.error(error); return [] }
  return data
}

export default async function Home() {
  const vehicles = await getVehicles()
  return (
    <main style={{ background: 'linear-gradient(180deg, #E8F4FD 0%, #F0F9FF 50%, #E8F8F0 100%)', minHeight: '100vh' }}>

      {/* ヘッダー */}
      <header style={{ background: 'white', borderBottom: '3px solid #BAE0F7', padding: '14px 16px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 28 }}>🚗</span>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 900, color: '#2980B9', margin: 0 }}>CARアプリ</h1>
              <p style={{ fontSize: 10, color: '#8BA4B5', margin: 0 }}>世界名車 価値評価インデックス</p>
            </div>
          </div>
          <span style={{ fontSize: 11, background: '#E8F4FD', color: '#4BA3D3', padding: '5px 12px', borderRadius: 99, fontWeight: 700 }}>
            🤖 AI・クルマん
          </span>
        </div>
      </header>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '20px 16px' }}>

        {/* ヒーローカード */}
        <div style={{ background: 'white', borderRadius: 24, padding: '24px 20px', boxShadow: '0 8px 40px rgba(75,163,211,0.15)', marginBottom: 24, position: 'relative', overflow: 'hidden' }}>

          {/* 背景装飾 */}
          <div style={{ position: 'absolute', top: -30, right: -30, width: 160, height: 160, background: 'radial-gradient(circle, #BAE0F7 0%, transparent 70%)', borderRadius: '50%', opacity: 0.5 }} />
          <div style={{ position: 'absolute', bottom: -20, left: -20, width: 120, height: 120, background: 'radial-gradient(circle, #A8E6C8 0%, transparent 70%)', borderRadius: '50%', opacity: 0.4 }} />

          {/* キャラクター＋テキスト：縦並び優先 */}
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, marginBottom: 20 }}>

            {/* キャラクター */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 90, height: 90, background: 'linear-gradient(135deg, #4BA3D3, #2980B9)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 44, boxShadow: '0 8px 24px rgba(75,163,211,0.35)', margin: '0 auto' }}>
                🤖
              </div>
              <div style={{ marginTop: 8, background: 'linear-gradient(135deg, #4BA3D3, #2980B9)', color: 'white', padding: '4px 14px', borderRadius: 99, fontSize: 12, fontWeight: 800, display: 'inline-block' }}>
                AI・クルマん
              </div>
            </div>

            {/* 吹き出し */}
            <div style={{ background: 'linear-gradient(135deg, #E8F4FD, #F0F9FF)', border: '2px solid #BAE0F7', borderRadius: 20, padding: '16px 20px', width: '100%' }}>
              <h2 style={{ fontSize: 17, fontWeight: 900, color: '#2980B9', margin: '0 0 10px' }}>
                こんにちは！AI・クルマんです 👋
              </h2>
              <p style={{ fontSize: 13, color: '#4A6A7A', lineHeight: 1.8, margin: '0 0 12px' }}>
                世界のクラシックカー（1930〜1990年製造）の
                <strong style={{ color: '#F5A623' }}>現在の価値</strong>と
                <strong style={{ color: '#4CAF82' }}>将来の価値向上</strong>を
                データに基づいて予測・評価します！<br />
                希少性・文化的価値など5つの指標から評価指数を算出し、
                日本市場での購入しやすさも独自に分析しています。
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {[
                  { icon: '📊', text: `${vehicles.length}台のデータ`, bg: '#E8F4FD', color: '#4BA3D3' },
                  { icon: '🇯🇵', text: '日本市場分析', bg: '#FFF3CD', color: '#E67E22' },
                  { icon: '🤖', text: 'AI価値予測', bg: '#E8F8F0', color: '#4CAF82' },
                  { icon: '💰', text: 'AI参考価格', bg: '#FEF0E7', color: '#E74C3C' },
                ].map(tag => (
                  <span key={tag.text} style={{ fontSize: 11, fontWeight: 700, background: tag.bg, color: tag.color, padding: '4px 10px', borderRadius: 99 }}>
                    {tag.icon} {tag.text}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 統計カード */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 16 }}>
            <div style={{ background: '#E8F4FD', borderRadius: 14, padding: '14px', textAlign: 'center' }}>
              <VehicleListModal vehicles={vehicles} totalCount={vehicles.length} />
            </div>
            <div style={{ background: '#E8F8F0', borderRadius: 14, padding: '14px', textAlign: 'center' }}>
              <div style={{ fontSize: 24, marginBottom: 4 }}>🌍</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: '#4CAF82' }}>7カ国</div>
              <div style={{ fontSize: 11, color: '#8BA4B5', marginTop: 2 }}>対象国数</div>
            </div>
            <div style={{ background: '#FFF3CD', borderRadius: 14, padding: '14px', textAlign: 'center' }}>
              <div style={{ fontSize: 24, marginBottom: 4 }}>📅</div>
              <div style={{ fontSize: 16, fontWeight: 900, color: '#F5A623' }}>1930〜1990年</div>
              <div style={{ fontSize: 11, color: '#8BA4B5', marginTop: 2 }}>対象年代</div>
            </div>
            <div style={{ background: '#F3E8FF', borderRadius: 14, padding: '14px', textAlign: 'center' }}>
              <div style={{ fontSize: 24, marginBottom: 4 }}>💴</div>
              <div style={{ fontSize: 16, fontWeight: 900, color: '#9B59B6' }}>¥0</div>
              <div style={{ fontSize: 11, color: '#8BA4B5', marginTop: 2 }}>月額費用（完全無料）</div>
            </div>
          </div>

          {/* 注意事項 */}
          <div style={{ background: '#FFF9E6', border: '1.5px solid #F5A623', borderRadius: 12, padding: '10px 14px', fontSize: 11, color: '#8B6914', display: 'flex', alignItems: 'flex-start', gap: 6 }}>
            <span style={{ flexShrink: 0 }}>⚠️</span>
            AI・クルマんの評価・価格予測はAIによる参考情報です。実際の市場価値とは異なる場合があります。投資・購入判断には専門家への相談をお勧めします。
          </div>
        </div>

        {/* ランキング */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <h2 style={{ fontSize: 18, fontWeight: 900, color: '#2980B9', margin: 0 }}>🏆 評価指数ランキング</h2>
          <span style={{ fontSize: 11, color: '#8BA4B5' }}>毎日AM6:00更新</span>
        </div>

        <SearchBox vehicles={vehicles} />

        <p style={{ textAlign: 'center', fontSize: 11, color: '#8BA4B5', marginTop: 24 }}>
          ⚠️ 本アプリは情報提供目的です。投資を推奨するものではありません。
        </p>
      </div>
    </main>
  )
}
