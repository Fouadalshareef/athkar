/**
 * DhikrArt — يدير أصول رسوم الأذكار المستخرجة (PNG فردي لكل ذكر).
 * إذا كان الرسم الفني محمّلاً في المشهد يُستخدم بدل الرسم الإجرائي (Procedural)،
 * وإلا ترجع الدالة null فيرسم كل نوع جسمه الإجرائي كالمعتاد (fallback).
 */

/** مفاتيح الأنسجة المحمّلة في BootScene لكل ذكر. */
const ART_KEYS: Record<string, string> = {
  subhanallah: 'dhikr-art-subhanallah',
  alhamdulillah: 'dhikr-art-alhamdulillah',
  'allahu-akbar': 'dhikr-art-allahu-akbar',
  'la-ilaha-illa-allah': 'dhikr-art-la-ilaha-illa-allah',
  'la-hawla': 'dhikr-art-la-hawla',
  'subhanallah-wa-bihamdih': 'dhikr-art-subhanallah-wa-bihamdih',
  salawat: 'dhikr-art-salawat',
}

/**
 * يُرجع مفتاح نسيج الرسم الفني للذكر إذا كان متوفراً في المشهد، وإلا null.
 */
export function getDhikrArtTexture(scene: Phaser.Scene, dhikrId: string): string | null {
  const key = ART_KEYS[dhikrId]
  if (!key) return null
  if (!scene.textures.exists(key)) return null
  return key
}

/**
 * يُرجع معامل التحجيم المحلي المناسب لعرض الرسم الفني داخل الجسم العائم.
 * الهدف: أن يغطي الرسم قطر الجسم المرئي (hitRadius × 2.5) مع هامش للهالة.
 */
export function getDhikrArtScale(scene: Phaser.Scene, textureKey: string, hitRadius: number): number {
  const frame = scene.textures.getFrame(textureKey)
  const maxDim = Math.max(frame.width, frame.height)
  if (maxDim <= 0) return 1
  return (hitRadius * 2.5) / maxDim
}
