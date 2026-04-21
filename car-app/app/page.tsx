import { supabase } from '@/lib/supabase'

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
      <header className="border-b border-[#C9A84C]/30 p-6">
        <h1 className="text-3xl font-bold text-[#C9A84C]">🚗 CARアプリ</h1>
        <p className="text-gray-400 text-sm mt-1">世界名車 価値評価インデックス｜1930〜1990年製造・7カ国対象</p>
      </header>
      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-xl font-bold text-white mb-6">🏆 評価指数トップ {vehicles.length}</h2>
        <div className="grid gap-4">
          {vehicles.map((v: any, i: number) => (
            <div key={v.id} className="bg-[#1A1A1A] rounded-xl overflow-hidden border border-gray-800 hover:border-[#C9A84C]/50 transition-all">
              <div className="flex">
                <div className="w-24 md:w-48 shrink-0 bg-gradient-to-br from-gray-800 to-gray-900 flex flex-col items-center justify-center gap-2 p-4">
                  <span className="text-5xl">{vehicleEmoji[v.name_jp] || '🚗'}</span>
                  <span className="text-2xl">{countryFlag[v.country] || '🌍'}</span>
                  <span className="text-2xl font-bold text-[#C9A84C]">#{i + 1}</span>
                </div>
                <div className="flex-1 p-5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-bold text-white">{v.name_jp}</h3>
                    {v.steering === 'right'
                      ? <span className="text-xs bg-blue-900/50 text-blue-300 px-2 py-0.5 rounded-full">🔵 右ハンドル</span>
                      : <span className="text-xs bg-orange-900/50 text-orange-300 px-2 py-0.5 rounded-full">🟠 左ハンドル</span>
                    }
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-sm text-gray-400">
                    <span>{v.maker}</span><span>·</span>
                    <span>{v.country}</span><span>·</span>
                    <span>{v.year_start}〜{v.year_end}年</span>
                  </div>
                  <p className="text-sm text-gray-400 mt-2">{v.description}</p>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">グローバル評価指数</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-800 rounded-full h-2">
                          <div className="bg-[#C9A84C] h-2 rounded-full" style={{ width: `${v.total_score}%` }} />
                        </div>
                        <span className="text-sm font-bold text-[#C9A84C] w-8">{v.total_score}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">🇯🇵 日本市場スコア</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-800 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${v.japan_total_score}%` }} />
                        </div>
                        <span className="text-sm font-bold text-blue-400 w-8">{v.japan_total_score}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    データ充足率：{v.data_completeness}%　|　AI参考価格：{v.price_range_min_jpy ? `${(v.price_range_min_jpy/10000).toLocaleString()}万〜${(v.price_range_max_jpy/10000).toLocaleString()}万円` : '調査中'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-gray-600 text-xs">⚠️ 本アプリは情報提供目的です。投資を推奨するものではありません。</p>
      </div>
    </main>
  )
}
