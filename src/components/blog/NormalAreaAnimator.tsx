'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import styles from './normalAreaAnimator.module.css'

type Mode = 'area' | 'ci'
  | 'quantile'

const X_MIN = -4
const X_MAX = 4
const Y_MAX = 0.45

function clamp(x: number, min: number, max: number) {
  return Math.min(max, Math.max(min, x))
}

function phi(z: number) {
  return Math.exp(-0.5 * z * z) / Math.sqrt(2 * Math.PI)
}

// Abramowitz & Stegun 7.1.26
function erf(x: number) {
  const sign = x < 0 ? -1 : 1
  const ax = Math.abs(x)
  const t = 1 / (1 + 0.3275911 * ax)
  const a1 = 0.254829592
  const a2 = -0.284496736
  const a3 = 1.421413741
  const a4 = -1.453152027
  const a5 = 1.061405429
  const poly = (((a5 * t + a4) * t + a3) * t + a2) * t + a1
  return sign * (1 - poly * t * Math.exp(-ax * ax))
}

function Phi(z: number) {
  return 0.5 * (1 + erf(z / Math.SQRT2))
}

function integralExact(a: number, b: number) {
  const lo = Math.min(a, b)
  const hi = Math.max(a, b)
  return Phi(hi) - Phi(lo)
}

function integralMidpoint(a: number, b: number, n: number) {
  const lo = Math.min(a, b)
  const hi = Math.max(a, b)
  const nn = Math.max(1, Math.floor(n))
  const w = (hi - lo) / nn
  let sum = 0
  for (let i = 0; i < nn; i++) {
    const x = lo + (i + 0.5) * w
    sum += phi(x) * w
  }
  return sum
}

function invPhi(p: number) {
  const pp = clamp(p, 1e-12, 1 - 1e-12)
  let lo = -8
  let hi = 8
  for (let i = 0; i < 80; i++) {
    const mid = (lo + hi) / 2
    if (Phi(mid) < pp) lo = mid
    else hi = mid
  }
  return (lo + hi) / 2
}

function fmt(x: number, digits = 4) {
  if (!Number.isFinite(x)) return '—'
  return x.toFixed(digits)
}

export default function NormalAreaAnimator() {
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [size, setSize] = useState({ w: 0, h: 320 })

  const [mode, setMode] = useState<Mode>('area')
  const [playing, setPlaying] = useState(false)

  const [a, setA] = useState(-1)
  const [b, setB] = useState(1)
  const [rects, setRects] = useState(10)

  const [cl, setCl] = useState(0.95)
  const [p, setP] = useState(0.975)

  const ci = useMemo(() => {
    const alpha = 1 - cl
    const z = invPhi(1 - alpha / 2)
    return { alpha, z }
  }, [cl])

  const quant = useMemo(() => {
    const z = invPhi(p)
    return { z, tail: 1 - p }
  }, [p])

  const area = useMemo(() => {
    const exact = integralExact(a, b)
    const approx = integralMidpoint(a, b, rects)
    const err = approx - exact
    return { exact, approx, err }
  }, [a, b, rects])

  useEffect(() => {
    if (!wrapRef.current) return
    const el = wrapRef.current
    const ro = new ResizeObserver((entries) => {
      const cr = entries[0]?.contentRect
      if (!cr) return
      setSize((s) => ({ ...s, w: Math.max(260, Math.floor(cr.width)) }))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (!playing) return

    if (mode === 'area') {
      const id = window.setInterval(() => {
        setRects((n) => (n >= 200 ? 4 : n + 2))
      }, 90)
      return () => window.clearInterval(id)
    }

    if (mode === 'quantile') {
      let t = 0
      const id = window.setInterval(() => {
        t += 1
        const wave = 0.5 + 0.5 * Math.sin(t / 18)
        const next = 0.5 + 0.499 * wave
        setP((cur) => (Math.abs(cur - next) < 0.002 ? cur : next))
      }, 90)
      return () => window.clearInterval(id)
    }

    // CI mode: gently sweep confidence level.
    let t = 0
    const id = window.setInterval(() => {
      t += 1
      const wave = 0.5 + 0.5 * Math.sin(t / 18)
      const next = 0.5 + 0.49 * wave
      setCl((cur) => (Math.abs(cur - next) < 0.003 ? cur : next))
    }, 90)
    return () => window.clearInterval(id)
  }, [playing, mode])

  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return
    if (size.w <= 0 || size.h <= 0) return

    const dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1))
    canvas.width = size.w * dpr
    canvas.height = size.h * dpr
    canvas.style.width = `${size.w}px`
    canvas.style.height = `${size.h}px`

    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const css = getComputedStyle(wrap)
    const cText = css.getPropertyValue('--c-text').trim() || '#111'
    const cMuted = css.getPropertyValue('--c-muted').trim() || '#666'
    const cLine = css.getPropertyValue('--divider').trim() || 'rgba(0,0,0,0.22)'
    const cAccent = css.getPropertyValue('--c-accent').trim() || '#b5162b'
    const cAccent2 = css.getPropertyValue('--c-accent2').trim() || '#1f5aa8'
    const cCard = css.getPropertyValue('--c-card').trim() || 'rgba(255,255,255,0.55)'
    const fontMono = css.getPropertyValue('--font-mono').trim() || 'ui-monospace, monospace'

    const W = size.w
    const H = size.h
    const padL = 42
    const padR = 16
    const padT = 14
    const padB = 30

    const xToPx = (x: number) => padL + ((x - X_MIN) / (X_MAX - X_MIN)) * (W - padL - padR)
    const yToPx = (y: number) => H - padB - (y / Y_MAX) * (H - padT - padB)

    ctx.clearRect(0, 0, W, H)

    // Frame
    ctx.save()
    ctx.globalAlpha = 0.9
    ctx.fillStyle = cCard
    ctx.strokeStyle = cLine
    ctx.lineWidth = 1
    roundRect(ctx, 0.5, 0.5, W - 1, H - 1, 12)
    ctx.fill()
    ctx.stroke()
    ctx.restore()

    // Grid
    ctx.save()
    ctx.globalAlpha = 0.55
    ctx.strokeStyle = cLine
    ctx.lineWidth = 1
    for (let x = -4; x <= 4; x++) {
      const px = xToPx(x)
      ctx.beginPath()
      ctx.moveTo(px, padT)
      ctx.lineTo(px, H - padB)
      ctx.stroke()
    }
    for (let i = 0; i <= 3; i++) {
      const y = (i / 3) * Y_MAX
      const py = yToPx(y)
      ctx.beginPath()
      ctx.moveTo(padL, py)
      ctx.lineTo(W - padR, py)
      ctx.stroke()
    }
    ctx.restore()

    // Axes labels
    ctx.fillStyle = cMuted
    ctx.font = `12px ${fontMono}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    for (let x = -4; x <= 4; x += 2) {
      ctx.fillText(String(x), xToPx(x), H - padB + 6)
    }

    ctx.textAlign = 'right'
    ctx.textBaseline = 'middle'
    ctx.fillText('0', padL - 10, yToPx(0))
    ctx.fillText('0.15', padL - 10, yToPx(0.15))
    ctx.fillText('0.30', padL - 10, yToPx(0.3))
    ctx.fillText('0.45', padL - 10, yToPx(0.45))

    // PDF curve
    const pts: Array<[number, number]> = []
    const samples = 480
    for (let i = 0; i <= samples; i++) {
      const x = X_MIN + (i / samples) * (X_MAX - X_MIN)
      pts.push([xToPx(x), yToPx(phi(x))])
    }

    ctx.strokeStyle = cText
    ctx.lineWidth = 2
    ctx.beginPath()
    for (let i = 0; i < pts.length; i++) {
      const [px, py] = pts[i]
      if (i === 0) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    }
    ctx.stroke()

    if (mode === 'area') {
      const lo = Math.min(a, b)
      const hi = Math.max(a, b)

      // Riemann rectangles (midpoint)
      const nn = Math.max(1, Math.floor(rects))
      const w = (hi - lo) / nn
      ctx.save()
      ctx.globalAlpha = 0.18
      ctx.fillStyle = cAccent2
      ctx.strokeStyle = cAccent2
      ctx.lineWidth = 1
      for (let i = 0; i < nn; i++) {
        const x0 = lo + i * w
        const x1 = x0 + w
        const mid = x0 + 0.5 * w
        const h = phi(mid)
        const px0 = xToPx(x0)
        const px1 = xToPx(x1)
        const py0 = yToPx(0)
        const py1 = yToPx(h)
        ctx.beginPath()
        ctx.rect(px0, py1, px1 - px0, py0 - py1)
        ctx.fill()
        ctx.stroke()
      }
      ctx.restore()

      // True area shading under curve
      ctx.save()
      ctx.globalAlpha = 0.22
      ctx.fillStyle = cAccent
      ctx.beginPath()
      ctx.moveTo(xToPx(lo), yToPx(0))
      const fillSamples = 420
      for (let i = 0; i <= fillSamples; i++) {
        const x = lo + (i / fillSamples) * (hi - lo)
        ctx.lineTo(xToPx(x), yToPx(phi(x)))
      }
      ctx.lineTo(xToPx(hi), yToPx(0))
      ctx.closePath()
      ctx.fill()
      ctx.restore()

      // Markers at a, b
      markerLine(ctx, xToPx(lo), padT, H - padB, cAccent)
      markerLine(ctx, xToPx(hi), padT, H - padB, cAccent)

      ctx.fillStyle = cMuted
      ctx.font = `12px ${fontMono}`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'bottom'
      ctx.fillText('a', xToPx(lo), padT - 2)
      ctx.fillText('b', xToPx(hi), padT - 2)
    } else if (mode === 'ci') {
      const lo = -ci.z
      const hi = ci.z

      // Central area shading
      ctx.save()
      ctx.globalAlpha = 0.22
      ctx.fillStyle = cAccent
      ctx.beginPath()
      ctx.moveTo(xToPx(lo), yToPx(0))
      const fillSamples = 520
      for (let i = 0; i <= fillSamples; i++) {
        const x = lo + (i / fillSamples) * (hi - lo)
        ctx.lineTo(xToPx(x), yToPx(phi(x)))
      }
      ctx.lineTo(xToPx(hi), yToPx(0))
      ctx.closePath()
      ctx.fill()
      ctx.restore()

      // Tails hint
      ctx.save()
      ctx.globalAlpha = 0.08
      ctx.fillStyle = cAccent2
      fillTail(ctx, xToPx, yToPx, X_MIN, lo)
      fillTail(ctx, xToPx, yToPx, hi, X_MAX)
      ctx.restore()

      markerLine(ctx, xToPx(lo), padT, H - padB, cAccent)
      markerLine(ctx, xToPx(hi), padT, H - padB, cAccent)

      ctx.fillStyle = cMuted
      ctx.font = `12px ${fontMono}`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'bottom'
      ctx.fillText('-z', xToPx(lo), padT - 2)
      ctx.fillText('z', xToPx(hi), padT - 2)
    } else {
      const z = quant.z

      // Left area shading: P(Z <= z) = p
      ctx.save()
      ctx.globalAlpha = 0.22
      ctx.fillStyle = cAccent
      ctx.beginPath()
      ctx.moveTo(xToPx(X_MIN), yToPx(0))
      const fillSamples = 620
      for (let i = 0; i <= fillSamples; i++) {
        const x = X_MIN + (i / fillSamples) * (z - X_MIN)
        ctx.lineTo(xToPx(x), yToPx(phi(x)))
      }
      ctx.lineTo(xToPx(z), yToPx(0))
      ctx.closePath()
      ctx.fill()
      ctx.restore()

      // Tail hint (1-p)
      ctx.save()
      ctx.globalAlpha = 0.08
      ctx.fillStyle = cAccent2
      fillTail(ctx, xToPx, yToPx, z, X_MAX)
      ctx.restore()

      markerLine(ctx, xToPx(z), padT, H - padB, cAccent)

      ctx.fillStyle = cMuted
      ctx.font = `12px ${fontMono}`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'bottom'
      ctx.fillText('z', xToPx(z), padT - 2)
    }
  }, [size, mode, a, b, rects, ci.z, quant.z])

  return (
    <div className={styles.wrap} ref={wrapRef}>
      <div className={styles.top}>
        <div className={styles.mode}>
          <button
            type="button"
            className={`${styles.tab} ${mode === 'area' ? styles.tabActive : ''}`}
            onClick={() => {
              setPlaying(false)
              setMode('area')
            }}
          >
            Area
          </button>
          <button
            type="button"
            className={`${styles.tab} ${mode === 'ci' ? styles.tabActive : ''}`}
            onClick={() => {
              setPlaying(false)
              setMode('ci')
            }}
          >
            Confidence Interval
          </button>
          <button
            type="button"
            className={`${styles.tab} ${mode === 'quantile' ? styles.tabActive : ''}`}
            onClick={() => {
              setPlaying(false)
              setMode('quantile')
            }}
          >
            Quantile
          </button>
        </div>

        <button type="button" className={styles.playBtn} onClick={() => setPlaying((p) => !p)}>
          {playing ? 'Pause' : 'Play'}
        </button>
      </div>

      <canvas ref={canvasRef} className={styles.canvas} aria-label="Standard normal visualization" />

      {mode === 'area' ? (
        <div className={styles.controls} aria-label="Area controls">
          <label className={styles.control}>
            <div className={styles.controlTop}>
              <span className={styles.label}>a</span>
              <span className={styles.value}>{fmt(a, 2)}</span>
            </div>
            <input
              className={styles.range}
              type="range"
              min={X_MIN}
              max={X_MAX}
              step={0.05}
              value={a}
              onChange={(e) => {
                setPlaying(false)
                setA(Number(e.target.value))
              }}
            />
          </label>

          <label className={styles.control}>
            <div className={styles.controlTop}>
              <span className={styles.label}>b</span>
              <span className={styles.value}>{fmt(b, 2)}</span>
            </div>
            <input
              className={styles.range}
              type="range"
              min={X_MIN}
              max={X_MAX}
              step={0.05}
              value={b}
              onChange={(e) => {
                setPlaying(false)
                setB(Number(e.target.value))
              }}
            />
          </label>

          <label className={styles.control}>
            <div className={styles.controlTop}>
              <span className={styles.label}>rectangles</span>
              <span className={styles.value}>{rects}</span>
            </div>
            <input
              className={styles.range}
              type="range"
              min={4}
              max={200}
              step={1}
              value={rects}
              onChange={(e) => {
                setPlaying(false)
                setRects(Number(e.target.value))
              }}
            />
          </label>

          <div className={styles.readout}>
            <div>
              <span className={styles.readoutKey}>Exact</span>
              <span className={styles.readoutVal}>{fmt(area.exact, 6)}</span>
            </div>
            <div>
              <span className={styles.readoutKey}>Midpoint sum</span>
              <span className={styles.readoutVal}>{fmt(area.approx, 6)}</span>
            </div>
            <div>
              <span className={styles.readoutKey}>Error</span>
              <span className={styles.readoutVal}>{fmt(area.err, 6)}</span>
            </div>
          </div>
        </div>
      ) : mode === 'ci' ? (
        <div className={styles.controls} aria-label="Confidence interval controls">
          <label className={styles.control}>
            <div className={styles.controlTop}>
              <span className={styles.label}>confidence</span>
              <span className={styles.value}>{fmt(cl * 100, 1)}%</span>
            </div>
            <input
              className={styles.range}
              type="range"
              min={0.5}
              max={0.99}
              step={0.005}
              value={cl}
              onChange={(e) => {
                setPlaying(false)
                setCl(Number(e.target.value))
              }}
            />
          </label>

          <div className={styles.readout}>
            <div>
              <span className={styles.readoutKey}>α</span>
              <span className={styles.readoutVal}>{fmt(ci.alpha, 4)}</span>
            </div>
            <div>
              <span className={styles.readoutKey}>α/2</span>
              <span className={styles.readoutVal}>{fmt(ci.alpha / 2, 4)}</span>
            </div>
            <div>
              <span className={styles.readoutKey}>p</span>
              <span className={styles.readoutVal}>{fmt(1 - ci.alpha / 2, 4)}</span>
            </div>
            <div>
              <span className={styles.readoutKey}>z</span>
              <span className={styles.readoutVal}>{fmt(ci.z, 4)}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.controls} aria-label="Quantile controls">
          <label className={styles.control}>
            <div className={styles.controlTop}>
              <span className={styles.label}>p = Φ(z)</span>
              <span className={styles.value}>{fmt(p, 4)}</span>
            </div>
            <input
              className={styles.range}
              type="range"
              min={0.5}
              max={0.999}
              step={0.001}
              value={p}
              onChange={(e) => {
                setPlaying(false)
                setP(Number(e.target.value))
              }}
            />
          </label>

          <div className={styles.readout}>
            <div>
              <span className={styles.readoutKey}>z</span>
              <span className={styles.readoutVal}>{fmt(quant.z, 4)}</span>
            </div>
            <div>
              <span className={styles.readoutKey}>1-p</span>
              <span className={styles.readoutVal}>{fmt(quant.tail, 4)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const rr = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + rr, y)
  ctx.arcTo(x + w, y, x + w, y + h, rr)
  ctx.arcTo(x + w, y + h, x, y + h, rr)
  ctx.arcTo(x, y + h, x, y, rr)
  ctx.arcTo(x, y, x + w, y, rr)
  ctx.closePath()
}

function markerLine(ctx: CanvasRenderingContext2D, x: number, y0: number, y1: number, color: string) {
  ctx.strokeStyle = color
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(x, y0)
  ctx.lineTo(x, y1)
  ctx.stroke()
}

function fillTail(
  ctx: CanvasRenderingContext2D,
  xToPx: (x: number) => number,
  yToPx: (y: number) => number,
  lo: number,
  hi: number,
) {
  const a = Math.min(lo, hi)
  const b = Math.max(lo, hi)
  ctx.beginPath()
  ctx.moveTo(xToPx(a), yToPx(0))
  const samples = 220
  for (let i = 0; i <= samples; i++) {
    const x = a + (i / samples) * (b - a)
    ctx.lineTo(xToPx(x), yToPx(phi(x)))
  }
  ctx.lineTo(xToPx(b), yToPx(0))
  ctx.closePath()
  ctx.fill()
}
