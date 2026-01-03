'use client'

import { useEffect, type ReactNode } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register plugins once
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface GSAPProviderProps {
  children: ReactNode
}

export function GSAPProvider({ children }: GSAPProviderProps) {
  useEffect(() => {
    // Configure GSAP defaults optimized for high refresh rate displays
    gsap.defaults({
      ease: 'power3.out',
      duration: 0.6, // Slightly shorter for snappier feel on high-fps displays
      force3D: true, // Force GPU acceleration
      overwrite: 'auto', // Prevent animation conflicts
    })

    // Configure GSAP ticker for high refresh rate displays
    gsap.ticker.fps(-1) // Uncapped FPS - uses native requestAnimationFrame (144Hz, 165Hz, 300Hz+)
    gsap.ticker.lagSmoothing(0) // Disable lag smoothing for smoother animations

    // Configure ScrollTrigger defaults
    ScrollTrigger.defaults({
      toggleActions: 'play none none reverse',
      start: 'top 85%',
      fastScrollEnd: true, // Better performance during fast scrolls
      preventOverlaps: true, // Prevent animation overlaps
    })

    // Refresh ScrollTrigger on resize
    const handleResize = () => {
      ScrollTrigger.refresh()
    }

    window.addEventListener('resize', handleResize)

    // Cleanup all ScrollTriggers on unmount
    return () => {
      window.removeEventListener('resize', handleResize)
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  return <>{children}</>
}

