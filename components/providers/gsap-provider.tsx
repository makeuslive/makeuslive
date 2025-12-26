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
    // Configure GSAP defaults
    gsap.defaults({
      ease: 'power3.out',
      duration: 0.8,
    })

    // Configure ScrollTrigger defaults
    ScrollTrigger.defaults({
      toggleActions: 'play none none reverse',
      start: 'top 85%',
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

