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
    <main className="min-h-screen bg-[#0A0A0A] text-[#F5F5F5]">

      {/* ヘッダー */}
      <header className="border-b border-[#C9A84C]/30 p-6">
        <h1 className="text-3xl font-bold text-[#C9A84C]">🚗 CARアプリ</h1>
        <p className="text-gray-400 text-sm mt-1">世界名車 価値評価インデックス｜1930〜1990年製造・7カ国対象</p>
      </header>

      {/* AI・クルマん紹介セクション */}
      <div className="bg-gradient-to-r from-[#1A1A1A] to-[#0A0A0A] border-b border-[#C9A84C]/20">
        <div className="max-w-6xl mx-auto p-6">
          <div className="flex flex-col md:flex-row items-center gap-6">

            {/* キャラクターアイコン */}
            <div className="shrink-0">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#C9A84C] to-[#8B6914] flex items-center justify-center text-5xl shadow-lg shadow-[#C9A84C]/20">
                🤖
              </div>
              <p className="text-center text-[#C9A84C] font-bold text-sm mt-2">AI・クルマん</p>
            </div>

            {/* 説明文 */}
            <div className="flex-1">
              <div className="bg-[#1A1A1A] rounded-2xl rounded-tl-none p-5 border border-[#C9A84C]/30 relative">
                <div className="absolute -left-3 top-4 w-3 h-3 bg-[#1A1A1A] border-l border-t border-[#C9A84C]/30 rotate-45 hidden md:block"></div>
                <h2 className="text-lg font-bold text-white mb-2">
                  はじめまして！AI・クルマんです 🚗
                </h2>
                <p className="text-gray-300 text-sm leading-relaxed mb-3">
                  私は世界のクラシックカー（1930〜1990年製造）の
                  <span className="text-[#C9A84C] font-bold">現在の価値</span>と
                  <span className="text-[#C9A84C] font-bold">将来の価値向上</span>を
                  データに基づいて予測・評価するAIアシスタントです。
                </p>
                <p className="text-gray-300 text-sm leading-relaxed mb-3">
                  希少性・文化的価値・維持性など5つの指標から
                  <span className="text-[#C9A84C] font-bold">グローバル評価指数</span>を算出し、
                  さらに日本で購入・維持するしやすさを示す
                  <span className="text-blue-400 font-bold">日本市場スコア</span>も独自に評価しています。
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="text-xs bg-[#C9A84C]/20 text-[#C9A84C] px-3 py-1 rounded-full border border-[#C9A84C]/30">📊 70台以上のデータ</span>
                  <span className="text-xs bg-blue-900/30 text-blue-400 px-3 py-1 rounded-full border border-blue-500/30">🇯🇵 日本市場特化分析</span>
                  <span className="text-xs bg-green-900/30 text-green-400 px-3 py-1 rounded-full border border-green-500/30">🤖 AI価値予測</span>
                  <span className="text-xs bg-purple-900/30 text-purple-400 px-3 py-1 rounded-full border border-purple-500/30">💰 AI参考価格レンジ</span>
                </div>
              </div>
            </div>
          </div>

          {/* 注意事項 */}
          <div className="mt-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-3 flex items-start gap-2">
            <span className="text-yellow-400 text-sm shrink-0">⚠️</span>
            <p className="text-xs text-gray-400">
              AI・クルマんの評価・価格予測はAIによる参考情報です。実際の市場価値とは異なる場合があります。投資・購入判断には専門家への相談をお勧めします。
            </p>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">🏆 評価指数ランキング</h2>
          <span className="text-xs text-gray-500">毎日AM6:00更新</span>
        </div>
        <SearchBox vehicles={vehicles} />
        <p className="mt-8 text-center text-gray-600 text-xs">
          ⚠️ 本アプリは情報提供目的です。投資を推奨するものではありません。全スコア・価格はAI参考評価です。
        </p>
      </div>
    </main>
  )
}
