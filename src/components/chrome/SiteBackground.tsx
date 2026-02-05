'use client'

import { useEffect } from 'react'

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min
}

export default function SiteBackground() {
  useEffect(() => {
    const root = document.documentElement

    root.style.setProperty('--paper-x', `${Math.round(rand(-90, 90))}px`)
    root.style.setProperty('--paper-y', `${Math.round(rand(-70, 70))}px`)
    root.style.setProperty('--paper-rot', `${rand(-1.1, 1.1).toFixed(2)}deg`)

    root.style.setProperty('--crease-x', `${Math.round(rand(-60, 60))}px`)
    root.style.setProperty('--crease-y', `${Math.round(rand(-50, 50))}px`)
    root.style.setProperty('--crease-rot', `${rand(-4.5, 4.5).toFixed(2)}deg`)
    root.style.setProperty('--crease-o', `${rand(0.14, 0.22).toFixed(3)}`)
    root.style.setProperty('--crease-blur', `${rand(10, 15).toFixed(1)}px`)
  }, [])

  return (
    <div className="background" aria-hidden="true">
      <div className="backgroundPaper" />
      <div className="backgroundCrease" />
      <div className="backgroundGlow" />
    </div>
  )
}
