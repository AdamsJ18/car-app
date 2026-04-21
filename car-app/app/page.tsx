import { supabase } from '@/lib/supabase'

const vehicleImages: { [key: string]: string } = {
  'フェラーリ 250 GTO': 'https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=640',
  'トヨタ 2000GT': 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=640',
  'メルセデス・ベンツ 300SL': 'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=640',
  'ポルシェ 911（930）ターボ': 'https://images.unsplash.com/photo-1611016186353-9af58c69a533?w=640',
  'ランボルギーニ ミウーラ': 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=640',
  'ジャガー Eタイプ': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=640',
  '日産 スカイライン GT-R（KPGC10）': 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=640',
  'アルファ・ロメオ ジュリア スプリント GTA': 'https://images.unsplash.com/photo-1588258219511-64eb629cb833?w=640',
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
        <div className="grid gap-6">
          {vehicles.map((v: any, i: number) => (
            <div key={v.id} className="bg-[#1A1A1A] rounded-xl overflow-hidden border border-gray-800 hover:border-[#C9A84C]/50 transition-all">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-64 h-48 md:h-auto relative bg-gray-900 shrink-0 flex items-center justify-center">
                  <img
                    src={vehicleImages[v.name_jp] || 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=640'}
                    alt={v.name_jp}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-[#0A0A0A]/80 rounded-full w-10 h-10 flex items-center justify-center">
                    <span className="text-lg font-bold text-[#C9A84C]">#{i + 1}</span>
                  </div>
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
