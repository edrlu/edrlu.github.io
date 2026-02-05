'use client'

import { usePathname } from 'next/navigation'
import ParticleNetwork from '@/components/animations/ParticleNetwork'

export default function SiteBackground() {
  const pathname = usePathname()
  const showParticles = pathname === '/'

  return (
    <div className="background" aria-hidden="true">
      <div className="backgroundGlow" />
      {showParticles ? <ParticleNetwork /> : null}
    </div>
  )
}
