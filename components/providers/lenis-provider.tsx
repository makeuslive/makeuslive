'use client'

import { useEffect, useRef, createContext, useContext, type ReactNode } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Import Lenis CSS
import 'lenis/dist/lenis.css'

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// Context for Lenis instance
const LenisContext = createContext<Lenis | null>(null)

interface LenisProviderProps {
  children: ReactNode
}

export function LenisProvider({ children }: LenisProviderProps) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (prefersReducedMotion) {
      return
    }

    // Initialize Lenis with optimized settings
    const lenis = new Lenis({
      duration: 1.0, // Slightly faster for snappier feel
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Expo easing
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
      autoResize: true,
      syncTouch: false, // Disable for better iOS performance
      anchors: true, // Enable smooth anchor scrolling
    })

    lenisRef.current = lenis

    // Sync Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)

    // Add Lenis to GSAP's ticker for smooth animation frame updates
    const rafCallback = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(rafCallback)

    // Disable GSAP's default lag smoothing for smoother scroll
    gsap.ticker.lagSmoothing(0)

    // Handle visibility change to prevent scroll issues when tab is inactive
    const handleVisibilityChange = () => {
      if (document.hidden) {
        lenis.stop()
      } else {
        lenis.start()
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Cleanup
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      gsap.ticker.remove(rafCallback)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  return (
    <LenisContext.Provider value={lenisRef.current}>
      {children}
    </LenisContext.Provider>
  )
}

/**
 * Hook to access Lenis instance
 * Use this for programmatic scroll control
 * 
 * @example
 * const lenis = useLenis()
 * lenis?.scrollTo('#section', { duration: 1.5 })
 */
export function useLenis(): Lenis | null {
  return useContext(LenisContext)
}

/**
 * Hook to scroll to a target
 * @param target - CSS selector, number, or HTMLElement
 * @param options - Scroll options
 */
export function useScrollTo() {
  const lenis = useLenis()

  return (target: string | number | HTMLElement, options?: {
    offset?: number
    duration?: number
    immediate?: boolean
    lock?: boolean
    onComplete?: () => void
  }) => {
    lenis?.scrollTo(target, options)
  }
}
