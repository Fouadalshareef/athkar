// Extract the 7 top-row dhikr bubbles from the composite sheet.
// The sheet already has an alpha channel with a mostly-transparent background.
import sharp from 'sharp';
import path from 'path';

const SRC = 'src/game/41eca6da-f9ce-4c49-90be-aef35a895b3a.png';
const OUT_DIR = 'public/assets/game/bubbles';

// 7 variants, left-to-right in the top row of the 1536x1024 sheet
const variants = [
  'subhanallah',
  'alhamdulillah',
  'allahu-akbar',
  'la-ilaha-illa-allah',
  'la-hawla',
  'subhanallah-wa-bihamdih',
  'salawat',
];

const W = 1536, H = 1024;
// Top-row band: bubbles occupy roughly y 42..290 in the sheet
const BAND = { left: 0, top: 42, width: W, height: 248 };

// Per-variant inset applied to the column crop to exclude neighbouring artwork
// (title banner ribbon, neighbour leaves).
const insets = {
  'allahu-akbar': { top: 18, right: 14 },
  'la-ilaha-illa-allah': { top: 18 },
  'la-hawla': { top: 18, right: 8 },
  'subhanallah-wa-bihamdih': { top: 8, right: 12 },
};

(async () => {
  const meta = await sharp(SRC).metadata();
  if (meta.width !== W || meta.height !== H) {
    console.warn(`Unexpected size ${meta.width}x${meta.height}`);
  }

  const colW = W / variants.length;
  for (let i = 0; i < variants.length; i++) {
    const name = variants[i];
    const ins = insets[name] || {};
    const crop = {
      left: Math.min(Math.max(0, Math.round(i * colW)), W - Math.round(colW)),
      top: BAND.top + (ins.top || 0),
      width: Math.round(colW) - (ins.right || 0),
      height: BAND.height - (ins.top || 0),
    };
    // Key out the semi-transparent sky: any pixel with alpha < 60 becomes fully
    // transparent so trim() can find the bubble bounds; glow (higher alpha) survives.
    const keyed = await sharp(SRC)
      .extract(crop)
      .raw()
      .toBuffer({ resolveWithObject: true });
    const d = keyed.data;
    for (let p = 3; p < d.length; p += 4) {
      if (d[p] < 16) d[p] = 0;
    }
    const out = path.join(OUT_DIR, `dhikr-${variants[i]}.png`);
    const keyedPng = await sharp(d, {
      raw: { width: keyed.info.width, height: keyed.info.height, channels: 4 },
    })
      .png()
      .toBuffer();
    await sharp(keyedPng)
      .trim({ threshold: 12 }) // trim transparent margins around the bubble
      .png()
      .toFile(out);
    const m = await sharp(out).metadata();
    console.log(`${variants[i]}: ${m.width}x${m.height} -> ${out}`);
  }
})();
