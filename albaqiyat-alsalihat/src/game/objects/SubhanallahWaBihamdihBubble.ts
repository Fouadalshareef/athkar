/**
 * SubhanallahWaBihamdihBubble â€” ظپظ‚ط§ط¹ط© ظپظٹط±ظˆط²ظٹط© ط²ط§ظ‡ظٹط© (Cyan / Turquoise Gradient)
 * ظ„ط°ظƒط±: "ط³ظڈط¨ظ’ط­ظژط§ظ†ظژ ط§ظ„ظ„ظژظ‘ظ‡ظگ ظˆظژط¨ظگط­ظژظ…ظ’ط¯ظگظ‡ظگ".
 * ط§ظ„ط£ظ„ظˆط§ظ†: ظپظٹط±ظˆط²ظٹ ظ…طھط¯ط±ط¬ + ط®ط·ظˆط· ط¨ظٹط¶ط§ط، ظ†ط§طµط¹ط© + طھظˆظ‡ط¬ ط¶ظˆط§ط¦ظٹ ظ…ط§ط¦ظٹ.
 */
import Phaser from 'phaser'
import { FloatingObject, type FloatingObjectOptions } from './FloatingObject'

export default class SubhanallahWaBihamdihBubble extends FloatingObject {
  constructor(scene: Phaser.Scene, x: number, y: number, override?: Partial<FloatingObjectOptions>) {
    super(scene, x, y, {
      dhikrId: 'subhanallah-wa-bihamdih',
      dhikrName: 'ط³ظڈط¨ظ’ط­ظژط§ظ†ظژ ط§ظ„ظ„ظژظ‘ظ‡ظگ ظˆظژط¨ظگط­ظژظ…ظ’ط¯ظگظ‡ظگ',
      dhikrTarget: 100,
      speedBase: 72,
      speedMultiplier: 1,
      wiggleAmp: 24,
      wiggleFreq: 2.0,
      popPitch: 2,
      hitRadius: 42,
      ...override,
    })
  }

  protected getGlowColor(): number {
    return 0x67e8f9 // ظپظٹط±ظˆط²ظٹ ظ…طھظˆظ‡ط¬
  }

  protected buildBody(): void {
    const g = this.scene.add.graphics()

    // ظ‡ط§ظ„ط© ظ…ط§ط¦ظٹط© ط®ط§ط±ط¬ظٹط© ظ…طھط¯ط±ط¬ط©
    g.fillStyle(0x06b6d4, 0.08)
    g.fillCircle(0, 0, 58)
    g.fillStyle(0x06b6d4, 0.14)
    g.fillCircle(0, 0, 50)
    g.fillStyle(0x0891b2, 0.2)
    g.fillCircle(0, 0, 44)

    // ط¬ط³ظ… ط§ظ„ظپظ‚ط§ط¹ط© ط§ظ„ظپظٹط±ظˆط²ظٹط© ط§ظ„ط£ط³ط§ط³ظٹط©
    g.fillStyle(0x06b6d4, 0.92)
    g.fillCircle(0, 0, 36)

    // طھط¯ط±ط¬ ظپظٹط±ظˆط²ظٹ ط¯ط§ط®ظ„ظٹ (ط£ط؛ظ…ظ‚ ظ„ظ„ط®ط§ط±ط¬طŒ ط£ظپطھط­ ظ„ظ„ط¯ط§ط®ظ„)
    g.fillStyle(0x0891b2, 0.6)
    g.fillCircle(0, 0, 30)
    g.fillStyle(0x67e8f9, 0.45)
    g.fillCircle(0, 0, 22)
    g.fillStyle(0x67e8f9, 0.3)
    g.fillCircle(0, 0, 14)

    // ظ‚ط·ط±ط© ظ…ط§ط،/ظ‡ظ„ط§ظ„ ظ†ط§طµط¹ ظپظٹ ط§ظ„ظ…ط±ظƒط² â€” ط±ظ…ط² ظپظٹط±ظˆط²ظٹ ظ†ط§ط¹ظ… ظ„ظ„طھط³ط¨ظٹط­
    const dropGlow = this.scene.add.graphics()
    dropGlow.fillStyle(0xecfeff, 0.18)
    dropGlow.fillEllipse(0, 4, 25, 32)
    this.add(dropGlow)
    const drop = this.scene.add.graphics()
    drop.fillStyle(0x99f6e4, 0.9)
    drop.beginPath()
    drop.moveTo(0, -16)
    drop.lineTo(12, 2)
    drop.arc(0, 2, 12, 0, Math.PI, false)
    drop.arc(0, 2, 12, Math.PI, Math.PI * 2, false)
    drop.closePath()
    drop.fillPath()
    drop.lineStyle(2, 0xecfeff, 0.95)
    drop.strokePath()
    // ظ‡ظ„ط§ظ„ طµط؛ظٹط± ط¯ط§ط®ظ„ ط§ظ„ظ‚ط·ط±ط© ظ„طھظ…ظٹظٹط² ط§ظ„ط±ظ…ط² ط¨طµط±ظٹط§ظ‹
    drop.fillStyle(0x0e7490, 0.75)
    drop.fillCircle(2, 1, 7)
    drop.fillStyle(0x99f6e4, 1)
    drop.fillCircle(6, -2, 7)
    this.add(drop)

    // ط®ط·ظˆط· ط¨ظٹط¶ط§ط، ظ†ط§طµط¹ط© (ط£ط´ط¹ط© ظ…ط§ط¦ظٹط©)
    g.lineStyle(2, 0xffffff, 0.7)
    g.lineBetween(0, -36, 0, -28)
    g.lineBetween(0, 28, 0, 36)
    g.lineBetween(-36, 0, -28, 0)
    g.lineBetween(28, 0, 36, 0)

    // ط®ط·ظˆط· ط¨ظٹط¶ط§ط، ظ‚ط·ط±ظٹط© ظ†ط§طµط¹ط©
    g.lineStyle(1.5, 0xffffff, 0.5)
    g.lineBetween(-25, -25, -20, -20)
    g.lineBetween(25, -25, 20, -20)
    g.lineBetween(-25, 25, -20, 20)
    g.lineBetween(25, 25, 20, 20)

    // ط­ط¯ ط®ط§ط±ط¬ظٹ ط£ط¨ظٹط¶ ظ†ط§طµط¹
    g.lineStyle(4, 0xffffff, 1)
    g.strokeCircle(0, 0, 36)

    // ظ„ظ…ط¹ط© ظ…ط§ط¦ظٹط© ط¹ظ„ظˆظٹط©
    g.fillStyle(0xffffff, 0.9)
    g.fillEllipse(-10, -14, 11, 7)
    g.fillStyle(0xffffff, 0.5)
    g.fillEllipse(-5, -8, 6, 4)
    g.fillStyle(0xecfeff, 0.35)
    g.fillEllipse(8, -18, 7, 5)

    this.add(g)

    // طھظˆظ‡ط¬ ظ…ط§ط¦ظٹ ظ†ط§ط³ط¨ ظٹط¯ظˆط± ط¨ط¨ط·ط،
    const waterGlow = this.scene.add.graphics()
    waterGlow.fillStyle(0x67e8f9, 0.15)
    waterGlow.fillCircle(0, 0, 48)
    waterGlow.fillStyle(0x67e8f9, 0.08)
    waterGlow.fillCircle(0, 0, 56)
    this.addAt(waterGlow, 0)

    this.scene.tweens.add({
      targets: waterGlow,
      alpha: { from: 0.7, to: 0.25 },
      scale: { from: 1, to: 1.1 },
      yoyo: true,
      repeat: -1,
      duration: 1600,
      ease: 'Sine.easeInOut',
      delay: Phaser.Math.Between(0, 700),
    })
  }
}
