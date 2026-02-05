'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
}

export default function ParticleNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const particlesRef = useRef<Particle[]>([])
  const startTimeRef = useRef<number>(Date.now())

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const colorsRef = { particle: 'rgba(0,0,0,0.42)', line: 'rgba(0,0,0,0.2)', mouse: 'rgba(0,0,0,0.24)' }
    let rafId = 0
    let frame = 0

    const readColors = () => {
      const style = getComputedStyle(document.documentElement)
      const particle = style.getPropertyValue('--fx-particle').trim()
      const line = style.getPropertyValue('--fx-line').trim()
      const mouse = style.getPropertyValue('--fx-mouse').trim()
      if (particle) colorsRef.particle = particle
      if (line) colorsRef.line = line
      if (mouse) colorsRef.mouse = mouse
    }

    // Set canvas size (HiDPI)
    const setCanvasSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(window.innerWidth * dpr)
      canvas.height = Math.floor(window.innerHeight * dpr)
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    readColors()
    setCanvasSize()

    // Configuration
    const config = {
      particleCount: 80,
      particleSpeed: 0.3,
      connectionDistance: 150,
      mouseRadius: 150,
    }

    // Initialize particles
    const initParticles = () => {
      particlesRef.current = []
      for (let i = 0; i < config.particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          vx: (Math.random() - 0.5) * config.particleSpeed,
          vy: (Math.random() - 0.5) * config.particleSpeed,
          radius: 2,
        })
      }
    }
    initParticles()

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY,
      }
    }

    const handleResize = () => {
      setCanvasSize()
      initParticles()
    }

    // Animation loop
    const animate = () => {
      rafId = requestAnimationFrame(animate)
      frame++
      if (frame % 60 === 0) readColors()

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

      const particles = particlesRef.current
      const mouse = mouseRef.current

      // Calculate initial momentum boost (dampens over first 3 seconds)
      const elapsed = (Date.now() - startTimeRef.current) / 1000
      const momentumBoost = elapsed < 3 ? Math.max(0, 3 - elapsed) : 0

      // Update and draw particles
      particles.forEach((particle, i) => {
        // Move particle with initial momentum boost
        const velocityMultiplier = 1 + momentumBoost
        particle.x += particle.vx * velocityMultiplier
        particle.y += particle.vy * velocityMultiplier

        // Bounce off edges
        if (particle.x < 0 || particle.x > window.innerWidth) particle.vx *= -1
        if (particle.y < 0 || particle.y > window.innerHeight) particle.vy *= -1

        // Mouse interaction - attract particles
        const dx = mouse.x - particle.x
        const dy = mouse.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance > 0.0001 && distance < config.mouseRadius) {
          const force = (config.mouseRadius - distance) / config.mouseRadius
          particle.vx += (dx / distance) * force * 0.2
          particle.vy += (dy / distance) * force * 0.2
        }

        // Dampen velocity
        particle.vx *= 0.98
        particle.vy *= 0.98

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
        ctx.fillStyle = colorsRef.particle
        ctx.fill()

        // Draw connections to nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const other = particles[j]
          const dx = particle.x - other.x
          const dy = particle.y - other.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < config.connectionDistance) {
            const opacity = 1 - distance / config.connectionDistance
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(other.x, other.y)
            ctx.globalAlpha = opacity
            ctx.strokeStyle = colorsRef.line
            ctx.lineWidth = 1
            ctx.stroke()
            ctx.globalAlpha = 1
          }
        }

        // Draw connection to mouse
        const mouseDistance = Math.sqrt(dx * dx + dy * dy)
        if (mouseDistance < config.mouseRadius) {
          const opacity = 1 - mouseDistance / config.mouseRadius
          ctx.beginPath()
          ctx.moveTo(particle.x, particle.y)
          ctx.lineTo(mouse.x, mouse.y)
          ctx.globalAlpha = opacity
          ctx.strokeStyle = colorsRef.mouse
          ctx.lineWidth = 1
          ctx.stroke()
          ctx.globalAlpha = 1
        }
      })
    }

    // Start animation
    rafId = requestAnimationFrame(animate)

    // Event listeners
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  )
}

