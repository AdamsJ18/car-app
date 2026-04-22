import { supabase } from '@/lib/supabase'
import SearchBox from './components/SearchBox'

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
      <header style={{ background: 'white', borderBottom: '3px solid #BAE0F7', padding: '16px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 36 }}>🚗</span>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 900, color: '#2980B9', margin: 0 }}>CARアプリ</h1>
              <p style={{ fontSize: 11, color: '#8BA4B5', margin: 0 }}>世界名車 価値評価インデックス</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, background: '#E8F4FD', color: '#4BA3D3', padding: '6px 14px', borderRadius: 99, fontWeight: 700 }}>
              🤖 AI・クルマん
            </span>
          </div>
        </div>
      </header>

      {/* ヒーローセクション */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px 20px' }}>
        <div style={{
          background: 'white',
          borderRadius: 28,
          padding: '40px',
          boxShadow: '0 8px 40px rgba(75,163,211,0.15)',
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
          marginBottom: 32,
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* 背景装飾 */}
          <div style={{
            position: 'absolute', top: -40, right: -40,
            width: 200, height: 200,
            background: 'radial-gradient(circle, #BAE0F7 0%, transparent 70%)',
            borderRadius: '50%', opacity: 0.5
          }} />
          <div style={{
            position: 'absolute', bottom: -30, left: -30,
            width: 150, height: 150,
            background: 'radial-gradient(circle, #A8E6C8 0%, transparent 70%)',
            borderRadius: '50%', opacity: 0.4
          }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 28, flexWrap: 'wrap', position: 'relative' }}>

            {/* キャラクター */}
            <div style={{ textAlign: 'center', flexShrink: 0 }}>
              <div style={{
                width: 110, height: 110,
                background: 'linear-gradient(135deg, #4BA3D3, #2980B9)',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 52,
                boxShadow: '0 8px 24px rgba(75,163,211,0.35)',
                margin: '0 auto',
                animation: 'float 3s ease-in-out infinite'
              }}>
                🤖
              </div>
              <div style={{
                marginTop: 10,
                background: 'linear-gradient(135deg, #4BA3D3, #2980B9)',
                color: 'white',
                padding: '4px 16px',
                borderRadius: 99,
                fontSize: 12,
                fontWeight: 800,
                display: 'inline-block'
              }}>
                AI・クルマん
              </div>
            </div>

            {/* 吹き出し */}
            <div style={{ flex: 1, minWidth: 280 }}>
              <div style={{
                background: 'linear-gradient(135deg, #E8F4FD, #F0F9FF)',
                border: '2px solid #BAE0F7',
                borderRadius: '0 20px 20px 20px',
                padding: '20px 24px',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute', top: -2, left: -14,
                  width: 0, height: 0,
                  borderTop: '12px solid #BAE0F7',
                  borderLeft: '14px solid transparent'
                }} />
                <h2 style={{ fontSize: 20, fontWeight: 900, color: '#2980B9', margin: '0 0 10px' }}>
                  こんにちは！AI・クルマんです 👋
                </h2>
                <p style={{ fontSize: 14, color: '#4A6A7A', lineHeight: 1.8, margin: '0 0 12px' }}>
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
                    <span key={tag.text} style={{
                      fontSize: 12, fontWeight: 700,
                      background: tag.bg, color: tag.color,
                      padding: '5px 12px', borderRadius: 99
                    }}>
                      {tag.icon} {tag.text}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 統計カード */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16 }}>
            {[
              { icon: '🚗', label: '登録車両数', value: `${vehicles.length}台`, color: '#4BA3D3', bg: '#E8F4FD' },
              { icon: '🌍', label: '対象国数', value: '7カ国', color: '#4CAF82', bg: '#E8F8F0' },
              { icon: '📅', label: '対象年代', value: '1930〜1990年', color: '#F5A623', bg: '#FFF3CD' },
              { icon: '💴', label: '月額費用', value: '¥0（完全無料）', color: '#9B59B6', bg: '#F3E8FF' },
            ].map(stat => (
              <div key={stat.label} style={{
                background: stat.bg,
                borderRadius: 16,
                padding: '16px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: 28, marginBottom: 4 }}>{stat.icon}</div>
                <div style={{ fontSize: 18, fontWeight: 900, color: stat.color }}>{stat.value}</div>
                <div style={{ fontSize: 11, color: '#8BA4B5', marginTop: 2 }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* 注意事項 */}
          <div style={{
            background: '#FFF9E6',
            border: '1.5px solid #F5A623',
            borderRadius: 12,
            padding: '10px 16px',
            fontSize: 11,
            color: '#8B6914',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 8
          }}>
            <span style={{ flexShrink: 0 }}>⚠️</span>
            AI・クルマんの評価・価格予測はAIによる参考情報です。実際の市場価値とは異なる場合があります。投資・購入判断には専門家への相談をお勧めします。
          </div>
        </div>

        {/* ランキングタイトル */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: '#2980B9', margin: 0 }}>
            🏆 評価指数ランキング
          </h2>
          <span style={{ fontSize: 11, color: '#8BA4B5' }}>毎日AM6:00更新</span>
        </div>

        <SearchBox vehicles={vehicles} />

        <p style={{ textAlign: 'center', fontSize: 11, color: '#8BA4B5', marginTop: 32 }}>
          ⚠️ 本アプリは情報提供目的です。投資を推奨するものではありません。全スコア・価格はAI参考評価です。
        </p>
      </div>
    </main>
  )
}
