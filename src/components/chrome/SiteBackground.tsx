'use client'

import ParticleNetwork from '@/components/animations/ParticleNetwork'

export default function SiteBackground() {
  return (
    <div className="background" aria-hidden="true">
      <div className="backgroundGlow" />
      <ParticleNetwork />
    </div>
  )
}

