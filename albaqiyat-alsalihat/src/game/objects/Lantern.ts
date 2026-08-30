/**
 * Lantern â€” ظ‚ظ†ط¯ظٹظ„ ظٹط§ظ‚ظˆطھظٹ ط£ط­ظ…ط± (Ruby Red) ظ„ط°ظƒط±: "ط§ظ„ظ„ظ‡ظڈ ط£ظژظƒظ’ط¨ظژط±".
 */
import Phaser from 'phaser'
import { FloatingObject, type FloatingObjectOptions } from './FloatingObject'

export default class Lantern extends FloatingObject {
  constructor(scene: Phaser.Scene, x: number, y: number, override?: Partial<FloatingObjectOptions>) {
    super(scene, x, y, {
      dhikrId: 'allahu-akbar',
      dhikrName: 'ط§ظ„ظ„ظ‡ظڈ ط£ظژظƒظ’ط¨ظژط±',
      dhikrTarget: 34,
      speedBase: 60,
      speedMultiplier: 1,
      wiggleAmp: 16,
      wiggleFreq: 1.4,
      popPitch: 5,
      hitRadius: 42,
      ...override,
    })
  }

  protected getGlowColor(): number {
    return 0xfbbf24 // ط£ط­ظ…ط± ظپط³ظپظˆط±ظٹ ظ…طھظˆظ‡ط¬ ظ„ظ„ظ‚ظ†ط¯ظٹظ„
  }

  protected buildBody(): void {
    const g = this.scene.add.graphics()

    // ظ‡ط§ظ„ط© ط­ظ…ط±ط§ط، ظ†ط§ط¹ظ…ط©
    g.fillStyle(0xef4444, 0.15)
    g.fillCircle(0, -2, 46)

    // ط¬ط³ظ… ط§ظ„ظ‚ظ†ط¯ظٹظ„
    g.fillStyle(0xef4444, 0.95)
    g.fillRoundedRect(-24, -38, 48, 68, 18)
    g.lineStyle(4, 0xffffff, 1)
    g.strokeRoundedRect(-24, -38, 48, 68, 18)

    // ط¶ظˆط، ط¯ط§ط®ظ„ظٹ
    g.fillStyle(0xfca5a5, 0.5)
    g.fillCircle(0, 0, 15)

    // ط§ظ„ط؛ط·ط§ط، ط§ظ„ط¹ظ„ظˆظٹ
    g.fillStyle(0xdc2626, 1)
    g.fillRoundedRect(-20, -56, 40, 14, 6)

    // ط§ظ„ظ‚ط§ط¹ط¯ط© ط§ظ„ط³ظپظ„ظٹط©
    g.fillRect(-16, 32, 32, 6)

    // ط´ط±ظ‘ط§ط¨ط© طµط؛ظٹط±ط©
    g.lineStyle(2, 0xfda4af, 1)
    g.beginPath()
    g.moveTo(0, 38)
    g.lineTo(-2, 50)
    g.lineTo(2, 62)
    g.strokePath()
    g.fillStyle(0xfca5a5, 1)
    g.fillCircle(0, 64, 3)

    // ط­ظ„ظ‚ط© طھط¹ظ„ظٹظ‚ ط¹ظ„ظˆظٹط© ظ…ط¶ظٹط¦ط©
    g.lineStyle(3, 0xfecdd3, 0.9)
    g.strokeCircle(0, -62, 6)

    this.add(g)
  }
}
