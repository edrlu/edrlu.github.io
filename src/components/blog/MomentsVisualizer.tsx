'use client'

import { useMemo, useState } from 'react'
import styles from './momentsVisualizer.module.css'

type Dist = 'normal' | 'uniform' | 'exponential'
type Scale = 'linear' | 'log'

function clampInt(x: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, Math.round(x)))
}

function doubleFactorial(n: number) {
  if (n <= 0) return 1
  let prod = 1
  for (let k = n; k >= 2; k -= 2) prod *= k
  return prod
}

function factorial(n: number) {
  let prod = 1
  for (let k = 2; k <= n; k++) prod *= k
  return prod
}

function exactMoment(dist: Dist, k: number) {
  if (k <= 0) return 1
  if (dist === 'normal') {
    if (k % 2 === 1) return 0
    return doubleFactorial(k - 1)
  }
  if (dist === 'uniform') {
    if (k % 2 === 1) return 0
    return 1 / (k + 1)
  }
  return factorial(k)
}

function xorshift32(seed: number) {
  let s = seed | 0
  return () => {
    s ^= s << 13
    s ^= s >>> 17
    s ^= s << 5
    return ((s >>> 0) % 1_000_000_000) / 1_000_000_000
  }
}

function sampleDist(dist: Dist, u: () => number) {
  if (dist === 'uniform') return 2 * u() - 1
  if (dist === 'exponential') return -Math.log(Math.max(1e-12, 1 - u()))
  // Box-Muller for N(0,1)
  const u1 = Math.max(1e-12, u())
  const u2 = u()
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
}

function fmt(x: number) {
  if (!Number.isFinite(x)) return '—'
  const ax = Math.abs(x)
  if (ax === 0) return '0'
  if (ax >= 10_000 || ax < 0.001) return x.toExponential(3)
  return x.toFixed(4).replace(/0+$/, '').replace(/\.$/, '')
}

export default function MomentsVisualizer() {
  const [dist, setDist] = useState<Dist>('normal')
  const [kMax, setKMax] = useState(8)
  const [n, setN] = useState(2500)
  const [scale, setScale] = useState<Scale>('log')

  const data = useMemo(() => {
    const kk = clampInt(kMax, 1, 10)
    const nn = clampInt(n, 200, 20_000)
    const u = xorshift32(0x1a2b3c4d)

    const sums = Array.from({ length: kk }, () => 0)
    for (let i = 0; i < nn; i++) {
      const x = sampleDist(dist, u)
      let xp = x
      for (let k = 1; k <= kk; k++) {
        sums[k - 1] += xp
        xp *= x
      }
    }

    const rows = Array.from({ length: kk }, (_, idx) => {
      const k = idx + 1
      const exact = exactMoment(dist, k)
      const est = sums[idx] / nn
      return { k, exact, est }
    })

    const mag = (x: number) => {
      const ax = Math.abs(x)
      if (scale === 'linear') return ax
      return Math.log10(1 + ax)
    }

    const maxMag = rows.reduce((m, r) => Math.max(m, mag(r.exact), mag(r.est)), 1e-12)
    return { kk, nn, rows, maxMag, mag }
  }, [dist, kMax, n, scale])

  return (
    <section className={styles.wrap} aria-label="Moment visualizer">
      <div className={styles.controls} aria-label="Controls">
        <label className={styles.control}>
          <div className={styles.label}>Distribution</div>
          <select className={styles.select} value={dist} onChange={(e) => setDist(e.target.value as Dist)}>
            <option value="normal">Normal(0,1)</option>
            <option value="uniform">Uniform(-1,1)</option>
            <option value="exponential">Exponential(1)</option>
          </select>
        </label>

        <label className={styles.control}>
          <div className={styles.label}>Max k</div>
          <input
            className={styles.range}
            type="range"
            min={1}
            max={10}
            value={data.kk}
            onChange={(e) => setKMax(Number(e.target.value))}
          />
          <div className={styles.value}>{data.kk}</div>
        </label>

        <label className={styles.control}>
          <div className={styles.label}>Samples</div>
          <input
            className={styles.range}
            type="range"
            min={200}
            max={20000}
            step={100}
            value={data.nn}
            onChange={(e) => setN(Number(e.target.value))}
          />
          <div className={styles.value}>{data.nn.toLocaleString()}</div>
        </label>

        <label className={styles.control}>
          <div className={styles.label}>Scale</div>
          <select className={styles.select} value={scale} onChange={(e) => setScale(e.target.value as Scale)}>
            <option value="log">Log</option>
            <option value="linear">Linear</option>
          </select>
        </label>
      </div>

      <div className={styles.chartWrap} aria-label="Chart">
        <svg className={styles.chart} viewBox="0 0 1000 320" role="img" aria-label="Moment bar chart">
          <rect x="0" y="0" width="1000" height="320" className={styles.frame} />

          {data.rows.map((r, i) => {
            const x0 = 60 + i * (880 / data.kk)
            const w = Math.max(36, 760 / data.kk)
            const gap = 10
            const barW = (w - gap) / 2
            const baseY = 278
            const hExact = (240 * data.mag(r.exact)) / data.maxMag
            const hEst = (240 * data.mag(r.est)) / data.maxMag
            return (
              <g key={r.k}>
                <rect x={x0} y={baseY - hExact} width={barW} height={hExact} className={styles.barExact} />
                <rect x={x0 + barW + gap} y={baseY - hEst} width={barW} height={hEst} className={styles.barEst} />
                <text x={x0 + w / 2} y="304" textAnchor="middle" className={styles.tick}>
                  k={r.k}
                </text>
              </g>
            )
          })}

          <text x="58" y="26" textAnchor="start" className={styles.title}>
            Moments E[X^k]
          </text>
        </svg>

        <div className={styles.legend} aria-label="Legend">
          <div className={styles.legendItem}>
            <span className={`${styles.swatch} ${styles.swatchExact}`} aria-hidden="true" />
            <span>Exact</span>
          </div>
          <div className={styles.legendItem}>
            <span className={`${styles.swatch} ${styles.swatchEst}`} aria-hidden="true" />
            <span>Monte Carlo</span>
          </div>
        </div>
      </div>

      <div className={styles.tableWrap} aria-label="Values">
        <table className={styles.table}>
          <thead>
            <tr>
              <th>k</th>
              <th>Exact</th>
              <th>Monte Carlo</th>
            </tr>
          </thead>
          <tbody>
            {data.rows.map((r) => (
              <tr key={r.k}>
                <td>{r.k}</td>
                <td className={styles.num}>{fmt(r.exact)}</td>
                <td className={styles.num}>{fmt(r.est)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

