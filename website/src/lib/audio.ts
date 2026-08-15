/**
 * Zero-latency procedural Web Audio synthesis for micro-haptic sound effects.
 * 100% asset-free (synthesizes sine/noise bursts on the fly).
 */
class SoundEngine {
  private ctx: AudioContext | null = null
  private enabled: boolean = false

  constructor() {
    // Audio context starts muted by default for clean UX
    this.enabled = typeof window !== 'undefined' && localStorage.getItem('ahpm:sound:enabled') === 'true'
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      void this.ctx.resume()
    }
    return this.ctx
  }

  public isEnabled(): boolean {
    return this.enabled
  }

  public toggle(): boolean {
    this.enabled = !this.enabled
    if (typeof window !== 'undefined') {
      localStorage.setItem('ahpm:sound:enabled', String(this.enabled))
    }
    if (this.enabled) {
      this.playClick()
    }
    return this.enabled
  }

  /** Subtle mechanical click (1200Hz tick with exponential decay) */
  public playClick(): void {
    if (!this.enabled) return
    const ctx = this.getContext()
    if (!ctx) return

    try {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(1200, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.02)

      gain.gain.setValueAtTime(0.08, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.025)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.03)
    } catch {
      // Ignore audio synthesis errors gracefully
    }
  }

  /** Deep tactile key thud (45Hz bass pulse) */
  public playThud(): void {
    if (!this.enabled) return
    const ctx = this.getContext()
    if (!ctx) return

    try {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = 'triangle'
      osc.frequency.setValueAtTime(140, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(45, ctx.currentTime + 0.05)

      gain.gain.setValueAtTime(0.12, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06)

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.07)
    } catch {
      // Ignore
    }
  }

  /** High success harmonic chime (980Hz -> 1480Hz) */
  public playSuccess(): void {
    if (!this.enabled) return
    const ctx = this.getContext()
    if (!ctx) return

    try {
      const now = ctx.currentTime
      const osc1 = ctx.createOscillator()
      const osc2 = ctx.createOscillator()
      const gain = ctx.createGain()

      osc1.type = 'sine'
      osc1.frequency.setValueAtTime(880, now)

      osc2.type = 'sine'
      osc2.frequency.setValueAtTime(1320, now + 0.04)

      gain.gain.setValueAtTime(0.06, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2)

      osc1.connect(gain)
      osc2.connect(gain)
      gain.connect(ctx.destination)

      osc1.start(now)
      osc1.stop(now + 0.1)
      osc2.start(now + 0.04)
      osc2.stop(now + 0.2)
    } catch {
      // Ignore
    }
  }
}

export const sounds = new SoundEngine()
