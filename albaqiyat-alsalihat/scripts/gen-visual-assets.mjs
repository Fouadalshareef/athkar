/**
 * gen-visual-assets.mjs — أداة تطوير فقط (لا تُشغَّل ضمن البناء).
 * تولّد أصولاً بصرية مستقلة وشفافة من تعريفات SVG:
 *  - environment: قمر متوهّج + فانوس دافئ
 *  - ui: أيقونات كريمية موحّدة لأزرار HUD
 */
import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'

const OUT_ENV = 'public/assets/game/environment'
const OUT_UI = 'public/assets/game/ui'
const OUT_VEG = 'public/assets/game/vegetation'
await mkdir(OUT_ENV, { recursive: true })
await mkdir(OUT_UI, { recursive: true })
await mkdir(OUT_VEG, { recursive: true })

const svg = (w, h, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>`

// ---------------------------------------------------------------------------
// القمر: توهّج ناعم + هالة + قرص كريمي + فوهات لطيفة
// ---------------------------------------------------------------------------
const moon = svg(256, 256, `
  <defs>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#fff7d6" stop-opacity="0.55"/>
      <stop offset="45%" stop-color="#fde9b0" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="#fde9b0" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="disc" cx="42%" cy="38%" r="70%">
      <stop offset="0%" stop-color="#fffdf2"/>
      <stop offset="70%" stop-color="#f7e8b8"/>
      <stop offset="100%" stop-color="#ecd79a"/>
    </radialGradient>
  </defs>
  <circle cx="128" cy="128" r="124" fill="url(#glow)"/>
  <circle cx="128" cy="128" r="58" fill="url(#disc)"/>
  <circle cx="108" cy="112" r="12" fill="#e3cd92" opacity="0.55"/>
  <circle cx="146" cy="140" r="8" fill="#e3cd92" opacity="0.45"/>
  <circle cx="132" cy="100" r="5" fill="#e3cd92" opacity="0.4"/>
  <circle cx="152" cy="112" r="3.5" fill="#e3cd92" opacity="0.4"/>
`)

// ---------------------------------------------------------------------------
// الفانوس: إطار كحلي + زجاج دافئ متوهّج + حلقة تعليق
// ---------------------------------------------------------------------------
const lantern = svg(192, 256, `
  <defs>
    <radialGradient id="lglow" cx="50%" cy="55%" r="55%">
      <stop offset="0%" stop-color="#ffd166" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="#ffd166" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="glass" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#fff3c4"/>
      <stop offset="100%" stop-color="#ffb84d"/>
    </linearGradient>
  </defs>
  <circle cx="96" cy="150" r="92" fill="url(#lglow)"/>
  <rect x="86" y="10" width="20" height="12" rx="6" fill="#2b3a67"/>
  <path d="M96 22 C 66 40, 62 60, 66 78 L 126 78 C 130 60, 126 40, 96 22 Z" fill="none" stroke="#2b3a67" stroke-width="7"/>
  <rect x="62" y="76" width="68" height="12" rx="6" fill="#2b3a67"/>
  <path d="M70 88 L122 88 L114 186 L78 186 Z" fill="url(#glass)"/>
  <path d="M70 88 L122 88 L114 186 L78 186 Z" fill="none" stroke="#2b3a67" stroke-width="7" stroke-linejoin="round"/>
  <rect x="60" y="182" width="72" height="14" rx="7" fill="#2b3a67"/>
  <circle cx="96" cy="210" r="8" fill="#2b3a67"/>
  <rect x="90" y="100" width="12" height="70" rx="6" fill="#ffffff" opacity="0.35"/>
`)

// ---------------------------------------------------------------------------
// أيقونات HUD الموحّدة — كريمية على خلفية شفافة (128px)
// ---------------------------------------------------------------------------
const CREAM = '#fff6e0'
const icons = {
  'icon-gear': svg(128, 128, `
    <g fill="none" stroke="${CREAM}" stroke-width="9">
      <circle cx="64" cy="64" r="26"/>
    </g>
    <circle cx="64" cy="64" r="11" fill="${CREAM}"/>
    ${Array.from({ length: 8 }, (_, i) => {
      const a = (Math.PI * 2 * i) / 8
      const x = 64 + Math.cos(a) * 38
      const y = 64 + Math.sin(a) * 38
      return `<rect x="${x - 8}" y="${y - 8}" width="16" height="16" rx="4" fill="${CREAM}" transform="rotate(${(a * 180) / Math.PI + 90} ${x} ${y})"/>`
    }).join('')}
  `),
  'icon-sliders': svg(128, 128, `
    <g stroke="${CREAM}" stroke-width="9" stroke-linecap="round">
      <line x1="24" y1="40" x2="104" y2="40"/>
      <line x1="24" y1="64" x2="104" y2="64"/>
      <line x1="24" y1="88" x2="104" y2="88"/>
    </g>
    <circle cx="78" cy="40" r="13" fill="${CREAM}" stroke="#0b1a33" stroke-width="4"/>
    <circle cx="46" cy="64" r="13" fill="${CREAM}" stroke="#0b1a33" stroke-width="4"/>
    <circle cx="88" cy="88" r="13" fill="${CREAM}" stroke="#0b1a33" stroke-width="4"/>
  `),
  'icon-leaf': svg(128, 128, `
    <path d="M64 108 C 30 88, 26 48, 44 24 C 66 34, 96 40, 96 72 C 96 96, 82 106, 64 108 Z"
          fill="${CREAM}"/>
    <path d="M64 108 C 60 76, 62 52, 76 32" fill="none" stroke="#0b1a33" stroke-width="6" stroke-linecap="round" opacity="0.55"/>
  `),
  'icon-quran': svg(128, 128, `
    <path d="M64 34 C 50 24, 28 24, 20 30 L 20 96 C 30 90, 52 90, 64 100 C 76 90, 98 90, 108 96 L 108 30 C 100 24, 78 24, 64 34 Z"
          fill="${CREAM}"/>
    <line x1="64" y1="36" x2="64" y2="98" stroke="#0b1a33" stroke-width="5" opacity="0.5"/>
    <path d="M36 50 C 44 46, 52 46, 58 49 M36 66 C 44 62, 52 62, 58 65 M70 49 C 76 46, 84 46, 92 50 M70 65 C 76 62, 84 62, 92 66"
          fill="none" stroke="#0b1a33" stroke-width="4.5" stroke-linecap="round" opacity="0.45"/>
  `),
  'icon-pause': svg(128, 128, `
    <rect x="34" y="28" width="22" height="72" rx="9" fill="${CREAM}"/>
    <rect x="72" y="28" width="22" height="72" rx="9" fill="${CREAM}"/>
  `),
  'icon-play': svg(128, 128, `
    <path d="M42 28 L42 100 L100 64 Z" fill="${CREAM}"/>
  `),
}

// ---------------------------------------------------------------------------
// أصول الحديقة الليلية — إضاءة قمرية من أعلى اليسار + لمسات ذهبية
// ---------------------------------------------------------------------------
const garden = {
  // شجرة: جذع + تاج طبقات مع حافة ضوء قمري وثمار ذهبية
  tree: svg(200, 260, `
    <ellipse cx="100" cy="248" rx="66" ry="10" fill="#020617" opacity="0.45"/>
    <path d="M92 250 C 90 200, 88 180, 78 158 L 96 164 L 100 132 L 106 164 L 122 156 C 110 182, 110 202, 108 250 Z"
          fill="#4a3728"/>
    <path d="M92 250 C 90 200, 88 180, 78 158 L 88 161 C 96 184, 98 210, 98 250 Z" fill="#5d4636"/>
    <circle cx="100" cy="120" r="62" fill="#1e4d3a"/>
    <circle cx="66" cy="138" r="40" fill="#256049"/>
    <circle cx="136" cy="140" r="38" fill="#1b4232"/>
    <circle cx="82" cy="98" r="36" fill="#2d7053"/>
    <circle cx="126" cy="104" r="32" fill="#256049"/>
    <path d="M56 108 A 52 52 0 0 1 96 66" fill="none" stroke="#8fd4a8" stroke-width="7" stroke-linecap="round" opacity="0.6"/>
    <path d="M74 84 A 34 34 0 0 1 104 70" fill="none" stroke="#b9e8c9" stroke-width="4.5" stroke-linecap="round" opacity="0.5"/>
    <circle cx="88" cy="132" r="5" fill="#ffd166"/>
    <circle cx="122" cy="118" r="4.5" fill="#ffd166"/>
    <circle cx="70" cy="112" r="4" fill="#ffd166" opacity="0.9"/>
    <circle cx="112" cy="146" r="4" fill="#ffd166" opacity="0.85"/>
    <circle cx="140" cy="132" r="3.5" fill="#ffd166" opacity="0.8"/>
  `),
  // شجيرة: كتلة ناعمة بثلاث فصوص وحافة قمرية
  bush: svg(140, 92, `
    <ellipse cx="70" cy="86" rx="56" ry="6" fill="#020617" opacity="0.4"/>
    <ellipse cx="44" cy="62" rx="34" ry="24" fill="#1e4d3a"/>
    <ellipse cx="96" cy="64" rx="32" ry="22" fill="#1b4232"/>
    <ellipse cx="70" cy="46" rx="38" ry="26" fill="#256049"/>
    <path d="M38 52 A 34 26 0 0 1 68 32" fill="none" stroke="#8fd4a8" stroke-width="5" stroke-linecap="round" opacity="0.5"/>
    <circle cx="56" cy="60" r="3.5" fill="#ffd166" opacity="0.85"/>
    <circle cx="88" cy="52" r="3" fill="#ffd166" opacity="0.75"/>
  `),
  // زهرة حمراء: ساق + بتلات مع لمعة قمرية
  'flower-red': svg(56, 64, `
    <path d="M28 62 C 26 48, 27 40, 28 32" stroke="#2d7053" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M28 48 C 20 46, 16 42, 15 36 C 22 37, 26 41, 28 45 Z" fill="#256049"/>
    ${[[28, 18, 0], [40, 26, 60], [37, 40, 120], [19, 40, -120], [16, 26, -60]].map(([x, y, r]) =>
      `<ellipse cx="${x}" cy="${y}" rx="9" ry="6" fill="#f43f5e" transform="rotate(${r} ${x} ${y})"/>`).join('')}
    <circle cx="28" cy="30" r="7" fill="#ffd166"/>
    <circle cx="26" cy="28" r="2.2" fill="#fff7d6" opacity="0.9"/>
  `),
  // زهرة صفراء
  'flower-yellow': svg(56, 64, `
    <path d="M28 62 C 26 48, 27 40, 28 32" stroke="#2d7053" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M28 48 C 20 46, 16 42, 15 36 C 22 37, 26 41, 28 45 Z" fill="#256049"/>
    ${[[28, 18, 0], [40, 26, 60], [37, 40, 120], [19, 40, -120], [16, 26, -60]].map(([x, y, r]) =>
      `<ellipse cx="${x}" cy="${y}" rx="9" ry="6" fill="#fbbf24" transform="rotate(${r} ${x} ${y})"/>`).join('')}
    <circle cx="28" cy="30" r="7" fill="#f59e0b"/>
    <circle cx="26" cy="28" r="2.2" fill="#fff7d6" opacity="0.9"/>
  `),
  // نافورة: حوض حجري + ماء سماوي متلألئ
  fountain: svg(140, 100, `
    <ellipse cx="70" cy="84" rx="62" ry="10" fill="#020617" opacity="0.45"/>
    <ellipse cx="70" cy="74" rx="58" ry="16" fill="#8b95a8"/>
    <ellipse cx="70" cy="70" rx="58" ry="16" fill="#a8b2c4"/>
    <ellipse cx="70" cy="72" rx="48" ry="11" fill="#0ea5e9"/>
    <ellipse cx="70" cy="71" rx="48" ry="11" fill="none" stroke="#7dd3fc" stroke-width="2.5" opacity="0.8"/>
    <ellipse cx="52" cy="70" rx="14" ry="3.5" fill="#bae6fd" opacity="0.7"/>
    <rect x="62" y="34" width="16" height="30" rx="6" fill="#8b95a8"/>
    <rect x="64" y="34" width="6" height="30" rx="3" fill="#a8b2c4"/>
    <circle cx="70" cy="28" r="9" fill="#7dd3fc"/>
    <circle cx="70" cy="28" r="5" fill="#e0f2fe"/>
  `),
  // خبزة عشب منتصبة
  'grass-tuft': svg(48, 44, `
    <path d="M10 44 C 8 30, 12 20, 18 12 C 19 24, 17 34, 15 44 Z" fill="#2d7053"/>
    <path d="M22 44 C 20 26, 24 14, 30 4 C 30 20, 27 32, 26 44 Z" fill="#3a8a65"/>
    <path d="M34 44 C 34 30, 37 20, 42 14 C 41 26, 39 34, 38 44 Z" fill="#2d7053"/>
    <path d="M27 8 C 27 14, 26 18, 26 22" stroke="#8fd4a8" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.7"/>
  `),
}
const GARDEN_SIZES = {
  tree: [200, 260],
  bush: [140, 92],
  'flower-red': [56, 64],
  'flower-yellow': [56, 64],
  fountain: [140, 100],
  'grass-tuft': [48, 44],
}

const jobs = [
  [`${OUT_ENV}/moon.png`, moon, 256, 256],
  [`${OUT_ENV}/lantern.png`, lantern, 150, 200],
  ...Object.entries(icons).map(([n, s]) => [`${OUT_UI}/${n}.png`, s, 128, 128]),
  ...Object.entries(garden).map(([n, s]) => [`${OUT_VEG}/garden-${n}.png`, s, ...GARDEN_SIZES[n]]),
]

for (const [file, body, w, h] of jobs) {
  await sharp(Buffer.from(body)).resize(w, h).png({ compressionLevel: 9 }).toFile(file)
  console.log('✓', file)
}
