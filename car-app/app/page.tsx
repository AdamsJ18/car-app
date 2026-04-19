export default function Home() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#F5F5F5] p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-[#C9A84C] mb-4">🚗 CARアプリ</h1>
        <p className="text-xl mb-8 text-gray-300">「公開データのみ」という制約下で、Explainableな車両価値評価モデルをどこまで構築できるかを検証するプロジェクト。</p>
        <div className="grid gap-6">
          <div className="bg-[#1A1A1A] rounded-xl p-6 border border-[#C9A84C]/30">
            <h2 className="text-2xl font-bold text-[#C9A84C] mb-4">🎯 このプロジェクトが証明すること</h2>
            <ul className="space-y-2 text-gray-300">
              <li>✅ 不完全データを正直に扱う設計ができる</li>
              <li>✅ Explainable AIを実装できる</li>
              <li>✅ 制約下で意思決定できる</li>
              <li>✅ 日本市場固有の要因を設計に統合できる</li>
            </ul>
          </div>
          <div className="bg-[#1A1A1A] rounded-xl p-6 border border-[#C9A84C]/30">
            <h2 className="text-2xl font-bold text-[#C9A84C] mb-4">⚖️ 評価指数スコアリング</h2>
            <table className="w-full text-sm text-gray-300">
              <thead><tr className="text-[#C9A84C] border-b border-gray-700"><th className="text-left py-2">評価指標</th><th className="text-center py-2">重み</th></tr></thead>
              <tbody className="divide-y divide-gray-800">
                <tr><td className="py-2">生産台数・現存台数の希少性</td><td className="text-center font-bold text-[#C9A84C]">30%</td></tr>
                <tr><td className="py-2">歴史的・文化的価値</td><td className="text-center font-bold text-[#C9A84C]">25%</td></tr>
                <tr><td className="py-2">メンテナンス維持性</td><td className="text-center font-bold text-[#C9A84C]">20%</td></tr>
                <tr><td className="py-2">デザイン・技術的革新性</td><td className="text-center font-bold text-[#C9A84C]">15%</td></tr>
                <tr><td className="py-2">著名オーナー・受賞歴</td><td className="text-center font-bold text-[#C9A84C]">10%</td></tr>
              </tbody>
            </table>
          </div>
          <div className="bg-[#1A1A1A] rounded-xl p-6 border border-[#C9A84C]/30">
            <h2 className="text-2xl font-bold text-[#C9A84C] mb-4">🇯🇵 日本市場リスクスコア</h2>
            <p className="text-gray-400 text-sm mb-3">※ ハンドル仕様はスコアに影響しません。事実情報として中立的に表示します。</p>
            <table className="w-full text-sm text-gray-300">
              <thead><tr className="text-[#C9A84C] border-b border-gray-700"><th className="text-left py-2">評価指標</th><th className="text-center py-2">重み</th></tr></thead>
              <tbody className="divide-y divide-gray-800">
                <tr><td className="py-2">国内流通実績</td><td className="text-center font-bold text-[#C9A84C]">30%</td></tr>
                <tr><td className="py-2">車検適合難易度</td><td className="text-center font-bold text-[#C9A84C]">25%</td></tr>
                <tr><td className="py-2">部品入手性（国内）</td><td className="text-center font-bold text-[#C9A84C]">25%</td></tr>
                <tr><td className="py-2">専門整備士の国内存在</td><td className="text-center font-bold text-[#C9A84C]">20%</td></tr>
              </tbody>
            </table>
          </div>
          <div className="bg-[#1A1A1A] rounded-xl p-6 border border-[#C9A84C]/30">
            <h2 className="text-2xl font-bold text-[#C9A84C] mb-4">🛠️ 技術スタック（月額¥0）</h2>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
              <div><strong className="text-white block mb-1">フロントエンド</strong>Next.js 14 / Tailwind CSS / TypeScript</div>
              <div><strong className="text-white block mb-1">バックエンド</strong>Supabase / GitHub Actions</div>
              <div><strong className="text-white block mb-1">AI</strong>Google Gemini API / Groq API</div>
              <div><strong className="text-white block mb-1">インフラ</strong>Vercel / Cloudinary / Sentry</div>
            </div>
            <p className="mt-4 text-[#4CAF50] font-bold">月額合計：¥0（完全無料）</p>
          </div>
        </div>
        <p className="mt-8 text-center text-gray-600 text-sm">⚠️ 本アプリは情報提供目的です。投資を推奨するものではありません。</p>
      </div>
    </main>
  );
}
