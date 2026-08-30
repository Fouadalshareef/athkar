/**
 * FloatingObject â€” ط§ظ„ظپط¦ط© ط§ظ„ط£ط³ط§ط³ظٹط© ظ„ظƒظ„ ط§ظ„ط£ط¬ط³ط§ظ… ط§ظ„ط¹ط§ط¦ظ…ط© (Bubble, Balloon, Gem, Lantern).
 * طھظˆظپط±: ط§ظ„ط­ط±ظƒط© ط§ظ„طµط§ط¹ط¯ط© ط§ظ„ط³ظ„ط³ط© + ط§ظ„طھظ…ط§ظˆط¬ ط§ظ„ط¬ظٹط¨ظٹ ط§ظ„ط£ظپظ‚ظٹ + ط§ظ„طھط­ظƒظ… ط¨ط³ط±ط¹ط© ط§ظ„طھطµط§ط¹ط¯طŒ
 * ظˆط§ظ„طھظپط§ط¹ظ„ ط¹ظ†ط¯ ط§ظ„ط¶ط؛ط· (ظپط±ظ‚ط¹ط©: ط¬ط²ظٹط¦ط§طھ + طµظˆطھ + ط§ظ‡طھط²ط§ط² + ط­ط¯ط« ط²ظٹط§ط¯ط© ط§ظ„ط±طµظٹط¯).
 */
import Phaser from 'phaser'
import { playPop } from '../../services/audio'
import { vibrate } from '../../services/haptics'
import { emitGoldBurst } from './ParticleBurst'
import { Events } from '../events'
import { getSpeed } from '../../services/SettingsService'
import { getDhikrArtTexture, getDhikrArtScale } from './DhikrArt'

/** ظ…ط¹ط§ظ…ظ„ طھظƒط¨ظٹط± ط§ظ„ط£ط¬ط³ط§ظ… ط§ظ„ط¹ط§ط¦ظ…ط© â€” 2.0 ظٹط¹ط·ظٹ ط­ط¬ظ…ط§ظ‹ ظ…ط±ظٹط­ط§ظ‹ ظ„ظ„ظ…ط³ ط¯ظˆظ† ط·ط؛ظٹط§ظ† ط¹ظ„ظ‰ ط§ظ„ط´ط§ط´ط©. */
const BODY_SCALE = 2.0

export interface FloatingObjectOptions {
  /** ظ…ط¹ط±ظپ ط§ظ„ط°ظƒط± (ظ…ط«ط§ظ„: "subhanallah"). */
  dhikrId: string
  /** ط§ظ„ط§ط³ظ… ط§ظ„ظ…ط¹ط±ظˆط¶ ظ„ظ„ط°ظƒط±. */
  dhikrName: string
  /** ط§ظ„ط¹ط¯ط¯ ط§ظ„ظ…ط³طھظ‡ط¯ظپ ظ„ط¥ظƒظ…ط§ظ„ ظˆظگط±ط¯ ط§ظ„ط°ظƒط±. */
  dhikrTarget: number
  /** ط§ظ„ط³ط±ط¹ط© ط§ظ„ط£ط³ط§ط³ظٹط© ظ„ظ„طھطµط§ط¹ط¯ ط¨ط§ظ„ط¨ظƒط³ظ„/ط«ط§ظ†ظٹط©. */
  speedBase: number
  /** ظ…ط¶ط§ط¹ظپ ط§ظ„ط³ط±ط¹ط© (ظٹطھط­ظƒظ… ط¨ظ‡ ط§ظ„ظ…ظˆظ„ظ‘ط¯ ط¹ط´ظˆط§ط¦ظٹط§ظ‹ ط£ظˆ ظٹط¯ظˆظٹط§ظ‹). */
  speedMultiplier: number
  /** ط³ط¹ط© ط§ظ„طھظ…ط§ظˆط¬ ط§ظ„ط£ظپظ‚ظٹ. */
  wiggleAmp: number
  /** طھط±ط¯ط¯ ط§ظ„طھظ…ط§ظˆط¬ (ط¯ظˆط±ط©/ط«ط§ظ†ظٹط©). */
  wiggleFreq: number
  /** ط¥ط²ط§ط­ط© ظ†ط؛ظ…ط© ط§ظ„طµظˆطھ ط¹ظ†ط¯ ط§ظ„ظپط±ظ‚ط¹ط©. */
  popPitch: number
  /** ظ†طµظپ ظ‚ط·ط± ظ…ظ†ط·ظ‚ط© ط§ظ„ظ„ظ…ط³. */
  hitRadius: number
}

export abstract class FloatingObject extends Phaser.GameObjects.Container {
  protected readonly opts: FloatingObjectOptions

  private readonly startX: number
  private phase: number
  private popped = false
  /** ظ‡ظ„ ظٹط³طھط®ط¯ظ… ظ‡ط°ط§ ط§ظ„ط¬ط³ظ… ط§ظ„ط±ط³ظ… ط§ظ„ظپظ†ظٹ ط§ظ„ظ…ط³طھط®ط±ط¬ ط¨ط¯ظ„ ط§ظ„ط±ط³ظ… ط§ظ„ط¥ط¬ط±ط§ط¦ظٹطں */
  private usesArt = false
    /** ظ‡ظ„ ط§ظ„ط¬ط³ظ… ظ…ط§ ظٹط²ط§ظ„ ظپظٹ ظ…ط±ط­ظ„ط© ط§ظ„ط§ظ†ط¯ظپط§ط¹ ط§ظ„ط£ظˆظ„ظٹ ط§ظ„ط³ط±ظٹط¹ ط¨ط¹ط¯ ط§ظ„ط¸ظ‡ظˆط±طں */
  private burst = true
  private comboGlow: Phaser.GameObjects.Graphics | null = null

  constructor(scene: Phaser.Scene, x: number, y: number, options: FloatingObjectOptions) {
    super(scene, x, y)

    this.opts = options
    this.startX = x
    this.phase = Phaser.Math.FloatBetween(0, Math.PI * 2)

    // طھظƒط¨ظٹط± ظˆط§ط¶ط­ ظ„ظ„ط¬ط³ظ… ظ„ظٹط³ظ‡ظ„ ظ„ظ…ط³ظ‡
    this.setScale(BODY_SCALE)

    // ط±ظپط¹ ط§ظ„ط¹ظ…ظ‚ ظ„ط¶ظ…ط§ظ† طھظ„ظ‚ظٹ ط£ط­ط¯ط§ط« ط§ظ„ظ„ظ…ط³ ظ‚ط¨ظ„ ط§ظ„ط®ظ„ظپظٹط§طھ ظˆط§ظ„ط·ط¨ظ‚ط§طھ ط§ظ„ط²ط®ط±ظپظٹط©
    this.setDepth(1500)

    // ط¨ظٹط§ظ†ط§طھ ط§ظ„طھط¹ط±ظٹظپ (طھظڈط³طھط®ط¯ظ… ظ„ظ„ظپط­طµ ط§ظ„ط¢ظ„ظٹ ظˆط§ظ„طھظ†ط¸ظٹظپ)
    this.setData('dhikrId', options.dhikrId)
    this.setData('dhikrName', options.dhikrName)

    // ط§ظ„ط±ط³ظ… ط§ظ„ظپظ†ظٹ ط§ظ„ظ…ط³طھط®ط±ط¬ (ط¥ظ† ظˆظڈط¬ط¯) ظٹظڈط³طھط®ط¯ظ… ط¨ط¯ظ„ ط§ظ„ط¬ط³ظ… ط§ظ„ط¥ط¬ط±ط§ط¦ظٹ ظˆظ†طµ ط§ظ„ط°ظƒط±طŒ
    // ظ„ط£ظ† ط§ظ„ط±ط³ظ… ظٹط­طھظˆظٹ ظ†طµ ط§ظ„ط°ظƒط± ظ…ط¶ظ…ظ†ط§ظ‹ ظپظٹظ‡ ط£طµظ„ط§ظ‹.
    const artKey = getDhikrArtTexture(scene, options.dhikrId)
    this.usesArt = artKey !== null

    if (artKey) {
      const art = scene.add.image(0, 0, artKey)
      art.setScale(getDhikrArtScale(scene, artKey, options.hitRadius))
      this.add(art)
    } else {
      // ط±ط³ظ… ط§ظ„ط´ظƒظ„ ط§ظ„ط®ط§طµ ط¨ظƒظ„ ظ†ظˆط¹ (fallback ط¥ط¬ط±ط§ط¦ظٹ)
      this.buildBody()
    }
    this.buildComboVisual()

    // ط¥ط¶ط§ط،ط© Glow ظ†ط§ط¹ظ…ط© ط®ظ„ظپ ط§ظ„ط¬ط³ظ… ظ„ط¥ط¨ط±ط§ط²ظ‡ ظپظٹ ط§ظ„ط´ط§ط´ط©
    this.buildGlow(options.hitRadius)
    // ظ†طµ طھط´ط¬ظٹط¹ظٹ ظپظˆظ‚ ط§ظ„ظپظ‚ط§ط¹ط© ط¹ظ†ط¯ ظˆط¬ظˆط¯ ظƒظˆظ…ط¨ظˆ ظپط¹ظ‘ط§ظ„
    const combo = Number(scene.data.get('combo') || 0)
    if (combo >= 10 && (combo % 10 === 0 || combo >= 20)) {
      this.add(scene.add.text(0, -options.hitRadius - 22, combo >= 50 ? 'ط§ظ„ط°ظƒط± ط§ظ„ظ…طھظˆط§طµظ„ âœ¨' : 'ظ…ظ…طھط§ط²! ًںŒں', {
        fontFamily: '"Amiri", "Segoe UI", Tahoma, sans-serif', fontSize: '14px', fontStyle: 'bold', color: '#fef3c7',
      }).setOrigin(0.5).setDepth(2))
    }

    // ظ†طµ ط§ظ„ط°ظƒط± ظپظٹ ظ…ظ†طھطµظپ ط§ظ„ط¬ط³ظ… â€” ط®ط· ط¹ط±ط¨ظٹ ط±ط´ظٹظ‚ ظ…ط¹ ط¸ظ„ ظ†ط§ط¹ظ…
    // (ظٹظڈطھط®ط·ظ‰ ط¹ظ†ط¯ ط§ط³طھط®ط¯ط§ظ… ط§ظ„ط±ط³ظ… ط§ظ„ظپظ†ظٹ ظ„ط£ظ† ط§ظ„ظ†طµ ظ…ط¶ظ…ظ† ظپظٹ ط§ظ„ط±ط³ظ…)
    if (!this.usesArt) {
      const label = scene.add
        .text(0, 0, options.dhikrName, {
          fontFamily: '"Amiri", "Scheherazade New", "Segoe UI", Tahoma, sans-serif',
          fontSize: '19px',
          fontStyle: 'bold',
          color: '#ffffff',
          align: 'center',
          wordWrap: { width: 115, useAdvancedWrap: true },
        })
        .setOrigin(0.5, 0.5)
      label.setShadow(0, 1, 'rgba(0,0,0,0.7)', 4, true, true)
      label.setStroke('#0a0f1e', 2)
      this.add(label)
    }

    // ظ…ظ†ط·ظ‚ط© ظ„ظ…ط³ ط¯ط§ط¦ط±ظٹط© ظ…ط±ظƒط²ط© 100% ط¹ظ„ظ‰ ظ…ط±ظƒط² ط§ظ„ظ…ط¬ط³ظ…:
    // ط§ظ„ط¥ط­ط¯ط§ط«ظٹط§طھ ط§ظ„ظ…ط­ظ„ظٹط© ظ„ظ„ط¯ط§ط¦ط±ط© طھظڈط¶ط±ط¨ ظپظٹ scale (2.6) ط¹ظ†ط¯ طھط­ظˆظٹظ„ Phaser ظ„ظ‡ط§ ظ„ط¥ط­ط¯ط§ط«ظٹط§طھ ط¯ظˆظ„ظٹط©طŒ
    // ظ„ط°ظ„ظƒ ظ†ظ‚ط³ظ… ط¹ظ„ظ‰ BODY_SCALE ظ„ظ„ط­طµظˆظ„ ط¹ظ„ظ‰ ط§ظ„ظ…ظ‚ظٹط§ط³ ط§ظ„ظ…ط­ظ„ظٹ ط§ظ„طµط­ظٹط­ ط§ظ„ظ…ط·ط§ط¨ظ‚ ظ„ظ„ط¬ط³ظ… ط§ظ„ظ…ط±ط¦ظٹ.
    // ظ†ظڈط¶ظٹظپ ظ‡ط§ظ…ط´ 12px ظ…ظ‚ط³ظˆظ…ط§ظ‹ ط¹ظ„ظ‰ BODY_SCALE ط£ظٹط¶ط§ظ‹ ظ„ط²ظٹط§ط¯ط© ظ…ط³ط§ط­ط© ط§ظ„ظ„ظ…ط³ ط§ظ„ظپط¹ظ„ظٹط©.
    const localHitR = options.hitRadius / BODY_SCALE + 12
    this.setInteractive(
      new Phaser.Geom.Circle(0, 0, localHitR),
      Phaser.Geom.Circle.Contains,
    )
    this.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, this.handlePointerDown, this)

    // ط§ظ†ط¯ظپط§ط¹ ط£ظˆظ„ظٹ ط³ط±ظٹط¹: ط§ظ„ظˆطµظˆظ„ ط¥ظ„ظ‰ ط±ط¨ط¹ ط§ط±طھظپط§ط¹ ط§ظ„ط´ط§ط´ط© ط®ظ„ط§ظ„ 175ms ط«ظ… ط§ظ„ط§ظ†طھظ‚ط§ظ„ ظ„ظ„ط³ط±ط¹ط© ط§ظ„ط¹ط§ط¯ظٹط©
    this.startSpawnBurst()

    // ط§ظ„ط­ط±ظƒط© ط¹ط¨ط± ط­ظ„ظ‚ط© ط§ظ„طھط­ط¯ظٹط«ط› ظˆطھط³ط¬ظٹظ„ ط§ظ„ط®ط±ظˆط¬ ط¹ظ†ط¯ ط§ظ„طھط¯ظ…ظٹط±
    scene.events.on(Phaser.Scenes.Events.UPDATE, this.onUpdate, this)
    this.once(Phaser.GameObjects.Events.DESTROY, () => {
      if (this.scene) this.scene.events.off(Phaser.Scenes.Events.UPDATE, this.onUpdate, this)
    })
  }

  /** ظٹط±ط³ظ… ظƒظ„ ظ†ظˆط¹ ط´ظƒظ„ظ‡ ط§ظ„ط®ط§طµ ط¯ط§ط®ظ„ ظ‡ط°ط§ ط§ظ„ط£ط³ظ„ظˆط¨. */
  protected abstract buildBody(): void

  /**
   * ط§ظ†ط¯ظپط§ط¹ ط§ظ„ط¸ظ‡ظˆط± ط§ظ„ط³ط±ظٹط¹: Tween ظٹظ†ظ‚ظ„ ط§ظ„ط¬ط³ظ… ظپظˆط±ط§ظ‹ ط¥ظ„ظ‰ ط±ط¨ط¹ ط§ط±طھظپط§ط¹ ط§ظ„ط´ط§ط´ط©
   * (75% ظ…ظ† ط§ظ„ط£ط³ظپظ„) ط®ظ„ط§ظ„ 175msطŒ ط«ظ… ط§ظ„ط§ظ†طھظ‚ط§ظ„ ط§ظ„ظ†ط§ط¹ظ… ط¥ظ„ظ‰ ط§ظ„ط³ط±ط¹ط© ط§ظ„ط¹ط§ط¯ظٹط©
   * ط§ظ„ظ…ط­ط³ظˆط¨ط© ظ…ظ† ط´ط±ظٹط· ط§ظ„طھط­ظƒظ… â€” ظ„ط³ظ‡ظˆظ„ط© ط§ظ„ظ†ظ‚ط± ط§ظ„ظ…ظƒط±ط± ط§ظ„ط³ط±ظٹط¹ ط¨ط¯ظˆظ† ط§ظ†طھط¸ط§ط±.
   */
  private startSpawnBurst(): void {
    const quarterY = this.scene.scale.height * 0.75
    // طھط¬ط§ظ‡ظ„ ط§ظ„ط§ظ†ط¯ظپط§ط¹ ط¥ط°ط§ ظˆظڈظ„ط¯ ط§ظ„ط¬ط³ظ… ط£ط¹ظ„ظ‰ ظ…ظ† ظ†ظ‚ط·ط© ط§ظ„ط±ط¨ط¹ ط£طµظ„ط§ظ‹
    if (this.y <= quarterY) {
      this.burst = false
      return
    }
    this.scene.tweens.add({
      targets: this,
      y: quarterY,
      duration: 175,
      ease: 'Quad.easeOut',
      onComplete: () => {
        this.burst = false
      },
    })
  }

  /** ظ‡ط§ظ„ط© ط¥ط¶ط§ظپظٹط© ظ„ظ„ظپظ‚ط§ط¹ط§طھ ط§ظ„طھط§ظ„ظٹط© ط¹ظ†ط¯ ط¨ظ„ظˆط؛ ظƒظˆظ…ط¨ظˆ 10 ط£ظˆ 20 ط£ظˆ 50. */
  private buildComboVisual(): void {
    const combo = Number(this.scene.data.get('combo') || 0)
    const milestone = combo >= 50 ? 50 : combo >= 20 ? 20 : combo >= 10 ? 10 : 0
    if (!milestone) return
    const color = milestone >= 50 ? 0xfde68a : milestone >= 20 ? 0xc4b5fd : 0x67e8f9
    const glow = this.scene.add.graphics()
    glow.fillStyle(color, 0.16)
    glow.fillCircle(0, 0, this.opts.hitRadius * 1.35)
    glow.lineStyle(3, color, 0.9)
    glow.strokeCircle(0, 0, this.opts.hitRadius * 1.22)
    this.addAt(glow, 0)
    this.comboGlow = glow
    this.scene.tweens.add({ targets: glow, alpha: { from: 0.45, to: 1 }, scale: { from: 0.92, to: 1.12 }, yoyo: true, repeat: -1, duration: 480, ease: 'Sine.easeInOut' })
    this.scene.add.particles(this.x, this.y, 'pixel-glow', { speed: { min: 30, max: 85 }, angle: { min: 0, max: 360 }, lifespan: 650, scale: { start: 0.28, end: 0 }, tint: color, quantity: 1, frequency: 180, duration: 1600, blendMode: 'ADD' }).setDepth(1499)
  }

  /** ظ‡ط§ظ„ط© طھظˆظ‡ط¬ ظ†ط§ط¹ظ…ط© ط®ظ„ظپ ط§ظ„ط¬ط³ظ… ظ„ط¥ط¨ط±ط§ط²ظ‡ ط¨طµط±ظٹط§ظ‹ â€” طھظڈط±ط³ظ… ط¨ط¹ط¯ buildBody. */
  protected buildGlow(hitRadius: number): void {
    const glowColor = this.getGlowColor()
    const glow = this.scene.add.graphics()
    // ط·ط¨ظ‚طھط§ظ† ظ…ظ† ط§ظ„طھظˆظ‡ط¬: ط¯ط§ط®ظ„ظٹط© ظƒط«ظٹظپط© ظˆط®ط§ط±ط¬ظٹط© ط´ظپظٹظپط©
    glow.fillStyle(glowColor, 0.30)
    glow.fillCircle(0, 0, hitRadius * 0.85)
    glow.fillStyle(glowColor, 0.12)
    glow.fillCircle(0, 0, hitRadius * 1.25)
    // ط¥ط¶ط§ظپط© ط§ظ„ظ€ glow ظƒط£ظˆظ„ ط·ط¨ظ‚ط© (ط£ط³ظپظ„ ط§ظ„ط¬ظ…ظٹط¹ ط¯ط§ط®ظ„ ط§ظ„ظ€ Container)
    this.addAt(glow, 0)

    // ط­ظ„ظ‚ط© ط¨ظٹط¶ط§ط، ط±ظپظٹط¹ط© ط£ظ†ظٹظ‚ط© ط­ظˆظ„ ط­ط§ظپط© ط§ظ„ط¬ط³ظ… (ظ„ظ„ط±ط³ظ… ط§ظ„ط¥ط¬ط±ط§ط¦ظٹ ظپظ‚ط·)
    if (!this.usesArt) {
      const outline = this.scene.add.graphics()
      outline.lineStyle(3, 0xffffff, 0.88)
      outline.strokeCircle(0, 0, hitRadius * 1.0)
      outline.lineStyle(1, 0xffffff, 0.35)
      outline.strokeCircle(0, 0, hitRadius * 1.1)
      this.addAt(outline, 1)
    }

    // ظ†ط¨ط¶ ط®ظپظٹظپ ظ†ط§ط¹ظ… ظ„ظ„ظ‡ط§ظ„ط©
    this.scene.tweens.add({
      targets: glow,
      alpha: { from: 0.9, to: 0.4 },
      scale: { from: 1, to: 1.1 },
      yoyo: true,
      repeat: -1,
      duration: 2000,
      ease: 'Sine.easeInOut',
      delay: Phaser.Math.Between(0, 900),
    })
    // طھظ†ظپظ‘ط³ ط®ط§ظ…ظ„ ظ‡ط§ط¯ط¦ ظ„ظ„ط¬ط³ظ… ظƒظƒظ„ (طھط؛ظٹظ‘ط± ظ…ظ‚ظٹط§ط³ ط¶ط¦ظٹظ„ ط¬ط¯ط§ظ‹)
    this.scene.tweens.add({
      targets: this,
      scaleX: { from: 1, to: 1.025 },
      scaleY: { from: 1, to: 1.03 },
      yoyo: true,
      repeat: -1,
      duration: 3200,
      ease: 'Sine.easeInOut',
      delay: Phaser.Math.Between(0, 1200),
    })
  }

  /** ظ„ظˆظ† ظ‡ط§ظ„ط© ط§ظ„ط¥ط¶ط§ط،ط© â€” ظƒظ„ ظ†ظˆط¹ ظٹط³طھط·ظٹط¹ طھط¬ط§ظˆط²ظ‡ط› ط§ظ„ط§ظپطھط±ط§ط¶ظٹ ط£ط®ط¶ط± ظپط³ظپظˆط±ظٹ ط²ط§ظ‡ظچ ط¬ط¯ط§ظ‹. */
  protected getGlowColor(): number {
    return 0xffd166 // ذهبي دافئ (الافتراضي للهالات الليلية)
  }

  private onUpdate(_time: number, delta: number): void {
    if (!this.active) return
    if (this.scene.data.get('paused') === true) return
    // ط£ط«ظ†ط§ط، ط§ظ„ط§ظ†ط¯ظپط§ط¹ ط§ظ„ط£ظˆظ„ظٹ ظٹطھط­ظƒظ… ط§ظ„ظ€ Tween ط¨ط§ظ„ط­ط±ظƒط© ط±ط£ط³ظٹط§ظ‹ â€” ظ†طھط±ظƒظ‡ ظٹط¹ظ…ظ„ ظپظ‚ط·
    if (this.burst) return
    const dt = delta / 1000

    // طھطµط§ط¹ط¯ ط³ظ„ط³ ظ†ط­ظˆ ط§ظ„ط£ط¹ظ„ظ‰
    this.y -= this.opts.speedBase * getSpeed() * dt

    // طھظ…ط§ظˆط¬ ط£ظپظ‚ظٹ ط¬ظٹط¨ظٹ
    this.phase += this.opts.wiggleFreq * dt
    this.x = this.startX + Math.sin(this.phase * Math.PI * 2) * this.opts.wiggleAmp
    this.rotation = Math.sin(this.phase * Math.PI * 2) * 0.05

    // طھظ†ط¸ظٹظپ: طھط¯ظ…ظٹط± ط£ظٹ ط¬ط³ظ… ط®ط±ط¬ ظ…ظ† ط£ط¹ظ„ظ‰ ط§ظ„ط´ط§ط´ط©
    if (this.y < -this.opts.hitRadius * 3) {
      this.destroy()
    }
  }

  private handlePointerDown(): void {
    if (this.popped || !this.active) return
    this.popped = true
    this.setData('collected', true)
    this.disableInteractive()

    // 1) ط¬ط²ظٹط¦ط§طھ ط°ظ‡ط¨ظٹط© ظ…طھط·ط§ظٹط±ط©
    emitGoldBurst(this.scene, this.x, this.y)

    // 2) طµظˆطھ ط§ظ„ظپط±ظ‚ط¹ط© ط§ظ„ظ†ط§ط¹ظ…
    playPop({ pitch: this.opts.popPitch, volume: 0.9 })

    // 3) ط§ظ‡طھط²ط§ط² ط®ظپظٹظپ
    vibrate(15)

    // 4) ط­ط¯ط« ط²ظٹط§ط¯ط© ط§ظ„ط±طµظٹط¯ ظ„ظ„ط°ظƒط± ط§ظ„ظ…ط­ط¯ط¯
    this.scene.events.emit(Events.DHIKR_COLLECTED, {
      id: this.opts.dhikrId,
      name: this.opts.dhikrName,
      target: this.opts.dhikrTarget,
    })

    // ط¥ظٹظ‚ط§ظپ ط§ظ„طھظ†ظپظ‘ط³ ط§ظ„ط®ط§ظ…ظ„ ظ‚ط¨ظ„ ط£ظ†ظٹظ…ظٹط´ظ† ط§ظ„ط§ط®طھظپط§ط، (طھط¬ظ†ظ‘ط¨ طھط¹ط§ط±ط¶ ط§ظ„ظ…ظ‚ظٹط§ط³)
    this.scene.tweens.killTweensOf(this)

    // ط§ط®طھظپط§ط، ظپظˆط±ظٹ ظ†ط§ط¹ظ… (طھظƒط¨ظٹط± ط®ظپظٹظپ + طھظ„ط§ط´ظٹ ط«ظ… طھط¯ظ…ظٹط±)
    this.scene.tweens.add({
      targets: this,
      scale: BODY_SCALE * 1.35,
      alpha: 0,
      duration: 110,
      ease: 'Quad.easeOut',
      onComplete: () => this.destroy(),
    })
  }
}
