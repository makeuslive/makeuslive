'use client'

import { memo, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface ConfettiProps {
  isActive: boolean
  className?: string
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  color: string
  size: number
  rotation: number
  rotationSpeed: number
}

const COLORS = ['#ddceaf', '#d2ae4a', '#f4e4bc', '#ffffff', '#ffd700']

export const Confetti = memo<ConfettiProps>(({ isActive, className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationRef = useRef<number>()

  useEffect(() => {
    if (!isActive) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      return
    }

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Create particles
    const createParticle = (): Particle => ({
      x: Math.random() * canvas.width,
      y: -20,
      vx: (Math.random() - 0.5) * 8,
      vy: Math.random() * 3 + 2,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: Math.random() * 8 + 4,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
    })

    // Initialize particles
    particlesRef.current = Array.from({ length: 150 }, createParticle)

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current.forEach((particle, index) => {
        // Update position
        particle.x += particle.vx
        particle.y += particle.vy
        particle.vy += 0.1 // Gravity
        particle.rotation += particle.rotationSpeed

        // Draw particle
        ctx.save()
        ctx.translate(particle.x, particle.y)
        ctx.rotate((particle.rotation * Math.PI) / 180)
        ctx.fillStyle = particle.color
        ctx.globalAlpha = Math.max(0, 1 - particle.y / canvas.height)
        
        // Draw rectangle confetti
        ctx.fillRect(
          -particle.size / 2,
          -particle.size / 2,
          particle.size,
          particle.size * 0.6
        )
        ctx.restore()

        // Reset particle if off screen
        if (particle.y > canvas.height + 20) {
          particlesRef.current[index] = createParticle()
        }
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    // Auto-stop after 5 seconds
    const timeout = setTimeout(() => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }, 5000)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      clearTimeout(timeout)
    }
  }, [isActive])

  if (!isActive) return null

  return (
    <canvas
      ref={canvasRef}
      className={cn(
        'fixed inset-0 pointer-events-none z-50',
        className
      )}
      aria-hidden="true"
    />
  )
})

Confetti.displayName = 'Confetti'

