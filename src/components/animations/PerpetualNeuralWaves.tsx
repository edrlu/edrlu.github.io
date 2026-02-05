'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

interface WaveSource {
  x: number
  y: number
  phase: number
  amplitude: number
  frequency: number
}

interface PerpetualNeuralWavesProps {
  size?: number
  gridSize?: number
  speed?: number
  className?: string
}

export default function PerpetualNeuralWaves({
  size = 200,
  gridSize = 20,
  speed = 120,
  className = '',
}: PerpetualNeuralWavesProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef(0)
  const gridRef = useRef<number[][]>([])
  const waveSourcesRef = useRef<WaveSource[]>([])
  const basePatternRef = useRef<number[][]>([])
  const runningRef = useRef(true)
  const animationRef = useRef<number | undefined>(undefined)
  const [cells, setCells] = useState<React.ReactElement[]>([])

  const cellSize = size / gridSize

  // Initialize system
  useEffect(() => {
    // Initialize grid
    gridRef.current = Array(gridSize)
      .fill(null)
      .map(() => Array(gridSize).fill(0))

    // Create wave sources
    waveSourcesRef.current = [
      { x: 0.3, y: 0.3, phase: 0, amplitude: 1, frequency: 0.02 },
      { x: 0.7, y: 0.7, phase: Math.PI, amplitude: 0.8, frequency: 0.025 },
      { x: 0.2, y: 0.8, phase: Math.PI / 2, amplitude: 0.9, frequency: 0.018 },
      { x: 0.8, y: 0.2, phase: (3 * Math.PI) / 2, amplitude: 0.7, frequency: 0.022 },
    ]

    // Generate base pattern
    const basePattern: number[][] = []
    for (let y = 0; y < gridSize; y++) {
      basePattern[y] = []
      for (let x = 0; x < gridSize; x++) {
        const nx = x / gridSize
        const ny = y / gridSize
        const distance = Math.sqrt((nx - 0.5) ** 2 + (ny - 0.5) ** 2)
        basePattern[y][x] = Math.sin(distance * 8) * 0.1
      }
    }
    basePatternRef.current = basePattern
  }, [gridSize])

  // Update wave sources
  const updateWaveSources = useCallback(() => {
    waveSourcesRef.current.forEach((source, index) => {
      const t = frameRef.current * 0.01 + (index * Math.PI) / 2

      const radius = 0.2 + 0.1 * Math.sin(t * 0.7)
      const centerX = 0.5 + 0.2 * Math.sin(t * 0.3)
      const centerY = 0.5 + 0.2 * Math.cos(t * 0.2)

      source.x = centerX + radius * Math.cos(t + source.phase)
      source.y = centerY + radius * Math.sin(t + source.phase)
      source.amplitude = 0.5 + 0.5 * Math.sin(t * source.frequency * 10)
    })
  }, [])

  // Calculate wave value at position
  const calculateWaveValue = useCallback(
    (x: number, y: number): number => {
    const nx = x / gridSize
    const ny = y / gridSize
    let value = basePatternRef.current[y][x]

    waveSourcesRef.current.forEach((source) => {
      const dx = nx - source.x
      const dy = ny - source.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      const wavePhase = distance * 15 - frameRef.current * source.frequency * 2
      const wave = Math.sin(wavePhase + source.phase) * source.amplitude

      const attenuation = Math.exp(-distance * 3)
      value += wave * attenuation
    })

    // Neural-like activation (sigmoid)
    const activation = 1 / (1 + Math.exp(-value * 3))

    // Temporal modulation
    const temporalMod =
      0.5 + 0.5 * Math.sin(frameRef.current * 0.005 + x * 0.1 + y * 0.1)

    return activation * temporalMod
    },
    [gridSize],
  )

  // Update grid
  const update = useCallback(() => {
    if (!runningRef.current) return

    updateWaveSources()

    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const newValue = calculateWaveValue(x, y)
        gridRef.current[y][x] = gridRef.current[y][x] * 0.7 + newValue * 0.3
      }
    }

    frameRef.current++
  }, [calculateWaveValue, gridSize, updateWaveSources])

  // Render cells
  const render = useCallback(() => {
    const newCells: React.ReactElement[] = []

    for (let y = 0; y < gridSize; y++) {
      for (let x = 0; x < gridSize; x++) {
        const value = gridRef.current[y][x]

        if (value > 0.15) {
          const cellSizeScaled = cellSize * (0.3 + value * 0.7)
          const offset = (cellSize - cellSizeScaled) / 2

          const intensity = Math.min(1, value)
          const hue = 270 + intensity * 30 // Purple to pink
          const saturation = 70 + intensity * 30
          const lightness = 30 + intensity * 50

          const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`
          const rotation = (x + y + frameRef.current * 0.1) * 5

          const style: React.CSSProperties = {
            left: `${x * cellSize + offset}px`,
            top: `${y * cellSize + offset}px`,
            width: `${cellSizeScaled}px`,
            height: `${cellSizeScaled}px`,
            backgroundColor: color,
            opacity: intensity * 0.9 + 0.1,
            transform: `rotate(${rotation}deg)`,
          }

          if (intensity > 0.6) {
            style.boxShadow = `
              0 0 ${intensity * 15}px ${color},
              0 0 ${intensity * 25}px ${color}66
            `
            style.animation = 'glow-pulse 2s ease-in-out infinite'
          }

          newCells.push(
            <div
              key={`${x}-${y}`}
              className="cell"
              style={style}
            />
          )
        }
      }
    }

    setCells(newCells)
  }, [cellSize, gridSize])

  // Animation loop
  useEffect(() => {
    runningRef.current = true

    const loop = () => {
      update()
      render()
      const timeoutId = setTimeout(() => {
        animationRef.current = requestAnimationFrame(loop)
      }, speed)

      return timeoutId
    }

    const timeoutId = loop()

    return () => {
      runningRef.current = false
      clearTimeout(timeoutId)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [gridSize, render, speed, update])

  return (
    <div
      ref={containerRef}
      className={`profile-image ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        position: 'relative',
        overflow: 'hidden',
        background: 'black',
        borderRadius: '0px',
      }}
    >
      {cells}
    </div>
  )
}
