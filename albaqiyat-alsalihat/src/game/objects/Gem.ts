/**
 * Gem â€” ط¬ظˆظ‡ط±ط© ط¨ظ„ظˆط±ظٹط© ظ…ط§ط³ظٹط© (Diamond Violet) ظ„ط°ظƒط±: "ظ„ظژط§ ط¥ظگظ„ظژظ°ظ‡ظژ ط¥ظگظ„ظژظ‘ط§ ط§ظ„ظ„ظ‡".
 */
import Phaser from 'phaser'
import { FloatingObject, type FloatingObjectOptions } from './FloatingObject'

export default class Gem extends FloatingObject {
  constructor(scene: Phaser.Scene, x: number, y: number, override?: Partial<FloatingObjectOptions>) {
    super(scene, x, y, {
      dhikrId: 'la-ilaha-illa-allah',
      dhikrName: 'ظ„ظژط§ ط¥ظگظ„ظژظ°ظ‡ظژ ط¥ظگظ„ظژظ‘ط§ ط§ظ„ظ„ظ‡',
      dhikrTarget: 100,
      speedBase: 68,
      speedMultiplier: 1,
      wiggleAmp: 24,
      wiggleFreq: 2.2,
      popPitch: -2,
      hitRadius: 40,
      ...override,
    })
  }

  protected getGlowColor(): number {
    return 0xc4b5fd // ط¨ظ†ظپط³ط¬ظٹ ظپط³ظپظˆط±ظٹ ظ…طھظˆظ‡ط¬ ظ„ظ„ط¬ظˆظ‡ط±ط©
  }

  protected buildBody(): void {
    const g = this.scene.add.graphics()

    // ظ‡ط§ظ„ط© ط¨ظ†ظپط³ط¬ظٹط© ظ†ط§ط¹ظ…ط©
    g.fillStyle(0x8b5cf6, 0.16)
    g.fillCircle(0, 0, 44)

    const top = [
      { x: 0, y: -34 },
      { x: 26, y: 0 },
      { x: 0, y: 0 },
      { x: -26, y: 0 },
    ]
    const bottom = [
      { x: 0, y: 0 },
      { x: 26, y: 0 },
      { x: 0, y: 34 },
      { x: -26, y: 0 },
    ]
    const outline = [
      { x: 0, y: -34 },
      { x: 26, y: 0 },
      { x: 0, y: 34 },
      { x: -26, y: 0 },
    ]

    // ط§ظ„ظ†طµظپ ط§ظ„ط¹ظ„ظˆظٹ ط£ظپطھط­طŒ ظˆط§ظ„ظ†طµظپ ط§ظ„ط³ظپظ„ظٹ ط£ط؛ظ…ظ‚ (ط¥ط­ط³ط§ط³ ط¨طµط±ظٹ)
    g.fillStyle(0x8b5cf6, 1)
    g.fillPoints(top, true)
    g.fillStyle(0x7c3aed, 1)
    g.fillPoints(bottom, true)

    // ط­ط¯ ط®ط§ط±ط¬ظٹ ظ…ط¶ظٹط، ط³ظ…ظٹظƒ (4px) ط£ط¨ظٹط¶ ظ†ط§طµط¹
    g.lineStyle(4, 0xffffff, 1)
    g.strokePoints(outline, true)

    // ط®ط·ظˆط· ط§ظ„ط£ظˆط¬ظ‡
    g.lineStyle(1.5, 0xc4b5fd, 0.9)
    g.lineBetween(-26, 0, 0, -14)
    g.lineBetween(26, 0, 0, -14)
    g.lineBetween(0, -34, 0, 0)

    this.add(g)
  }
}
