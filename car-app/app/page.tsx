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
      <header className="border-b border-[#C9A84C]/30 p-6">
        <h1 className="text-3xl font-bold text-[#C9A84C]">🚗 CARアプリ</h1>
        <p className="text-gray-400 text-sm mt-1">世界名車 価値評価インデックス｜1930〜1990年製造・7カ国対象</p>
      </header>
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">🏆 評価指数ランキング</h2>
          <span className="text-xs text-gray-500">毎日AM6:00更新</span>
        </div>
        <SearchBox vehicles={vehicles} />
        <p className="mt-8 text-center text-gray-600 text-xs">⚠️ 本アプリは情報提供目的です。投資を推奨するものではありません。</p>
      </div>
    </main>
  )
}
