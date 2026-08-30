/**
 * Bubble â€” ظپظ‚ط§ط¹ط© ظ…ط§ط¦ظٹط© ط²ط¨ط±ط¬ط¯ظٹط© (Teal/Cyan) ط¨ط±ظ‘ط§ظ‚ط© ظ„ط°ظƒط±: "ط³ظڈط¨ظ’ط­ظژط§ظ†ظژ ط§ظ„ظ„ظ‡".
 */
import Phaser from 'phaser'
import { FloatingObject, type FloatingObjectOptions } from './FloatingObject'

export default class Bubble extends FloatingObject {
  constructor(scene: Phaser.Scene, x: number, y: number, override?: Partial<FloatingObjectOptions>) {
    super(scene, x, y, {
      dhikrId: 'subhanallah',
      dhikrName: 'ط³ظڈط¨ظ’ط­ظژط§ظ†ظژ ط§ظ„ظ„ظ‡',
      dhikrTarget: 33,
      speedBase: 78,
      speedMultiplier: 1,
      wiggleAmp: 22,
      wiggleFreq: 1.8,
      popPitch: 0,
      hitRadius: 40,
      ...override,
    })
  }

  protected getGlowColor(): number {
    return 0x7dd3fc // ظپط³ظپظˆط±ظٹ ط³ظ…ط§ظˆظٹ ظ…طھظˆظ‡ط¬
  }

  protected buildBody(): void {
    const g = this.scene.add.graphics()

    // ظ‡ط§ظ„ط© ط®ط§ط±ط¬ظٹط© ظ†ط§ط¹ظ…ط©
    g.fillStyle(0x00ffff, 0.4)
    g.fillCircle(0, 0, 48)

    // ط¬ط³ظ… ط§ظ„ظپظ‚ط§ط¹ط© ط¨ط£ظ„ظˆط§ظ† ط²ط§ظ‡ظٹط© ط¬ط¯ط§ظ‹
    g.fillStyle(0x06b6d4, 0.95)
    g.fillCircle(0, 0, 32)

    // ط­ط¯ ط®ط§ط±ط¬ظٹ ط³ظ…ظٹظƒ ظˆظˆط§ط¶ط­ (4px ط§ظ„ط£ط¨ظٹط¶ ط§ظ„ظ†ط§طµط¹ ظƒظ…ط§ ط·ظڈظ„ط¨)
    g.lineStyle(4, 0xffffff, 1)
    g.strokeCircle(0, 0, 32)

    // ظ‚ظ„ط¨ ظ…ط¶ظٹط، ط¯ط§ط®ظ„ظٹ
    g.fillStyle(0x67e8f9, 0.5)
    g.fillCircle(0, 0, 18)

    // ظ„ظ…ط¹ط©
    g.fillStyle(0xffffff, 0.9)
    g.fillEllipse(-9, -13, 12, 8)
    g.fillStyle(0xffffff, 0.6)
    g.fillEllipse(-4, -6, 6, 4)

    this.add(g)

    // ط¨ط±ظٹظ‚ ظ…طھظ„ط£ظ„ط¦ (ظ†ط¬ظ…ط© طھظ„ظ…ط¹ ط¨ظ„ط§ طھظˆظ‚ظپ)
    const spark = this.scene.add.graphics()
    this.scene.tweens.add({
      targets: spark,
      alpha: { from: 1, to: 0.15 },
      yoyo: true,
      repeat: -1,
      duration: 700,
      delay: Phaser.Math.Between(0, 600),
    })
    spark.fillStyle(0xfef3c7, 1)
    spark.fillPoints(
      [
        { x: 14, y: -24 },
        { x: 17, y: -21 },
        { x: 14, y: -18 },
        { x: 11, y: -21 },
      ],
      true,
    )
    this.add(spark)
  }
}
