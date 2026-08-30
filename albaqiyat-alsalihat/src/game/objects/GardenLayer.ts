/**
 * GardenLayer — طبقة حديقة الحسنات داخل مشهد Phaser:
 * ترسم العناصر المفتوحة (عشب، زهور، شجيرات، شجرة، عصافير، نافورة، فراشات، قوس قزح)
 * بأسلوب زاهٍ في طبقة خلفية (Depth منخفض) خلف الأجسام العائمة، مع حركة خفيفة حية.
 */
import Phaser from 'phaser'
import { getUnlockedIds, getGardenState } from '../../services/GardenService'

export default class GardenLayer extends Phaser.GameObjects.Container {
  private unlocked: string[] = []

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0)
    this.setDepth(-10)
    scene.add.existing(this)
    this.refresh()
  }

  /** إعادة بناء الحديقة من الرصيد المخزن (تُستدعى عند زيادة الأذكار). */
  refresh(): void {
    const unlocked = getUnlockedIds()
    if (JSON.stringify(unlocked) === JSON.stringify(this.unlocked)) return
    this.unlocked = unlocked
    this.removeAll(true)

    const { width, height } = this.scene.scale
    const groundY = height - 40

    if (unlocked.includes('rainbow')) this.buildRainbow(width, groundY)
    if (unlocked.includes('grass')) this.buildGrass(width, groundY)
    if (unlocked.includes('fountain')) this.buildFountain(width / 2, groundY - 6)
    if (unlocked.includes('tree')) this.buildTree(width - 110, groundY - 4)
    if (unlocked.includes('bush')) this.buildBush(110, groundY - 4)
    if (unlocked.includes('flower-red')) this.buildFlowers(width, groundY, 'flower-red')
    if (unlocked.includes('flower-yellow')) this.buildFlowers(width, groundY, 'flower-yellow')
    if (unlocked.includes('bird')) this.buildBirds(width, height)
    if (unlocked.includes('butterflies')) this.buildButterflies(width, groundY)
  }

  /** أرضية ليلية: تلال داكنة بهدوء قمري + خبزات عشب من الأصول. */
  private buildGrass(width: number, groundY: number): void {
    const base = this.scene.scale.height

    // 1) جسم أرضي داكن (ليلة هادئة) بانتقال ناعم نحو الأسفل
    const groundG = this.scene.add.graphics()
    groundG.fillGradientStyle(0x14352a, 0x14352a, 0x0b241c, 0x071a14, 1)
    groundG.fillRect(-20, groundY, width + 40, base - groundY + 10)
    this.add(groundG)

    // 2) تلال عشبية داكنة بحافة مضيئة قمرياً من الأعلى
    const g = this.scene.add.graphics()
    g.fillStyle(0x1a4a38, 1)
    g.fillEllipse(width * 0.5, groundY - 4, width * 0.55, 92)
    g.fillStyle(0x163d2f, 1)
    g.fillEllipse(width * 0.16, groundY + 12, width * 0.4, 80)
    g.fillEllipse(width * 0.85, groundY + 12, width * 0.42, 84)
    // حافة إضاءة علوية (ضوء القمر يمس قمم التلال)
    g.lineStyle(2, 0x8fd4a8, 0.35)
    g.strokeEllipse(width * 0.5, groundY - 8, width * 0.5, 84)
    g.lineStyle(1.5, 0x8fd4a8, 0.22)
    g.strokeEllipse(width * 0.16, groundY + 6, width * 0.34, 72)
    g.lineStyle(1.5, 0x8fd4a8, 0.22)
    g.strokeEllipse(width * 0.85, groundY + 6, width * 0.36, 76)
    this.add(g)

    // 3) خبزات عشب من الأصول مع تنويع بسيط
    if (this.scene.textures.exists('garden-grass-tuft')) {
      for (let i = 0; i < 9; i++) {
        const tx = width * (0.06 + i * 0.11) + Phaser.Math.Between(-10, 10)
        const tuft = this.scene.add.image(tx, groundY + Phaser.Math.Between(10, 26), 'garden-grass-tuft')
        tuft.setScale(Phaser.Math.FloatBetween(0.75, 1.15)).setFlipX(Phaser.Math.Between(0, 1) === 1)
        this.add(tuft)
      }
    }
  }

  /** زهور من الأصول مع تنويع مقياس/دوران وتمايل ناعم. */
  private buildFlowers(width: number, groundY: number, kind: string): void {
    const texture = `garden-${kind}`
    if (!this.scene.textures.exists(texture)) return
    const positions =
      kind === 'flower-red'
        ? [0.12, 0.3, 0.55, 0.78, 0.92]
        : [0.2, 0.42, 0.66, 0.86]
    positions.forEach((fx, i) => {
      const flower = this.scene.add.image(width * fx, groundY + 14 + (i % 2) * 14, texture)
      flower.setScale(0).setAngle(Phaser.Math.Between(-8, 8))
      // ظهور مرن عند الفتح + تمايل هادئ
      this.scene.tweens.add({
        targets: flower,
        scale: Phaser.Math.FloatBetween(0.85, 1.15),
        duration: 520,
        delay: i * 90,
        ease: 'Back.easeOut',
      })
      this.scene.tweens.add({
        targets: flower,
        angle: { from: -4, to: 4 },
        yoyo: true,
        repeat: -1,
        duration: 1800 + i * 220,
        ease: 'Sine.easeInOut',
      })
      this.add(flower)
    })
  }

  /** شجيرة من الأصول مع نبض نموّ هادئ. */
  private buildBush(x: number, y: number): void {
    if (!this.scene.textures.exists('garden-bush')) return
    const bush = this.scene.add.image(x, y - 6, 'garden-bush').setScale(0)
    this.scene.tweens.add({
      targets: bush,
      scale: 1.15,
      duration: 560,
      ease: 'Back.easeOut',
    })
    this.scene.tweens.add({
      targets: bush,
      scaleX: { from: 1.15, to: 1.2 },
      scaleY: { from: 1.15, to: 1.1 },
      yoyo: true,
      repeat: -1,
      duration: 2400,
      ease: 'Sine.easeInOut',
    })
    this.add(bush)
  }

  /** شجرة مثمرة من الأصول: ظهور مرن + تمايل خفيف + توهج ثمار ذهبية. */
  private buildTree(x: number, y: number): void {
    if (!this.scene.textures.exists('garden-tree')) return
    const tree = this.scene.add.image(x, y - 96, 'garden-tree').setScale(0)
    this.scene.tweens.add({
      targets: tree,
      scale: 1.1,
      duration: 700,
      ease: 'Back.easeOut',
    })
    this.scene.tweens.add({
      targets: tree,
      angle: { from: -1.2, to: 1.2 },
      yoyo: true,
      repeat: -1,
      duration: 3400,
      ease: 'Sine.easeInOut',
    })
    // وميض ذهبي ناعم على الثمار (تغيّر سطوع الصورة ككل بحدود خفيفة)
    this.scene.tweens.add({
      targets: tree,
      alpha: { from: 1, to: 0.88 },
      yoyo: true,
      repeat: -1,
      duration: 2600,
      delay: 900,
      ease: 'Sine.easeInOut',
    })
    this.add(tree)
  }

  /** عصفوران ظليان يطيران أفقياً فوق السماء بهدوء. */
  private buildBirds(width: number, height: number): void {
    const colors = [0x7dd3fc, 0xc4b5fd]
    colors.forEach((color, i) => {
      const bird = this.scene.add.container(-40, height * (0.22 + i * 0.1))
      const g = this.scene.add.graphics()
      // جسم ظلي ناعم مع توهج خفيف
      g.fillStyle(color, 0.9)
      g.fillEllipse(0, 0, 22, 12)
      g.fillCircle(9, -4, 5.5)
      g.fillStyle(0x0f172a, 1)
      g.fillCircle(11, -5, 1.4)
      g.fillStyle(0xfde68a, 1)
      g.fillTriangle(13, -4, 18, -2.5, 13, -1.5)
      bird.add(g)
      bird.setAlpha(0.85)
      const dir = i === 0 ? 1 : -1
      bird.setScale(dir, 1)
      this.scene.tweens.add({
        targets: bird,
        x: dir === 1 ? width + 40 : -40,
        duration: 16000 + i * 5000,
        repeat: -1,
        delay: i * 4000,
        onRepeat: () => {
          bird.y = height * Phaser.Math.FloatBetween(0.16, 0.34)
        },
      })
      // رفرفة (تذبذب رأسي خفيف)
      this.scene.tweens.add({
        targets: bird,
        y: '-=14',
        yoyo: true,
        repeat: -1,
        duration: 700,
        ease: 'Sine.easeInOut',
      })
      this.add(bird)
    })
  }

  /** نافورة من الأصول: ماء سماوي مضيء مع انعكاس ناعم ونبض خفيف. */
  private buildFountain(x: number, y: number): void {
    const parts: Phaser.GameObjects.GameObject[] = []
    // بركة ماء متوهجة (أساس مضيء تحت الأصل)
    const pool = this.scene.add.graphics()
    pool.fillStyle(0x0c4a6e, 0.85)
    pool.fillEllipse(0, 4, 104, 26)
    pool.fillStyle(0x38bdf8, 0.5)
    pool.fillEllipse(0, 3, 88, 18)
    pool.fillStyle(0xbae6fd, 0.55)
    pool.fillEllipse(0, 2, 52, 9)
    parts.push(pool)
    // تموّج ماء ناعم (حلقتان تتنفسان ببطء)
    const ripple = this.scene.add.graphics()
    ripple.lineStyle(1.5, 0xbae6fd, 0.5)
    ripple.strokeEllipse(0, 3, 60, 12)
    this.scene.tweens.add({
      targets: ripple,
      scaleX: { from: 0.6, to: 1.5 },
      scaleY: { from: 0.6, to: 1.5 },
      alpha: { from: 0.55, to: 0 },
      duration: 2200,
      repeat: -1,
      ease: 'Sine.easeOut',
    })
    parts.push(ripple)
    // جسم النافورة من الأصول + عمود ماء متوهج
    if (this.scene.textures.exists('garden-fountain')) {
      const body = this.scene.add.image(0, -22, 'garden-fountain')
      parts.push(body)
    } else {
      const g = this.scene.add.graphics()
      g.fillStyle(0x334155, 1)
      g.fillRoundedRect(-6, -30, 12, 30, 4)
      parts.push(g)
    }
    const jet = this.scene.add.graphics()
    jet.fillStyle(0x7dd3fc, 0.9)
    jet.fillCircle(0, -38, 4)
    jet.fillStyle(0xe0f2fe, 0.7)
    jet.fillCircle(0, -44, 2.5)
    this.scene.tweens.add({
      targets: jet,
      y: -16,
      alpha: { from: 1, to: 0.2 },
      scaleX: 2.2,
      scaleY: 0.5,
      yoyo: true,
      repeat: -1,
      duration: 950,
      ease: 'Sine.easeOut',
    })
    parts.push(jet)
    const container = this.scene.add.container(x, y, parts)
    // نبض توهج ذهبي خفيف (ضوء الفانوس يلامس الماء)
    this.scene.tweens.add({
      targets: pool,
      alpha: { from: 1, to: 0.8 },
      yoyo: true,
      repeat: -1,
      duration: 2800,
      ease: 'Sine.easeInOut',
    })
    this.add(container)
  }

  /** فراشات ليلية (تصوير ظلي ناعم) تتحرك بهدوء فوق الحديقة. */
  private buildButterflies(width: number, groundY: number): void {
    const colors = [0xfbbf24, 0xc4b5fd, 0x86efac]
    colors.forEach((color, i) => {
      const bf = this.scene.add.container(width * (0.25 + i * 0.25), groundY - 90 - i * 40)
      const g = this.scene.add.graphics()
      // أجنحة شفافة متوهجة بروح الليل
      g.fillStyle(color, 0.85)
      g.fillEllipse(-6, 0, 12, 9)
      g.fillEllipse(6, 0, 12, 9)
      g.fillStyle(0xfff7ed, 0.5)
      g.fillEllipse(-6, -2, 7, 5)
      g.fillEllipse(6, -2, 7, 5)
      g.fillStyle(0x1e293b, 1)
      g.fillRoundedRect(-1.5, -5, 3, 10, 1.5)
      bf.add(g)
      bf.setAlpha(0.9)
      this.scene.tweens.add({
        targets: bf,
        x: `+=${Phaser.Math.Between(-110, 110)}`,
        y: `+=${Phaser.Math.Between(-46, 46)}`,
        yoyo: true,
        repeat: -1,
        duration: 3400 + i * 900,
        ease: 'Sine.easeInOut',
      })
      // رفرفة أجنحة (نبض شفافية خفيف)
      this.scene.tweens.add({
        targets: bf,
        alpha: { from: 0.9, to: 0.55 },
        yoyo: true,
        repeat: -1,
        duration: 420 + i * 60,
        ease: 'Sine.easeInOut',
      })
      this.add(bf)
    })
  }

  /** قوس قزح نادر: يظهر شفافاً مع وميض سماوي بطيء (مكافأة بصرية نادرة). */
  private buildRainbow(width: number, groundY: number): void {
    const g = this.scene.add.graphics()
    const colors = [0xfda4af, 0xfcd34d, 0x86efac, 0x7dd3fc, 0xc4b5fd]
    const cx = width / 2
    const cy = groundY + 20
    colors.forEach((color, i) => {
      g.lineStyle(7, color, 0.22)
      g.strokeCircle(cx, cy, 300 - i * 8)
    })
    // توهج داخلي ناعم يتنفس ببطء شديد
    this.scene.tweens.add({
      targets: g,
      alpha: { from: 0.55, to: 0.95 },
      yoyo: true,
      repeat: -1,
      duration: 4200,
      ease: 'Sine.easeInOut',
    })
    this.add(g)
  }

  /** حالة الحديقة الحالية (للعرض في لوحة التحكم). */
  getGardenInfo(): { level: number; total: number; progress: number } {
    const s = getGardenState()
    return { level: s.level, total: s.total, progress: s.progress }
  }
}