'use client'

import { useEffect, useRef, createContext, useContext, type ReactNode } from 'react'
import { usePathname } from 'next/navigation'
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
  const pathname = usePathname()

  // Disable Lenis on admin routes - they need native scrolling for nested containers
  const isAdminRoute = pathname?.startsWith('/admin')

  useEffect(() => {
    // Skip Lenis initialization for admin routes
    if (isAdminRoute) {
      return
    }

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (prefersReducedMotion) {
      return
    }

    // Initialize Lenis with optimized settings for high refresh rate displays
    // Lerp-based smoothing works better than duration for 144Hz+ monitors
    const lenis = new Lenis({
      lerp: 0.1, // Lerp-based smoothing (lower = smoother, higher = snappier)
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.2, // Slightly higher for responsive feel on high-fps displays
      touchMultiplier: 2,
      infinite: false,
      autoResize: true,
      syncTouch: false, // Disable for better iOS performance
      autoRaf: false, // We'll use GSAP ticker for precise frame sync
    })

    lenisRef.current = lenis

    // Sync Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)

    // Configure GSAP ticker for high refresh rate displays
    // This ensures animations run at the display's native refresh rate
    gsap.ticker.fps(-1) // Uncapped FPS - uses native requestAnimationFrame

    // Add Lenis to GSAP's ticker for smooth animation frame updates
    const rafCallback = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(rafCallback)

    // Disable GSAP's default lag smoothing for smoother scroll on high-fps displays
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
  }, [isAdminRoute])

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
