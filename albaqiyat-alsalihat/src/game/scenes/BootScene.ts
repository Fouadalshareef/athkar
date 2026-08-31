import Phaser from 'phaser'

/**
 * BootScene — شاشة بدء التجربة.
 * تعرض خلفية متدرجة ونص اللعبة للتأكد من أن محرك Phaser يعمل بدون أخطاء.
 */
export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene')
  }

  preload(): void {
    // رسوم الأذكار المستخرجة (فردي لكل ذكر) — يستخدمها FloatingObject بدل الرسم الإجرائي عند توفرها.
    this.load.image('dhikr-art-subhanallah', 'assets/game/bubbles/dhikr-subhanallah.png')
    this.load.image('dhikr-art-alhamdulillah', 'assets/game/bubbles/dhikr-alhamdulillah.png')
    this.load.image('dhikr-art-allahu-akbar', 'assets/game/bubbles/dhikr-allahu-akbar.png')
    this.load.image('dhikr-art-la-ilaha-illa-allah', 'assets/game/bubbles/dhikr-la-ilaha-illa-allah.png')
    this.load.image('dhikr-art-la-hawla', 'assets/game/bubbles/dhikr-la-hawla.png')
    this.load.image('dhikr-art-subhanallah-wa-bihamdih', 'assets/game/bubbles/dhikr-subhanallah-wa-bihamdih.png')
    this.load.image('dhikr-art-salawat', 'assets/game/bubbles/dhikr-salawat.png')
    // أصول البيئة الليلية (قمر + فانوس) وأيقونات HUD الموحّدة
    this.load.image('env-moon', 'assets/game/environment/moon.png')
    this.load.image('env-lantern', 'assets/game/environment/lantern.png')
    this.load.image('icon-gear', 'assets/game/ui/icon-gear.png')
    this.load.image('icon-sliders', 'assets/game/ui/icon-sliders.png')
    this.load.image('icon-leaf', 'assets/game/ui/icon-leaf.png')
    this.load.image('icon-quran', 'assets/game/ui/icon-quran.png')
    this.load.image('icon-pause', 'assets/game/ui/icon-pause.png')
    this.load.image('icon-play', 'assets/game/ui/icon-play.png')
    // أزرار HUD المخصصة
    this.load.image('btn_settings', new URL('../buttons/1.jfif', import.meta.url).href)
    this.load.image('btn_theme', new URL('../buttons/2.jfif', import.meta.url).href)
    this.load.image('btn_farm', new URL('../buttons/3.jfif', import.meta.url).href)
    this.load.image('btn_quran', new URL('../buttons/4.jfif', import.meta.url).href)
    this.load.image('btn_pause', new URL('../buttons/5.jfif', import.meta.url).href)
    this.load.image('btn_play', new URL('../buttons/6.jfif', import.meta.url).href)
    // أصول الحديقة الليلية (شجرة/شجيرة/زهور/نافورة/عشب)
    this.load.image('garden-tree', 'assets/game/vegetation/garden-tree.png')
    this.load.image('garden-bush', 'assets/game/vegetation/garden-bush.png')
    this.load.image('garden-flower-red', 'assets/game/vegetation/garden-flower-red.png')
    this.load.image('garden-flower-yellow', 'assets/game/vegetation/garden-flower-yellow.png')
    this.load.image('garden-fountain', 'assets/game/vegetation/garden-fountain.png')
    this.load.image('garden-grass-tuft', 'assets/game/vegetation/garden-grass-tuft.png')
    // أصول مقطوعة آلياً بأداة `scripts/cut_assets.py` (شفافة، عالية الجودة).
    // متاحة تحت المفاتيح `cut_*` لاستخدامها مباشرة داخل اللعبة عند الحاجة.
    const cutAssets: Array<[string, string]> = [
      ['cut_item_1', 'cut_item_1.png'],
      ['cut_item_2', 'cut_item_2.png'],
      ['cut_item_3', 'cut_item_3.png'],
      ['cut_item_4', 'cut_item_4.png'],
      ['cut_item_5', 'cut_item_5.png'],
      ['cut_item_6', 'cut_item_6.png'],
      ['cut_item_7', 'cut_item_7.png'],
      ['cut_item_8', 'cut_item_8.png'],
      ['cut_item_9', 'cut_item_9.png'],
      ['cut_item_10', 'cut_item_10.png'],
      ['cut_btn_1', 'cut_btn_1.png'],
      ['cut_btn_2', 'cut_btn_2.png'],
      ['cut_btn_3', 'cut_btn_3.png'],
      ['cut_btn_4', 'cut_btn_4.png'],
      ['cut_btn_5', 'cut_btn_5.png'],
      ['cut_btn_6', 'cut_btn_6.png'],
      ['cut_btn_7', 'cut_btn_7.png'],
      ['cut_btn_8', 'cut_btn_8.png'],
      ['cut_btn_9', 'cut_btn_9.png'],
      ['cut_btn_10', 'cut_btn_10.png'],
      ['cut_btn_11', 'cut_btn_11.png'],
      ['cut_btn_12', 'cut_btn_12.png'],
      ['cut_bg_1', 'cut_bg_1.png'],
      ['cut_bg_2', 'cut_bg_2.png'],
    ]
    for (const [key, file] of cutAssets) {
      this.load.image(key, 'assets/images/cut_assets/' + file)
    }
  }

  create(): void {
    // منع أي انزياح في إحداثيات اللمس بين HTML والـ Canvas
    this.scale.refresh()
    const { width, height } = this.scale
    const cx = width / 2

    // 1) خلفية فاخرة: تدرج عميق (أزرق ليلي → زمردي داكن) بدل الأخضر الصريح
    const background = this.add.graphics()
    background.fillGradientStyle(0x02150f, 0x02150f, 0x062e22, 0x010a14, 1)
    background.fillRect(0, 0, width, height)

    // 2) زخارف هندسية دقيقة (أقواس متحدة المركز شفافة جداً — إحساس فاخر هادئ)
    const decor = this.add.graphics()
    decor.lineStyle(1, 0x34d399, 0.07)
    for (let i = 0; i < 12; i++) {
      decor.strokeCircle(cx, height * 0.42, 120 + i * 55)
    }

    // 3) vignette داكن على الأطراف لتركيز النظر في المنتصف
    const vignette = this.add.graphics()
    vignette.fillStyle(0x000000, 0.22)
    vignette.fillRect(0, 0, width, height * 0.08)
    vignette.fillRect(0, height * 0.92, width, height * 0.08)

    // 4) هالة ضوئية ذهبية ناعمة خلف البطاقة
    const glow = this.add.graphics()
    glow.fillStyle(0xfacc15, 0.04)
    glow.fillCircle(cx, height * 0.38, 210)
    glow.fillStyle(0xfacc15, 0.08)
    glow.fillCircle(cx, height * 0.38, 110)

    // 5) بطاقة ترحيب مركزية أنيقة بحواف مائلة (عرض أوسع لاحتواء العنوان)
    const cardW = Math.min(width * 0.92, 440)
    const cardH = 260
    const cardY = height * 0.38
    const cardPadding = 24
    const card = this.add.graphics()
    card.fillStyle(0x0a1f18, 0.92)
    card.fillRoundedRect(cx - cardW / 2, cardY - cardH / 2, cardW, cardH, 24)
    card.lineStyle(2, 0xfacc15, 0.55)
    card.strokeRoundedRect(cx - cardW / 2, cardY - cardH / 2, cardW, cardH, 24)
    card.lineStyle(1, 0xffffff, 0.12)
    card.strokeRoundedRect(cx - cardW / 2 + 8, cardY - cardH / 2 + 8, cardW - 16, cardH - 16, 18)

    // 6) البسملة أعلى البطاقة
    const bismillah = this.add
      .text(cx, cardY - cardH / 2 + 40, 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', {
        fontFamily: '"Amiri", "Scheherazade New", "Segoe UI", Arial, sans-serif',
        fontSize: '24px',
        color: '#d1fae5',
      })
      .setOrigin(0.5)
      .setAlpha(0)

    // 7) فاصل زخرفي ذهبي (خط + معين) — فاصل مستقل بين البسملة والعنوان
    //    بهوامش رأسية مريحة (≥ 16px) وخطان أبعد عن النقطة المركزية لمنع التداخل
    const dividerY = cardY - 48
    const divider = this.add.graphics()
    divider.lineStyle(1.5, 0xfacc15, 0.6)
    divider.lineBetween(cx - 95, dividerY, cx - 20, dividerY)
    divider.lineBetween(cx + 20, dividerY, cx + 95, dividerY)
    divider.fillStyle(0xfacc15, 0.9)
    divider.fillPoints(
      [
        { x: cx, y: dividerY - 7 },
        { x: cx + 7, y: dividerY },
        { x: cx, y: dividerY + 7 },
        { x: cx - 7, y: dividerY },
      ],
      true,
    )

    // 8) عنوان التطبيق بخط عربي فاخر وتأثير ذهبي (حجم متجاوب مع لفظ تلقائي)
    const titleFontSize = Math.min(Math.max(Math.floor(cardW * 0.1), 28), 48)
    const title = this.add
      .text(cx, cardY + 8, 'الباقيات الصالحات', {
        fontFamily: '"Amiri", "Scheherazade New", "Segoe UI", Arial, sans-serif',
        fontSize: `${titleFontSize}px`,
        fontStyle: 'bold',
        color: '#fef08a',
        align: 'center',
        wordWrap: { width: cardW - cardPadding * 2, useAdvancedWrap: true },
      })
      .setOrigin(0.5)
      .setAlpha(0)
      .setShadow(0, 4, 'rgba(0,0,0,0.6)', 12, true, true)
    title.setStroke('#713f12', 3)

    // 9) رسالة ترحيبية هادئة
    const subtitle = this.add
      .text(cx, cardY + cardH / 2 - 42, 'طمأنينة القلوب بذكر الله', {
        fontFamily: '"Amiri", "Scheherazade New", "Segoe UI", Arial, sans-serif',
        fontSize: '24px',
        color: '#a7f3d0',
      })
      .setOrigin(0.5)
      .setAlpha(0)
    subtitle.setShadow(0, 2, 'rgba(0,0,0,0.5)', 4, true, true)

    // 10) نص "اضغط للبدء" نابض أسفل الشاشة
    const startText = this.add
      .text(cx, height - 110, '« اضغط في أي مكان للبدء »', {
        fontFamily: '"Amiri", "Segoe UI", Tahoma, sans-serif',
        fontSize: '22px',
        color: '#6ee7b7',
      })
      .setOrigin(0.5)
      .setAlpha(0)

    // حركات دخول متسلسلة راقية (Fade In متدرج + طفو خفيف)
    this.tweens.add({ targets: bismillah, alpha: 1, y: '-=8', duration: 1100, ease: 'Power2' })
    this.tweens.add({ targets: title, y: '-=6', alpha: 1, duration: 1400, delay: 400, ease: 'Power3' })
    this.tweens.add({ targets: subtitle, alpha: 1, y: '-=6', duration: 1200, delay: 900, ease: 'Power3' })
    this.tweens.add({
      targets: startText,
      alpha: { from: 0.2, to: 1 },
      yoyo: true,
      repeat: -1,
      duration: 1200,
      delay: 1600,
      ease: 'Sine.easeInOut',
    })

    // الانتقال إلى شاشة اللعب: بالضغط مع تأثير انتقال ناعم
    this.input.once('pointerdown', () => {
      this.cameras.main.fadeOut(400, 2, 21, 15)
      this.time.delayedCall(400, () => this.scene.start('MainScene'))
    })

    // تلقائياً بعد 6 ثوانٍ
    this.time.delayedCall(6000, () => {
      if (this.scene.isActive()) {
        this.cameras.main.fadeOut(400, 2, 21, 15)
        this.time.delayedCall(400, () => this.scene.start('MainScene'))
      }
    })
  }
}
