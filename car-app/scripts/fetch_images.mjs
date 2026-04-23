import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://pyajnbzdfxdifaqpforb.supabase.co',
  'sb_publishable_XtqQNa5zwYlm9sJgj4uOZQ_E2FxWjsC'
)

const vehicleWikiMap = {
  'フェラーリ 250 GTO': 'Ferrari_250_GTO',
  'トヨタ 2000GT': 'Toyota_2000GT',
  'メルセデス・ベンツ 300SL': 'Mercedes-Benz_300SL',
  'ポルシェ 911（930）ターボ': 'Porsche_930',
  'ランボルギーニ ミウーラ': 'Lamborghini_Miura',
  'ジャガー Eタイプ': 'Jaguar_E-Type',
  '日産 スカイライン GT-R（KPGC10）': 'Nissan_Skyline_GT-R',
  'アルファ・ロメオ ジュリア スプリント GTA': 'Alfa_Romeo_Giulia',
  'フェラーリ テスタロッサ': 'Ferrari_Testarossa',
  'フェラーリ 308 GTB': 'Ferrari_308_GTB',
  'ランボルギーニ カウンタック': 'Lamborghini_Countach',
  'ポルシェ 356': 'Porsche_356',
  'メルセデス・ベンツ 190SL': 'Mercedes-Benz_190SL',
  'BMW 507': 'BMW_507',
  'ジャガー Dタイプ': 'Jaguar_D-Type',
  'アストン・マーティン DB5': 'Aston_Martin_DB5',
  'ロールス・ロイス シルバーシャドウ': 'Rolls-Royce_Silver_Shadow',
  '日産 フェアレディZ（S30）': 'Nissan_S30',
  '日産 GT-R（R32）': 'Nissan_Skyline_GT-R_(R32)',
  'ホンダ NSX（NA1）': 'Honda_NSX',
  'マツダ コスモスポーツ': 'Mazda_Cosmo',
  'プジョー 205 GTI': 'Peugeot_205',
  'シトロエン DS': 'Citroën_DS',
  'アルピーヌ A110': 'Alpine_A110',
  'ボルボ P1800': 'Volvo_P1800',
  'シェルビー コブラ 427': 'Shelby_Cobra',
  'フォード GT40': 'Ford_GT40',
  'シボレー コルベット スティングレー（C2）': 'Chevrolet_Corvette_(C2)',
  'トライアンフ TR3': 'Triumph_TR3',
  'トライアンフ TR4': 'Triumph_TR4',
  'トライアンフ TR6': 'Triumph_TR6',
  'MG MGB': 'MG_MGB',
  'MG MGA': 'MG_MGA',
  'オースティン・ヒーレー 3000': 'Austin-Healey_3000',
  'ロータス エスプリ': 'Lotus_Esprit',
  'ロータス エラン': 'Lotus_Elan',
  'アストン・マーティン V8ヴァンテージ': 'Aston_Martin_V8',
  'ランチア ストラトス': 'Lancia_Stratos',
  'ランチア フルビア': 'Lancia_Fulvia',
  'フィアット 500（チンクエチェント）': 'Fiat_500',
  'アルファ・ロメオ スパイダー（デュエット）': 'Alfa_Romeo_Spider',
  'ポルシェ 959': 'Porsche_959',
  'いすゞ 117クーペ': 'Isuzu_117_Coupe',
  'シボレー カマロ（初代）': 'Chevrolet_Camaro_(first_generation)',
  'フォード マスタング（初代）': 'Ford_Mustang_(first_generation)',
  'ダッジ チャージャー（1969年）': 'Dodge_Charger',
  'メルセデス・ベンツ 450SL': 'Mercedes-Benz_R107_and_C107',
  'BMW 3.0 CSL': 'BMW_E9',
  'フェラーリ 365 GTB/4 デイトナ': 'Ferrari_365_GTB/4',
  'アバルト 695 SS': 'Abarth_695',
  'ジャガー XK120': 'Jaguar_XK120',
  'モーガン プラス8': 'Morgan_Plus_8',
  'トヨタ スプリンタートレノ（AE86）': 'Toyota_AE86',
  'マツダ RX-7（SA22C）': 'Mazda_RX-7_(FB)',
  'ホンダ S800': 'Honda_S800',
  'ブガッティ タイプ35': 'Bugatti_Type_35',
  'シトロエン SM': 'Citroën_SM',
  'フォード サンダーバード（初代）': 'Ford_Thunderbird_(first_generation)',
  'ポルシェ 914': 'Porsche_914',
  'メルセデス・ベンツ W113（280SL）': 'Mercedes-Benz_W113',
  'BMW 2002ターボ': 'BMW_2002',
  'フェラーリ F40': 'Ferrari_F40',
  'ランボルギーニ ディアブロ': 'Lamborghini_Diablo',
  'ポルシェ 911 カレラRS（2.7）': 'Porsche_911_GT3_RS',
  'ベントレー コンティネンタル（R型）': 'Bentley_Continental_R',
  'サーブ 900ターボ': 'Saab_900',
  'ホンダ Z（軽スポーツ）': 'Honda_Z_(1970)',
  'ダットサン フェアレディ（SP310）': 'Nissan_Fairlady',
  'ホンダ シビック（初代）': 'Honda_Civic_(first_generation)',
  'デ・トマソ パンテーラ': 'De_Tomaso_Pantera',
  'フォード コルチナ（ロータス）': 'Lotus_Cortina',
}

async function fetchWikipediaImage(wikiTitle) {
  try {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(wikiTitle)}`
    const res = await fetch(url, {
      headers: { 'User-Agent': 'CARApp/1.0 (educational project)' }
    })
    if (!res.ok) return null
    const data = await res.json()
    return data.thumbnail?.source || null
  } catch (e) {
    return null
  }
}

async function main() {
  console.log('画像URL取得開始...')
  const { data: vehicles } = await supabase.from('vehicles').select('id, name_jp')

  let success = 0
  let fail = 0

  for (const vehicle of vehicles) {
    const wikiTitle = vehicleWikiMap[vehicle.name_jp]
    if (!wikiTitle) {
      console.log(`⏭️  マップなし: ${vehicle.name_jp}`)
      fail++
      continue
    }

    const imageUrl = await fetchWikipediaImage(wikiTitle)
    if (imageUrl) {
      await supabase.from('vehicles').update({ image_url: imageUrl }).eq('id', vehicle.id)
      console.log(`✅ ${vehicle.name_jp}`)
      success++
    } else {
      console.log(`❌ 画像なし: ${vehicle.name_jp}`)
      fail++
    }

    await new Promise(r => setTimeout(r, 300))
  }

  console.log(`\n完了！ 成功:${success}台 / 失敗:${fail}台`)
}

main()
